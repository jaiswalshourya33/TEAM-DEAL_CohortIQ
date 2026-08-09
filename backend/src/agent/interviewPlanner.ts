import { CandidateProfile } from '../services/candidate.service';
import { curriculumService } from '../services/curriculum.service';

export interface ClassifiedTopic {
  dayNumber: number;
  title: string;
  status: 'COMPLETED' | 'ATTEMPTED / NEEDS PROBING' | 'FAILED' | 'SKIPPED' | 'NOT COVERED';
  attempts: number;
  relevanceScore: number;
}

export interface PlannedTopic {
  dayNumber: number;
  title: string;
  focusArea: string;
  isProbeTarget?: boolean;
  status: string;
}

export interface InterviewPlan {
  candidateId: string;
  candidateName: string;
  jobRole: string;
  yearsExperience: number;
  selectedDays: number[];
  selectedTopics: string[];
  priorityAreas: string[];
  startingDay: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  minimumQuestions: number;
  minimumDays: number;
  targetDays: PlannedTopic[];
  candidateTopicPool: number[];
  skippedDays: number[];
  classifiedTopics: Record<number, ClassifiedTopic>;
}

export class InterviewPlanner {
  planInterview(candidate: CandidateProfile): InterviewPlan {
    const candidateId = candidate.member.id || 'CAND-UNKNOWN';
    const candidateName = candidate.member.name || 'Candidate';
    const jobRole = candidate.member.jobRole || 'Software Engineer';
    const yearsExperience = candidate.member.yearsExperience || 0;
    const lowerRole = jobRole.toLowerCase();

    // 1. Role-aware priority days lookup
    const rolePreferredDays = this.getRolePreferredDays(lowerRole);

    // 2. Classify all 31 curriculum days for candidate
    const classifiedTopics: Record<number, ClassifiedTopic> = {};
    const skippedDays: number[] = [];
    const candidateMissions = candidate.missions || [];

    const allCurriculumDays = curriculumService.getAllDays();

    allCurriculumDays.forEach(curDay => {
      const dNum = curDay.day;
      const mission = candidateMissions.find(m => m.day === dNum);

      let status: 'COMPLETED' | 'ATTEMPTED / NEEDS PROBING' | 'FAILED' | 'SKIPPED' | 'NOT COVERED' = 'NOT COVERED';
      let attempts = 0;
      let score = 5; // Base score

      if (mission) {
        attempts = mission.attempts || 1;
        if (mission.skipped) {
          status = 'SKIPPED';
          score = -50; // Exclude from active question pool
          skippedDays.push(dNum);
        } else if (mission.passed === false) {
          status = 'FAILED';
          score += 40; // High priority probing target
        } else if (mission.passed) {
          if (attempts >= 2) {
            status = 'ATTEMPTED / NEEDS PROBING';
            score += 35; // Probing target
          } else {
            status = 'COMPLETED';
            score += 25; // Completed topic
          }
        }
      }

      // Role preference boost based on position in preference list
      const rolePrefIndex = rolePreferredDays.indexOf(dNum);
      if (rolePrefIndex !== -1 && status !== 'SKIPPED') {
        score += Math.max(5, 30 - rolePrefIndex * 4);
      }

      // Capstone project boost (Day 31)
      if (dNum === 31 && status !== 'SKIPPED') {
        score += 2; // Low boost for starting day so core topic is chosen first
      }

      classifiedTopics[dNum] = {
        dayNumber: dNum,
        title: curDay.title,
        status,
        attempts,
        relevanceScore: score
      };
    });

    // 3. Build candidate topic pool (Active non-skipped days sorted by relevance score)
    const scoredDaysList = Object.values(classifiedTopics)
      .filter(t => t.status !== 'SKIPPED')
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Pick top 6 days for primary target list
    const selectedDays: number[] = [];
    const selectedTopics: string[] = [];
    const priorityAreas: string[] = [];
    const targetDays: PlannedTopic[] = [];

    for (const item of scoredDaysList) {
      if (selectedDays.length < 6) {
        selectedDays.push(item.dayNumber);
        selectedTopics.push(`Day ${item.dayNumber}: ${item.title}`);

        let focusArea = 'Core technical mastery & architectural trade-offs';
        let isProbeTarget = false;

        if (item.status === 'FAILED') {
          focusArea = `Diagnostic probe on failed mission (${item.attempts} attempts)`;
          isProbeTarget = true;
          priorityAreas.push(`Day ${item.dayNumber} (${item.title}) - Probe Failed Mission`);
        } else if (item.status === 'ATTEMPTED / NEEDS PROBING') {
          focusArea = `Probing perseverance & resolution (${item.attempts} attempts)`;
          isProbeTarget = true;
          priorityAreas.push(`Day ${item.dayNumber} (${item.title}) - Probing ${item.attempts} Attempts`);
        } else if (rolePreferredDays.includes(item.dayNumber)) {
          focusArea = `Role-aligned assessment for ${jobRole}`;
          priorityAreas.push(`Day ${item.dayNumber} (${item.title}) - ${jobRole} Priority`);
        } else {
          priorityAreas.push(`Day ${item.dayNumber} (${item.title}) - Completed Topic`);
        }

        targetDays.push({
          dayNumber: item.dayNumber,
          title: item.title,
          focusArea,
          isProbeTarget,
          status: item.status
        });
      }
    }

    // Ensure minimum 4 days in candidate plan
    if (selectedDays.length < 4) {
      allCurriculumDays.forEach(curDay => {
        if (!selectedDays.includes(curDay.day) && !skippedDays.includes(curDay.day)) {
          if (selectedDays.length < 5) {
            selectedDays.push(curDay.day);
            selectedTopics.push(`Day ${curDay.day}: ${curDay.title}`);
            targetDays.push({
              dayNumber: curDay.day,
              title: curDay.title,
              focusArea: 'General curriculum assessment',
              isProbeTarget: false,
              status: 'NOT COVERED'
            });
          }
        }
      });
    }

    // 4. Determine Candidate Continuation Starting Topic
    // Pick the top non-capstone topic aligned with candidate's role / probe needs
    const nonCapstoneTarget = selectedDays.find(d => d !== 31);
    const startingDay = nonCapstoneTarget || selectedDays[0] || 7;

    // 5. Determine Experience-Aware Difficulty
    const difficulty: 'Foundational' | 'Intermediate' | 'Advanced' =
      yearsExperience >= 8
        ? 'Advanced'
        : yearsExperience >= 3
        ? 'Intermediate'
        : 'Foundational';

    const candidateTopicPool = scoredDaysList.map(t => t.dayNumber);

    return {
      candidateId,
      candidateName,
      jobRole,
      yearsExperience,
      selectedDays,
      selectedTopics,
      priorityAreas,
      startingDay,
      difficulty,
      minimumQuestions: 8,
      minimumDays: 4,
      targetDays,
      candidateTopicPool,
      skippedDays,
      classifiedTopics
    };
  }

  private getRolePreferredDays(lowerRole: string): number[] {
    if (lowerRole.includes('data engineer') || lowerRole.includes('data scientist') || lowerRole.includes('analytics')) {
      return [10, 7, 8, 11, 23, 28, 29, 31];
    }
    if (lowerRole.includes('devops') || lowerRole.includes('infrastructure') || lowerRole.includes('sre') || lowerRole.includes('sysadmin')) {
      return [28, 29, 23, 1, 2, 27, 30, 31];
    }
    if (lowerRole.includes('ai engineer') || lowerRole.includes('ml engineer') || lowerRole.includes('machine learning')) {
      return [22, 23, 10, 7, 11, 13, 21, 31];
    }
    if (lowerRole.includes('backend') || lowerRole.includes('software engineer') || lowerRole.includes('architect') || lowerRole.includes('developer')) {
      return [16, 22, 13, 23, 18, 10, 28, 31];
    }
    if (lowerRole.includes('ux') || lowerRole.includes('frontend') || lowerRole.includes('mobile')) {
      return [3, 17, 18, 16, 12, 1, 2, 31];
    }
    if (lowerRole.includes('business analyst') || lowerRole.includes('product') || lowerRole.includes('marketing') || lowerRole.includes('hr') || lowerRole.includes('manager')) {
      return [12, 16, 20, 1, 2, 3, 31];
    }
    return [10, 16, 22, 12, 7, 28, 31];
  }
}

export const interviewPlanner = new InterviewPlanner();
