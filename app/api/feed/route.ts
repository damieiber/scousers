import { NextResponse } from 'next/server';
import { auth } from "@/auth"
import type { FeedItem, GroupedNewsItem } from '@/lib/types';
import dbConnect from '@/lib/mongodb';
import Article from '@/lib/models/Article';
import User from '@/lib/models/User';
import SubscriptionFeature from '@/lib/models/SubscriptionFeature';
import Rivalry from '@/lib/models/Rivalry';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const mode = searchParams.get('mode');

    await dbConnect();
    const session = await auth();

    if (id) {
      const article = await Article.findById(id).lean();

      if (!article) {
        return new NextResponse('Not Found', { status: 404 });
      }

      const feedItem: FeedItem = {
        id: article._id.toString(),
        type: 'news_group',
        title: article.title,
        titleEn: article.titleEn,
        aiSummary: article.summary,
        aiSummaryEn: article.summaryEn,
        teamId: article.teamId.toString(),
        createdAt: article.createdAt.toISOString(),
        publishedAt: article.publishedAt.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        articles: ((article as any).originalLinks || []).map((link: {url: string; title: string; sourceName: string}) => ({
          id: link.url,
          title: link.title,
          originalUrl: link.url,
          source: { name: link.sourceName },
        })),
        imageUrl: article.imageUrl,
        shortSummary: article.shortSummary,
        shortSummaryEn: article.shortSummaryEn,
        rivalSentiment: article.rivalSentiment,
      };

      return NextResponse.json({ items: [feedItem] });

    } else {
      let teamIdFilter: string | null = null;
      let rivalTeamIds: string[] = [];
      let hasRivalAccess = false;

      if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        
        if (user) {
          teamIdFilter = user.primaryTeamId?.toString() || null;

          if (mode === 'rivals' && teamIdFilter) {
            // Check rival access
            const featureAccess = await SubscriptionFeature.findOne({
               subscriptionStatus: user.subscriptionStatus,
               featureKey: 'RivalMode'
            });

            hasRivalAccess = !!featureAccess;

            if (hasRivalAccess) {
              const rivalries = await Rivalry.find({ teamId: teamIdFilter });
              rivalTeamIds = rivalries.map(r => r.rivalTeamId.toString());
            }
          }
        }
      }

      const query: Record<string, unknown> = {};

      if (mode === 'rivals') {
        if (!hasRivalAccess) {
          return NextResponse.json({ 
            items: [], 
            mode: 'rivals',
            hasRivalAccess: false,
            message: 'Necesitás una suscripción premium para usar Modo Rival'
          });
        }
        
        if (rivalTeamIds.length === 0) {
           // No rivals found or configured
           // Return empty or maybe fallback? 
           // For now empty to match previous logic
          return NextResponse.json({ 
            items: [], 
            mode: 'rivals',
            hasRivalAccess: true,
            message: 'No hay rivales configurados para tu equipo'
          });
        }
        
        query.teamId = { $in: rivalTeamIds };
      } else if (teamIdFilter) {
        query.teamId = teamIdFilter;
      }

      const themedArticles = await Article.find(query)
        .sort({ publishedAt: -1 })
        .limit(50)
        .lean();

      if (!themedArticles || themedArticles.length === 0) {
        return NextResponse.json({ items: [], mode: mode || 'normal' });
      }

      let sortedThemedArticles = themedArticles;

      if (mode === 'rivals' && hasRivalAccess) {
        const sentimentOrder: Record<string, number> = { 'NEGATIVE': 0, 'NEUTRAL': 1, 'POSITIVE': 2 };
        sortedThemedArticles = [...themedArticles].sort((a, b) => {
          const sentimentA = sentimentOrder[a.rivalSentiment || ''] ?? 1;
          const sentimentB = sentimentOrder[b.rivalSentiment || ''] ?? 1;
          if (sentimentA !== sentimentB) {
            return sentimentA - sentimentB;
          }
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      } else {
        // Feature logic: Pick the best article of the most recent day
        if (themedArticles.length > 0) {
            const mostRecentDate = new Date(themedArticles[0].publishedAt).toDateString();
            const articlesFromMostRecentDay = themedArticles.filter(
            (article) => new Date(article.publishedAt).toDateString() === mostRecentDate
            );
            
            if (articlesFromMostRecentDay.length > 0) {
                const featuredArticle = articlesFromMostRecentDay.reduce((prev, current) => 
                ((prev.originalLinks as unknown[])?.length || 0) > ((current.originalLinks as unknown[])?.length || 0) ? prev : current
                );
                
                const otherArticles = themedArticles.filter((article) => article._id.toString() !== featuredArticle._id.toString());
                sortedThemedArticles = [featuredArticle, ...otherArticles];
            }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const groupedNewsItems: GroupedNewsItem[] = sortedThemedArticles.map((article: any) => ({
        id: article._id.toString(),
        type: 'news_group',
        title: article.title,
        titleEn: article.titleEn || '',
        aiSummary: article.summary,
        aiSummaryEn: article.summaryEn || '',
        shortSummary: article.shortSummary,
        shortSummaryEn: article.shortSummaryEn || '',
        publishedAt: article.publishedAt.toISOString(),
        teamId: article.teamId?.toString(),
        createdAt: article.createdAt.toISOString(),
        imageUrl: article.imageUrl || undefined,
        rivalSentiment: article.rivalSentiment,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        articles: (article.originalLinks || []).map((link: any) => ({
          id: link.url, 
          title: link.title,
          originalUrl: link.url,
          source: {
            name: link.sourceName,
          },
        })),
      }));

      return NextResponse.json({ 
        items: groupedNewsItems, 
        mode: mode || 'normal',
        hasRivalAccess 
      });
    }

  } catch (error) {
    console.error('Error building feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
