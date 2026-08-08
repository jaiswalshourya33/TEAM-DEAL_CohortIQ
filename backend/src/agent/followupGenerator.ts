import { GoogleGenAI } from '@google/genai';
import { CandidateProfile } from '../services/candidate.service';
import { curriculumService } from '../services/curriculum.service';
import { INTERVIEWER_SYSTEM_PROMPT } from '../prompts/interviewer.prompt';
import { MessageItem } from '../services/session.service';

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

export class FollowupGenerator {
  async generateNextQuestion(
    candidate: CandidateProfile,
    targetDayNumber: number,
    questionNumber: number,
    totalQuestions: number,
    conversationHistory: MessageItem[],
    evaluationInsight?: string
  ): Promise<{ reply: string; topic: string; difficulty: string }> {
    const dayObj = curriculumService.getDayByNumber(targetDayNumber) || curriculumService.getDayByNumber(7)!;
    const topic = `Day ${dayObj.day}: ${dayObj.title}`;
    const candidateName = candidate.member.name;
    const candidateRole = candidate.member.jobRole;
    const candidateExp = candidate.member.yearsExperience;
    const difficulty = candidateExp >= 8 ? 'Advanced' : candidateExp >= 3 ? 'Intermediate' : 'Foundational';

    const ai = getGenAI();
    if (ai) {
      try {
        const historyText = conversationHistory
          .slice(-6)
          .map(h => `${h.role.toUpperCase()}: ${h.content}`)
          .join('\n\n');

        const prompt = `${INTERVIEWER_SYSTEM_PROMPT}

CANDIDATE: ${candidateName} (${candidateRole}, ${candidateExp} yrs exp)
TURN: Question ${questionNumber} of ${totalQuestions}
TARGET CURRICULUM TOPIC: ${topic}
TOOLS: ${dayObj.tools.join(', ')}
OBJECTIVES: ${dayObj.objectives.join('; ')}
${evaluationInsight ? `EVALUATION OF PREVIOUS ANSWER: ${evaluationInsight}` : ''}

RECENT CONVERSATION HISTORY:
${historyText}

INSTRUCTIONS:
1. In 1 concise opening sentence, acknowledge or address the candidate's previous answer.
2. Ask EXACTLY ONE clear, technical question grounded in ${topic}.
3. Adjust depth based on candidate experience (${candidateExp} yrs exp - ${difficulty} depth).
4. DO NOT ask multiple sub-questions or bullet point lists. Ask ONLY ONE question.`;

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
        console.warn('Gemini API notice (using fallback followup generator):', err?.message?.substring(0, 100) || err);
      }
    }

    // Fallback follow-up questions tied to curriculum days
    const fallbacks: Record<number, string> = {
      1: "How do you configure isolated virtual environments (venv/conda) and handle dependencies safely across development and CI/CD pipelines?",
      2: "What architectural trade-offs do you consider when deciding between local open-weight models vs managed cloud AI APIs for sensitive workloads?",
      3: "How do you connect a React frontend to an async REST backend while handling state updates and error boundaries cleanly?",
      4: "When reading structured CSV/JSON data, how do you handle schema validation and efficient database indexing?",
      7: "Good explanation of embeddings. How do you handle dimensional reduction or similarity metrics (cosine vs dot product) when scaling vector search?",
      8: "Understood. Moving to vector databases: What factors determine whether you choose a local index like ChromaDB versus a managed service like Pinecone in production?",
      10: "That makes sense. In a retrieval engine, how do you implement hybrid routing between structured SQL queries and unstructured vector search?",
      12: "Great insight. When designing system prompts for structured compliance, how do you prevent prompt injection or hallucination in grounded RAG?",
      13: "Solid point. How do you use Pydantic or function calling schemas to guarantee strict JSON output schema adherence from the LLM?",
      16: "Good technical answer. In your chatbot backend, how do you manage streaming API endpoints and session memory under concurrent loads?",
      17: "When building an interactive AI chatbot UI, how do you handle optimistic UI updates and auto-scrolling streaming text?",
      18: "How do server-sent events (SSE) compare to WebSockets when streaming LLM tokens to client interfaces?",
      20: "How do you manage token context windows and sliding window memory truncation in long conversational sessions?",
      21: "When using agent framework abstractions, how do you prevent infinite loops and bound memory consumption?",
      22: "Understood. In multi-agent orchestration (e.g. LangGraph or CrewAI), how do you prevent cascading loops or handle agent delegation failures?",
      23: "Great depth. How does Model Context Protocol (MCP) standardize tool execution compared to custom API wrappers?",
      27: "What guardrails and output sanitization techniques do you employ to prevent PII leaks or unsafe LLM outputs?",
      28: "Excellent. From a deployment standpoint, how do you configure Docker container health checks and secrets management for AI microservices?",
      29: "How do you set up telemetry tracing and structured logging to debug latency spikes in multi-step AI pipelines?",
      31: "Very good. In your capstone architecture, how did you evaluate end-to-end retrieval accuracy and token latency before final deployment?"
    };

    const reply = fallbacks[targetDayNumber] || `Thank you for that response. For turn ${questionNumber} on ${topic}: How would you optimize latency, cost, and reliability when executing these workflows in production?`;

    return {
      reply,
      topic,
      difficulty
    };
  }
}

export const followupGenerator = new FollowupGenerator();
