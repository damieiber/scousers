import { IMatchAnalysisService, ISquadService, IClubService } from './types';
import { MockMatchAnalysisService } from './mock/matchAnalysis';
import { MockSquadService } from './mock/squadService';
import { MockClubService } from './mock/clubService';

const useMock = true;

export const matchAnalysisService: IMatchAnalysisService = useMock
  ? new MockMatchAnalysisService()
  : new MockMatchAnalysisService();

export const squadService: ISquadService = useMock
  ? new MockSquadService()
  : new MockSquadService();

export const clubService: IClubService = useMock
  ? new MockClubService()
  : new MockClubService();
