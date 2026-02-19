import { H2HStats } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords, Trophy, Goal, XCircle } from 'lucide-react';

interface HeadToHeadCompactProps {
  data: H2HStats;
  homeTeam: string;
  awayTeam: string;
}

export function HeadToHeadCompact({ data, homeTeam, awayTeam }: HeadToHeadCompactProps) {
  const getResultColor = (result: 'W' | 'D' | 'L') => {
    if (result === 'W') return 'bg-green-500';
    if (result === 'D') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="h-full border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <Swords className="w-5 h-5 text-primary" />
          Historial (Últimos {data.played})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2 mb-4">
          {data.lastMatches.map((result, index) => (
            <div 
              key={index} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ${getResultColor(result)} border-2 border-card shadow-sm`}
              title={result === 'W' ? 'Victoria' : result === 'D' ? 'Empate' : 'Derrota'}
            >
              {result}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-y-4 text-center items-center">
           <div className="text-[10px] font-bold text-muted-foreground uppercase">{homeTeam}</div>
           <div className="text-[10px] font-bold text-muted-foreground uppercase">VS</div>
           <div className="text-[10px] font-bold text-muted-foreground uppercase">{awayTeam}</div>

           <div className="text-xl font-black text-foreground">{data.wins}</div>
           <div className="flex flex-col items-center">
              <Trophy className="w-4 h-4 text-yellow-500 mb-1" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Victorias</span>
           </div>
           <div className="text-xl font-black text-foreground">{data.losses}</div>

           <div className="text-xl font-black text-foreground">{data.draws}</div>
           <div className="flex flex-col items-center">
              <XCircle className="w-4 h-4 text-muted-foreground mb-1" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Empates</span>
           </div>
           <div className="text-xl font-black text-foreground">{data.draws}</div>

           <div className="text-xl font-black text-foreground">{data.goalsFor}</div>
           <div className="flex flex-col items-center">
              <Goal className="w-4 h-4 text-primary mb-1" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Goles</span>
           </div>
           <div className="text-xl font-black text-foreground">{data.goalsAgainst}</div>
        </div>
      </CardContent>
    </Card>
  );
}
