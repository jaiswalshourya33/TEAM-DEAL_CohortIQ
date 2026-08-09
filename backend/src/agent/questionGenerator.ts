import { GoogleGenAI } from '@google/genai';
import { CandidateProfile } from '../services/candidate.service';
import { curriculumService } from '../services/curriculum.service';
import { INTERVIEWER_SYSTEM_PROMPT } from '../prompts/interviewer.prompt';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export class QuestionGenerator {
  async generateOpeningQuestion(candidate: CandidateProfile, targetDayNumber: number): Promise<{
    reply: string;
    topic: string;
    difficulty: string;
  }> {
    const dayObj = curriculumService.getDayByNumber(targetDayNumber) || curriculumService.getDayByNumber(7)!;
    const candidateName = candidate.member.name || 'Candidate';
    const candidateRole = candidate.member.jobRole || 'Engineer';
    const candidateExp = candidate.member.yearsExperience || 0;
    const topic = `Day ${dayObj.day}: ${dayObj.title}`;
    const difficulty = candidateExp >= 8 ? 'Advanced' : candidateExp >= 3 ? 'Intermediate' : 'Foundational';

    const missionInfo = candidate.missions?.find(m => m.day === targetDayNumber);
    const probeContext = missionInfo
      ? missionInfo.passed === false
        ? `Note: Candidate previously failed this mission (${missionInfo.attempts || 1} attempts). Probe gently on core concepts.`
        : missionInfo.attempts && missionInfo.attempts >= 2
        ? `Note: Candidate completed this mission after ${missionInfo.attempts} attempts. Assess how they resolved challenges.`
        : `Note: Candidate completed this mission on first try.`
      : '';

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `${INTERVIEWER_SYSTEM_PROMPT}

CANDIDATE PROFILE:
Name: ${candidateName}
Role: ${candidateRole}
Experience: ${candidateExp} years (${difficulty} depth)
Education: ${candidate.member.education}

STARTING TOPIC FOR THIS CANDIDATE:
Topic: ${topic}
Tools: ${dayObj.tools.join(', ')}
Objectives: ${dayObj.objectives.join('; ')}
${probeContext}

TASK:
1. Welcome ${candidateName} briefly to their personalized AI Engineering technical interview.
2. Ask your FIRST technical question specifically grounded in ${topic}.
3. Tailor question depth to ${candidateRole} (${candidateExp} years experience - ${difficulty} depth).

CRITICAL CONSTRAINTS:
- Ask EXACTLY ONE technical question.
- Do NOT ask multi-part questions or bullet point lists.
- Keep tone professional, encouraging, and technically rigorous.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        if (response.text) {
          return {
            reply: response.text.trim(),
            topic,
            difficulty
          };
        }
      } catch (err: any) {
        console.warn('Gemini API notice (using fallback opening question generator):', err?.message?.substring(0, 100) || err);
      }
    }

    // Role-aware and experience-aware fallback opening question
    const mainObjective = dayObj.objectives?.[0] || 'core concepts';
    let questionText = `What key technical trade-offs do you evaluate when implementing ${dayObj.title} (${mainObjective})?`;

    if (targetDayNumber === 7) {
      questionText = candidateExp >= 8
        ? 'When architecting large-scale vector retrieval systems, how do you evaluate dense embeddings versus sparse lexical indices (like BM25 or SPLADE) under high throughput and memory budgets?'
        : 'When generating vector embeddings for document chunks, how do you choose the embedding model dimension and chunking strategy for optimal retrieval performance?';
    } else if (targetDayNumber === 8) {
      questionText = candidateExp >= 8
        ? 'How do you evaluate vector index algorithms (HNSW vs IVF-PQ) in terms of recall rates, RAM overhead, and query latency when scaling to millions of vectors?'
        : 'What key considerations determine whether you select a local vector index like ChromaDB versus a managed vector database like Pinecone?';
    } else if (targetDayNumber === 10) {
      questionText = candidateRole.toLowerCase().includes('data')
        ? 'How do you design an enterprise retrieval & matching pipeline to combine structured SQL filtering with semantic vector search?'
        : 'In a RAG retrieval architecture, how do you implement two-stage retrieval with cross-encoder reranking to ensure response relevance?';
    } else if (targetDayNumber === 12) {
      questionText = candidateExp >= 8
        ? 'When designing production system prompts for LLMs, how do you systematically mitigate prompt injection risks while enforcing strict schema output constraints?'
        : 'How do you structure system prompts and few-shot examples to achieve consistent, deterministic outputs from LLMs?';
    } else if (targetDayNumber === 13) {
      questionText = 'How do you utilize Pydantic schemas and OpenAI tool/function calling to guarantee type-safe, validated JSON responses from LLM APIs?';
    } else if (targetDayNumber === 16) {
      questionText = candidateRole.toLowerCase().includes('backend') || candidateRole.toLowerCase().includes('software')
        ? 'How do you design a high-concurrency FastAPI backend to handle streaming LLM responses and async API state without blocking the event loop?'
        : 'How do you manage API rate limits, backoff retry logic, and error boundaries when connecting backend services to LLM providers?';
    } else if (targetDayNumber === 22) {
      questionText = candidateExp >= 8
        ? 'When orchestrating multi-agent systems, how do you handle state persistence, agent-to-agent delegation loops, and graceful fallback when an agent fails?'
        : 'In a multi-agent workflow, how do you define distinct agent roles, tool access permissions, and handoff protocols between agents?';
    } else if (targetDayNumber === 23) {
      questionText = 'How does Model Context Protocol (MCP) standardize tool discovery and context sharing compared to proprietary function-calling wrappers?';
    } else if (targetDayNumber === 28) {
      questionText = 'How do you configure Docker multi-stage builds and Kubernetes pod resources for deploying AI microservices with low cold-start latency?';
    } else if (targetDayNumber === 31) {
      questionText = 'In your final capstone project, what were the most critical architecture trade-offs you made between token latency, retrieval accuracy, and system complexity?';
    }

    const fallbackText = `Welcome ${candidateName}. We're excited to conduct your personalized technical interview based on your AI Engineering cohort journey as a ${candidateRole}.\n\nTo begin with ${topic}: ${questionText}`;

    return {
      reply: fallbackText,
      topic,
      difficulty
    };
  }
}

export const questionGenerator = new QuestionGenerator();
