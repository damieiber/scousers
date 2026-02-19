'use client';

import { useEffect, useState } from 'react';
import { NewsCard } from '@/components/cards/NewsCard';
import { EfemeridesCard } from '@/components/cards/EfemeridesCard';
import type { FeedItem, GroupedNewsItem } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface Efemeride {
  date: string;
  year: number;
  title: string;
  description: string;
  type: 'match' | 'birth' | 'title' | 'generic';
}

export default function Home() {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [todayEfemeride, setTodayEfemeride] = useState<Efemeride | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { locale, t } = useLanguage();

  useEffect(() => {
    let mounted = true;

    fetch('/api/feed')
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setItems(data.items ?? []);
      })
      .catch(() => setError(t.home.couldNotLoadFeed));

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}`;

    fetch(`/api/efemerides?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data.efemerides && data.efemerides.length > 0) {
          setTodayEfemeride(data.efemerides[0]);
        }
      })
      .catch((err) => console.error('Error loading efemeride:', err));

    return () => {
      mounted = false;
    };
  }, []);

  const featuredArticle = items && items.length > 0 ? (items[0] as GroupedNewsItem) : null;
  const previewArticles = items && items.length > 1 ? items.slice(1, 3) : [];

  const getTitle = (item: GroupedNewsItem) => locale === 'en' && item.titleEn ? item.titleEn : item.title;
  const getSummary = (item: GroupedNewsItem) => {
    if (locale === 'en') {
      return item.shortSummaryEn || item.shortSummary || item.aiSummaryEn || item.aiSummary;
    }
    return item.shortSummary || item.aiSummary;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
      {error && <p className="text-center text-red-600 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-8">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {featuredArticle && (
            <section>
              <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tighter border-l-4 border-primary pl-3">
                {t.home.featuredArticle}
              </h2>
              <a
                href={`/news/${featuredArticle.id}`}
                className="block group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {featuredArticle.imageUrl && (
                  <div className="relative h-64 md:h-96 overflow-hidden">
                    <Image 
                      src={featuredArticle.imageUrl} 
                      alt={getTitle(featuredArticle)} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-primary rounded-full uppercase tracking-wider">
                        {featuredArticle.articles.length > 1 ? t.home.specialCoverage : featuredArticle.articles[0]?.source.name}
                      </span>
                      <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3 group-hover:text-gray-100 transition-colors drop-shadow-lg">
                        {getTitle(featuredArticle)}
                      </h3>
                      <p className="text-gray-200 line-clamp-2 md:line-clamp-3 text-sm md:text-base max-w-2xl drop-shadow-md">
                        {getSummary(featuredArticle)}
                      </p>
                    </div>
                  </div>
                )}
                {!featuredArticle.imageUrl && (
                   <div className="p-8">
                      <h3 className="text-3xl font-black text-foreground leading-tight mb-4 group-hover:text-primary transition-colors">
                        {getTitle(featuredArticle)}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 text-lg">
                        {getSummary(featuredArticle)}
                      </p>
                   </div>
                )}
              </a>
            </section>
          )}

          {previewArticles.length > 0 && (
            <section>
              <Link href="/feed">
                <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tighter border-l-4 border-primary pl-3 hover:text-primary transition-colors cursor-pointer">
                  {t.home.latestNews}
                </h2>
              </Link>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {previewArticles.map((item) => {
                  const group = item as GroupedNewsItem;
                  return (
                    <NewsCard
                      key={item.id}
                      id={group.id}
                      title={group.title}
                      titleEn={group.titleEn}
                      aiSummary={group.aiSummary}
                      aiSummaryEn={group.aiSummaryEn}
                      shortSummary={group.shortSummary}
                      shortSummaryEn={group.shortSummaryEn}
                      sourceName={group.articles.length > 1 ? t.home.multipleSources : group.articles[0]?.source.name ?? t.home.unknownSource}
                      publishedAt={group.publishedAt}
                      isGrouped={true}
                      imageUrl={group.imageUrl}
                    />
                  );
                })}
              </div>
              <div className="mt-10 text-center">
                <a
                  href="/feed"
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-black hover:bg-primary rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1 uppercase tracking-widest border border-gray-800 hover:border-primary"
                >
                  {t.home.viewMoreNews}
                </a>
              </div>
            </section>
          )}

          {!items && !error && (
            <div className="space-y-10">
              <div className="rounded-xl border border-border p-0 overflow-hidden animate-pulse bg-card h-96">
                <div className="h-full w-full bg-muted"></div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Link href="/efemerides">
            <h2 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tighter border-l-4 border-primary pl-3 hover:text-primary transition-colors cursor-pointer">
              {t.home.ephemerides}
            </h2>
          </Link>
          {todayEfemeride ? (
            <EfemeridesCard efemeride={todayEfemeride} isToday={true} />
          ) : (
            <div className="rounded-xl border border-border p-6 animate-pulse bg-card h-64">
              <div className="h-full w-full bg-muted rounded-lg"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
