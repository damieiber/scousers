'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';
import { AuthGate } from '@/components/auth/AuthGate';
import { matchAnalysisService, clubService } from '@/lib/services';
import { TacticalBoard } from '@/components/tactics/TacticalBoard';
import { SetPieceCard } from '@/components/tactics/SetPieceCard';
import { RiskMeter } from '@/components/tactics/RiskMeter';
import { HeadToHeadCompact } from '@/components/tactics/HeadToHeadCompact';
import { MatchHeader } from '@/components/tactics/MatchHeader';
import { OddsComparison } from '@/components/club/OddsComparison';
import { MatchPreviewData, MatchOdds } from '@/lib/services/types';
import { useEffect, useState } from 'react';
import { useUserTeamKey } from '@/lib/hooks/useUserTeamKey';

export default function MatchCenterPage() {
  const { t } = useLanguage();
  const { teamKey, loading: teamLoading } = useUserTeamKey();
  const [matchData, setMatchData] = useState<MatchPreviewData | null>(null);
  const [oddsData, setOddsData] = useState<MatchOdds | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamLoading) return;
    Promise.all([
      matchAnalysisService.getMatchPreview('mock-match-id', teamKey || undefined),
      clubService.getMatchOdds('mock-match-id', teamKey || undefined),
    ]).then(([match, odds]) => {
      setMatchData(match);
      setOddsData(odds);
      setLoading(false);
    });
  }, [teamKey, teamLoading]);

  if (loading || teamLoading || !matchData || !oddsData) {
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
        <MatchHeader data={matchData} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TacticalBoard data={matchData.tactics.home} />
          <SetPieceCard data={matchData.setPieces.home} teamName={matchData.homeTeam} />
          <RiskMeter data={matchData.risk} />
          <TacticalBoard data={matchData.tactics.away} />
          <SetPieceCard data={matchData.setPieces.away} teamName={matchData.awayTeam} />
          <HeadToHeadCompact data={matchData.h2h} homeTeam={matchData.homeTeam} awayTeam={matchData.awayTeam} />
          <div className="md:col-span-2 lg:col-span-3">
             <OddsComparison data={oddsData} />
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
