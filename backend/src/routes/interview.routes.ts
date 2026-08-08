import { Router } from 'express';
import { handleInterview, getCandidatesList, getCohortInfo } from '../controllers/interview.controller';

const router = Router();

router.post('/interview', handleInterview);
router.get('/candidates', getCandidatesList);
router.get('/cohort', getCohortInfo);

export default router;
