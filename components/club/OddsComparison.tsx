'use client';

import { MatchOdds } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface OddsComparisonProps {
  data: MatchOdds;
}

export function OddsComparison({ data }: OddsComparisonProps) {
  const { t } = useLanguage();

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <Card className="h-full border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <DollarSign className="w-5 h-5 text-primary" />
          {t.matchCenter.oddsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 mb-4">
          <p className="text-[10px] text-yellow-600 font-medium text-center">
            {t.matchCenter.oddsDisclaimer}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="text-xs font-bold text-muted-foreground uppercase mb-2">{t.matchCenter.home}</div>
          <div className="text-xs font-bold text-muted-foreground uppercase mb-2">{t.matchCenter.draw}</div>
          <div className="text-xs font-bold text-muted-foreground uppercase mb-2">{t.matchCenter.away}</div>
          <div className="space-y-2">
            {data.homeWin.map((opt, i) => (
              <div key={i} className="bg-muted/30 p-2 rounded border border-border/50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground">{opt.provider}</span>
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm text-foreground">{opt.odds.toFixed(2)}</span>
                  {getTrendIcon(opt.trend)}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {data.draw.map((opt, i) => (
              <div key={i} className="bg-muted/30 p-2 rounded border border-border/50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground">{opt.provider}</span>
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm text-foreground">{opt.odds.toFixed(2)}</span>
                  {getTrendIcon(opt.trend)}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {data.awayWin.map((opt, i) => (
              <div key={i} className="bg-muted/30 p-2 rounded border border-border/50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground">{opt.provider}</span>
                <div className="flex items-center gap-1">
                  <span className="font-black text-sm text-foreground">{opt.odds.toFixed(2)}</span>
                  {getTrendIcon(opt.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
