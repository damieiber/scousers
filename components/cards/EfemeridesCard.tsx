'use client';

import { Efemeride } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';


interface EfemeridesCardProps {
  efemeride: Efemeride;
  isToday?: boolean;
}

const typeStyles = {
  match: 'bg-gradient-to-br from-primary to-red-800',
  birth: 'bg-gradient-to-br from-zinc-800 to-black',
  title: 'bg-gradient-to-br from-yellow-500 to-amber-600',
  generic: 'bg-gradient-to-br from-gray-500 to-gray-700',
};

const typeIcons = {
  match: '⚽',
  birth: '🎂',
  title: '🏆',
  generic: '📅',
};

export function EfemeridesCard({ efemeride, isToday = false }: EfemeridesCardProps) {
  const [month, day] = efemeride.date.split('-');
  const formattedDate = `${day}/${month}`;
  const { t } = useLanguage();

  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        isToday
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className={`${typeStyles[efemeride.type]} p-6 text-white h-full flex flex-col`}>
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-1.5 text-sm font-bold tracking-wider">
            {formattedDate}
          </div>
          <div className="text-3xl drop-shadow-md">{typeIcons[efemeride.type]}</div>
        </div>
        <div className="flex-grow">
          <div className="text-sm font-medium opacity-90 mb-1">{efemeride.year}</div>
          <h3 className="text-2xl font-black mb-3 leading-tight tracking-tight">{efemeride.title}</h3>
          <p className="text-white/90 text-sm leading-relaxed font-medium">{efemeride.description}</p>
        </div>
        {isToday && (
          <div className="absolute top-3 right-3">
            <span className="bg-white text-primary text-[10px] font-black px-2 py-1 rounded-full shadow-lg animate-pulse uppercase tracking-widest">
              {t.ephemeridesCard.today}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
