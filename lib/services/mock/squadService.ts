import { ISquadService, PlayerForm, PlayerLoad, TransferImpact, LoanPlayer, YouthProspect } from '../types';

export class MockSquadService implements ISquadService {
  async getTopFormPlayers(teamKey?: string): Promise<PlayerForm[]> {
    if (teamKey === 'everton') {
      return [
        { id: '1', name: 'Abdoulaye Doucouré', position: 'MID', rating: 7.8, trend: 'up' },
        { id: '2', name: 'Dwight McNeil', position: 'FWD', rating: 7.6, trend: 'up' },
        { id: '3', name: 'James Tarkowski', position: 'DEF', rating: 7.5, trend: 'stable' },
        { id: '4', name: 'Vitalii Mykolenko', position: 'DEF', rating: 7.2, trend: 'up' },
        { id: '5', name: 'Iliman Ndiaye', position: 'FWD', rating: 7.0, trend: 'down' },
      ];
    }
    return [
      { id: '1', name: 'Mohamed Salah', position: 'FWD', rating: 8.5, trend: 'up' },
      { id: '2', name: 'Alexis Mac Allister', position: 'MID', rating: 8.1, trend: 'up' },
      { id: '3', name: 'Virgil van Dijk', position: 'DEF', rating: 7.9, trend: 'stable' },
      { id: '4', name: 'Ryan Gravenberch', position: 'MID', rating: 7.7, trend: 'up' },
      { id: '5', name: 'Luis Díaz', position: 'FWD', rating: 7.4, trend: 'down' },
    ];
  }

  async getSquadLoad(teamKey?: string): Promise<PlayerLoad[]> {
    if (teamKey === 'everton') {
      return [
        { id: '1', name: 'James Tarkowski', position: 'DEF', minutesPlayed: 450, status: 'overload' },
        { id: '2', name: 'Vitalii Mykolenko', position: 'DEF', minutesPlayed: 410, status: 'warning' },
        { id: '3', name: 'Abdoulaye Doucouré', position: 'MID', minutesPlayed: 370, status: 'optimal' },
        { id: '4', name: 'Idrissa Gueye', position: 'MID', minutesPlayed: 340, status: 'warning' },
        { id: '5', name: 'Beto', position: 'FWD', minutesPlayed: 280, status: 'optimal' },
        { id: '6', name: 'Ashley Young', position: 'DEF', minutesPlayed: 430, status: 'overload' },
      ];
    }
    return [
      { id: '1', name: 'Virgil van Dijk', position: 'DEF', minutesPlayed: 450, status: 'overload' },
      { id: '2', name: 'Trent Alexander-Arnold', position: 'DEF', minutesPlayed: 420, status: 'warning' },
      { id: '3', name: 'Dominik Szoboszlai', position: 'MID', minutesPlayed: 380, status: 'optimal' },
      { id: '4', name: 'Curtis Jones', position: 'MID', minutesPlayed: 250, status: 'optimal' },
      { id: '5', name: 'Cody Gakpo', position: 'FWD', minutesPlayed: 300, status: 'optimal' },
      { id: '6', name: 'Andrew Robertson', position: 'DEF', minutesPlayed: 440, status: 'overload' },
    ];
  }

  async getTransferImpacts(teamKey?: string): Promise<TransferImpact[]> {
    if (teamKey === 'everton') {
      return [
        {
          id: '1',
          name: 'Tim Iroegbunam',
          fromTeam: 'Aston Villa',
          toTeam: 'Everton',
          type: 'arrival',
          impactScore: 'medium',
          analysis: 'Young midfielder with energy and versatility. Adds depth to the central midfield options.',
          date: '2025-01-20',
        },
        {
          id: '2',
          name: 'Ben Godfrey',
          fromTeam: 'Everton',
          toTeam: 'Atalanta',
          type: 'departure',
          impactScore: 'medium',
          analysis: 'Versatile defender moved on. Frees up wages but reduces squad depth at the back.',
          date: '2025-01-10',
        },
      ];
    }
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

  async getLoanWatch(teamKey?: string): Promise<LoanPlayer[]> {
    if (teamKey === 'everton') {
      return [
        {
          id: '1',
          name: 'Lewis Dobbin',
          currentTeam: 'West Brom',
          stats: { matches: 16, goals: 4, assists: 2, rating: 7.1 },
          highlight: true,
          summary: 'Scored a brace in a 3-1 win. Showing real promise in the Championship.',
        },
        {
          id: '2',
          name: 'Reece Welch',
          currentTeam: 'Preston North End',
          stats: { matches: 14, goals: 1, assists: 0, rating: 6.7 },
          highlight: false,
          summary: 'Steady performances at centre-back. Building experience at a competitive level.',
        },
      ];
    }
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

  async getYouthProspect(teamKey?: string): Promise<YouthProspect> {
    if (teamKey === 'everton') {
      return {
        id: '1',
        name: 'Harrison Armstrong',
        category: 'U18',
        position: 'Midfielder',
        stats: '3 Goals, 5 Assists in 8 matches',
        description: 'Creative playmaker with excellent vision. Named Academy Player of the Month after standout performances.',
      };
    }
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
