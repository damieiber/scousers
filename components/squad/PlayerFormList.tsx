'use client';

import { PlayerForm } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface PlayerFormListProps {
  players: PlayerForm[];
}

export function PlayerFormList({ players }: PlayerFormListProps) {
  const { t } = useLanguage();

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <Flame className="w-5 h-5 text-orange-500" />
          {t.squad.formMeter}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {players.map((player, index) => (
          <div key={player.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border">
                {index + 1}
              </div>
              <div>
                <div className="font-bold text-sm text-foreground leading-none">{player.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{player.position}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-black text-lg text-foreground leading-none">{player.rating}</div>
                <div className="text-[10px] text-muted-foreground">{t.squad.rating}</div>
              </div>
              <div className="w-6 flex justify-center">
                {getTrendIcon(player.trend)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
