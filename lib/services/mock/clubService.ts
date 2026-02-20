import { IClubService, MatchOdds, CompetitionStandings } from '../types';

export class MockClubService implements IClubService {
  async getMatchOdds(matchId: string): Promise<MatchOdds> {
    return {
      matchId,
      homeWin: [
        { provider: 'Bet365', odds: 1.55, trend: 'down' },
        { provider: 'William Hill', odds: 1.50, trend: 'stable' },
      ],
      draw: [
        { provider: 'Bet365', odds: 4.00, trend: 'up' },
        { provider: 'William Hill', odds: 3.90, trend: 'stable' },
      ],
      awayWin: [
        { provider: 'Bet365', odds: 6.50, trend: 'up' },
        { provider: 'William Hill', odds: 6.25, trend: 'up' },
      ],
    };
  }

  async getStandings(): Promise<CompetitionStandings[]> {
    return [
      {
        id: 'pl-2025',
        name: 'Premier League',
        table: [
          { position: 1, team: 'Liverpool', played: 20, won: 14, drawn: 4, lost: 2, points: 46, form: ['W', 'W', 'D', 'W', 'W'] },
          { position: 2, team: 'Arsenal', played: 20, won: 13, drawn: 4, lost: 3, points: 43, form: ['W', 'L', 'W', 'W', 'D'] },
          { position: 3, team: 'Man City', played: 20, won: 12, drawn: 5, lost: 3, points: 41, form: ['W', 'W', 'D', 'L', 'W'] },
          { position: 4, team: 'Aston Villa', played: 20, won: 10, drawn: 7, lost: 3, points: 37, form: ['D', 'W', 'D', 'W', 'L'] },
          { position: 5, team: 'Tottenham', played: 20, won: 9, drawn: 6, lost: 5, points: 33, form: ['L', 'W', 'L', 'D', 'W'] },
        ],
      },
      {
        id: 'ucl-2025',
        name: 'Champions League (Group E)',
        table: [
          { position: 1, team: 'Liverpool', played: 4, won: 3, drawn: 1, lost: 0, points: 10, form: ['W', 'W', 'D', 'W'] },
          { position: 2, team: 'Atalanta', played: 4, won: 2, drawn: 1, lost: 1, points: 7, form: ['W', 'L', 'D', 'W'] },
          { position: 3, team: 'Union SG', played: 4, won: 1, drawn: 1, lost: 2, points: 4, form: ['L', 'D', 'W', 'L'] },
          { position: 4, team: 'Sparta Praha', played: 4, won: 0, drawn: 1, lost: 3, points: 1, form: ['L', 'L', 'D', 'L'] },
        ],
      },
    ];
  }
}
