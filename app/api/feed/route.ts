import { NextResponse } from 'next/server';
import { auth } from "@/auth"
import type { FeedItem, GroupedNewsItem } from '@/lib/types';
import dbConnect from '@/lib/mongodb';
import Article, { IArticle } from '@/lib/models/Article';
import User from '@/lib/models/User';
import SubscriptionFeature from '@/lib/models/SubscriptionFeature';
import Rivalry from '@/lib/models/Rivalry';
import { OriginalArticleLink } from '@/lib/db'; 

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

      // Transform Mongoose doc to FeedItem
      const feedItem: FeedItem = {
        id: article._id.toString(),
        type: 'news_group',
        title: article.title,
        aiSummary: article.summary,
        // @ts-ignore - lean() result
        teamId: article.teamId.toString(),
        // @ts-ignore
        createdAt: article.createdAt.toISOString(),
        // @ts-ignore
        publishedAt: article.publishedAt.toISOString(),
        // @ts-ignore
        articles: (article.originalLinks || []).map((link: any) => ({
          id: link.url, // Use URL as ID for now if no specific ID
          title: link.title,
          originalUrl: link.url,
          source: { name: link.sourceName },
        })),
        // @ts-ignore
        imageUrl: article.imageUrl,
        // @ts-ignore
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
               featureKey: 'rival_mode'
            });

            hasRivalAccess = !!featureAccess;

            if (hasRivalAccess) {
              const rivalries = await Rivalry.find({ teamId: teamIdFilter });
              rivalTeamIds = rivalries.map(r => r.rivalTeamId.toString());
            }
          }
        }
      }

      let query: any = {};

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
        const sentimentOrder: any = { 'NEGATIVE': 0, 'NEUTRAL': 1, 'POSITIVE': 2 };
        sortedThemedArticles = [...themedArticles].sort((a: any, b: any) => {
          const sentimentA = sentimentOrder[a.rivalSentiment] ?? 1;
          const sentimentB = sentimentOrder[b.rivalSentiment] ?? 1;
          if (sentimentA !== sentimentB) {
            return sentimentA - sentimentB;
          }
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      } else {
        // Feature logic: Pick the best article of the most recent day
        if (themedArticles.length > 0) {
            // @ts-ignore
            const mostRecentDate = new Date(themedArticles[0].publishedAt).toDateString();
            const articlesFromMostRecentDay = themedArticles.filter(
            // @ts-ignore
            (article: any) => new Date(article.publishedAt).toDateString() === mostRecentDate
            );
            
            if (articlesFromMostRecentDay.length > 0) {
                const featuredArticle = articlesFromMostRecentDay.reduce((prev: any, current: any) => 
                (prev.originalLinks?.length || 0) > (current.originalLinks?.length || 0) ? prev : current
                );
                
                const otherArticles = themedArticles.filter((article: any) => article._id.toString() !== featuredArticle._id.toString());
                sortedThemedArticles = [featuredArticle, ...otherArticles];
            }
        }
      }

      const groupedNewsItems: GroupedNewsItem[] = sortedThemedArticles.map((article: any) => ({
        id: article._id.toString(),
        type: 'news_group',
        title: article.title,
        aiSummary: article.summary,
        shortSummary: article.shortSummary,
        publishedAt: article.publishedAt.toISOString(),
        teamId: article.teamId?.toString(),
        createdAt: article.createdAt.toISOString(),
        imageUrl: article.imageUrl || undefined,
        rivalSentiment: article.rivalSentiment,
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
