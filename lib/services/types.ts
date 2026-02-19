export interface ZoneStats {
  zone: 'left' | 'center' | 'right';
  percentage: number;
  label: string;
}

export interface ShotStats {
  total: number;
  onTarget: number;
  offTarget: number;
  blocked: number;
}

export interface TacticalData {
  teamId: string;
  teamName: string;
  attackZones: ZoneStats[];
  shotStats: ShotStats;
  possession: number;
}

export interface SetPieceStats {
  corners: {
    scored: number;
    conceded: number;
    totalFor: number;
    totalAgainst: number;
  };
  freeKicks: {
    scored: number;
    conceded: number;
    totalFor: number;
    totalAgainst: number;
  };
  trend: 'up' | 'down' | 'stable';
}

export interface MatchRisk {
  level: 'low' | 'medium' | 'high';
  score: number;
  factors: string[];
}

export interface H2HStats {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  lastMatches: ('W' | 'D' | 'L')[];
}

export interface MatchPreviewData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  referee: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  h2h: H2HStats;
  risk: MatchRisk;
  tactics: {
    home: TacticalData;
    away: TacticalData;
  };
  setPieces: {
    home: SetPieceStats;
    away: SetPieceStats;
  };
}

export interface IMatchAnalysisService {
  getMatchPreview(matchId: string): Promise<MatchPreviewData>;
  getTacticalData(teamId: string): Promise<TacticalData>;
}

export interface PlayerForm {
  id: string;
  name: string;
  position: string;
  rating: number;
  trend: 'up' | 'down' | 'stable';
  avatarUrl?: string;
}

export interface PlayerLoad {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  minutesPlayed: number;
  status: 'optimal' | 'warning' | 'overload';
  avatarUrl?: string;
}

export interface TransferImpact {
  id: string;
  name: string;
  fromTeam: string;
  toTeam: string;
  type: 'arrival' | 'departure';
  impactScore: 'high' | 'medium' | 'low';
  analysis: string;
  date: string;
}

export interface LoanPlayer {
  id: string;
  name: string;
  currentTeam: string;
  stats: {
    matches: number;
    goals: number;
    assists: number;
    rating: number;
  };
  highlight: boolean;
  summary: string;
}

export interface YouthProspect {
  id: string;
  name: string;
  category: string;
  position: string;
  stats: string;
  description: string;
  imageUrl?: string;
}

export interface ISquadService {
  getTopFormPlayers(): Promise<PlayerForm[]>;
  getSquadLoad(): Promise<PlayerLoad[]>;
  getTransferImpacts(): Promise<TransferImpact[]>;
  getLoanWatch(): Promise<LoanPlayer[]>;
  getYouthProspect(): Promise<YouthProspect>;
}

export interface OddsOption {
  provider: string;
  odds: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MatchOdds {
  matchId: string;
  homeWin: OddsOption[];
  draw: OddsOption[];
  awayWin: OddsOption[];
}

export interface StandingRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface CompetitionStandings {
  id: string;
  name: string;
  table: StandingRow[];
}

export interface IClubService {
  getMatchOdds(matchId: string): Promise<MatchOdds>;
  getStandings(): Promise<CompetitionStandings[]>;
}
