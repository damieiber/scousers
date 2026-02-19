import { saveThemedArticle, getActiveSources, getAllTeams } from '../lib/db';
import { getLinksFromSource, getContentFromUrl } from '../lib/scrapingService';
import { clusterArticlesByTheme, summarizeThemedArticles, filterRelevantArticles, ArticleData, generateEmbedding } from '../lib/aiService';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MAX_LINKS_PER_SOURCE = 100;
const VALID_ARTICLES_PER_SOURCE = 30;

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
});

async function main() {
    console.log("Starting ingestion process...");
    
    // Fetch active sources
    const sources = await getActiveSources();
    
    if (!sources || sources.length === 0) {
        console.log("No active sources found.");
        return;
    }

    // Fetch teams to map keys
    const teams = await getAllTeams();
    const teamMap = new Map(teams.map(team => [team._id.toString(), team.key]));

    const sourcesByTeam: Record<string, { teamKey: string; sources: any[] }> = {};
    
    sources.forEach((source: any) => {
        const teamId = (source.teamId || source.team_id).toString();
        const teamKey = teamMap.get(teamId);

        if (!teamKey) {
             // Try to see if team_id is already populated or something else?
             // But getActiveSources returns generic documents.
             return;
        }

        if (!sourcesByTeam[teamId]) {
            sourcesByTeam[teamId] = { teamKey: teamKey, sources: [] };
        }
        sourcesByTeam[teamId].sources.push(source);
    });

    for (const teamId in sourcesByTeam) {
        try {
            const { teamKey, sources: teamSources } = sourcesByTeam[teamId];
            console.log(`Processing ${teamKey} (${teamSources.length} sources)`);
            
            const allPotentialArticlesForTeam: any[] = [];

            for (const source of teamSources) {
                try {
                    const potentialLinks = await getLinksFromSource(source, teamKey, MAX_LINKS_PER_SOURCE);
                    
                    if (!potentialLinks) continue;

                    let validArticlesCount = 0;
                    for (const link of potentialLinks) {
                        if (validArticlesCount >= VALID_ARTICLES_PER_SOURCE) break;
                        try {
                            const { title, content, imageUrl } = await getContentFromUrl(link.url);
                            allPotentialArticlesForTeam.push({ 
                                url: link.url, 
                                title: title || link.title, 
                                content, 
                                sourceName: source.name, 
                                teamId, 
                                imageUrl 
                            });
                            validArticlesCount++;
                        } catch (articleError: any) {
                             // console.warn(`    ⚠️ Error fetching content for ${link.url}: ${articleError.message}`);
                        }
                    }
                } catch (sourceError) {
                    console.error(`Error processing source ${source.name}:`, sourceError);
                }
            }
            
            // Transform for filterRelevantArticles
            const articlesToFilter = allPotentialArticlesForTeam.map(a => ({
                url: a.url,
                title: a.title,
                content: a.content || '',
                sourceName: a.sourceName,
                teamId: a.teamId,
                imageUrl: a.imageUrl
            }));

            const allValidArticlesForTeam = await filterRelevantArticles(articlesToFilter, teamKey, teamSources.flatMap(s => s.keywords || []));

            if (allValidArticlesForTeam.length === 0) continue;

            const articlesForClustering = allValidArticlesForTeam.slice(0, 60);
            const themedGroups = await clusterArticlesByTheme(articlesForClustering); 

            if (themedGroups.length === 0) continue;

            for (const group of themedGroups) {
                try {
                    const { fullSummary, shortSummary } = await summarizeThemedArticles(group.theme, group.articles);
                    const embedding = await generateEmbedding(`${group.theme} - ${shortSummary}`);

                    const articlesToSave = group.articles.map((a: any) => ({ 
                        url: a.url, 
                        source_name: a.sourceName, 
                        title: a.title 
                    }));
                    
                    await saveThemedArticle(
                        group.theme,
                        '',  // titleEn
                        fullSummary,
                        '',  // summaryEn
                        shortSummary,
                        '',  // shortSummaryEn
                        teamId,
                        articlesToSave,
                        embedding,
                        group.imageUrl
                    );

                } catch (groupError) {
                    console.error(`Error processing theme "${group.theme}":`, groupError);
                }
            }
        } catch (teamError) {
            console.error(`Error processing team ${teamId}:`, teamError);
        }
    }
    
    console.log("Ingestion complete.");
    process.exit(0);
}

main().catch(err => {
    console.error(`Fatal error:`, err);
    process.exit(1);
});
