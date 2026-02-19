import { squadService } from '@/lib/services';
import { PlayerFormList } from '@/components/squad/PlayerFormList';
import { SquadLoadMap } from '@/components/squad/SquadLoadMap';
import { TransferImpactCard } from '@/components/squad/TransferImpactCard';
import { LoanWatch } from '@/components/squad/LoanWatch';
import { YouthProspectCard } from '@/components/squad/YouthProspectCard';

export default async function SquadPage() {
  const topPlayers = await squadService.getTopFormPlayers();
  const squadLoad = await squadService.getSquadLoad();
  const transfers = await squadService.getTransferImpacts();
  const loanPlayers = await squadService.getLoanWatch();
  const youthProspect = await squadService.getYouthProspect();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-2">
          Plantel Profesional
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Gestión de rendimiento, cargas y mercado de pases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <PlayerFormList players={topPlayers} />
          <SquadLoadMap players={squadLoad} />
        </div>
        <div className="space-y-6">
          <TransferImpactCard transfers={transfers} />
          <YouthProspectCard prospect={youthProspect} />
        </div>
        <div className="space-y-6">
          <LoanWatch players={loanPlayers} />
          <div className="border-2 border-dashed border-border rounded-xl flex items-center justify-center p-8 text-muted-foreground font-medium h-48">
            Próximamente: Estadísticas Históricas
          </div>
        </div>
      </div>
    </div>
  );
}
