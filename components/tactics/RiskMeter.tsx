'use client';

import { MatchRisk } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface RiskMeterProps {
  data: MatchRisk;
}

export function RiskMeter({ data }: RiskMeterProps) {
  const { t } = useLanguage();

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return 'bg-green-500 text-green-500';
    if (level === 'medium') return 'bg-yellow-500 text-yellow-500';
    return 'bg-red-500 text-red-500';
  };

  const getRiskLabel = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return t.matchCenter.low;
    if (level === 'medium') return t.matchCenter.medium;
    return t.matchCenter.high;
  };

  const colorClass = getRiskColor(data.level);
  const bgClass = colorClass.split(' ')[0];
  const textClass = colorClass.split(' ')[1];

  return (
    <Card className="h-full border-border bg-card shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgClass} opacity-5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none`}></div>

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <AlertTriangle className={`w-5 h-5 ${textClass}`} />
          {t.matchCenter.riskIndex}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full ${bgClass} transition-all duration-1000 ease-out`}
              style={{ width: `${data.score}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-full text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
             <span>{t.matchCenter.low}</span>
             <span>{t.matchCenter.medium}</span>
             <span>{t.matchCenter.high}</span>
          </div>
          <div className="mt-4 text-center">
             <span className={`text-4xl font-black ${textClass} leading-none`}>{data.score}</span>
             <span className="block text-xs font-bold text-muted-foreground uppercase mt-1">{t.matchCenter.riskLevel}: {getRiskLabel(data.level)}</span>
          </div>
        </div>

        <div className="space-y-3">
           <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3 h-3" /> {t.matchCenter.keyFactors}
          </h4>
          <ul className="space-y-2">
            {data.factors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2 text-sm font-medium text-foreground bg-muted/30 p-2 rounded-lg border border-border/50">
                <CheckCircle2 className={`w-4 h-4 ${textClass} mt-0.5 flex-shrink-0`} />
                <span className="leading-tight">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-border">
           <p className="text-[10px] text-muted-foreground text-center">
             {t.matchCenter.riskDisclaimer}
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
