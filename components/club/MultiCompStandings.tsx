import { CompetitionStandings } from '@/lib/services/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface MultiCompStandingsProps {
  competitions: CompetitionStandings[];
}

export function MultiCompStandings({ competitions }: MultiCompStandingsProps) {
  return (
    <div className="space-y-8">
      {competitions.map((comp) => (
        <Card key={comp.id} className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
              <Trophy className="w-6 h-6 text-primary" />
              {comp.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-bold text-center w-12">#</th>
                    <th className="px-4 py-3 font-bold">Equipo</th>
                    <th className="px-4 py-3 font-bold text-center">PJ</th>
                    <th className="px-4 py-3 font-bold text-center">G</th>
                    <th className="px-4 py-3 font-bold text-center">E</th>
                    <th className="px-4 py-3 font-bold text-center">P</th>
                    <th className="px-4 py-3 font-black text-center text-foreground">Pts</th>
                    <th className="px-4 py-3 font-bold text-center hidden sm:table-cell">Forma</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comp.table.map((row) => {
                    const isUserTeam = row.team === 'Liverpool' || row.team === 'Everton';
                    return (
                    <tr key={row.team} className={`hover:bg-muted/30 transition-colors ${isUserTeam ? 'bg-primary/5' : ''}`}>
                      <td className="px-4 py-3 text-center font-bold text-muted-foreground">{row.position}</td>
                      <td className="px-4 py-3 font-bold text-foreground flex items-center gap-2">
                        {isUserTeam && <div className="w-1 h-4 bg-primary rounded-full"></div>}
                        {row.team}
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{row.played}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{row.won}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{row.drawn}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{row.lost}</td>
                      <td className="px-4 py-3 text-center font-black text-foreground text-base">{row.points}</td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <div className="flex justify-center gap-1">
                          {row.form.map((res, i) => (
                            <div 
                              key={i} 
                              className={`w-2 h-2 rounded-full ${
                                res === 'W' ? 'bg-green-500' : res === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
