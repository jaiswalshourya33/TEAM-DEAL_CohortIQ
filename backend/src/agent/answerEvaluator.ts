import { GoogleGenAI } from '@google/genai';
import { EVALUATOR_SYSTEM_PROMPT } from '../prompts/evaluator.prompt';

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

export interface EvaluationResult {
  isStrong: boolean;
  needsFollowup: boolean;
  keyInsights: string;
  technicalDepth: 'high' | 'medium' | 'low';
}

export class AnswerEvaluator {
  async evaluateAnswer(currentQuestion: string, candidateAnswer: string, topic: string): Promise<EvaluationResult> {
    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `${EVALUATOR_SYSTEM_PROMPT}

TOPIC: ${topic}
QUESTION ASKED: ${currentQuestion}
CANDIDATE ANSWER: ${candidateAnswer}

Evaluate the candidate's answer strictly in JSON format matching this schema:
{
  "isStrong": boolean (true if response shows solid technical understanding, false if vague/shallow),
  "needsFollowup": boolean (true if candidate missed key concepts or gave a incomplete answer worth probing deeper),
  "keyInsights": "1-2 sentences summarizing candidate's strengths, missing concepts, or technical depth",
  "technicalDepth": "high" | "medium" | "low"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return {
            isStrong: !!parsed.isStrong,
            needsFollowup: !!parsed.needsFollowup,
            keyInsights: parsed.keyInsights || 'Answer provided relevant technical concepts.',
            technicalDepth: (parsed.technicalDepth as any) || (parsed.isStrong ? 'high' : 'low')
          };
        }
      } catch (err: any) {
        console.warn('Gemini API notice (using fallback answer evaluator):', err?.message?.substring(0, 100) || err);
      }
    }

    // Fallback heuristic answer evaluator
    const textLen = candidateAnswer.trim().length;
    const lowerAnswer = candidateAnswer.toLowerCase();
    const keywords = ['trade-off', 'latency', 'cost', 'scaling', 'index', 'vector', 'retrieval', 'schema', 'pipeline', 'deployment', 'docker', 'model', 'api', 'architecture', 'evaluation'];
    const matchedCount = keywords.filter(k => lowerAnswer.includes(k)).length;

    const isStrong = textLen > 70 && matchedCount >= 2;
    const needsFollowup = textLen < 50 || matchedCount === 0;
    const technicalDepth = isStrong ? 'high' : textLen > 40 ? 'medium' : 'low';

    return {
      isStrong,
      needsFollowup,
      keyInsights: isStrong
        ? 'Candidate provided a detailed technical explanation addressing trade-offs.'
        : needsFollowup
        ? 'Candidate response was brief; worth probing deeper into implementation details.'
        : 'Candidate provided a satisfactory high-level overview.',
      technicalDepth
    };
  }
}

export const answerEvaluator = new AnswerEvaluator();
