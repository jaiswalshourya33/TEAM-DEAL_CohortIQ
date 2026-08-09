import type { CandidateProfile, InterviewFeedback, InterviewMessage } from '@/types';

// 1. Generate Candidate-Specific Baseline Report from Dataset (Before Interview)
export function generateDatasetBaselineReport(candidate: CandidateProfile): InterviewFeedback {
  const member = candidate.member;
  const signals = candidate.signals || { commitDays: 25, missionsCompleted: 28, missionsFirstTry: 15 };
  const missions = candidate.missions || [];

  const completedCount = signals.missionsCompleted ?? missions.filter(m => m.passed).length ?? 28;
  const firstTryCount = signals.missionsFirstTry ?? missions.filter(m => (m.attempts || 1) === 1 && m.passed).length ?? 15;
  const commitDays = signals.commitDays ?? 25;
  const yearsExp = member.yearsExperience ?? 5;

  const skippedMissions = missions.filter(m => m.skipped);
  const highAttemptMissions = missions.filter(m => (m.attempts || 0) >= 3);
  const firstTryMissions = missions.filter(m => (m.attempts || 1) === 1 && m.passed);

  // Baseline Scores derived strictly from Candidate's Dataset
  const techScore = Math.min(98, Math.max(62, Math.round((firstTryCount / 31) * 35 + (completedCount / 31) * 45 + Math.min(yearsExp, 10) * 1.5)));
  const reasoningScore = Math.min(98, Math.max(60, Math.round(62 + Math.min(yearsExp, 10) * 2.5 + (firstTryCount >= 20 ? 10 : 3))));
  
  // System design penalty if key infra modules skipped
  const skippedSysDesign = skippedMissions.some(m => m.day === 28 || m.day === 29);
  const designScore = Math.min(98, Math.max(55, Math.round((completedCount / 31) * 75 + Math.min(yearsExp, 10) * 1.5 - (skippedSysDesign ? 10 : 0))));
  
  const practicalScore = Math.min(98, Math.max(64, Math.round((completedCount / 31) * 80 + (firstTryCount / 31) * 15)));
  const commScore = Math.min(98, Math.max(65, Math.round((commitDays / 31) * 78 + 18)));

  const overallScore = Math.round(
    techScore * 0.25 +
    reasoningScore * 0.25 +
    designScore * 0.20 +
    practicalScore * 0.15 +
    commScore * 0.15
  );

  // Candidate-specific Baseline Summary
  let summary = `${member.name} (${member.jobRole}, ${yearsExp} yrs exp) completed ${completedCount}/31 cohort modules across ${commitDays} active days with ${firstTryCount} first-try passes. `;
  
  if (overallScore >= 92) {
    summary += `Top cohort performer demonstrating outstanding mastery of AI engineering principles, execution speed, and architectural depth.`;
  } else if (overallScore >= 84) {
    summary += `Strong candidate showing solid domain competency across AI product workflows with reliable cohort consistency.`;
  } else {
    summary += `Demonstrated persistent effort across foundational modules; required multiple iteration attempts on technical curriculum challenges.`;
  }

  // Candidate-specific Strengths from Dataset
  const strengths: string[] = [];
  if (firstTryCount >= 20) {
    strengths.push(`High First-Try Execution: Achieved ${firstTryCount} module passes on first attempt across the cohort.`);
  } else {
    strengths.push(`Consistent Commitment: Maintained active progress across ${commitDays} cohort execution days.`);
  }

  if (firstTryMissions.length > 0) {
    const topMissionTitles = firstTryMissions.slice(0, 2).map(m => m.title).join(' & ');
    strengths.push(`Strong initial proficiency in ${topMissionTitles}.`);
  } else {
    strengths.push(`Solid technical background aligned with ${member.jobRole} role requirements.`);
  }

  strengths.push(`Active cohort participant with ${completedCount}/31 completed evaluation modules.`);

  // Candidate-specific Gaps from Dataset
  const gaps: string[] = [];
  if (skippedMissions.length > 0) {
    gaps.push(`Skipped ${skippedMissions.length} cohort module(s): ${skippedMissions.map(m => `Day ${m.day} (${m.title})`).join(', ')}.`);
  }

  if (highAttemptMissions.length > 0) {
    gaps.push(`Required 3+ attempts on ${highAttemptMissions.length} module(s): ${highAttemptMissions.slice(0, 2).map(m => m.title).join(', ')}.`);
  }

  if (gaps.length === 0) {
    gaps.push(`Opportunity to deepen production debugging under high-concurrency real-time load.`);
    gaps.push(`Could expand quantitative SLA evaluations for multi-agent workflows.`);
  } else if (gaps.length === 1) {
    gaps.push(`Would benefit from hands-on architecture tradeoff discussions prior to production deployment.`);
  }

  // Candidate-specific Next Steps from Dataset
  const next: string[] = [];
  if (skippedMissions.length > 0) {
    skippedMissions.forEach(m => {
      next.push(`Targeted Module Review: Day ${m.day} (${m.title})`);
    });
  }

  if (highAttemptMissions.length > 0 && next.length < 3) {
    highAttemptMissions.slice(0, 2 - next.length).forEach(m => {
      next.push(`Reinforce Concepts: Day ${m.day} (${m.title})`);
    });
  }

  if (next.length === 0) {
    next.push(`Conduct advanced multi-agent orchestration and MCP tool integration workshops.`);
  }

  next.push(`Focus on end-to-end production system design and latency constraints.`);
  next.push(`Practice live incident response and failure-mode analysis.`);

  return {
    summary,
    strengths,
    gaps,
    next,
    scores: {
      overall: overallScore,
      technicalUnderstanding: techScore,
      depthOfReasoning: reasoningScore,
      systemDesign: designScore,
      practicalApplication: practicalScore,
      communication: commScore,
    }
  };
}

// 2. Generate Interview-Based Report (After Live Interview Session)
export function generateFeedbackFromTranscript(
  candidate: CandidateProfile,
  transcript: InterviewMessage[]
): InterviewFeedback {
  const userMessages = transcript.filter(m => m.sender === 'user');
  const aiMessages = transcript.filter(m => m.sender === 'ai');

  // Extract topics discussed in the live interview
  const topicsDiscussed = Array.from(new Set(
    aiMessages.map(m => m.topic).filter((t): t is string => Boolean(t))
  ));
  if (topicsDiscussed.length === 0) {
    topicsDiscussed.push('Embeddings & Vector Search', 'RAG & Context Windows', 'Agentic Workflows');
  }

  // Answer depth analysis from actual candidate responses
  const totalUserWords = userMessages.reduce((sum, m) => sum + (m.text ? m.text.trim().split(/\s+/).length : 0), 0);
  const avgWordsPerAnswer = userMessages.length > 0 ? Math.round(totalUserWords / userMessages.length) : 0;

  // Technical terminology detection in interview answers
  const techKeywords = [
    'embedding', 'vector', 'rag', 'chunk', 'lora', 'fine-tune', 'mcp', 'agent',
    'guardrail', 'evaluation', 'latency', 'token', 'langchain', 'pinecone',
    'bm25', 'hnsw', 'cosine', 'rerank', 'quantization', 'docker', 'k8s', 'api',
    'schema', 'json', 'pipeline', 'prompt', 'context', 'cache', 'throughput'
  ];

  const fullTextLower = userMessages.map(m => m.text.toLowerCase()).join(' ');
  const detectedTech = techKeywords.filter(kw => fullTextLower.includes(kw));

  // Check attachments in interview turns
  const totalAttachments = userMessages.reduce((sum, m) => sum + (m.attachments ? m.attachments.length : 0), 0);

  // Dynamic Score Calculation from Live Interview Performance
  const completedMissions = candidate.signals?.missionsCompleted ?? 28;
  const cohortBase = Math.round((completedMissions / 31) * 70);

  const depthBonus = Math.min(15, Math.round(avgWordsPerAnswer / 4));
  const techBonus = Math.min(14, detectedTech.length * 2);
  const attachmentBonus = totalAttachments > 0 ? 4 : 0;

  const techScore = Math.min(98, Math.max(62, cohortBase + techBonus + 5));
  const reasoningScore = Math.min(98, Math.max(60, 62 + depthBonus + (avgWordsPerAnswer > 30 ? 10 : 3)));
  const designScore = Math.min(98, Math.max(58, cohortBase + (detectedTech.includes('rag') || detectedTech.includes('pipeline') ? 10 : 4)));
  const practicalScore = Math.min(98, Math.max(64, 68 + attachmentBonus + techBonus));
  const commScore = Math.min(98, Math.max(65, 70 + (userMessages.length >= 3 ? 12 : 5) + (avgWordsPerAnswer > 15 ? 8 : 2)));

  const overallScore = Math.round(
    techScore * 0.25 +
    reasoningScore * 0.25 +
    designScore * 0.20 +
    practicalScore * 0.15 +
    commScore * 0.15
  );

  // Dynamic Post-Interview Executive Summary
  const topicSummaryStr = topicsDiscussed.slice(0, 3).join(', ');
  let summary = `[LIVE INTERVIEW EVALUATION] ${candidate.member.name} (${candidate.member.jobRole}) completed a live ${userMessages.length}-turn technical interview session evaluating ${topicSummaryStr}. `;

  if (overallScore >= 86) {
    summary += `Demonstrated exceptional live technical depth, clear architectural trade-off reasoning, and authoritative domain terminology during interviewer probing.`;
  } else if (overallScore >= 76) {
    summary += `Showed solid live technical competency and effective communication, addressing core cohort concepts with practical clarity.`;
  } else {
    summary += `Provided concise answers during live evaluation turns; recommended for focused curriculum review on system design trade-offs before placement.`;
  }

  // Dynamic Post-Interview Strengths
  const strengths: string[] = [];
  if (detectedTech.length > 0) {
    strengths.push(`Live Technical Vocabulary: Articulated answers incorporating key domain terms (${detectedTech.slice(0, 4).join(', ')}).`);
  } else {
    strengths.push(`Active Interview Participation: Engaged directly with AI interviewer probing across technical evaluation turns.`);
  }

  if (avgWordsPerAnswer > 25) {
    strengths.push(`Structured Explanations: Provided detailed, multi-sentence technical answers during live probing.`);
  } else {
    strengths.push(`Direct Communication: Gave clear, concise technical responses during interview turns.`);
  }

  if (totalAttachments > 0) {
    strengths.push(`Artifact Demonstration: Leveraged file attachments and code mode during live system design discussion.`);
  } else {
    strengths.push(`Evaluated Session: Completed ${userMessages.length} technical evaluation turns in the live interview room.`);
  }

  // Dynamic Post-Interview Gaps
  const gaps: string[] = [];
  if (avgWordsPerAnswer < 20) {
    gaps.push(`Answer Depth: Responses were concise; could elaborate further on architectural trade-offs and edge cases.`);
  } else {
    gaps.push(`Quantitative SLAs: Could specify explicit latency benchmarks and failure recovery metrics.`);
  }

  const skipped = candidate.missions ? candidate.missions.filter(m => m.skipped) : [];
  if (skipped.length > 0) {
    gaps.push(`Journey Gaps: Skipped ${skipped.length} cohort module(s) (${skipped.map(s => `Day ${s.day}`).join(', ')}).`);
  } else {
    gaps.push(`Concurrency Stress: Opportunity to deepen production debugging under real-time concurrent load.`);
  }

  // Dynamic Post-Interview Next Steps
  const next: string[] = [];
  if (skipped.length > 0) {
    skipped.slice(0, 2).forEach(s => {
      next.push(`Targeted Review: Day ${s.day} (${s.title})`);
    });
  } else {
    next.push(`Review production observability & tracing patterns (Day 29)`);
  }

  next.push(`Practice end-to-end system design & latency tradeoff scenarios`);
  next.push(`Conduct hands-on incident response & guardrail failure workshops`);

  return {
    summary,
    strengths,
    gaps,
    next,
    scores: {
      overall: overallScore,
      technicalUnderstanding: techScore,
      depthOfReasoning: reasoningScore,
      systemDesign: designScore,
      practicalApplication: practicalScore,
      communication: commScore,
    }
  };
}

// 3. Main Report Selector
export function getCandidateReport(
  candidate: CandidateProfile,
  feedback?: InterviewFeedback,
  transcript?: InterviewMessage[],
): { feedback: InterviewFeedback; transcript: InterviewMessage[] } {
  // Case A: Explicit feedback object provided (e.g. from backend API)
  if (feedback && feedback.summary) {
    return { feedback, transcript: transcript ?? [] };
  }

  // Case B: Live interview took place (transcript has user turns) -> Show Live Interview Results
  if (transcript && transcript.length > 0 && transcript.some(m => m.sender === 'user')) {
    const interviewFeedback = generateFeedbackFromTranscript(candidate, transcript);
    return { feedback: interviewFeedback, transcript };
  }

  // Case C: Before interview -> Show Dataset Baseline Report unique to candidate
  const baselineFeedback = generateDatasetBaselineReport(candidate);
  return {
    feedback: baselineFeedback,
    transcript: transcript ?? [],
  };
}
