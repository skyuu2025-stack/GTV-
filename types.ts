
export enum VisaRoute {
  TECH = 'Digital Technology (Tech Nation)',
  ARTS = 'Arts and Culture (Arts Council)',
  FASHION = 'Fashion Design (British Fashion Council)',
  ARCHITECTURE = 'Architecture (RIBA)',
  FILM = 'Film and Television (PACT)'
}

export interface UserProfile {
  fullName: string;
  email: string;
  route: VisaRoute;
  // Fixed: Corrected union type syntax by removing invalid parenthetical descriptions
  careerStage: 'Exceptional Talent' | 'Exceptional Promise';
  currentRole: string;
  summary: string;
  evidenceItems: string[];
}

export interface AssessmentResult {
  score: number;
  probability: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suggestedEvidence: string[];
}

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}