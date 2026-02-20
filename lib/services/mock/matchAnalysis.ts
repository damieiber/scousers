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
        shotStats: { total: 15.2, onTarget: 6.5, offTarget: 5.1, blocked: 3.6 },
      };
    }
    if (teamId === 'everton') {
      return {
        teamId: 'everton',
        teamName: 'Everton',
        possession: 46,
        attackZones: [
          { zone: 'left', percentage: 35, label: 'Left' },
          { zone: 'center', percentage: 30, label: 'Centre' },
          { zone: 'right', percentage: 35, label: 'Right' },
        ],
        shotStats: { total: 11.4, onTarget: 4.6, offTarget: 3.9, blocked: 2.9 },
      };
    }
    if (teamId === 'arsenal') {
      return {
        teamId: 'arsenal',
        teamName: 'Arsenal',
        possession: 58,
        attackZones: [
          { zone: 'left', percentage: 40, label: 'Left' },
          { zone: 'center', percentage: 28, label: 'Centre' },
          { zone: 'right', percentage: 32, label: 'Right' },
        ],
        shotStats: { total: 14.1, onTarget: 5.8, offTarget: 4.7, blocked: 3.6 },
      };
    }
    // Newcastle
    return {
      teamId: 'newcastle',
      teamName: 'Newcastle',
      possession: 52,
      attackZones: [
        { zone: 'left', percentage: 28, label: 'Left' },
        { zone: 'center', percentage: 38, label: 'Centre' },
        { zone: 'right', percentage: 34, label: 'Right' },
      ],
      shotStats: { total: 13.2, onTarget: 5.4, offTarget: 4.3, blocked: 3.5 },
    };
  }

  async getMatchPreview(matchId: string, teamKey?: string): Promise<MatchPreviewData> {
    if (teamKey === 'everton') {
      const evertonTactics = await this.getTacticalData('everton');
      const newcastleTactics = await this.getTacticalData('newcastle');

      return {
        id: matchId,
        homeTeam: 'Everton',
        awayTeam: 'Newcastle',
        date: '2025-11-30T15:00:00',
        venue: 'Goodison Park',
        referee: 'Anthony Taylor',
        weather: { temp: 7, condition: 'Rainy', icon: 'rain' },
        h2h: {
          played: 10,
          wins: 3,
          draws: 3,
          losses: 4,
          goalsFor: 10,
          goalsAgainst: 13,
          lastMatches: ['L', 'D', 'W', 'L', 'D'],
        },
        risk: {
          level: 'medium',
          score: 55,
          factors: [
            'Newcastle strong in away form this season',
            'Everton solid defensive record at Goodison',
            'Key doubt: Calvert-Lewin (hamstring)',
          ],
        },
        tactics: { home: evertonTactics, away: newcastleTactics },
        setPieces: {
          home: {
            corners: { scored: 2, conceded: 3, totalFor: 28, totalAgainst: 22 },
            freeKicks: { scored: 1, conceded: 1, totalFor: 8, totalAgainst: 9 },
            trend: 'stable',
          },
          away: {
            corners: { scored: 4, conceded: 2, totalFor: 42, totalAgainst: 20 },
            freeKicks: { scored: 2, conceded: 1, totalFor: 12, totalAgainst: 7 },
            trend: 'up',
          },
        },
      };
    }

    // Default: Liverpool vs Arsenal
    const liverpoolTactics = await this.getTacticalData('liverpool');
    const arsenalTactics = await this.getTacticalData('arsenal');

    return {
      id: matchId,
      homeTeam: 'Liverpool',
      awayTeam: 'Arsenal',
      date: '2025-11-24T16:30:00',
      venue: 'Anfield',
      referee: 'Michael Oliver',
      weather: { temp: 8, condition: 'Cloudy', icon: 'cloud' },
      h2h: {
        played: 10,
        wins: 5,
        draws: 3,
        losses: 2,
        goalsFor: 14,
        goalsAgainst: 8,
        lastMatches: ['W', 'D', 'W', 'L', 'W'],
      },
      risk: {
        level: 'high',
        score: 72,
        factors: [
          'Title six-pointer — both teams in top 2',
          'Key absence: Robertson (doubtful)',
          'Arsenal unbeaten in last 8 away matches',
        ],
      },
      tactics: { home: liverpoolTactics, away: arsenalTactics },
      setPieces: {
        home: {
          corners: { scored: 5, conceded: 1, totalFor: 52, totalAgainst: 18 },
          freeKicks: { scored: 3, conceded: 0, totalFor: 14, totalAgainst: 6 },
          trend: 'up',
        },
        away: {
          corners: { scored: 4, conceded: 2, totalFor: 48, totalAgainst: 20 },
          freeKicks: { scored: 2, conceded: 1, totalFor: 11, totalAgainst: 8 },
          trend: 'up',
        },
      },
    };
  }
}
