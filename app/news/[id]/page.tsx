'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface OriginalArticleLink {
  id: string;
  title: string;
  source_name?: string;
  sourceName?: string;
  url: string;
}

interface ArticleDetail {
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  shortSummary?: string;
  shortSummaryEn?: string;
  image_url?: string;
  imageUrl?: string;
  original_article_links: OriginalArticleLink[];
}

export default function NewsDetail() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { locale, t } = useLanguage();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/feed?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const item = data.items[0];
          setArticle({
            title: item.title,
            titleEn: item.titleEn || '',
            summary: item.aiSummary,
            summaryEn: item.aiSummaryEn || '',
            shortSummary: item.shortSummary,
            shortSummaryEn: item.shortSummaryEn || '',
            image_url: item.imageUrl,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            original_article_links: (item.articles || []).map((a: any) => ({
              id: a.id,
              title: a.title,
              source_name: a.source?.name || '',
              url: a.originalUrl,
            })),
          });
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-muted-foreground">
          {locale === 'es' ? 'Artículo no encontrado.' : 'Article not found.'}
        </p>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">
          {t.newsDetail.backToHome}
        </Link>
      </div>
    );
  }

  const displayTitle = locale === 'en' && article.titleEn ? article.titleEn : article.title;
  const displaySummary = locale === 'en' && article.summaryEn ? article.summaryEn : article.summary;

  return (
    <div className='max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
      <Link href='/' className='inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 font-medium group'>
        <ChevronLeft className='h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform' /> {t.newsDetail.backToHome}
      </Link>

      <article className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
        {article.image_url && (
          <div className="relative w-full h-64 md:h-[400px]">
            <Image
              src={article.image_url}
              alt={`Imagen para la noticia: ${displayTitle}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
               <h1 className='text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg'>{displayTitle}</h1>
            </div>
          </div>
        )}
        
        {!article.image_url && (
            <div className="p-6 md:p-8 border-b border-border">
                <h1 className='text-3xl md:text-4xl font-black text-foreground leading-tight'>{displayTitle}</h1>
            </div>
        )}

        <div className="p-6 md:p-8">
          <div className='prose prose-lg dark:prose-invert max-w-none mb-10'>
            <p className='text-lg leading-relaxed text-muted-foreground whitespace-pre-line'>{displaySummary}</p>
          </div>

          <div className="border-t border-border pt-8">
            <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              {t.newsDetail.originalSources}
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {article.original_article_links.map((link: OriginalArticleLink) => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='block p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all duration-300 group'
                >
                  <div className='font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1'>{link.title}</div>
                  <div className='text-xs text-muted-foreground mt-1 flex justify-between items-center'>
                    <span>{link.source_name || link.sourceName}</span>
                    <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">{t.newsDetail.readArticle}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}