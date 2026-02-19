import { NextResponse } from 'next/server';
import { saveThemedArticle, getActiveSources, handleSourceSuccess, handleSourceFailure, getAllTeams } from '@/lib/db';
import { getLinksFromSource, getContentFromUrl } from '@/lib/scrapingService';
import { clusterArticlesByTheme, summarizeThemedArticles, filterRelevantArticles, ArticleData, generateEmbedding } from '@/lib/aiService';
import { Source } from '@/lib/types'; // We align types in db.ts to types.ts or vice versa

const MAX_LINKS_PER_SOURCE = 100;
const VALID_ARTICLES_PER_SOURCE = 30;

async function runIngestionProcess() {
    let sources: any[]; // Using any to bypass strict type check for now if types mismatch, or Import ISource
    try {
        sources = await getActiveSources();
    } catch (error) {
        console.error('Error fetching active sources:', error);
        return;
    }

    if (!sources || sources.length === 0) {
        return;
    }

    // Replace direct supabase call with db helper
    const teams = await getAllTeams();
    // Use camelCase accessors for Mongoose docs if they are not plain objects yet 
    const teamMap = new Map(teams.map(team => [team._id.toString(), team.key]));

    const sourcesByTeam: Record<string, { teamKey: string; sources: any[] }> = {};
    sources.forEach(source => {
        const teamId = source.teamId.toString(); // Ensure string for map key
        const teamKey = teamMap.get(teamId);

        if (!teamId || !teamKey) {
            console.warn(`Source "${source.name}" is missing a valid team or team not found. Skipping.`);
            return;
        }

        if (!sourcesByTeam[teamId]) {
            sourcesByTeam[teamId] = { teamKey, sources: [] };
        }
        sourcesByTeam[teamId].sources.push(source);
    });

    for (const teamId in sourcesByTeam) {
        try {
            const { teamKey, sources: teamSources } = sourcesByTeam[teamId]
            const allPotentialArticlesForTeam: any[] = [];
            
            console.log(`Processing team: ${teamKey} (${teamId}) with ${teamSources.length} sources.`);

            for (const source of teamSources) {
                console.log(`  - Processing source: ${source.name} (${source.url})`);
                try {
                    // Adapt getLinksFromSource if it expects a specific Source type 
                    // (Mongoose document might need .toObject() if strict typing in scrapingService)
                    console.time(`extract-links-${source.name}`);
                    const potentialLinks = await getLinksFromSource(source, teamKey, MAX_LINKS_PER_SOURCE);
                    console.timeEnd(`extract-links-${source.name}`);
                    
                    if (!potentialLinks || potentialLinks.length === 0) {
                        console.log(`    No links found for ${source.name}.`);
                        continue;
                    }
                    console.log(`    Found ${potentialLinks.length} potential links.`);

                    let validArticlesCount = 0;
                    for (const link of potentialLinks) {
                        if (validArticlesCount >= VALID_ARTICLES_PER_SOURCE) {
                            break;
                        }
                        try {
                            // console.log(`      Scraping: ${link.url}`);
                            const { title, content, imageUrl } = await getContentFromUrl(link.url);
                            // Avoid adding duplicate URLs if multiple sources link to same?
                            // Logic is simplified here.
                            allPotentialArticlesForTeam.push({ 
                                url: link.url, 
                                title: title || link.title, 
                                content, 
                                sourceName: source.name, 
                                teamId, 
                                imageUrl 
                            });
                            validArticlesCount++;
                        } catch (articleError: unknown) {
                            // const errorMessage = articleError instanceof Error ? articleError.message : String(articleError);
                            // console.warn(`    ⚠️ Error fetching content for ${link.url}, skipping.`, errorMessage);
                        }
                    }
                    console.log(`    Extracted content for ${validArticlesCount} articles.`);
                    await handleSourceSuccess(source._id.toString());
                } catch (sourceError) {
                    console.error(`Error processing source ${source.name} (${source.url}). Skipping.`, sourceError);
                    await handleSourceFailure(source);
                }
            }

            console.log(`  Filtering ${allPotentialArticlesForTeam.length} articles for relevance...`);

            // Filter
            // Note: filterRelevantArticles expects ArticleData. 
            // We map our object to match Articledata
            
            const articlesToFilter = allPotentialArticlesForTeam.map(a => ({
                url: a.url,
                title: a.title,
                content: a.content || '',
                sourceName: a.sourceName,
                teamId: a.teamId,
                imageUrl: a.imageUrl
            }));
            
            console.time('ai-filter');
            const allValidArticlesForTeam = await filterRelevantArticles(articlesToFilter, teamKey, teamSources.flatMap(s => s.keywords || []));
            console.timeEnd('ai-filter');

            console.log(`  Found ${allValidArticlesForTeam.length} relevant articles.`);

            if (allValidArticlesForTeam.length === 0) {
                continue;
            }

            const articlesForClustering = allValidArticlesForTeam.slice(0, 60);
            
            console.log('  Clustering articles...');
            // Cluster
            // ... (rest of logic mostly same, just ensuring imported functions work)
            // ...
            
            // Note: aiService probably needs no changes if it is pure logic.
            
            // However, clusterArticlesByTheme might return generic objects.
            console.time('ai-cluster');
            const themedGroups = await clusterArticlesByTheme(articlesForClustering);
            console.timeEnd('ai-cluster');
            console.log(`  Created ${themedGroups.length} clusters.`);

            if (themedGroups.length === 0) {
                continue;
            }

             for (const group of themedGroups) {
                try {
                    console.log(`    Summarizing cluster: "${group.theme}"`);
                    const { fullSummary, shortSummary, fullSummaryEn, shortSummaryEn } = await summarizeThemedArticles(group.theme, group.articles);
                     // Generate embedding using AI Service
                    const embedding = await generateEmbedding(`${group.theme} - ${shortSummary}`);

                    const articlesToSave = group.articles.map((a: any) => ({ 
                        url: a.url, 
                        source_name: a.sourceName, 
                        title: a.title 
                    }));

                    await saveThemedArticle(
                        group.theme,
                        group.themeEn || group.theme,
                        fullSummary,
                        fullSummaryEn,
                        shortSummary,
                        shortSummaryEn,
                        teamId,
                        articlesToSave,
                        embedding,
                        group.imageUrl
                    );
                    console.log(`    Saved cluster: "${group.theme}"`);

                } catch (groupError) {
                    console.error(`Error processing theme group "${group.theme}". Skipping.`, groupError);
                }
            }

        } catch (teamError) {
            console.error(`An unrecoverable error occurred while processing team ${teamId}.`, teamError);
        }
    }
}

export async function POST(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Fire and forget usually, but Vercel lambda might kill it. 
    // Ideally await it or use background job.
    await runIngestionProcess().catch(error => {
        console.error('Unhandled error in runIngestionProcess:', error);
    });

    return NextResponse.json({ message: 'Ingestion process started successfully.' });
}
