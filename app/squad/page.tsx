'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { AuthGate } from '@/components/auth/AuthGate';
import { squadService } from '@/lib/services';
import { PlayerFormList } from '@/components/squad/PlayerFormList';
import { SquadLoadMap } from '@/components/squad/SquadLoadMap';
import { TransferImpactCard } from '@/components/squad/TransferImpactCard';
import { LoanWatch } from '@/components/squad/LoanWatch';
import { YouthProspectCard } from '@/components/squad/YouthProspectCard';
import { PlayerForm, PlayerLoad, TransferImpact, LoanPlayer, YouthProspect } from '@/lib/services/types';
import { useEffect, useState } from 'react';
import { useUserTeamKey } from '@/lib/hooks/useUserTeamKey';

export default function SquadPage() {
  const { t } = useLanguage();
  const { teamKey, loading: teamLoading } = useUserTeamKey();
  const [topPlayers, setTopPlayers] = useState<PlayerForm[]>([]);
  const [squadLoad, setSquadLoad] = useState<PlayerLoad[]>([]);
  const [transfers, setTransfers] = useState<TransferImpact[]>([]);
  const [loanPlayers, setLoanPlayers] = useState<LoanPlayer[]>([]);
  const [youthProspect, setYouthProspect] = useState<YouthProspect | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamLoading) return;
    const tk = teamKey || undefined;
    Promise.all([
      squadService.getTopFormPlayers(tk),
      squadService.getSquadLoad(tk),
      squadService.getTransferImpacts(tk),
      squadService.getLoanWatch(tk),
      squadService.getYouthProspect(tk),
    ]).then(([players, load, trans, loans, youth]) => {
      setTopPlayers(players);
      setSquadLoad(load);
      setTransfers(trans);
      setLoanPlayers(loans);
      setYouthProspect(youth);
      setLoading(false);
    });
  }, [teamKey, teamLoading]);

  if (loading || teamLoading || !youthProspect) {
    return (
      <AuthGate>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20 text-center text-muted-foreground">
          {t.common.loading}
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-2">
            {t.squad.title}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {t.squad.subtitle}
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
              {t.squad.comingSoon}
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
