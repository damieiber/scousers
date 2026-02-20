'use client';

import { TacticalData } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Target, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface TacticalBoardProps {
  data: TacticalData;
}

export function TacticalBoard({ data }: TacticalBoardProps) {
  const { t } = useLanguage();

  const getZoneColor = (percentage: number) => {
    if (percentage >= 40) return 'bg-primary';
    if (percentage >= 30) return 'bg-primary/70';
    return 'bg-muted-foreground/30';
  };

  return (
    <Card className="h-full border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <Activity className="w-5 h-5 text-primary" />
          {t.matchCenter.tacticalBoard}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t.matchCenter.avgPossession}</span>
            <span className="text-3xl font-black text-foreground">{data.possession}%</span>
          </div>
          <div className="h-16 w-16 rounded-full border-4 border-muted relative flex items-center justify-center">
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent transform -rotate-45"
              style={{ clipPath: `polygon(0 0, 100% 0, 100% ${data.possession}%, 0 ${data.possession}%)` }}
            ></div>
             <Activity className="w-6 h-6 text-primary opacity-80" />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
            <BarChart3 className="w-3 h-3" /> {t.matchCenter.attackZones}
          </h4>
          <div className="grid grid-cols-3 gap-2 h-32">
            {data.attackZones.map((zone) => (
              <div key={zone.zone} className="flex flex-col justify-end gap-2 group">
                <div className="relative w-full bg-muted/30 rounded-t-lg overflow-hidden h-full flex items-end">
                  <div 
                    className={`w-full transition-all duration-500 ${getZoneColor(zone.percentage)} group-hover:opacity-90`}
                    style={{ height: `${zone.percentage * 2}%` }}
                  >
                    <div className="w-full text-center text-[10px] font-bold text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {zone.percentage}%
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-center uppercase text-muted-foreground">{zone.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
           <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
            <Target className="w-3 h-3" /> {t.matchCenter.shotsPerMatch}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 p-2 rounded-lg border border-border/50 text-center">
               <span className="block text-xl font-black text-foreground">{data.shotStats.total}</span>
               <span className="text-[10px] text-muted-foreground uppercase font-bold">{t.matchCenter.total}</span>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/20 text-center">
               <span className="block text-xl font-black text-primary">{data.shotStats.onTarget}</span>
               <span className="text-[10px] text-primary uppercase font-bold">{t.matchCenter.onTarget}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
