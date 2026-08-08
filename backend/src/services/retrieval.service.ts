import { curriculumService, CurriculumDay } from './curriculum.service';
import { CandidateProfile } from './candidate.service';

export interface CurriculumRetrievalResult {
  relevantDays: CurriculumDay[];
  probeDays: CurriculumDay[];
  skippedDays: CurriculumDay[];
}

export class RetrievalService {
  retrieveCurriculumForCandidate(candidate: CandidateProfile): CurriculumRetrievalResult {
    const allDays = curriculumService.getAllDays();
    const passedMissions = candidate.missions.filter(m => m.passed);
    const probeMissions = candidate.missions.filter(m => (m.passed && (m.attempts || 1) > 2) || m.passed === false);
    const skippedMissions = candidate.missions.filter(m => m.skipped);

    const relevantDays = allDays.filter(d => passedMissions.some(m => m.day === d.day));
    const probeDays = allDays.filter(d => probeMissions.some(m => m.day === d.day));
    const skippedDays = allDays.filter(d => skippedMissions.some(m => m.day === d.day));

    return {
      relevantDays: relevantDays.length > 0 ? relevantDays : allDays.slice(0, 8),
      probeDays,
      skippedDays
    };
  }

  getCurriculumContext(dayNumbers: number[]): string {
    return dayNumbers
      .map(dn => curriculumService.getDayByNumber(dn))
      .filter((d): d is CurriculumDay => d !== undefined)
      .map(d => `Day ${d.day} (${d.title}): Tools=[${d.tools.join(', ')}], Objectives=[${d.objectives.join('; ')}]`)
      .join('\n');
  }
}

export const retrievalService = new RetrievalService();
