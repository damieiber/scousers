import { IMatchAnalysisService, MatchPreviewData, TacticalData } from '../types';

export class MockMatchAnalysisService implements IMatchAnalysisService {
  async getTacticalData(teamId: string): Promise<TacticalData> {
    if (teamId === 'liverpool') {
      return {
        teamId: 'liverpool',
        teamName: 'Liverpool',
        possession: 62,
        attackZones: [
          { zone: 'left', percentage: 30, label: 'Left' },
          { zone: 'center', percentage: 25, label: 'Centre' },
          { zone: 'right', percentage: 45, label: 'Right' },
        ],
        shotStats: {
          total: 15.2,
          onTarget: 6.5,
          offTarget: 5.1,
          blocked: 3.6,
        },
      };
    }
    
    return {
      teamId: 'everton',
      teamName: 'Everton',
      possession: 48,
      attackZones: [
        { zone: 'left', percentage: 35, label: 'Left' },
        { zone: 'center', percentage: 30, label: 'Centre' },
        { zone: 'right', percentage: 35, label: 'Right' },
      ],
      shotStats: {
        total: 12.8,
        onTarget: 5.2,
        offTarget: 4.5,
        blocked: 3.1,
      },
    };
  }

  async getMatchPreview(matchId: string): Promise<MatchPreviewData> {
    const liverpoolTactics = await this.getTacticalData('liverpool');
    const evertonTactics = await this.getTacticalData('everton');

    return {
      id: matchId,
      homeTeam: 'Liverpool',
      awayTeam: 'Everton',
      date: '2025-11-24T15:00:00',
      venue: 'Anfield',
      referee: 'Michael Oliver',
      weather: {
        temp: 8,
        condition: 'Cloudy',
        icon: 'cloud',
      },
      h2h: {
        played: 10,
        wins: 6,
        draws: 2,
        losses: 2,
        goalsFor: 16,
        goalsAgainst: 9,
        lastMatches: ['W', 'W', 'D', 'W', 'L'],
      },
      risk: {
        level: 'high',
        score: 72,
        factors: [
          'Merseyside Derby — high-intensity rivalry',
          'Key absence: Robertson (doubtful)',
          'Recent favourable home record',
        ],
      },
      tactics: {
        home: liverpoolTactics,
        away: evertonTactics,
      },
      setPieces: {
        home: {
          corners: { scored: 5, conceded: 1, totalFor: 52, totalAgainst: 18 },
          freeKicks: { scored: 3, conceded: 0, totalFor: 14, totalAgainst: 6 },
          trend: 'up',
        },
        away: {
          corners: { scored: 2, conceded: 3, totalFor: 30, totalAgainst: 25 },
          freeKicks: { scored: 1, conceded: 1, totalFor: 10, totalAgainst: 10 },
          trend: 'stable',
        },
      },
    };
  }
}
