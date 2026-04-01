import { Router } from 'express';
import {
  getCodeforcesAggregate,
  getCodeforcesReview,
} from '../http/controllers/codeforces.controller';

const codeforcesRouter = Router();

codeforcesRouter.get('/codeforces/:handle', getCodeforcesAggregate);
codeforcesRouter.get('/review/codeforces/:handle', getCodeforcesReview);

export default codeforcesRouter;
