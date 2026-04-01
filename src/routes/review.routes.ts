import { Router } from 'express';
import { getLeetCodeReview } from '../http/controllers/review.controller';

const reviewRouter = Router();

reviewRouter.get('/review/leetcode/:username', getLeetCodeReview);

export default reviewRouter;
