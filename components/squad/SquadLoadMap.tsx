import { PlayerLoad } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BatteryWarning, BatteryCharging, BatteryFull } from 'lucide-react';

interface SquadLoadMapProps {
  players: PlayerLoad[];
}

export function SquadLoadMap({ players }: SquadLoadMapProps) {
  const getStatusColor = (status: 'optimal' | 'warning' | 'overload') => {
    if (status === 'optimal') return 'bg-green-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: 'optimal' | 'warning' | 'overload') => {
    if (status === 'optimal') return <BatteryFull className="w-4 h-4 text-green-500" />;
    if (status === 'warning') return <BatteryCharging className="w-4 h-4 text-yellow-500" />;
    return <BatteryWarning className="w-4 h-4 text-red-500" />;
  };

  const grouped = {
    DEF: players.filter(p => p.position === 'DEF'),
    MID: players.filter(p => p.position === 'MID'),
    FWD: players.filter(p => p.position === 'FWD'),
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
          <BatteryWarning className="w-5 h-5 text-primary" />
          Mapa de Carga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(grouped).map(([pos, group]) => (
          group.length > 0 && (
            <div key={pos}>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border pb-1">
                {pos === 'DEF' ? 'Defensores' : pos === 'MID' ? 'Mediocampistas' : 'Delanteros'}
              </h4>
              <div className="space-y-2">
                {group.map(player => (
                  <div key={player.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{player.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStatusColor(player.status)}`} 
                          style={{ width: `${Math.min((player.minutesPlayed / 450) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {getStatusIcon(player.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
        <div className="flex justify-between text-[10px] text-muted-foreground pt-2">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Óptimo</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Precaución</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Sobrecarga</span>
        </div>
      </CardContent>
    </Card>
  );
}
