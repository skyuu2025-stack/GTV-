
export enum VisaRoute {
  TECH = 'Digital Technology (Tech Nation)',
  ARTS = 'Arts and Culture (Arts Council)',
  FASHION = 'Fashion Design (British Fashion Council)',
  ARCHITECTURE = 'Architecture (RIBA)',
  FILM = 'Film and Television (PACT)'
}

export interface Recommendation {
  title: string;
  description: string;
  action: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface InsightPoint {
  title: string;
  description: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  route: VisaRoute;
  careerStage: 'Exceptional Talent' | 'Exceptional Promise';
  currentRole: string;
  summary: string;
  evidenceItems: string[];
  evidenceImages: string[];
}

export interface AssessmentResult {
  score: number;
  probability: string;
  strengths: InsightPoint[];
  weaknesses: InsightPoint[];
  recommendations: Recommendation[];
  suggestedEvidence: string[];
  groundingSources: GroundingSource[];
}

export interface AssessmentRecord {
  id: string;
  timestamp: string;
  profile: UserProfile;
  result: AssessmentResult;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}
