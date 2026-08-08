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

Evaluate the candidate's answer in JSON format:
{
  "isStrong": true/false,
  "needsFollowup": true/false,
  "keyInsights": "1-2 sentences on correctness and depth"
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
            keyInsights: parsed.keyInsights || 'Answer provided relevant technical concepts.'
          };
        }
      } catch (err: any) {
        console.warn('Gemini API notice (using fallback answer evaluator):', err?.message?.substring(0, 100) || err);
      }
    }

    const isLongEnough = candidateAnswer.length > 50;
    return {
      isStrong: isLongEnough,
      needsFollowup: !isLongEnough,
      keyInsights: isLongEnough ? 'Candidate provided a structured explanation.' : 'Candidate provided a brief overview.'
    };
  }
}

export const answerEvaluator = new AnswerEvaluator();
