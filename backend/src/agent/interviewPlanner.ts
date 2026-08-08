import { CandidateProfile } from '../services/candidate.service';
import { curriculumService } from '../services/curriculum.service';

export interface PlannedTopic {
  dayNumber: number;
  title: string;
  focusArea: string;
  isProbeTarget?: boolean;
}

export interface InterviewPlan {
  startingDay: number;
  targetDays: PlannedTopic[];
  totalQuestions: number;
  initialDifficulty: string;
  candidateTopicPool: number[];
  skippedDays: number[];
}

export class InterviewPlanner {
  planInterview(candidate: CandidateProfile): InterviewPlan {
    const candidateExp = candidate.member.yearsExperience || 0;
    const jobRole = (candidate.member.jobRole || '').toLowerCase();

    // 1. Separate missions into passed, probed, and skipped
    const passedMissions = candidate.missions.filter(m => m.passed === true);
    const probeMissions = candidate.missions.filter(
      m => (m.passed === true && (m.attempts || 1) >= 2) || m.passed === false
    );
    const skippedMissions = candidate.missions.filter(m => m.skipped === true);
    const skippedDays = skippedMissions.map(m => m.day);

    // 2. Map role relevance to curriculum days
    const rolePreferences: number[] = this.getRolePreferredDays(jobRole);

    // 3. Score all completed or attempted candidate days
    // Candidate Topic Pool consists primarily of completed missions plus failed missions worth probing
    const candidateDays = candidate.missions
      .filter(m => !m.skipped)
      .map(m => m.day);

    // If candidate has very few completed missions, fall back to curriculum days aligned with role
    let availablePool = [...candidateDays];
    if (availablePool.length < 4) {
      for (const prefDay of rolePreferences) {
        if (!availablePool.includes(prefDay) && !skippedDays.includes(prefDay)) {
          availablePool.push(prefDay);
        }
      }
    }

    // Score days based on role preference, probe flags (attempts/failed), and completion
    const scoredDays = availablePool.map(dNum => {
      const mission = candidate.missions.find(m => m.day === dNum);
      let score = 10;

      // Role preference boost
      if (rolePreferences.includes(dNum)) score += 15;

      // Probe boost (failed missions or multiple attempts)
      if (mission?.passed === false) score += 20;
      if (mission?.attempts && mission.attempts > 2) score += 12;

      // Capstone project boost
      if (dNum === 31) score += 5;

      return { dayNumber: dNum, score, mission };
    });

    // Sort by priority score descending
    scoredDays.sort((a, b) => b.score - a.score);

    // Pick top 5-6 target days for candidate's plan
    const selectedDayNumbers: number[] = [];
    for (const item of scoredDays) {
      if (!selectedDayNumbers.includes(item.dayNumber) && selectedDayNumbers.length < 6) {
        selectedDayNumbers.push(item.dayNumber);
      }
    }

    // Ensure we have at least 4 distinct days in the plan
    if (selectedDayNumbers.length < 4) {
      const allDays = curriculumService.getAllDays().map(d => d.day);
      for (const d of allDays) {
        if (!selectedDayNumbers.includes(d) && !skippedDays.includes(d)) {
          selectedDayNumbers.push(d);
          if (selectedDayNumbers.length >= 5) break;
        }
      }
    }

    // Select starting day: Pick the highest scored topic that best aligns with role/probe
    const startingDay = selectedDayNumbers[0] || candidateDays[0] || 7;

    // Build planned topics list
    const targetDays: PlannedTopic[] = selectedDayNumbers.map(dNum => {
      const dayObj = curriculumService.getDayByNumber(dNum);
      const mission = candidate.missions.find(m => m.day === dNum);
      let focusArea = 'Practical application & architecture';
      let isProbeTarget = false;

      if (mission) {
        if (mission.passed === false) {
          focusArea = `Diagnostic probe on mission gap (${mission.attempts || 1} failed attempts)`;
          isProbeTarget = true;
        } else if (mission.attempts && mission.attempts > 2) {
          focusArea = `Probing perseverance & resolution (${mission.attempts} attempts)`;
          isProbeTarget = true;
        } else if (mission.passed) {
          focusArea = 'Core implementation & trade-offs';
        }
      } else {
        focusArea = 'Role-aligned technical assessment';
      }

      return {
        dayNumber: dNum,
        title: dayObj ? dayObj.title : `Day ${dNum}`,
        focusArea,
        isProbeTarget
      };
    });

    // Experience-based initial difficulty
    const initialDifficulty =
      candidateExp >= 8
        ? 'Advanced'
        : candidateExp >= 3
        ? 'Intermediate'
        : 'Foundational';

    return {
      startingDay,
      targetDays,
      totalQuestions: 8,
      initialDifficulty,
      candidateTopicPool: availablePool,
      skippedDays
    };
  }

  private getRolePreferredDays(role: string): number[] {
    if (role.includes('data engineer') || role.includes('data scientist')) {
      return [10, 7, 8, 9, 23, 28, 29, 31];
    }
    if (role.includes('devops') || role.includes('infrastructure') || role.includes('support')) {
      return [28, 29, 1, 2, 23, 27, 30, 31];
    }
    if (role.includes('ai engineer') || role.includes('ml engineer')) {
      return [22, 23, 10, 7, 8, 13, 21, 31];
    }
    if (role.includes('backend') || role.includes('software engineer') || role.includes('architect')) {
      return [16, 22, 10, 13, 23, 28, 31];
    }
    if (role.includes('ux') || role.includes('frontend') || role.includes('product') || role.includes('marketing') || role.includes('hr') || role.includes('analyst')) {
      return [3, 2, 1, 12, 16, 17, 19, 20, 31];
    }
    // Default fallback
    return [7, 10, 12, 22, 28, 31];
  }
}

export const interviewPlanner = new InterviewPlanner();
