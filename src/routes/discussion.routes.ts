import { Router } from 'express';
import {
  discussComments,
  discussTopic,
  trendingCategoryTopics,
} from '../http/controllers/leetcode.controller';

const discussionRouter = Router();

discussionRouter.get('/trendingDiscuss', trendingCategoryTopics);
discussionRouter.get('/discussTopic/:topicId', discussTopic);
discussionRouter.get('/discussComments/:topicId', discussComments);

export default discussionRouter;
