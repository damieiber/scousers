import { IClubService, MatchOdds, CompetitionStandings } from '../types';

export class MockClubService implements IClubService {
  async getMatchOdds(matchId: string): Promise<MatchOdds> {
    return {
      matchId,
      homeWin: [
        { provider: 'Bet365', odds: 1.85, trend: 'down' },
        { provider: 'Codere', odds: 1.80, trend: 'stable' },
      ],
      draw: [
        { provider: 'Bet365', odds: 3.40, trend: 'up' },
        { provider: 'Codere', odds: 3.35, trend: 'stable' },
      ],
      awayWin: [
        { provider: 'Bet365', odds: 4.50, trend: 'up' },
        { provider: 'Codere', odds: 4.40, trend: 'up' },
      ],
    };
  }

  async getStandings(): Promise<CompetitionStandings[]> {
    return [
      {
        id: 'lpf-2025',
        name: 'Liga Profesional',
        table: [
          { position: 1, team: 'Liverpool', played: 20, won: 14, drawn: 4, lost: 2, points: 46, form: ['W', 'W', 'D', 'W', 'W'] },
          { position: 2, team: 'Vélez', played: 20, won: 12, drawn: 5, lost: 3, points: 41, form: ['W', 'L', 'W', 'W', 'D'] },
          { position: 3, team: 'Racing', played: 20, won: 11, drawn: 6, lost: 3, points: 39, form: ['W', 'W', 'D', 'L', 'W'] },
          { position: 4, team: 'Talleres', played: 20, won: 10, drawn: 7, lost: 3, points: 37, form: ['D', 'W', 'D', 'W', 'L'] },
          { position: 5, team: 'Boca Juniors', played: 20, won: 9, drawn: 6, lost: 5, points: 33, form: ['L', 'W', 'L', 'D', 'W'] },
        ],
      },
      {
        id: 'libertadores-2025',
        name: 'Copa Libertadores (Grupo H)',
        table: [
          { position: 1, team: 'Liverpool', played: 4, won: 3, drawn: 1, lost: 0, points: 10, form: ['W', 'W', 'D', 'W'] },
          { position: 2, team: 'Nacional', played: 4, won: 2, drawn: 1, lost: 1, points: 7, form: ['W', 'L', 'D', 'W'] },
          { position: 3, team: 'Libertad', played: 4, won: 1, drawn: 1, lost: 2, points: 4, form: ['L', 'D', 'W', 'L'] },
          { position: 4, team: 'Dep. Táchira', played: 4, won: 0, drawn: 1, lost: 3, points: 1, form: ['L', 'L', 'D', 'L'] },
        ],
      },
    ];
  }
}
