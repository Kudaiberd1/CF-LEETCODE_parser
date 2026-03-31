import type { RequestHandler } from 'express';
import * as leetcode from '../../leetCode';

export const trendingCategoryTopics =
  leetcode.trendingCategoryTopics as RequestHandler;
export const discussTopic = leetcode.discussTopic as RequestHandler;
export const discussComments = leetcode.discussComments as RequestHandler;
export const dailyProblem = leetcode.dailyProblem as RequestHandler;
export const dailyProblemRaw = leetcode.dailyProblemRaw as RequestHandler;
export const selectProblem = leetcode.selectProblem as RequestHandler;
export const selectProblemRaw = leetcode.selectProblemRaw as RequestHandler;
export const officialSolution = leetcode.officialSolution as RequestHandler;
export const problems = leetcode.problems as unknown as RequestHandler;
export const allContests = leetcode.allContests as RequestHandler;
export const upcomingContests = leetcode.upcomingContests as RequestHandler;

export const userData = leetcode.userData as RequestHandler;
export const userBadges = leetcode.userBadges as RequestHandler;
export const solvedProblem = leetcode.solvedProblem as RequestHandler;
export const userContest = leetcode.userContest as RequestHandler;
export const userContestHistory = leetcode.userContestHistory as RequestHandler;
export const submission = leetcode.submission as RequestHandler;
export const acSubmission = leetcode.acSubmission as RequestHandler;
export const calendar = leetcode.calendar as RequestHandler;
export const skillStats = leetcode.skillStats as RequestHandler;
export const userProfile = leetcode.userProfile as RequestHandler;
export const languageStats = leetcode.languageStats as RequestHandler;
export const progress = leetcode.progress as RequestHandler;

export const legacyUserProfile = leetcode.userProfile_ as RequestHandler;
export const legacyDailyQuestion = leetcode.dailyQuestion_ as RequestHandler;
export const legacySelectQuestion = leetcode.selectProblemRaw as RequestHandler;
export const legacySkillStats = leetcode.skillStats_ as RequestHandler;
export const legacyQuestionProgress =
  leetcode.userProfileUserQuestionProgressV2_ as RequestHandler;
export const legacyLanguageStats = leetcode.languageStats_ as RequestHandler;
export const legacyContestRanking =
  leetcode.userContestRankingInfo_ as RequestHandler;
