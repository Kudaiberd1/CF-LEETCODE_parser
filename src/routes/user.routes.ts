import { Router } from 'express';
import {
  acSubmission,
  calendar,
  languageStats,
  progress,
  skillStats,
  solvedProblem,
  submission,
  userBadges,
  userContest,
  userContestHistory,
  userData,
  userProfile,
} from '../http/controllers/leetcode.controller';
import { buildUserRequestContext } from '../middleware/userRequestContext';

const userRouter = Router();

userRouter.use('/:username*', buildUserRequestContext);

userRouter.get('/:username', userData);
userRouter.get('/:username/badges', userBadges);
userRouter.get('/:username/solved', solvedProblem);
userRouter.get('/:username/contest', userContest);
userRouter.get('/:username/contest/history', userContestHistory);
userRouter.get('/:username/submission', submission);
userRouter.get('/:username/acSubmission', acSubmission);
userRouter.get('/:username/calendar', calendar);
userRouter.get('/:username/skill/', skillStats);
userRouter.get('/:username/profile/', userProfile);
userRouter.get('/:username/language', languageStats);
userRouter.get('/:username/progress/', progress);

export default userRouter;
