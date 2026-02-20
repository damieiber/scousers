'use client';

import { TransferImpact } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface TransferImpactCardProps {
  transfers: TransferImpact[];
}

export function TransferImpactCard({ transfers }: TransferImpactCardProps) {
  const { t } = useLanguage();

  const getImpactLabel = (score: 'high' | 'medium' | 'low') => {
    if (score === 'high') return t.squad.impactHigh;
    if (score === 'medium') return t.squad.impactMedium;
    return t.squad.impactLow;
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          {t.squad.transferMarket}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {transfer.type === 'arrival' ? (
                  <div className="bg-green-500/10 text-green-600 p-1 rounded">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-red-500/10 text-red-600 p-1 rounded">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="block font-bold text-sm text-foreground">{transfer.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">
                    {transfer.type === 'arrival' ? `${t.squad.from} ${transfer.fromTeam}` : `${t.squad.to} ${transfer.toTeam}`}
                  </span>
                </div>
              </div>
              <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                transfer.impactScore === 'high' ? 'bg-primary/10 text-primary border-primary/20' : 
                transfer.impactScore === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
                'bg-muted text-muted-foreground border-border'
              }`}>
                {t.squad.impact} {getImpactLabel(transfer.impactScore)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {transfer.analysis}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
