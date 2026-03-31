import { Router } from 'express';
import { getCodeforcesAggregate } from '../http/controllers/codeforces.controller';

const codeforcesRouter = Router();

codeforcesRouter.get('/codeforces/:handle', getCodeforcesAggregate);

export default codeforcesRouter;
