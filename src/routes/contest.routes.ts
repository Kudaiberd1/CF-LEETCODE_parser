import { Router } from 'express';
import {
  allContests,
  upcomingContests,
} from '../http/controllers/leetcode.controller';

const contestRouter = Router();

contestRouter.get('/contests', allContests);
contestRouter.get('/contests/upcoming', upcomingContests);

export default contestRouter;
