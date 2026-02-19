import { clubService } from '@/lib/services';
import { MultiCompStandings } from '@/components/club/MultiCompStandings';

export default async function StandingsPage() {
  const standings = await clubService.getStandings();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-2">
          Tablas de Posiciones
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Seguimiento de todas las competencias oficiales.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <MultiCompStandings competitions={standings} />
      </div>
    </div>
  );
}
