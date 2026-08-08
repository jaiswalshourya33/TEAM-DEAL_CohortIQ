import type { CohortModule } from '@/types';

export const COHORT_MODULES: CohortModule[] = [
  { n: 1, title: 'Environment Setup & Developer Workflow', days: [1, 2] },
  { n: 2, title: 'Python & Data Foundations', days: [3, 4, 5, 6] },
  { n: 3, title: 'Embeddings & Vector Search', days: [7, 8, 9] },
  { n: 4, title: 'RAG & Context Windows', days: [10, 11] },
  { n: 5, title: 'Prompting & Structured Output', days: [12, 13] },
  { n: 6, title: 'Fine-Tuning & LoRA', days: [14, 15] },
  { n: 7, title: 'Agents, Orchestration & MCP', days: [16, 17, 18, 19, 20, 21, 22, 23] },
  { n: 8, title: 'Production Readiness & Deployment', days: [24, 25, 26, 27, 28, 29, 30, 31] },
];
