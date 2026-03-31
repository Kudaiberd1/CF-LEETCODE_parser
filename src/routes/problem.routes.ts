import { Router } from 'express';
import {
  dailyProblem,
  dailyProblemRaw,
  officialSolution,
  problems,
  selectProblem,
  selectProblemRaw,
} from '../http/controllers/leetcode.controller';

const problemRouter = Router();

problemRouter.get('/daily', dailyProblem);
problemRouter.get('/daily/raw', dailyProblemRaw);
problemRouter.get('/select', selectProblem);
problemRouter.get('/select/raw', selectProblemRaw);
problemRouter.get('/officialSolution', officialSolution);
problemRouter.get('/problems', problems);

export default problemRouter;
