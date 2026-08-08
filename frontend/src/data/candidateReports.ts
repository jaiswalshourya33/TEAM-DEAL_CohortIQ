import type { CandidateProfile, InterviewFeedback, InterviewMessage } from '@/types';

const defaultFeedback = (candidate: CandidateProfile): InterviewFeedback => ({
  summary: `${candidate.member.name} demonstrated solid execution across the cohort and showed strong readiness for a production-oriented AI engineering role.`,
  strengths: [
    'Consistent progress across core technical modules',
    'Strong understanding of AI product workflows and evaluation thinking',
    'Clear communication and practical reasoning during problem solving',
  ],
  gaps: [
    'Could deepen production debugging and observability patterns',
    'Would benefit from more hands-on architecture tradeoff discussions',
    'Needs more practice with deployment and operational recovery scenarios',
  ],
  next: [
    'Focus on end-to-end system design and production constraints',
    'Practice incident response and failure-mode analysis',
    'Reinforce deployment, monitoring, and scaling decisions',
  ],
  scores: {
    overall: 85,
    technicalUnderstanding: 88,
    depthOfReasoning: 82,
    systemDesign: 84,
    practicalApplication: 87,
    communication: 86,
  },
});

export function getCandidateReport(
  candidate: CandidateProfile,
  feedback?: InterviewFeedback,
  transcript?: InterviewMessage[],
): { feedback: InterviewFeedback; transcript: InterviewMessage[] } {
  return {
    feedback: feedback ?? defaultFeedback(candidate),
    transcript: transcript ?? [],
  };
}
