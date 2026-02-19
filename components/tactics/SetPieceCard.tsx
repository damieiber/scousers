import { SetPieceStats } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CornerDownRight, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SetPieceCardProps {
  data: SetPieceStats;
  teamName: string;
}

export function SetPieceCard({ data, teamName }: SetPieceCardProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getConversionRate = (scored: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((scored / total) * 100);
  };

  return (
    <Card className="h-full border-border bg-card shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <CornerDownRight className="w-5 h-5 text-primary" />
          Balón Parado
        </CardTitle>
        <div className="flex items-center gap-1 text-xs font-bold bg-muted/50 px-2 py-1 rounded-full">
          {getTrendIcon(data.trend)}
          <span className="uppercase text-muted-foreground">{data.trend === 'up' ? 'Mejorando' : data.trend === 'down' ? 'Empeorando' : 'Estable'}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-xs font-bold text-muted-foreground uppercase text-center mb-2">{teamName}</div>
        
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            Córners
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-primary uppercase">A Favor</span>
                <span className="text-xs font-black text-primary">{getConversionRate(data.corners.scored, data.corners.totalFor)}%</span>
              </div>
              <div className="text-2xl font-black text-foreground leading-none">{data.corners.scored}</div>
              <span className="text-[10px] text-muted-foreground">Goles de {data.corners.totalFor} intentos</span>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">En Contra</span>
                <Shield className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="text-2xl font-black text-foreground leading-none">{data.corners.conceded}</div>
              <span className="text-[10px] text-muted-foreground">Recibidos de {data.corners.totalAgainst}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            Tiros Libres
          </h4>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-primary uppercase">A Favor</span>
                <span className="text-xs font-black text-primary">{getConversionRate(data.freeKicks.scored, data.freeKicks.totalFor)}%</span>
              </div>
              <div className="text-2xl font-black text-foreground leading-none">{data.freeKicks.scored}</div>
              <span className="text-[10px] text-muted-foreground">Goles de {data.freeKicks.totalFor} intentos</span>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">En Contra</span>
                <Shield className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="text-2xl font-black text-foreground leading-none">{data.freeKicks.conceded}</div>
              <span className="text-[10px] text-muted-foreground">Recibidos de {data.freeKicks.totalAgainst}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
