import { CandidateProfile } from './candidate.service';
import { InterviewPlan } from '../agent/interviewPlanner';

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
  askedQuestions: string[];
  evaluations: any[];
  done: boolean;
  feedback?: any;
  plan: InterviewPlan;
}

export class SessionService {
  private sessions = new Map<string, InterviewSession>();

  createSession(sessionId: string, candidate: CandidateProfile, plan: InterviewPlan): InterviewSession {
    const startDay = plan.startingDay || 7;
    const startTopicObj = plan.targetDays.find(t => t.dayNumber === startDay) || plan.targetDays[0];
    const startTopicTitle = startTopicObj ? startTopicObj.title : `Day ${startDay}`;
    const startTopic = startTopicTitle.startsWith('Day ') ? startTopicTitle : `Day ${startDay}: ${startTopicTitle}`;

    const session: InterviewSession = {
      sessionId,
      candidate,
      questionCount: 1,
      maxQuestions: plan.minimumQuestions || 8,
      coveredDays: new Set<number>([startDay]),
      coveredTopics: [startTopic],
      currentTopic: startTopic,
      currentDay: startDay,
      difficulty: plan.difficulty || 'Intermediate',
      history: [],
      askedQuestions: [],
      evaluations: [],
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
    if (role === 'assistant') {
      session.askedQuestions.push(content);
    }
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
    const minQ = session.plan?.minimumQuestions || 8;
    const minDays = session.plan?.minimumDays || 4;
    return session.questionCount >= minQ && session.coveredDays.size >= minDays;
  }
}

export const sessionService = new SessionService();
