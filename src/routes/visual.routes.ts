import { Router } from 'express';
import {
  getCodeforcesVisualPng,
  getLeetCodeVisualPng,
} from '../http/controllers/visual.controller';

const visualRouter = Router();

visualRouter.get('/visual/leetcode/:username', getLeetCodeVisualPng);
visualRouter.get('/visual/codeforces/:handle', getCodeforcesVisualPng);

export default visualRouter;
