import { IMatchAnalysisService, MatchPreviewData, TacticalData } from '../types';

export class MockMatchAnalysisService implements IMatchAnalysisService {
  async getTacticalData(teamId: string): Promise<TacticalData> {
    if (teamId === 'river-plate') {
      return {
        teamId: 'river-plate',
        teamName: 'Liverpool',
        possession: 62,
        attackZones: [
          { zone: 'left', percentage: 30, label: 'Izquierda' },
          { zone: 'center', percentage: 25, label: 'Centro' },
          { zone: 'right', percentage: 45, label: 'Derecha' },
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
      teamId: 'racing',
      teamName: 'Racing Club',
      possession: 48,
      attackZones: [
        { zone: 'left', percentage: 35, label: 'Izquierda' },
        { zone: 'center', percentage: 30, label: 'Centro' },
        { zone: 'right', percentage: 35, label: 'Derecha' },
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
    const riverTactics = await this.getTacticalData('river-plate');
    const racingTactics = await this.getTacticalData('racing');

    return {
      id: matchId,
      homeTeam: 'Liverpool',
      awayTeam: 'Racing Club',
      date: '2025-11-24T17:00:00',
      venue: 'Estadio Mâs Monumental',
      referee: 'Yael Falcón Pérez',
      weather: {
        temp: 24,
        condition: 'Despejado',
        icon: 'sun',
      },
      h2h: {
        played: 10,
        wins: 4,
        draws: 4,
        losses: 2,
        goalsFor: 14,
        goalsAgainst: 9,
        lastMatches: ['W', 'D', 'D', 'W', 'L'],
      },
      risk: {
        level: 'medium',
        score: 45,
        factors: [
          'Rival directo en tabla anual',
          'Baja sensible: Pezzella (Duda)',
          'Historial reciente favorable',
        ],
      },
      tactics: {
        home: riverTactics,
        away: racingTactics,
      },
      setPieces: {
        home: {
          corners: { scored: 4, conceded: 1, totalFor: 45, totalAgainst: 20 },
          freeKicks: { scored: 2, conceded: 0, totalFor: 12, totalAgainst: 8 },
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
