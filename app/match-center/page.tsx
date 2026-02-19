import { matchAnalysisService, clubService } from '@/lib/services';
import { TacticalBoard } from '@/components/tactics/TacticalBoard';
import { SetPieceCard } from '@/components/tactics/SetPieceCard';
import { RiskMeter } from '@/components/tactics/RiskMeter';
import { HeadToHeadCompact } from '@/components/tactics/HeadToHeadCompact';
import { MatchHeader } from '@/components/tactics/MatchHeader';
import { OddsComparison } from '@/components/club/OddsComparison';

export default async function MatchCenterPage() {
  const matchData = await matchAnalysisService.getMatchPreview('mock-match-id');
  const oddsData = await clubService.getMatchOdds('mock-match-id');

  return (
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
  );
}
