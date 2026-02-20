'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { AuthGate } from '@/components/auth/AuthGate';
import { MultiCompStandings } from '@/components/club/MultiCompStandings';
import { clubService } from '@/lib/services';
import { CompetitionStandings } from '@/lib/services/types';
import { useEffect, useState } from 'react';
import { useUserTeamKey } from '@/lib/hooks/useUserTeamKey';

export default function StandingsPage() {
  const { t } = useLanguage();
  const { teamKey } = useUserTeamKey();
  const [standings, setStandings] = useState<CompetitionStandings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clubService.getStandings().then((data) => {
      setStandings(data);
      setLoading(false);
    });
  }, []);

  return (
    <AuthGate>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-2">
            {t.standings.title}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {t.standings.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-muted-foreground py-12">{t.common.loading}</div>
          ) : (
            <MultiCompStandings competitions={standings} userTeam={teamKey} />
          )}
        </div>
      </div>
    </AuthGate>
  );
}
