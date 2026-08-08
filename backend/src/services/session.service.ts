import { CandidateProfile } from './candidate.service';

export interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface InterviewSession {
  sessionId: string;
  candidate: CandidateProfile;
  questionCount: number;
  maxQuestions: number;
  coveredDays: Set<number>;
  coveredTopics: string[];
  currentTopic: string;
  currentDay: number;
  difficulty: string;
  history: MessageItem[];
  done: boolean;
  feedback?: any;
  plan?: any;
}

export class SessionService {
  private sessions = new Map<string, InterviewSession>();

  createSession(sessionId: string, candidate: CandidateProfile, plan?: any): InterviewSession {
    const firstTarget = plan?.targetDays?.[0];
    const startDay = firstTarget?.dayNumber || (candidate.missions?.[0]?.day || 1);
    const startTopicTitle = firstTarget?.title || `Day ${startDay}`;
    const startTopic = startTopicTitle.startsWith('Day ') ? startTopicTitle : `Day ${startDay}: ${startTopicTitle}`;

    const session: InterviewSession = {
      sessionId,
      candidate,
      questionCount: 1,
      maxQuestions: 8,
      coveredDays: new Set<number>([startDay]),
      coveredTopics: [startTopic],
      currentTopic: startTopic,
      currentDay: startDay,
      difficulty: candidate.member.yearsExperience >= 8 ? 'Advanced' : 'Intermediate',
      history: [],
      done: false,
      plan
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): InterviewSession | undefined {
    return this.sessions.get(sessionId);
  }

  updateSession(session: InterviewSession): void {
    this.sessions.set(session.sessionId, session);
  }

  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): InterviewSession | undefined {
    const session = this.getSession(sessionId);
    if (!session) return undefined;
    session.history.push({ role, content });
    this.updateSession(session);
    return session;
  }

  markDayCovered(sessionId: string, dayNumber: number, topicName: string): void {
    const session = this.getSession(sessionId);
    if (!session) return;
    session.coveredDays.add(dayNumber);
    if (!session.coveredTopics.includes(topicName)) {
      session.coveredTopics.push(topicName);
    }
    session.currentDay = dayNumber;
    session.currentTopic = topicName;
    this.updateSession(session);
  }

  isInterviewComplete(session: InterviewSession): boolean {
    return session.questionCount >= session.maxQuestions && session.coveredDays.size >= 4;
  }
}

export const sessionService = new SessionService();
