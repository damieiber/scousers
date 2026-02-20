'use client';

import { LoanPlayer } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Star } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface LoanWatchProps {
  players: LoanPlayer[];
}

export function LoanWatch({ players }: LoanWatchProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <Eye className="w-5 h-5 text-primary" />
          {t.squad.loanWatch}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className={`rounded-lg p-3 border ${player.highlight ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border/50'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{player.name}</span>
                  {player.highlight && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">{t.squad.at} {player.currentTeam}</span>
              </div>
              <div className="text-right">
                <div className="font-black text-lg text-foreground leading-none">{player.stats.rating}</div>
                <span className="text-[10px] text-muted-foreground">{t.squad.rating}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
               <div className="bg-background/50 rounded p-1 text-center">
                 <span className="block text-xs font-bold">{player.stats.matches}</span>
                 <span className="text-[9px] text-muted-foreground uppercase">{t.squad.matches}</span>
               </div>
               <div className="bg-background/50 rounded p-1 text-center">
                 <span className="block text-xs font-bold">{player.stats.goals}</span>
                 <span className="text-[9px] text-muted-foreground uppercase">{t.squad.goalsLabel}</span>
               </div>
               <div className="bg-background/50 rounded p-1 text-center">
                 <span className="block text-xs font-bold">{player.stats.assists}</span>
                 <span className="text-[9px] text-muted-foreground uppercase">{t.squad.assists}</span>
               </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              &quot;{player.summary}&quot;
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
