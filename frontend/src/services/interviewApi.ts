import { CandidateProfile, InterviewFeedback, InterviewMessage } from '@/types';

const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '';

export interface InterviewApiResponse {
  reply: string;
  done: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  topic?: string;
  difficulty?: string;
  feedback?: InterviewFeedback;
  error?: string;
}

export const interviewApi = {
  async startInterview(sessionId: string, candidate: CandidateProfile): Promise<InterviewApiResponse> {
    const res = await fetch(`${API_BASE_URL}/api/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, candidate })
    });
    if (!res.ok) {
      throw new Error(`Failed to start interview session: ${res.statusText}`);
    }
    return res.json();
  },

  async sendAnswer(sessionId: string, message: string): Promise<InterviewApiResponse> {
    const res = await fetch(`${API_BASE_URL}/api/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message })
    });
    if (!res.ok) {
      throw new Error(`Failed to send interview message: ${res.statusText}`);
    }
    return res.json();
  },

  async getCandidates(): Promise<{ candidates: CandidateProfile[] }> {
    const res = await fetch(`${API_BASE_URL}/api/candidates`);
    if (!res.ok) {
      throw new Error(`Failed to fetch candidates: ${res.statusText}`);
    }
    return res.json();
  },

  async getCohort(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/cohort`);
    if (!res.ok) {
      throw new Error(`Failed to fetch cohort info: ${res.statusText}`);
    }
    return res.json();
  }
};
