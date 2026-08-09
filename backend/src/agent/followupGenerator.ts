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
    evaluationInsight?: string,
    askedQuestions: string[] = []
  ): Promise<{ reply: string; topic: string; difficulty: string }> {
    const dayObj = curriculumService.getDayByNumber(targetDayNumber) || curriculumService.getDayByNumber(7)!;
    const topic = `Day ${dayObj.day}: ${dayObj.title}`;
    const candidateName = candidate.member.name || 'Candidate';
    const candidateRole = candidate.member.jobRole || 'Engineer';
    const candidateExp = candidate.member.yearsExperience || 0;
    const difficulty = candidateExp >= 8 ? 'Advanced' : candidateExp >= 3 ? 'Intermediate' : 'Foundational';

    const ai = getGenAI();
    if (ai) {
      try {
        const historyText = conversationHistory
          .slice(-6)
          .map(h => `${h.role.toUpperCase()}: ${h.content}`)
          .join('\n\n');

        const previouslyAskedText = askedQuestions.length > 0
          ? `PREVIOUSLY ASKED QUESTIONS (DO NOT REPEAT OR DUPLICATE):\n${askedQuestions.map(q => `- ${q}`).join('\n')}`
          : '';

        const prompt = `${INTERVIEWER_SYSTEM_PROMPT}

CANDIDATE: ${candidateName} (${candidateRole}, ${candidateExp} yrs experience, ${difficulty} depth)
TURN: Question ${questionNumber} of ${totalQuestions}
TARGET CURRICULUM TOPIC: ${topic}
TOOLS: ${dayObj.tools.join(', ')}
OBJECTIVES: ${dayObj.objectives.join('; ')}
${evaluationInsight ? `EVALUATION OF PREVIOUS ANSWER: ${evaluationInsight}` : ''}
${previouslyAskedText}

RECENT CONVERSATION HISTORY:
${historyText}

INSTRUCTIONS FOR THIS TURN:
1. In 1 concise opening sentence, acknowledge or address the candidate's previous answer.
2. Ask EXACTLY ONE clear, technical question grounded in ${topic}.
3. Adjust question depth based on candidate experience (${candidateExp} yrs exp - ${difficulty} depth):
   - For Junior (<3 yrs): Focus on concepts, practical implementation, and code structure.
   - For Mid-level (3-7 yrs): Focus on implementation trade-offs, APIs, and real-world usage.
   - For Senior (8+ yrs): Focus on architecture, scalability, system trade-offs, and production failure scenarios.
4. Ensure the question is SUBSTANTIALLY DIFFERENT from all previously asked questions.
5. DO NOT ask multiple sub-questions or bullet point lists. Ask ONLY ONE question.`;

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

    // Role and Experience-aware Fallback Follow-up Library tied to Curriculum Days
    const fallbacks: Record<number, string[]> = {
      1: [
        "How do you configure isolated virtual environments (venv/conda) and handle dependencies safely across development and CI/CD pipelines?",
        "When managing Python project dependencies, how do you handle lockfiles and resolve version conflicts in production builds?"
      ],
      2: [
        "What architectural trade-offs do you consider when deciding between local open-weight models vs managed cloud AI APIs for sensitive workloads?",
        "How do you evaluate GPU memory requirements (VRAM) vs quantization techniques (e.g. 4-bit/8-bit) when hosting open-source models locally?"
      ],
      3: [
        "How do you connect a React frontend to an async REST backend while handling state updates and error boundaries cleanly?",
        "When handling asynchronous API requests in FastAPI, how do you implement middleware for CORS, logging, and error propagation?"
      ],
      4: [
        "When reading structured CSV/JSON data, how do you handle schema validation and efficient database indexing in SQLite or PostgreSQL?",
        "How do you optimize SQL query execution plans when aggregating large tabular datasets for AI analytical models?"
      ],
      7: [
        "How do you evaluate dimensional reduction or similarity metrics (cosine vs dot product vs euclidean distance) when scaling vector search?",
        "When chunking long technical documents, how do you choose chunk sizes and overlap ratios to preserve semantic context?"
      ],
      8: [
        "What factors determine whether you choose a local index like ChromaDB versus a managed service like Pinecone in production?",
        "How do you handle index updates, metadata filtering, and namespace segregation in multi-tenant vector databases?"
      ],
      10: [
        "In a retrieval engine, how do you implement hybrid routing between structured SQL queries and unstructured vector search?",
        "How do you measure and optimize retrieval precision and recall using cross-encoder rerankers like Cohere or BGE Reranker?"
      ],
      11: [
        "When building an end-to-end RAG system, how do you prevent hallucination when retrieved context is ambiguous or insufficient?",
        "How do you calculate token cost and latency trade-offs when passing large retrieved context windows to LLMs?"
      ],
      12: [
        "When designing system prompts for structured compliance, how do you prevent prompt injection or prompt leaking in production RAG?",
        "How do you systematically test and benchmark system prompt variations across model updates?"
      ],
      13: [
        "How do you use Pydantic or function calling schemas to guarantee strict JSON output schema adherence from the LLM?",
        "When an LLM returns a schema validation error during tool execution, how do you design auto-healing retry logic?"
      ],
      16: [
        "In your chatbot backend, how do you manage streaming API endpoints and session memory under concurrent user loads?",
        "How do you handle API timeout handling, backoff retries, and rate limiting when integrating external LLM APIs?"
      ],
      17: [
        "When building an interactive AI chatbot UI, how do you handle optimistic UI updates and auto-scrolling streaming text?",
        "How do you display real-time tool execution states and intermediate reasoning steps to the user in a chat interface?"
      ],
      18: [
        "How do server-sent events (SSE) compare to WebSockets when streaming LLM tokens to client interfaces?",
        "How do you manage client connection drops and resume token streams during streaming responses?"
      ],
      20: [
        "How do you manage token context windows and sliding window memory truncation in long conversational sessions?",
        "What strategies do you use to summarize earlier conversation turns without losing critical session state or entity references?"
      ],
      21: [
        "When using agent framework abstractions like LangChain, how do you prevent infinite execution loops and bound memory consumption?",
        "How do you design custom agent tools with explicit parameter constraints and error feedback?"
      ],
      22: [
        "In multi-agent orchestration (e.g. LangGraph or CrewAI), how do you prevent cascading loops or handle agent delegation failures?",
        "How do you manage shared state and context passing when multiple specialized agents collaborate on a complex goal?"
      ],
      23: [
        "How does Model Context Protocol (MCP) standardize tool execution compared to custom API wrappers?",
        "How do you implement security authorization and rate limits for tools exposed via MCP servers?"
      ],
      27: [
        "What guardrails and output sanitization techniques do you employ to prevent PII leaks or unsafe LLM outputs?",
        "How do you implement input classification models to detect jailbreak attempts before sending prompts to the main LLM?"
      ],
      28: [
        "From a deployment standpoint, how do you configure Docker container health checks and secrets management for AI microservices?",
        "How do you set up horizontal pod autoscaling in Kubernetes based on GPU/CPU utilization or request queue depth?"
      ],
      29: [
        "How do you set up telemetry tracing (OpenTelemetry/LangSmith) and structured logging to debug latency spikes in multi-step AI pipelines?",
        "What key metrics do you monitor in production to track model drift, response latency, and cost per query?"
      ],
      31: [
        "In your capstone architecture, how did you evaluate end-to-end retrieval accuracy and token latency before final deployment?",
        "If you were scaling your capstone system to 10x traffic, what primary architectural bottlenecks would you refactor first?"
      ]
    };

    const dayQuestions = fallbacks[targetDayNumber] || [
      `How do you optimize latency, cost, and reliability when deploying ${topic} in production?`,
      `What automated testing or evaluation metrics do you use to verify ${topic} performance?`
    ];

    // Pick a question from fallbacks that hasn't been asked yet
    let chosenQuestion = dayQuestions.find(q => !askedQuestions.includes(q)) || dayQuestions[0];

    const reply = `Thank you for that explanation. Continuing on ${topic}:\n\n${chosenQuestion}`;

    return {
      reply,
      topic,
      difficulty
    };
  }
}

export const followupGenerator = new FollowupGenerator();
