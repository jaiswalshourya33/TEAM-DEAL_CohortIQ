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
    const candidateName = candidate.member.name;
    const candidateRole = candidate.member.jobRole;
    const candidateExp = candidate.member.yearsExperience;
    const topic = `Day ${dayObj.day}: ${dayObj.title}`;
    const difficulty = candidateExp >= 8 ? 'Advanced' : 'Intermediate';

    const ai = getGenAI();
    if (ai) {
      try {
        const prompt = `${INTERVIEWER_SYSTEM_PROMPT}

CANDIDATE:
Name: ${candidateName}
Role: ${candidateRole} (${candidateExp} years experience)
Education: ${candidate.member.education}

FIRST TARGET TOPIC:
${topic}
Tools: ${dayObj.tools.join(', ')}
Objectives: ${dayObj.objectives.join('; ')}

TASK:
Welcome ${candidateName} briefly and ask your FIRST technical question on ${topic}.

CRITICAL REQUIREMENTS:
- Ask EXACTLY ONE question.
- Do NOT ask multi-part questions or bullet points.
- Keep the prompt professional, technical, and grounded in the cohort objectives.`;

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
        console.warn('Gemini API notice (using fallback question generator):', err?.message?.substring(0, 100) || err);
      }
    }

    // Fallback opening question
    const mainObjective = dayObj.objectives?.[0] || 'core concepts';
    const fallbackQuestion = targetDayNumber === 1
      ? 'How do you set up and manage isolated Python virtual environments and package dependencies across team projects?'
      : targetDayNumber === 2
      ? 'What are the architectural trade-offs between local open-weight coding models (via Ollama) versus cloud AI coding APIs?'
      : targetDayNumber === 3
      ? 'How do you connect a FastAPI REST backend with a Vite React frontend while handling asynchronous API state?'
      : targetDayNumber === 4
      ? 'When working with structured datasets, how do you optimize SQL query execution and schema normalization in SQLite/PostgreSQL?'
      : targetDayNumber === 7
      ? 'When generating vector embeddings for large documents, how do you evaluate the trade-offs between dense embeddings vs sparse representations like BM25 or SPLADE?'
      : `What key technical trade-offs do you evaluate when implementing ${dayObj.title} (${mainObjective})?`;

    const fallbackText = `Welcome ${candidateName}. Let's begin your technical interview focusing on your AI Cohort journey.\n\nTo start with ${topic}: ${fallbackQuestion}`;

    return {
      reply: fallbackText,
      topic,
      difficulty
    };
  }
}

export const questionGenerator = new QuestionGenerator();
