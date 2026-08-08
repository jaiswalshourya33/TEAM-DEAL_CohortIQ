export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  avatarUrl?: string;
}

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  skipped?: boolean;
  attempts?: number;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
  efficiencyScore?: string;
  matchScore?: string;
}

export interface CandidateProfile {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
  learningSignals?: string[];
  probeAreas?: {
    title: string;
    description: string;
    dayBadge?: string;
    tag?: string;
  }[];
}

export interface CohortDay {
  day: number;
  title: string;
  type: 'SETUP' | 'BUILD' | 'AI_CORE' | 'SHIP_IT' | 'LEARN' | 'OPTIMIZE' | 'CAPSTONE';
  tools: string[];
  objectives: string[];
}

export interface CohortModule {
  n: number;
  title: string;
  days: number[];
}

export interface InterviewFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
  scores?: {
    overall: number;
    technicalUnderstanding: number;
    depthOfReasoning: number;
    systemDesign: number;
    practicalApplication: number;
    communication: number;
  };
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  badge?: string;
  questionNumber?: number;
  topic?: string;
  difficulty?: string;
  depth?: string;
  attachments?: { name: string; size: string; type?: string }[];
}

export interface InterviewSession {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  currentQuestion: number;
  totalQuestions: number;
  currentTopic: string;
  difficulty: string;
  depth: string;
  messages: InterviewMessage[];
  done: boolean;
  feedback?: InterviewFeedback;
  startTime: number;
}
