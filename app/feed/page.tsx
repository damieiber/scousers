'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { NewsCard } from '@/components/cards/NewsCard';
import { Swords } from 'lucide-react';
import type { FeedItem, GroupedNewsItem } from '@/lib/types';

import { Suspense } from 'react';

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="w-full h-96 animate-pulse bg-muted rounded-xl" />}>
      <FeedContent />
    </Suspense>
  );
}

function FeedContent() {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedMode, setFeedMode] = useState<string>('normal');
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode');

  useEffect(() => {
    let mounted = true;
    const fetchUrl = mode === 'rivals' ? '/api/feed?mode=rivals' : '/api/feed';
    
    fetch(fetchUrl)
      .then((r) => r.json())
      .then((data) => {
        if (mounted) {
          setItems(data.items ?? []);
          setFeedMode(data.mode || 'normal');
        }
      })
      .catch(() => setError('No se pudo cargar el feed.'));
    return () => {
      mounted = false;
    };
  }, [mode]);

  const renderNewsCard = (item: GroupedNewsItem) => {
    const group = item as GroupedNewsItem;
    return (
      <NewsCard
        key={item.id}
        id={group.id}
        title={group.title}
        aiSummary={group.aiSummary}
        shortSummary={group.shortSummary}
        sourceName={group.articles.length > 1 ? 'Varias fuentes' : group.articles[0]?.source.name ?? 'Fuente desconocida'}
        publishedAt={group.publishedAt}
        isGrouped={true}
        imageUrl={group.imageUrl}
        rivalSentiment={feedMode === 'rivals' ? group.rivalSentiment : undefined}
      />
    );
  };

  const isRivalMode = feedMode === 'rivals';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-8 border-b border-border pb-4">
        <div className="flex items-center gap-3 mb-2">
          {isRivalMode && (
            <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-bold flex items-center gap-2">
              <Swords className="h-4 w-4" />
              Modo Rival
            </span>
          )}
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter">
            {isRivalMode ? 'Noticias de Rivales' : 'Feed de Noticias'}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          {isRivalMode 
            ? 'Lo que está pasando con tus rivales - ordenado por impacto' 
            : 'Todas las noticias de River Plate en un solo lugar'}
        </p>
      </div>

      {!items && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-0 overflow-hidden animate-pulse bg-card h-96">
              <div className="h-48 w-full bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-600 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>}

      {items && items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground font-medium">
            {isRivalMode ? '🏟️ No hay noticias de rivales aún' : 'Aún no hay noticias.'}
          </p>
          <p className="text-muted-foreground/80 mt-2">
            {isRivalMode 
              ? 'Los rivales se configuran automáticamente. La IA está trabajando.' 
              : 'Vuelve a intentarlo en unos minutos, la IA está trabajando.'}
          </p>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => renderNewsCard(item as GroupedNewsItem))}
        </div>
      )}
    </div>
  );
}
