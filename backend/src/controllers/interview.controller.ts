import { Request, Response } from 'express';
import { candidateService } from '../services/candidate.service';
import { curriculumService } from '../services/curriculum.service';
import { sessionService } from '../services/session.service';
import { interviewPlanner } from '../agent/interviewPlanner';
import { questionGenerator } from '../agent/questionGenerator';
import { answerEvaluator } from '../agent/answerEvaluator';
import { followupGenerator } from '../agent/followupGenerator';
import { feedbackGenerator } from '../agent/feedbackGenerator';

export async function handleInterview(req: Request, res: Response) {
  try {
    const { sessionId, candidate, message } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // 1. Initial interview setup (Start Session)
    if (candidate && !message) {
      const normalizedCandidate = candidateService.normalizeCandidateData(candidate);
      const plan = interviewPlanner.planInterview(normalizedCandidate);
      const session = sessionService.createSession(sessionId, normalizedCandidate, plan);

      const startingTargetDay = plan.startingDay || 7;
      const opening = await questionGenerator.generateOpeningQuestion(normalizedCandidate, startingTargetDay);

      sessionService.addMessage(sessionId, 'assistant', opening.reply);
      sessionService.markDayCovered(sessionId, startingTargetDay, opening.topic);

      return res.json({
        reply: opening.reply,
        done: false,
        questionNumber: 1,
        totalQuestions: session.maxQuestions,
        topic: opening.topic,
        difficulty: opening.difficulty
      });
    }

    // 2. Subsequent turn (Candidate Answer)
    let session = sessionService.getSession(sessionId);
    if (!session) {
      const defaultCandidate = candidateService.normalizeCandidateData(candidate);
      const plan = interviewPlanner.planInterview(defaultCandidate);
      session = sessionService.createSession(sessionId, defaultCandidate, plan);
    }

    if (message) {
      sessionService.addMessage(sessionId, 'user', message);
      session.questionCount += 1;
    }

    // 3. Evaluate answer
    const previousQuestion = session.history[session.history.length - 2]?.content || '';
    const currentTopicName = session.currentTopic;
    const currentDayNumber = session.currentDay;

    let evalResult = { isStrong: true, needsFollowup: false, keyInsights: 'Good explanation.' };
    if (message) {
      evalResult = await answerEvaluator.evaluateAnswer(previousQuestion, message, currentTopicName);
    }

    // Count how many assistant messages were asked on current day
    const questionsAskedOnCurrentDay = session.history.filter(
      h => h.role === 'assistant' && h.content.toLowerCase().includes(`day ${currentDayNumber}`)
    ).length;

    // 4. Select next target day
    let nextTargetDayNumber = currentDayNumber;
    const targetDays = session.plan?.targetDays || [];
    const candidatePool = session.plan?.candidateTopicPool || targetDays.map((t: any) => t.dayNumber);

    // Rule A: If candidate needs follow-up / probing AND we haven't asked 2 questions on current day -> stay on current day
    if (evalResult.needsFollowup && questionsAskedOnCurrentDay < 2) {
      nextTargetDayNumber = currentDayNumber;
    } else {
      // Rule B: Candidate answered well or reached limit on current topic -> transition to next uncovered planned target day
      const uncoveredPlanTopic = targetDays.find((t: any) => !session.coveredDays.has(t.dayNumber));

      if (uncoveredPlanTopic) {
        nextTargetDayNumber = uncoveredPlanTopic.dayNumber;
      } else {
        // Find any uncovered day in candidate topic pool
        const uncoveredPoolDay = candidatePool.find((d: number) => !session.coveredDays.has(d));
        if (uncoveredPoolDay) {
          nextTargetDayNumber = uncoveredPoolDay;
        } else {
          // If all days covered, rotate to another planned day
          const nextIndex = (session.coveredDays.size) % Math.max(1, targetDays.length);
          nextTargetDayNumber = targetDays[nextIndex]?.dayNumber || currentDayNumber;
        }
      }
    }

    // Rule C: Ensure 4+ covered days requirement by question 7 & 8
    if (session.questionCount >= 7 && session.coveredDays.size < 4) {
      const remainingUncovered = targetDays.find((t: any) => !session.coveredDays.has(t.dayNumber));
      if (remainingUncovered) {
        nextTargetDayNumber = remainingUncovered.dayNumber;
      }
    }

    const dayObj = curriculumService.getDayByNumber(nextTargetDayNumber) || curriculumService.getDayByNumber(currentDayNumber)!;
    const nextTopicTitle = `Day ${dayObj.day}: ${dayObj.title}`;

    sessionService.markDayCovered(sessionId, nextTargetDayNumber, nextTopicTitle);

    // 5. Check Completion (questionCount > maxQuestions AND coveredDays >= 4)
    if (session.questionCount > session.maxQuestions && session.coveredDays.size >= 4) {
      session.done = true;
      const feedback = await feedbackGenerator.generateFeedback(
        session.candidate,
        session.history,
        session.coveredTopics
      );
      session.feedback = feedback;
      sessionService.updateSession(session);

      return res.json({
        reply: 'Interview completed.',
        done: true,
        feedback
      });
    }

    // 6. Generate next question
    const nextQuestion = await followupGenerator.generateNextQuestion(
      session.candidate,
      nextTargetDayNumber,
      session.questionCount,
      session.maxQuestions,
      session.history,
      evalResult.keyInsights
    );

    sessionService.addMessage(sessionId, 'assistant', nextQuestion.reply);

    return res.json({
      reply: nextQuestion.reply,
      done: false,
      questionNumber: session.questionCount,
      totalQuestions: session.maxQuestions,
      topic: nextQuestion.topic,
      difficulty: nextQuestion.difficulty
    });

  } catch (err: any) {
    console.error('Error handling interview API request:', err);
    return res.status(500).json({
      error: 'Failed to process interview request',
      details: err.message
    });
  }
}

export function getCandidatesList(req: Request, res: Response) {
  try {
    const candidates = candidateService.getAllCandidates();
    return res.json({ candidates });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export function getCohortInfo(req: Request, res: Response) {
  try {
    const cohort = curriculumService.getCohortInfo();
    return res.json(cohort);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
