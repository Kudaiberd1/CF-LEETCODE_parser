import { Router } from 'express';
import {
  legacyContestRanking,
  legacyDailyQuestion,
  legacyLanguageStats,
  legacyQuestionProgress,
  legacySelectQuestion,
  legacySkillStats,
  legacyUserProfile,
} from '../http/controllers/leetcode.controller';

const legacyRouter = Router();

legacyRouter.get('/userProfile/:id', legacyUserProfile);
legacyRouter.get('/dailyQuestion', legacyDailyQuestion);
legacyRouter.get('/selectQuestion', legacySelectQuestion);
legacyRouter.get('/skillStats/:username', legacySkillStats);
legacyRouter.get(
  '/userProfileUserQuestionProgressV2/:userSlug',
  legacyQuestionProgress,
);
legacyRouter.get('/languageStats', legacyLanguageStats);
legacyRouter.get('/userContestRankingInfo/:username', legacyContestRanking);

export default legacyRouter;
