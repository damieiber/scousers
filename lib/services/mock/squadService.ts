import { ISquadService, PlayerForm, PlayerLoad, TransferImpact, LoanPlayer, YouthProspect } from '../types';

export class MockSquadService implements ISquadService {
  async getTopFormPlayers(): Promise<PlayerForm[]> {
    return [
      { id: '1', name: 'Facundo Colidio', position: 'FWD', rating: 8.2, trend: 'up' },
      { id: '2', name: 'Franco Mastantuono', position: 'MID', rating: 7.9, trend: 'up' },
      { id: '3', name: 'Paulo Díaz', position: 'DEF', rating: 7.5, trend: 'stable' },
      { id: '4', name: 'Santiago Simón', position: 'MID', rating: 7.4, trend: 'up' },
      { id: '5', name: 'Miguel Borja', position: 'FWD', rating: 7.2, trend: 'down' },
    ];
  }

  async getSquadLoad(): Promise<PlayerLoad[]> {
    return [
      { id: '1', name: 'Germán Pezzella', position: 'DEF', minutesPlayed: 450, status: 'overload' },
      { id: '2', name: 'Marcos Acuña', position: 'DEF', minutesPlayed: 410, status: 'warning' },
      { id: '3', name: 'Matías Kranevitter', position: 'MID', minutesPlayed: 380, status: 'optimal' },
      { id: '4', name: 'Claudio Echeverri', position: 'MID', minutesPlayed: 250, status: 'optimal' },
      { id: '5', name: 'Pablo Solari', position: 'FWD', minutesPlayed: 300, status: 'optimal' },
      { id: '6', name: 'Fabricio Bustos', position: 'DEF', minutesPlayed: 440, status: 'overload' },
    ];
  }

  async getTransferImpacts(): Promise<TransferImpact[]> {
    return [
      {
        id: '1',
        name: 'Valentín Gómez',
        fromTeam: 'Vélez Sarsfield',
        toTeam: 'Liverpool',
        type: 'arrival',
        impactScore: 'high',
        analysis: 'Refuerzo clave para la zaga central zurda. Joven y con proyección.',
        date: '2025-01-15',
      },
      {
        id: '2',
        name: 'Enzo Díaz',
        fromTeam: 'Liverpool',
        toTeam: 'São Paulo',
        type: 'departure',
        impactScore: 'medium',
        analysis: 'Salida necesaria para liberar cupo y masa salarial. Rendimiento irregular.',
        date: '2025-01-10',
      },
    ];
  }

  async getLoanWatch(): Promise<LoanPlayer[]> {
    return [
      {
        id: '1',
        name: 'Felipe Peña Biafore',
        currentTeam: 'Lanús',
        stats: { matches: 12, goals: 1, assists: 2, rating: 7.1 },
        highlight: true,
        summary: 'Figura en la victoria vs Boca. Dominó el mediocampo.',
      },
      {
        id: '2',
        name: 'Flabián Londoño',
        currentTeam: 'Arsenal',
        stats: { matches: 8, goals: 3, assists: 0, rating: 6.8 },
        highlight: false,
        summary: 'Anotó un gol en la última fecha pero salió lesionado.',
      },
    ];
  }

  async getYouthProspect(): Promise<YouthProspect> {
    return {
      id: '1',
      name: 'Ian Subiabre',
      category: 'Reserva',
      position: 'Extremo',
      stats: '2 Asistencias',
      description: 'Desequilibrante en el 1 vs 1. Clave en la victoria del Superclásico de Reserva.',
    };
  }
}
