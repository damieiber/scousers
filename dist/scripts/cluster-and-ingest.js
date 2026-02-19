"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabaseService_1 = require("../lib/supabaseService");
const scrapingService_1 = require("../lib/scrapingService");
const aiService_1 = require("../lib/aiService");
const MAX_LINKS_PER_SOURCE = 100;
const VALID_ARTICLES_PER_SOURCE = 30;
const MIN_CONTENT_LENGTH = 500;

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
});
async function main() {
    const { data: fetchedSources, error: sourcesError } = await supabaseService_1.supabase.from('sources').select('url, name, team_id, teams(key), keywords, selectors');
    if (sourcesError) {
        console.error('Error fetching sources:', sourcesError);
        return;
    }
    if (!fetchedSources || fetchedSources.length === 0) {
        console.log('No sources found. Exiting.');
        return;
    }
    
    const sources = fetchedSources;
    const sourcesByTeam = {};
    sources.forEach(source => {
        const teamId = source.team_id;
        let teamKey;
        if (Array.isArray(source.teams)) {
            teamKey = source.teams[0]?.key; 
        }
        else if (source.teams && typeof source.teams === 'object' && 'key' in source.teams) {
            teamKey = source.teams.key; 
        }
        if (!teamId || !teamKey)
            return; 
        if (!sourcesByTeam[teamId]) {
            sourcesByTeam[teamId] = { teamKey: teamKey, sources: [] };
        }
        sourcesByTeam[teamId].sources.push(source);
    });
    
    for (const teamId in sourcesByTeam) {
        try {
            const teamData = sourcesByTeam[teamId];
            const teamSources = teamData.sources;
            let allPotentialArticlesForTeam = [];
            for (const source of teamSources) {
                try {
                    const potentialLinks = await (0, scrapingService_1.getLinksFromSource)(source, teamData.teamKey, MAX_LINKS_PER_SOURCE);
                    let validArticlesCount = 0;
                    for (const link of potentialLinks) {
                        if (validArticlesCount >= VALID_ARTICLES_PER_SOURCE) {
                            break;
                        }
                        try {
                            const { title, content } = await (0, scrapingService_1.getContentFromUrl)(link.url);
                            if (content && content.length > MIN_CONTENT_LENGTH) {
                                allPotentialArticlesForTeam.push({ url: link.url, title, content, sourceName: source.name, teamId });
                                validArticlesCount++;
                            }
                        }
                        catch (articleError) {
                            console.warn(`    ⚠️ Error fetching content for ${link.url}, skipping.`, articleError.message);
                        }
                    }
                }
                catch (sourceError) {
                    console.error(`
  🚨 Error processing source ${source.name} (${source.url}). Skipping.`, sourceError);
                }
            }
            const allValidArticlesForTeam = await (0, aiService_1.filterRelevantArticles)(allPotentialArticlesForTeam, teamData.teamKey, teamSources.flatMap(s => s.keywords || []));
            if (allValidArticlesForTeam.length === 0) {
                continue;
            }
            const articlesForClustering = allValidArticlesForTeam.slice(0, 60);
            if (allValidArticlesForTeam.length > 60) {
                console.warn(`  ⚠️ Too many articles (${allValidArticlesForTeam.length}). Clustering only the first 60.`);
            }
            const themedGroups = await (0, aiService_1.clusterArticlesByTheme)(articlesForClustering);
            if (themedGroups.length === 0) {
                continue;
            }
            for (const group of themedGroups) {
                try {
                    const { fullSummary, shortSummary } = await (0, aiService_1.summarizeThemedArticles)(group.theme, group.articles);
                    const embedding = await (0, aiService_1.generateEmbedding)(`${group.theme} - ${shortSummary}`);
                    const articlesToSave = group.articles.map((a) => ({ url: a.url, source_name: a.sourceName, title: a.title, raw_content: a.content }));
                    await (0, supabaseService_1.saveThemedArticle)(group.theme, fullSummary, shortSummary, teamId, articlesToSave, embedding, group.imageUrl);
                }
                catch (groupError) {
                    console.error(`
  🚨 Error processing theme group "${group.theme}". Skipping.`, groupError);
                }
            }
        }
        catch (teamError) {
            console.error(`
  
  🚨🚨🚨 An unrecoverable error occurred while processing team ${teamId}. Skipping to next team. 🚨🚨🚨`, teamError);
        }
    }
}
main().catch(err => {
    console.error(`
An unexpected fatal error occurred during the process:`, err);
    process.exit(1);
});
