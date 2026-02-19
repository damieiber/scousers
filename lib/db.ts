import dbConnect from './mongodb';
import Team, { ITeam } from './models/Team';
import Source, { ISource } from './models/Source';
import Article, { IArticle } from './models/Article';
import User, { IUser } from './models/User';
import Feature, { IFeature } from './models/Feature';
import SubscriptionFeature, { ISubscriptionFeature } from './models/SubscriptionFeature';
import Rivalry, { IRivalry } from './models/Rivalry';
import Efemeris, { IEfemeris } from './models/Efemeris';
import mongoose from 'mongoose';

// Ensure connection is established
const ensureDb = async () => {
    await dbConnect();
};

export async function getOrCreateTeamId(teamKey: string): Promise<string> {
    await ensureDb();
    const team = await Team.findOne({ key: teamKey });
    
    if (team) {
        return team._id.toString();
    }

    // Attempt to create if not exists
    const newTeam = await Team.create({
        key: teamKey,
        name: teamKey.charAt(0).toUpperCase() + teamKey.slice(1), // Fallback name
        sportId: 'football',
        isAvailable: true
    });

    return newTeam._id.toString();
}

// In-memory Cosine Similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function findSimilarTheme(queryEmbedding: number[], teamId: string, similarityThreshold: number = 0.85): Promise<{ id: string; title: string; publishedAt: Date; similarity: number } | null> {
    await ensureDb();
    
    // Fetch recent articles (e.g., last 3 days) to compare
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const candidates = await Article.find({
        teamId: teamId,
        publishedAt: { $gte: threeDaysAgo }
    }).select('title publishedAt embedding');

    let bestMatch: { id: string; title: string; publishedAt: Date; similarity: number } | null = null;
    let maxSimilarity = -1;

    for (const candidate of candidates) {
        const similarity = cosineSimilarity(queryEmbedding, candidate.embedding);
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            bestMatch = {
                id: candidate._id.toString(),
                title: candidate.title,
                publishedAt: candidate.publishedAt,
                similarity: similarity
            };
        }
    }

    if (maxSimilarity >= similarityThreshold && bestMatch) {
         return bestMatch;
    }

    return null;
}

export interface OriginalArticleLink {
  url: string;
  source_name: string;
  title: string;
}

export async function saveThemedArticle(
  title: string,
  titleEn: string,
  summary: string,
  summaryEn: string,
  shortSummary: string,
  shortSummaryEn: string,
  teamId: string,
  originalArticles: OriginalArticleLink[],
  embedding: number[],
  imageUrl: string | null | undefined
): Promise<void> {
    await ensureDb();

    // 1. Check for similar/duplicate theme
    const similarTheme = await findSimilarTheme(embedding, teamId, 0.85);

    if (similarTheme) {
        console.log(`Found similar theme: "${similarTheme.title}" (Sim: ${similarTheme.similarity.toFixed(2)})`);
        
        // Merge logic: Add new links to existing article and update timestamps/summary if needed
        const article = await Article.findById(similarTheme.id);
        if (article) {
             const existingUrls = new Set(article.originalLinks.map(l => l.url));
             
             // Map legacy/external OriginalArticleLink to internal model IOriginalLink
             // Note: OriginalArticleLink interface uses source_name, internal uses sourceName
             // We need to map it carefully.
             const mappedLinks = originalArticles.map(l => ({
                 url: l.url,
                 title: l.title,
                 sourceName: l.source_name
             }));

             const newLinks = mappedLinks.filter(l => !existingUrls.has(l.url));
             
             if (newLinks.length > 0) {
                 article.originalLinks.push(...newLinks);
                 article.updatedAt = new Date();
                 // Optionally update summary if strictly needed, but getting complicated.
                 // For now, just appending links.
                 if (imageUrl && !article.imageUrl) {
                    article.imageUrl = imageUrl;
                 }
                 await article.save();
             }
        }
    } else {
        // Map links
        const mappedLinks = originalArticles.map(l => ({
            url: l.url,
            title: l.title,
            sourceName: l.source_name
        }));

        // 2. Create new article
        await Article.create({
            title,
            titleEn,
            summary,
            summaryEn,
            shortSummary: shortSummary,
            shortSummaryEn: shortSummaryEn,
            teamId: teamId,
            imageUrl: imageUrl,
            embedding,
            originalLinks: mappedLinks,
            publishedAt: new Date()
        });
    }
}

export async function getActiveSources(): Promise<ISource[]> {
    await ensureDb();
    return Source.find({ status: 'active' });
}

export async function handleSourceSuccess(sourceId: string): Promise<void> {
    await ensureDb();
    await Source.findByIdAndUpdate(sourceId, { consecutiveFailures: 0 });
}

export async function handleSourceFailure(source: ISource): Promise<void> {
    await ensureDb();
    const newFailureCount = (source.consecutiveFailures || 0) + 1;
    const update: any = { consecutiveFailures: newFailureCount };
    
    if (newFailureCount >= source.quarantineThreshold) {
        update.status = 'quarantined';
        console.warn(`Source ${source.name} quarantined.`);
    }
    
    await Source.findByIdAndUpdate(source._id, update);
}

export async function getQuarantinedSources(): Promise<ISource[]> {
    await ensureDb();
    return Source.find({ status: 'quarantined' });
}

export async function reactivateSource(sourceId: string): Promise<void> {
    await ensureDb();
    await Source.findByIdAndUpdate(sourceId, { status: 'active', consecutiveFailures: 0 });
}

export async function purgeOldArticles(daysOld: number) {
    await ensureDb();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await Article.deleteMany({ publishedAt: { $lt: cutoffDate } });
    return { count: result.deletedCount };
}

export async function getAllTeams(): Promise<ITeam[]> {
    await ensureDb();
    return Team.find().sort({ key: 1 });
}

export async function getAvailableTeams(): Promise<ITeam[]> {
    await ensureDb();
    return Team.find({ isAvailable: true }).sort({ key: 1 });
}

// ... (User Profile Wrappers) ...

export async function updateUserProfile(userId: string, updates: Partial<IUser>): Promise<void> {
    await ensureDb();
    await User.findByIdAndUpdate(userId, updates, { new: true });
}

export async function isUserPremium(userId: string): Promise<boolean> {
    await ensureDb();
    const user = await User.findById(userId);
    
    if (!user) return false;

    if (['standard', 'plus', 'premium'].includes(user.subscriptionStatus)) {
        if (user.subscriptionExpiresAt) {
            return user.subscriptionExpiresAt > new Date();
        }
        return true;
    }

    if (user.subscriptionStatus === 'trial' && user.subscriptionExpiresAt) {
        return user.subscriptionExpiresAt > new Date();
    }

    return false;
}

export async function getAllFeatures(): Promise<IFeature[]> {
    await ensureDb();
    return Feature.find().sort({ name: 1 });
}

export async function getSubscriptionFeatures(subscriptionStatus: string): Promise<IFeature[]> {
    await ensureDb();
    const mappings = await SubscriptionFeature.find({ subscriptionStatus: subscriptionStatus });
    const keys = mappings.map(m => m.featureKey);
    
    return Feature.find({ key: { $in: keys }, isActive: true });
}

export async function getUserFeatures(userId: string): Promise<IFeature[]> {
    await ensureDb();
    const user = await User.findById(userId);
    if (!user) return [];
    
    return getSubscriptionFeatures(user.subscriptionStatus);
}

export async function hasFeature(userId: string, featureKey: string): Promise<boolean> {
    const features = await getUserFeatures(userId);
    return features.some(f => f.key === featureKey);
}

export async function getTeamRivalries(teamId: string): Promise<any[]> {
    await ensureDb();
    // Populate rival team info
    const rivalries = await Rivalry.find({ teamId: teamId }).sort({ rank: 1 }).populate('rivalTeamId');
    
    return rivalries.map(r => ({
        team_id: r.teamId, // Keeping return snake_case if frontend expects it, or changing?
        // Let's assume we need to update frontend too, but for safety lets keep snake_case on "public" return types if API contract demands it.
        // But types.ts likely needs update.
        // For now, let's return camelCase to be consistent internally, but likely need to map in API routes
        // Actually, let's look at usage. 
        // For now:
        teamId: r.teamId,
        rivalTeamId: r.rivalTeamId._id, 
        rank: r.rank,
        rivalTeam: r.rivalTeamId // This will be the full Team document
    }));
}

export async function getRivalTeamIds(teamId: string): Promise<string[]> {
    await ensureDb();
    const rivalries = await Rivalry.find({ teamId: teamId });
    return rivalries.map(r => r.rivalTeamId.toString());
}

export async function updateArticleSentiment(
  articleId: string, 
  sentiment: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE'
): Promise<void> {
    await ensureDb();
    await Article.findByIdAndUpdate(articleId, { rivalSentiment: sentiment });
}

// Helper to get article with content if needed (Mongoose articles already have content embedded usually, 
// but here we just return the document).
export async function getThemedArticleWithOriginals(id: string) {
    await ensureDb();
    // In Mongo, original_links are embedded, so just findById
    const article = await Article.findById(id).lean(); // Use lean for plain JS object if needed
    if (!article) return null;
    
    return {
        ...article,
        original_article_links: article.originalLinks || [] // Map back to expected prop name if UI uses it
    };
}

