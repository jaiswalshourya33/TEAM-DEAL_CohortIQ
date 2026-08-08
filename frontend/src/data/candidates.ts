import type { CandidateProfile } from '@/types';
import candidatesJson from '../../../backend/src/data/candidates.json';

const candidateData = candidatesJson as { candidates?: CandidateProfile[] };

export const CANDIDATES_DATA: CandidateProfile[] = candidateData.candidates ?? [];

export default CANDIDATES_DATA;
