import { IClubService, MatchOdds, CompetitionStandings } from '../types';

export class MockClubService implements IClubService {
  async getMatchOdds(matchId: string, teamKey?: string): Promise<MatchOdds> {
    if (teamKey === 'everton') {
      return {
        matchId,
        homeWin: [
          { provider: 'Bet365', odds: 2.90, trend: 'up' },
          { provider: 'William Hill', odds: 2.80, trend: 'stable' },
        ],
        draw: [
          { provider: 'Bet365', odds: 3.30, trend: 'stable' },
          { provider: 'William Hill', odds: 3.25, trend: 'down' },
        ],
        awayWin: [
          { provider: 'Bet365', odds: 2.40, trend: 'down' },
          { provider: 'William Hill', odds: 2.35, trend: 'down' },
        ],
      };
    }
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
          { position: 6, team: 'Chelsea', played: 20, won: 9, drawn: 5, lost: 6, points: 32, form: ['W', 'D', 'L', 'W', 'D'] },
          { position: 7, team: 'Newcastle', played: 20, won: 9, drawn: 4, lost: 7, points: 31, form: ['W', 'W', 'L', 'L', 'W'] },
          { position: 8, team: 'Brighton', played: 20, won: 8, drawn: 6, lost: 6, points: 30, form: ['D', 'W', 'W', 'L', 'D'] },
          { position: 9, team: 'Man United', played: 20, won: 8, drawn: 5, lost: 7, points: 29, form: ['L', 'W', 'D', 'W', 'L'] },
          { position: 10, team: 'West Ham', played: 20, won: 7, drawn: 6, lost: 7, points: 27, form: ['D', 'L', 'W', 'D', 'W'] },
          { position: 11, team: 'Bournemouth', played: 20, won: 7, drawn: 5, lost: 8, points: 26, form: ['W', 'L', 'L', 'W', 'D'] },
          { position: 12, team: 'Everton', played: 20, won: 6, drawn: 6, lost: 8, points: 24, form: ['D', 'L', 'W', 'D', 'L'] },
          { position: 13, team: 'Fulham', played: 20, won: 6, drawn: 5, lost: 9, points: 23, form: ['L', 'D', 'L', 'W', 'W'] },
          { position: 14, team: 'Wolves', played: 20, won: 5, drawn: 6, lost: 9, points: 21, form: ['L', 'L', 'D', 'D', 'W'] },
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
