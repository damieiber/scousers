import { notFound } from 'next/navigation';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getThemedArticleWithOriginals } from '@/lib/db';
import Image from 'next/image';

interface OriginalArticleLink {
  id: string;
  title: string;
  source_name: string;
  url: string;
}

export default async function NewsDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const article = await getThemedArticleWithOriginals(id);

  if (!article) {
    return notFound();
  }

  return (
    <div className='max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
      <Link href='/' className='inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 font-medium group'>
        <ChevronLeft className='h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform' /> Volver al Inicio
      </Link>

      <article className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
        {article.image_url && (
          <div className="relative w-full h-64 md:h-[400px]">
            <Image
              src={article.image_url}
              alt={`Imagen para la noticia: ${article.title}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
               <h1 className='text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg'>{article.title}</h1>
            </div>
          </div>
        )}
        
        {!article.image_url && (
            <div className="p-6 md:p-8 border-b border-border">
                <h1 className='text-3xl md:text-4xl font-black text-foreground leading-tight'>{article.title}</h1>
            </div>
        )}

        <div className="p-6 md:p-8">
          <div className='prose prose-lg dark:prose-invert max-w-none mb-10'>
            <p className='text-lg leading-relaxed text-muted-foreground whitespace-pre-line'>{article.summary}</p>
          </div>

          <div className="border-t border-border pt-8">
            <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Fuentes Originales
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
                    <span>{link.source_name}</span>
                    <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Leer nota →</span>
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