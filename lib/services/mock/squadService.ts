import { ISquadService, PlayerForm, PlayerLoad, TransferImpact, LoanPlayer, YouthProspect } from '../types';

export class MockSquadService implements ISquadService {
  async getTopFormPlayers(): Promise<PlayerForm[]> {
    return [
      { id: '1', name: 'Mohamed Salah', position: 'FWD', rating: 8.5, trend: 'up' },
      { id: '2', name: 'Alexis Mac Allister', position: 'MID', rating: 8.1, trend: 'up' },
      { id: '3', name: 'Virgil van Dijk', position: 'DEF', rating: 7.9, trend: 'stable' },
      { id: '4', name: 'Ryan Gravenberch', position: 'MID', rating: 7.7, trend: 'up' },
      { id: '5', name: 'Luis Díaz', position: 'FWD', rating: 7.4, trend: 'down' },
    ];
  }

  async getSquadLoad(): Promise<PlayerLoad[]> {
    return [
      { id: '1', name: 'Virgil van Dijk', position: 'DEF', minutesPlayed: 450, status: 'overload' },
      { id: '2', name: 'Trent Alexander-Arnold', position: 'DEF', minutesPlayed: 420, status: 'warning' },
      { id: '3', name: 'Dominik Szoboszlai', position: 'MID', minutesPlayed: 380, status: 'optimal' },
      { id: '4', name: 'Curtis Jones', position: 'MID', minutesPlayed: 250, status: 'optimal' },
      { id: '5', name: 'Cody Gakpo', position: 'FWD', minutesPlayed: 300, status: 'optimal' },
      { id: '6', name: 'Andrew Robertson', position: 'DEF', minutesPlayed: 440, status: 'overload' },
    ];
  }

  async getTransferImpacts(): Promise<TransferImpact[]> {
    return [
      {
        id: '1',
        name: 'Federico Chiesa',
        fromTeam: 'Juventus',
        toTeam: 'Liverpool',
        type: 'arrival',
        impactScore: 'high',
        analysis: 'Key reinforcement for the attack. Versatile forward who can play across the front three.',
        date: '2025-01-15',
      },
      {
        id: '2',
        name: 'Joel Matip',
        fromTeam: 'Liverpool',
        toTeam: 'Free Agent',
        type: 'departure',
        impactScore: 'medium',
        analysis: 'Released after contract expiry. Solid servant but injury-prone in recent seasons.',
        date: '2025-01-10',
      },
    ];
  }

  async getLoanWatch(): Promise<LoanPlayer[]> {
    return [
      {
        id: '1',
        name: 'Fabio Carvalho',
        currentTeam: 'Brentford',
        stats: { matches: 14, goals: 3, assists: 4, rating: 7.3 },
        highlight: true,
        summary: 'Man of the match in a 2-1 win. Dominated the midfield with creative passing.',
      },
      {
        id: '2',
        name: 'Tyler Morton',
        currentTeam: 'Blackburn Rovers',
        stats: { matches: 12, goals: 2, assists: 1, rating: 6.9 },
        highlight: false,
        summary: 'Scored a late equaliser but picked up a yellow card for a rash challenge.',
      },
    ];
  }

  async getYouthProspect(): Promise<YouthProspect> {
    return {
      id: '1',
      name: 'Jayden Danns',
      category: 'U21',
      position: 'Striker',
      stats: '4 Goals in 6 matches',
      description: 'Clinical finisher with pace to burn. Scored twice in the Youth Cup quarter-final.',
    };
  }
}
