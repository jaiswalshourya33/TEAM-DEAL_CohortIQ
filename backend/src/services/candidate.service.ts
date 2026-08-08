import candidatesData from '../data/candidates.json';

export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
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
}

export interface CandidateProfile {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export class CandidateService {
  private candidates: CandidateProfile[];

  constructor() {
    this.candidates = candidatesData.candidates as CandidateProfile[];
  }

  getAllCandidates(): CandidateProfile[] {
    return this.candidates;
  }

  getCandidateById(id: string): CandidateProfile | undefined {
    return this.candidates.find(c => c.member.id === id);
  }

  normalizeCandidateData(candidateInput: any): CandidateProfile {
    if (!candidateInput) {
      return this.candidates[0];
    }
    if (candidateInput.member && candidateInput.member.id) {
      const existing = this.getCandidateById(candidateInput.member.id);
      if (existing) return existing;
      return candidateInput as CandidateProfile;
    }
    if (candidateInput.id) {
      const existing = this.getCandidateById(candidateInput.id);
      if (existing) return existing;
    }
    return this.candidates[0];
  }
}

export const candidateService = new CandidateService();
