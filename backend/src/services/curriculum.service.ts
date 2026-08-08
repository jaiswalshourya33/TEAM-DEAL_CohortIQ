import curriculumData from '../data/curriculum.json';

export interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export interface CurriculumModule {
  n: number;
  title: string;
  days: number[];
}

export class CurriculumService {
  private cohortName: string;
  private modules: CurriculumModule[];
  private days: CurriculumDay[];

  constructor() {
    this.cohortName = curriculumData.cohort;
    this.modules = curriculumData.modules as CurriculumModule[];
    this.days = curriculumData.days as CurriculumDay[];
  }

  getCohortInfo() {
    return {
      cohort: this.cohortName,
      modules: this.modules,
      days: this.days
    };
  }

  getAllDays(): CurriculumDay[] {
    return this.days;
  }

  getDayByNumber(dayNumber: number): CurriculumDay | undefined {
    return this.days.find(d => d.day === dayNumber);
  }

  getDaysForModule(moduleNumber: number): CurriculumDay[] {
    const mod = this.modules.find(m => m.n === moduleNumber);
    if (!mod) return [];
    return this.days.filter(d => mod.days.includes(d.day));
  }
}

export const curriculumService = new CurriculumService();
