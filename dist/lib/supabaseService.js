"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purgeOldArticles = exports.reactivateSource = exports.getQuarantinedSources = exports.handleSourceFailure = exports.handleSourceSuccess = exports.getActiveSources = exports.supabase = void 0;
exports.getOrCreateTeamId = getOrCreateTeamId;
exports.saveThemedArticle = saveThemedArticle;
exports.getThemedArticleWithOriginals = getThemedArticleWithOriginals;
exports.findSimilarTheme = findSimilarTheme;
exports.addArticlesToTheme = addArticlesToTheme;
const supabase_js_1 = require("@supabase/supabase-js");
const uuid_1 = require("uuid");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not set.');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
async function getOrCreateTeamId(teamKey) {
    const { data: team, error: selectError } = await exports.supabase
        .from('teams')
        .select('id')
        .eq('key', teamKey)
        .single();
    if (team) {
        return team.id;
    }
    if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error fetching team:', selectError);
        throw selectError;
    }
    const { data: newTeam, error: insertError } = await exports.supabase
        .from('teams')
        .insert({ id: (0, uuid_1.v4)(), key: teamKey })
        .select('id')
        .single();
    if (insertError) {
        console.error('Error inserting new team:', insertError);
        throw insertError;
    }
    return newTeam.id;
}
async function saveThemedArticle(title, summary, shortSummary, teamId, originalArticles, embedding, imageUrl) {
    console.log(`Attempting to save themed article: "${title}" for team: ${teamId}`);
    const { data: existingThemedArticle } = await exports.supabase
        .from('themed_articles')
        .select('id')
        .eq('title', title)
        .eq('team_id', teamId)
        .single();
    let themedArticleId;
    if (existingThemedArticle) {
        themedArticleId = existingThemedArticle.id;
        await exports.supabase
            .from('themed_articles')
            .update({
            summary,
            short_summary: shortSummary,
            embedding,
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
        })
            .eq('id', themedArticleId);
    }
    else {
        const { data: newThemedArticle, error: insertError } = await exports.supabase
            .from('themed_articles')
            .insert({
            title,
            summary,
            short_summary: shortSummary,
            team_id: teamId,
            published_at: new Date().toISOString(),
            embedding: embedding,
            image_url: imageUrl,
        })
            .select('id')
            .single();
        if (insertError) {
            console.error('Error saving new themed article:', insertError);
            throw insertError;
        }
        themedArticleId = newThemedArticle.id;
    }
    await addArticlesToTheme(themedArticleId, originalArticles);
}
async function getThemedArticleWithOriginals(id) {
    const { data: themedArticle, error: themedArticleError } = await exports.supabase
        .from('themed_articles')
        .select('*')
        .eq('id', id)
        .single();
    if (themedArticleError) {
        console.error('Error fetching themed article:', themedArticleError);
        if (themedArticleError.code === 'PGRST116')
            return null;
        throw themedArticleError;
    }
    if (!themedArticle) {
        return null;
    }
    const { data: originalLinks, error: linksError } = await exports.supabase
        .from('original_article_links')
        .select('*')
        .eq('themed_article_id', themedArticle.id);
    if (linksError) {
        console.error('Error fetching original article links:', linksError);
        throw linksError;
    }
    return {
        ...themedArticle,
        original_article_links: originalLinks || [],
    };
}
async function findSimilarTheme(embedding, teamId, similarityThreshold = 0.9) {
    const { data, error } = await exports.supabase.rpc('find_similar_theme', {
        query_embedding: embedding,
        p_team_id: teamId,
        similarity_threshold: similarityThreshold,
    });
    if (error) {
        console.error('Error finding similar theme:', error);
        return null;
    }
    return data && data.length > 0 ? data[0] : null;
}
async function addArticlesToTheme(themeId, originalArticles) {
    const { data: existingLinks, error: fetchError } = await exports.supabase
        .from('original_article_links')
        .select('url')
        .eq('themed_article_id', themeId);
    if (fetchError) {
        console.error(`Error fetching existing links for theme ${themeId}:`, fetchError);
        throw fetchError;
    }
    const existingUrlSet = new Set(existingLinks.map(link => link.url));
    const newArticlesToInsert = originalArticles.filter(article => !existingUrlSet.has(article.url));
    if (newArticlesToInsert.length === 0) {
        return;
    }
    const linksToInsert = newArticlesToInsert.map(article => ({
        themed_article_id: themeId,
        url: article.url,
        source_name: article.source_name,
        title: article.title,
        raw_content: article.raw_content,
    }));
    const { error } = await exports.supabase.from('original_article_links').insert(linksToInsert);
    if (error) {
        console.error(`Error adding articles to theme ${themeId}:`, error);
        throw error;
    }
}

const getActiveSources = async () => {
    const { data, error } = await exports.supabase
        .from('sources')
        .select('*')
        .eq('status', 'active');
    if (error) {
        console.error('Error fetching active sources:', error);
        throw error;
    }
    return data;
};
exports.getActiveSources = getActiveSources;

const handleSourceSuccess = async (sourceId) => {
    const { error } = await exports.supabase
        .from('sources')
        .update({ consecutive_failures: 0 })
        .eq('id', sourceId);
    if (error) {
        console.error(`Error resetting failure count for source ${sourceId}:`, error);
    }
};
exports.handleSourceSuccess = handleSourceSuccess;

const handleSourceFailure = async (source) => {
    const newFailureCount = (source.consecutive_failures || 0) + 1;
    const updateData = {
        consecutive_failures: newFailureCount,
    };
    if (newFailureCount >= source.quarantine_threshold) {
        updateData.status = 'quarantined';
    }
    const { error } = await exports.supabase
        .from('sources')
        .update(updateData)
        .eq('id', source.id);
    if (error) {
        console.error(`Error updating failure count for source ${source.id}:`, error);
    }
};
exports.handleSourceFailure = handleSourceFailure;

const getQuarantinedSources = async () => {
    const { data, error } = await exports.supabase
        .from('sources')
        .select('*')
        .eq('status', 'quarantined');
    if (error) {
        console.error('Error fetching quarantined sources:', error);
        throw error;
    }
    return data;
};
exports.getQuarantinedSources = getQuarantinedSources;

const reactivateSource = async (sourceId) => {
    const { error } = await exports.supabase
        .from('sources')
        .update({ status: 'active', consecutive_failures: 0 })
        .eq('id', sourceId);
    if (error) {
        console.error(`Error reactivating source ${sourceId}:`, error);
        throw error;
    }
};
exports.reactivateSource = reactivateSource;

const purgeOldArticles = async (daysOld) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const { error, count } = await exports.supabase
        .from('themed_articles')
        .delete({ count: 'exact' })
        .lt('published_at', cutoffDate.toISOString());
    if (error) {
        console.error('Error purging old articles:', error);
        throw error;
    }
    return { count };
};
exports.purgeOldArticles = purgeOldArticles;
