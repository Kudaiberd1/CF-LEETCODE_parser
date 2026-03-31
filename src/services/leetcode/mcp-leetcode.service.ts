import { executeLeetCodeGraphQL } from '../../clients/leetcodeGraphql.client';
import {
  formatAcSubmissionData,
  formatBadgesData,
  formatContestData,
  formatContestHistoryData,
  formatDailyData,
  formatLanguageStats,
  formatProblemsData,
  formatProgressStats,
  formatQuestionData,
  formatSkillStats,
  formatSolvedProblemsData,
  formatSubmissionCalendarData,
  formatSubmissionData,
  formatTrendingCategoryTopicData,
  formatUserData,
  formatUserProfileData,
} from '../../FormatUtils';
import {
  AcSubmissionQuery,
  contestQuery,
  dailyProblemQuery,
  discussCommentsQuery,
  discussTopicQuery,
  getUserProfileQuery,
  languageStatsQuery,
  officialSolutionQuery,
  problemListQuery,
  selectProblemQuery,
  skillStatsQuery,
  submissionQuery,
  trendingDiscussQuery,
  userContestRankingInfoQuery,
  userProfileCalendarQuery,
  userProfileQuery,
  userQuestionProgressQuery,
} from '../../GQLQueries';
import type {
  DailyProblemData,
  ProblemSetQuestionListData,
  SelectProblemData,
  TrendingDiscussionObject,
  UserData,
} from '../../types';

export type SubmissionArgs = { username: string; limit?: number };
export type CalendarArgs = { username: string; year: number };
export type ProblemArgs = {
  limit?: number;
  skip?: number;
  tags?: string;
  difficulty?: string;
};
export type DiscussCommentsArgs = {
  topicId: number;
  orderBy?: string;
  pageNo?: number;
  numPerPage?: number;
};

function buildVariables(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'number' && Number.isNaN(value))
    ) {
      result[key] = value;
    }
  }
  return result;
}

export async function getUserProfileSummary(username: string) {
  const data = await executeLeetCodeGraphQL(userProfileQuery, { username });
  return formatUserData(data as UserData);
}
export async function getUserBadges(username: string) {
  const data = await executeLeetCodeGraphQL(userProfileQuery, { username });
  return formatBadgesData(data as UserData);
}
export async function getUserContest(username: string) {
  const data = await executeLeetCodeGraphQL(contestQuery, { username });
  return formatContestData(data as any);
}
export async function getUserContestHistory(username: string) {
  const data = await executeLeetCodeGraphQL(contestQuery, { username });
  return formatContestHistoryData(data as any);
}
export async function getSolvedProblems(username: string) {
  const data = await executeLeetCodeGraphQL(userProfileQuery, { username });
  return formatSolvedProblemsData(data as UserData);
}
export async function getRecentSubmission(args: SubmissionArgs) {
  const data = await executeLeetCodeGraphQL(
    submissionQuery,
    buildVariables({ username: args.username, limit: args.limit }),
  );
  return formatSubmissionData(data as UserData);
}
export async function getRecentAcSubmission(args: SubmissionArgs) {
  const data = await executeLeetCodeGraphQL(
    AcSubmissionQuery,
    buildVariables({ username: args.username, limit: args.limit }),
  );
  return formatAcSubmissionData(data as UserData);
}
export async function getSubmissionCalendar(args: CalendarArgs) {
  const data = await executeLeetCodeGraphQL(
    userProfileCalendarQuery,
    buildVariables({ username: args.username, year: args.year }),
  );
  return formatSubmissionCalendarData(data as UserData);
}
export async function getUserProfileAggregate(username: string) {
  const data = await executeLeetCodeGraphQL(getUserProfileQuery, { username });
  return formatUserProfileData(data as any);
}
export async function getLanguageStats(username: string) {
  const data = await executeLeetCodeGraphQL(languageStatsQuery, { username });
  return formatLanguageStats(data as any);
}
export async function getSkillStats(username: string) {
  const data = await executeLeetCodeGraphQL(skillStatsQuery, { username });
  return formatSkillStats(data as UserData);
}
export async function getDailyProblem() {
  const data = await executeLeetCodeGraphQL(dailyProblemQuery, {});
  return formatDailyData(data as DailyProblemData);
}
export async function getDailyProblemRaw() {
  return executeLeetCodeGraphQL(dailyProblemQuery, {});
}
export async function getSelectProblem(titleSlug: string) {
  const data = await executeLeetCodeGraphQL(selectProblemQuery, { titleSlug });
  return formatQuestionData(data as SelectProblemData);
}
export async function getSelectProblemRaw(titleSlug: string) {
  return executeLeetCodeGraphQL(selectProblemQuery, { titleSlug });
}
export async function getProblemSet(args: ProblemArgs) {
  const limit =
    args.skip !== undefined && args.limit === undefined
      ? 1
      : (args.limit ?? 20);
  const skip = args.skip ?? 0;
  const tags = args.tags ? args.tags.split(' ') : [];
  const difficulty = args.difficulty ?? undefined;
  const variables = buildVariables({
    categorySlug: '',
    limit,
    skip,
    filters: { tags, difficulty },
  });
  const data = await executeLeetCodeGraphQL(problemListQuery, variables);
  return formatProblemsData(data as ProblemSetQuestionListData);
}
export async function getOfficialSolution(titleSlug: string) {
  return executeLeetCodeGraphQL(officialSolutionQuery, { titleSlug });
}
export async function getTrendingTopics(first: number) {
  const data = await executeLeetCodeGraphQL(trendingDiscussQuery, { first });
  return formatTrendingCategoryTopicData(data as TrendingDiscussionObject);
}
export async function getDiscussTopic(topicId: number) {
  return executeLeetCodeGraphQL(discussTopicQuery, { topicId });
}
export async function getDiscussComments(args: DiscussCommentsArgs) {
  return executeLeetCodeGraphQL(
    discussCommentsQuery,
    buildVariables({
      topicId: args.topicId,
      orderBy: args.orderBy ?? 'newest_to_oldest',
      pageNo: args.pageNo ?? 1,
      numPerPage: args.numPerPage ?? 10,
    }),
  );
}
export async function getLanguageStatsRaw(username: string) {
  return executeLeetCodeGraphQL(languageStatsQuery, { username });
}
export async function getUserProfileCalendarRaw(args: CalendarArgs) {
  return executeLeetCodeGraphQL(
    userProfileCalendarQuery,
    buildVariables({ username: args.username, year: args.year }),
  );
}
export async function getUserProfileRaw(username: string) {
  return executeLeetCodeGraphQL(getUserProfileQuery, { username });
}
export async function getDailyProblemLegacy() {
  return executeLeetCodeGraphQL(dailyProblemQuery, {});
}
export async function getSkillStatsRaw(username: string) {
  return executeLeetCodeGraphQL(skillStatsQuery, { username });
}
export async function getUserProgress(username: string) {
  const data = await executeLeetCodeGraphQL(userQuestionProgressQuery, {
    username,
  });
  return formatProgressStats(data as UserData);
}
export async function getUserContestRankingInfo(username: string) {
  return executeLeetCodeGraphQL(userContestRankingInfoQuery, { username });
}
export async function getUserProgressRaw(username: string) {
  return executeLeetCodeGraphQL(userQuestionProgressQuery, { username });
}
