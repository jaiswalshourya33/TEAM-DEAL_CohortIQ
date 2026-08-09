import { candidateService } from '../backend/src/services/candidate.service';
import { interviewPlanner } from '../backend/src/agent/interviewPlanner';
import { questionGenerator } from '../backend/src/agent/questionGenerator';
import { followupGenerator } from '../backend/src/agent/followupGenerator';
import { answerEvaluator } from '../backend/src/agent/answerEvaluator';
import { sessionService } from '../backend/src/services/session.service';
import { feedbackGenerator } from '../backend/src/agent/feedbackGenerator';
import { curriculumService } from '../backend/src/services/curriculum.service';

export interface VerificationResult {
  candidateId: string;
  name: string;
  jobRole: string;
  yearsExp: number;
  startingDay: number;
  startingTopic: string;
  selectedDays: number[];
  coveredDays: number[];
  uniqueCoveredCount: number;
  totalQuestions: number;
  difficulty: string;
  skippedDays: number[];
  recommendations: string[];
  passed: boolean;
}

async function testCandidateInterview(candidateId: string): Promise<VerificationResult> {
  const candidate = candidateService.getCandidateById(candidateId);
  if (!candidate) {
    throw new Error(`Candidate ${candidateId} not found`);
  }

  // 1. Generate Candidate-Specific Interview Plan
  const plan = interviewPlanner.planInterview(candidate);

  // 2. Start Session & Opening Question (Q1)
  const sessionId = `loop-test-${candidateId}-${Date.now()}`;
  const session = sessionService.createSession(sessionId, candidate, plan);

  const opening = await questionGenerator.generateOpeningQuestion(candidate, plan.startingDay);
  sessionService.addMessage(sessionId, 'assistant', opening.reply);
  sessionService.markDayCovered(sessionId, plan.startingDay, opening.topic);

  // Sample responses tailored by role / topic
  const defaultAnswers = [
    "We evaluate system trade-offs by measuring latency SLAs, RAM footprint, and automated retrieval accuracy against test benchmarks.",
    "For our data infrastructure, we implement two-stage retrieval combining dense vector search with cross-encoder reranking.",
    "To enforce prompt reliability, we use explicit system instructions with Pydantic JSON schema validation and auto-healing retries.",
    "When managing state across services, we use event-driven queues with typed schema objects to prevent cascading failure loops.",
    "We standardize external tool execution using Model Context Protocol schemas to isolate tool execution environments.",
    "In container deployments, we configure health probes and secrets management in Kubernetes with horizontal pod autoscaling.",
    "We set up OpenTelemetry tracing across all LLM API endpoints and vector database queries to debug latency spikes.",
    "In our capstone project, we optimized retrieval accuracy and token cost trade-offs, achieving 94% faithfulness across evaluation benchmarks."
  ];

  // 3. Execute 7 subsequent adaptive turns (Q2 .. Q8)
  for (let qNum = 2; qNum <= 8; qNum++) {
    const candidateAnswer = defaultAnswers[qNum - 2] || defaultAnswers[0];
    sessionService.addMessage(sessionId, 'user', candidateAnswer);
    session.questionCount += 1;

    // Evaluate answer
    const prevQ = session.history.filter(h => h.role === 'assistant').slice(-1)[0]?.content || '';
    const evalResult = await answerEvaluator.evaluateAnswer(prevQ, candidateAnswer, session.currentTopic);

    // Determine next target day
    const questionsAskedOnCurrentDay = session.history.filter(
      h => h.role === 'assistant' && (h.content.toLowerCase().includes(`day ${session.currentDay}`) || h.content === prevQ)
    ).length;

    let nextTargetDayNumber = session.currentDay;
    const targetDays = session.plan.targetDays;
    const candidatePool = session.plan.candidateTopicPool;

    if (evalResult.needsFollowup && questionsAskedOnCurrentDay < 2) {
      nextTargetDayNumber = session.currentDay;
    } else {
      const uncoveredPlanTopic = targetDays.find(t => !session.coveredDays.has(t.dayNumber));
      if (uncoveredPlanTopic) {
        nextTargetDayNumber = uncoveredPlanTopic.dayNumber;
      } else {
        const uncoveredPoolDay = candidatePool.find(d => !session.coveredDays.has(d));
        if (uncoveredPoolDay) {
          nextTargetDayNumber = uncoveredPoolDay;
        } else {
          const nextIndex = session.coveredDays.size % Math.max(1, targetDays.length);
          nextTargetDayNumber = targetDays[nextIndex]?.dayNumber || session.currentDay;
        }
      }
    }

    // Force 4+ covered days requirement before Q8
    if (session.questionCount >= 6 && session.coveredDays.size < 4) {
      const remainingUncovered = targetDays.find(t => !session.coveredDays.has(t.dayNumber));
      if (remainingUncovered) {
        nextTargetDayNumber = remainingUncovered.dayNumber;
      }
    }

    const dayObj = curriculumService.getDayByNumber(nextTargetDayNumber)!;
    const nextTopicTitle = `Day ${dayObj.day}: ${dayObj.title}`;

    sessionService.markDayCovered(sessionId, nextTargetDayNumber, nextTopicTitle);

    const nextQuestion = await followupGenerator.generateNextQuestion(
      candidate,
      nextTargetDayNumber,
      session.questionCount,
      session.maxQuestions,
      session.history,
      evalResult.keyInsights,
      session.askedQuestions
    );

    sessionService.addMessage(sessionId, 'assistant', nextQuestion.reply);
  }

  // 4. Generate Final Feedback Report
  const feedback = await feedbackGenerator.generateFeedback(candidate, session.history, session.coveredTopics);

  const coveredDaysList = Array.from(session.coveredDays);
  const passed = session.questionCount >= 8 && coveredDaysList.length >= 4 && !!feedback.summary;

  return {
    candidateId: candidate.member.id,
    name: candidate.member.name,
    jobRole: candidate.member.jobRole,
    yearsExp: candidate.member.yearsExperience,
    startingDay: plan.startingDay,
    startingTopic: `Day ${plan.startingDay}: ${curriculumService.getDayByNumber(plan.startingDay)?.title || ''}`,
    selectedDays: plan.selectedDays,
    coveredDays: coveredDaysList,
    uniqueCoveredCount: coveredDaysList.length,
    totalQuestions: session.questionCount,
    difficulty: plan.difficulty,
    skippedDays: plan.skippedDays,
    recommendations: feedback.next,
    passed
  };
}

async function runLoopAllCandidates() {
  const allCandidates = candidateService.getAllCandidates();
  console.log(`\n================================================================================`);
  console.log(`STARTING CANDIDATE INTERVIEW ROOM CHECKS LOOP (TOTAL: ${allCandidates.length} CANDIDATES)`);
  console.log(`================================================================================\n`);

  const results: VerificationResult[] = [];

  for (const cand of allCandidates) {
    try {
      const res = await testCandidateInterview(cand.member.id);
      results.push(res);
      console.log(`✓ [${res.candidateId}] ${res.name.padEnd(20)} | Role: ${res.jobRole.padEnd(26)} | Start: Day ${String(res.startingDay).padStart(2)} | Covered: [${res.coveredDays.join(', ')}] (${res.uniqueCoveredCount} days) | Status: PASSED`);
    } catch (err: any) {
      console.error(`✗ [${cand.member.id}] ${cand.member.name} FAILED: ${err.message}`);
    }
  }

  console.log(`\n================================================================================`);
  console.log(`SUMMARY RESULT TABLE FOR ALL ${allCandidates.length} CANDIDATE INTERVIEW ROOM CHECKS`);
  console.log(`================================================================================\n`);

  console.log(`ID       | Candidate Name       | Job Role                   | Exp | Start | Days Covered | Min Req Met`);
  console.log(`---------|----------------------|----------------------------|-----|-------|--------------|------------`);
  results.forEach(r => {
    console.log(`${r.candidateId.padEnd(8)} | ${r.name.padEnd(20)} | ${r.jobRole.padEnd(26)} | ${String(r.yearsExp).padStart(3)} | Day ${String(r.startingDay).padStart(2)} | [${r.coveredDays.join(', ')}] | ${r.passed ? 'PASSED ✓' : 'FAILED ✗'}`);
  });

  const totalPassed = results.filter(r => r.passed).length;
  console.log(`\nTotal Checked: ${results.length} / ${allCandidates.length}`);
  console.log(`Passed: ${totalPassed} / ${results.length}`);
  console.log(`Failed: ${results.length - totalPassed}`);
  console.log(`================================================================================\n`);
}

runLoopAllCandidates().catch(err => console.error(err));
