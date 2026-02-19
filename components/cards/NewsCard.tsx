import LinkNext from 'next/link';
import Image from 'next/image';
import { Clock, Link, Users, ThumbsDown, Minus, ThumbsUp } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  aiSummary: string;
  shortSummary?: string;
  sourceName: string;
  publishedAt: string;
  isGrouped: boolean;
  imageUrl?: string;
  rivalSentiment?: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
}

const sentimentConfig = {
  NEGATIVE: {
    label: 'Mala para ellos',
    icon: ThumbsDown,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    borderColor: 'border-red-500/30',
  },
  NEUTRAL: {
    label: 'Neutral',
    icon: Minus,
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-500',
    borderColor: 'border-gray-500/30',
  },
  POSITIVE: {
    label: 'Buena para ellos',
    icon: ThumbsUp,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/30',
  },
};

export function NewsCard({ 
  id, 
  title, 
  aiSummary, 
  shortSummary, 
  sourceName, 
  publishedAt, 
  isGrouped, 
  imageUrl,
  rivalSentiment 
}: NewsCardProps) {
  const href = `/news/${id ?? 'unknown'}`;
  const sentiment = rivalSentiment ? sentimentConfig[rivalSentiment] : null;

  return (
    <LinkNext href={href} className="block group h-full">
      <div className={`h-full flex flex-col bg-card rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        sentiment ? `${sentiment.borderColor} hover:${sentiment.borderColor}` : 'border-border hover:border-primary/30'
      }`}>
        {imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Imagen para la noticia: ${title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {sentiment && (
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full ${sentiment.bgColor} ${sentiment.textColor} text-[10px] font-bold uppercase flex items-center gap-1`}>
                <sentiment.icon className="h-3 w-3" />
                {sentiment.label}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col flex-grow p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              {sourceName}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(publishedAt).toLocaleDateString()}
            </span>
            {sentiment && !imageUrl && (
              <span className={`px-2 py-0.5 rounded-full ${sentiment.bgColor} ${sentiment.textColor} text-[10px] font-bold flex items-center gap-1`}>
                <sentiment.icon className="h-3 w-3" />
                {sentiment.label}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm flex-grow">
            {shortSummary || aiSummary}
          </p>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium group-hover:text-primary transition-colors">
              Leer más <Link className="h-3 w-3 ml-1" />
            </span>
            {isGrouped && (
              <span className="flex items-center gap-1" title="Agrupada de varias fuentes">
                <Users className="h-3 w-3" /> +Fuentes
              </span>
            )}
          </div>
        </div>
      </div>
    </LinkNext>
  );
}