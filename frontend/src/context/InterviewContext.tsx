import React, { createContext, useContext, useState, useCallback } from 'react';
import { CandidateProfile, InterviewFeedback, InterviewMessage } from '../types';
import { interviewApi } from '../services/interviewApi';

interface InterviewContextType {
  sessionId: string;
  messages: InterviewMessage[];
  isLoading: boolean;
  questionNumber: number;
  totalQuestions: number;
  currentTopic: string;
  difficulty: string;
  done: boolean;
  feedback?: InterviewFeedback;
  startInterviewSession: (candidate: CandidateProfile) => Promise<void>;
  sendCandidateAnswer: (messageText: string) => Promise<void>;
  resetInterviewSession: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>(() => `LF-${Math.floor(1000 + Math.random() * 9000)}-X`);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(8);
  const [currentTopic, setCurrentTopic] = useState<string>('Technical Assessment');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [done, setDone] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | undefined>(undefined);

  const startInterviewSession = useCallback(async (candidate: CandidateProfile) => {
    const newSessionId = `LF-${Math.floor(1000 + Math.random() * 9000)}-X`;
    setSessionId(newSessionId);
    setIsLoading(true);
    setDone(false);
    setFeedback(undefined);

    try {
      const data = await interviewApi.startInterview(newSessionId, candidate);
      const firstAiMsg: InterviewMessage = {
        id: '1',
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionNumber: data.questionNumber || 1,
        topic: data.topic || 'Technical Assessment',
        difficulty: data.difficulty || 'Intermediate'
      };
      setMessages([firstAiMsg]);
      if (data.questionNumber) setQuestionNumber(data.questionNumber);
      if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
      if (data.topic) setCurrentTopic(data.topic);
      if (data.difficulty) setDifficulty(data.difficulty);
    } catch (err) {
      console.error('Context error starting interview:', err);
      const firstMission = candidate.missions?.[0];
      const startTopic = firstMission ? `Day ${firstMission.day}: ${firstMission.title}` : 'Day 1: AI Foundations';
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: `Welcome ${candidate.member.name}. Let's begin the technical interview tailored to your AI Cohort journey.\n\nTo start with ${startTopic}: How do you approach key design choices and trade-offs in this module?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          questionNumber: 1
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendCandidateAnswer = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: InterviewMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await interviewApi.sendAnswer(sessionId, messageText);
      if (data.done) {
        setDone(true);
        if (data.feedback) setFeedback(data.feedback);
        const finalAiMsg: InterviewMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply || 'Interview completed.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, finalAiMsg]);
      } else {
        const nextAiMsg: InterviewMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          questionNumber: data.questionNumber,
          topic: data.topic,
          difficulty: data.difficulty
        };
        setMessages(prev => [...prev, nextAiMsg]);
        if (data.questionNumber) setQuestionNumber(data.questionNumber);
        if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
        if (data.topic) setCurrentTopic(data.topic);
        if (data.difficulty) setDifficulty(data.difficulty);
      }
    } catch (err) {
      console.error('Context error sending answer:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading]);

  const resetInterviewSession = useCallback(() => {
    setMessages([]);
    setQuestionNumber(1);
    setDone(false);
    setFeedback(undefined);
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        sessionId,
        messages,
        isLoading,
        questionNumber,
        totalQuestions,
        currentTopic,
        difficulty,
        done,
        feedback,
        startInterviewSession,
        sendCandidateAnswer,
        resetInterviewSession
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
