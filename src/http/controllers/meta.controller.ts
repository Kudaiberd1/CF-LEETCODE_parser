import type { RequestHandler } from 'express';

const rootPayload = {
  apiOverview:
    'Welcome to the Alfa-Leetcode-API! Alfa-Leetcode-Api is a custom solution born out of the need for a well-documented and detailed LeetCode API. This project is designed to provide developers with endpoints that offer insights into a user"s profile, badges, solved questions, contest details, contest history, submissions, and also daily questions, selected problem, list of problems.',
  apiEndpointsLink:
    'https://github.com/alfaarghya/alfa-leetcode-api?tab=readme-ov-file#endpoints-',
  routes: {
    userDetails: {
      description:
        'Endpoints for retrieving detailed user profile information on Leetcode.',
      Method: 'GET',
      '/:username': 'Get your leetcode profile Details',
      '/:username/profile': 'Get full profile details',
      '/:username/badges': 'Get your badges',
      '/:username/solved': 'Get total number of question you solved',
      '/:username/contest': 'Get your contest details',
      '/:username/contest/history': 'Get all contest history',
      '/:username/submission': 'Get your last 20 submission',
      '/:username/submission?limit=7':
        'Get a specified number of last submissions.',
      '/:username/acSubmission': 'Get your last 20 accepted submission',
      '/:username/acSubmission?limit=7':
        'Get a specified number of last acSubmissions.',
      '/:username/calendar': 'Get your submission calendar',
      '/:username/calendar?year=2025': 'Get your year submission calendar',
      '/:username/skill': 'Get your skill stats',
      '/:username/language': 'Get your language stats',
      '/:username/progress': 'Get your progress stats',
    },
    discussion: {
      description: 'Endpoints for fetching discussion topics and comments.',
      Method: 'GET',
      '/trendingDiscuss?first=20': 'Get top 20 trending discussions',
      '/discussTopic/:topicId': 'Get discussion topic',
      '/discussComments/:topicId': 'Get discussion comments',
    },
    visual: {
      description:
        'PNG snapshot of the same React dashboard as the web UI (Puppeteer opens the app, then captures #screenshot-capture).',
      Method: 'GET',
      '/visual/leetcode/:username': 'LeetCode dashboard as image/png',
      '/visual/codeforces/:handle':
        'Codeforces dashboard as image/png (?cfMode=all|contest|practice|virtual)',
    },
    problems: {
      description:
        'Endpoints for fetching problem-related data, including lists, details, and solutions.',
      Method: 'GET',
      singleProblem: {
        '/select?titleSlug=two-sum': 'Get selected Problem',
        '/select/raw?titleSlug=two-sum': 'Get raw selected Problem',
        '/daily': 'Get daily Problem',
        '/daily/raw': 'Get raw daily Problem',
      },
      problemList: {
        '/problems': 'Get list of 20 problems',
        '/problems?limit=50': 'Get list of some problems',
        '/problems?tags=array+math': 'Get list problems on selected topics',
        '/problems?tags=array+math+string&limit=5':
          'Get list some problems on selected topics',
        '/problems?skip=500':
          'Get list after skipping a given amount of problems',
        '/problems?difficulty=EASY':
          'Get list of problems having selected difficulty',
        '/problems?limit=5&skip=100':
          'Get list of size limit after skipping selected amount',
        'problems?tags=array+maths&limit=5&skip=100':
          'Get list of problems with selected tags having size limit after skipping selected amount',
        '/officialSolution?titleSlug=two-sum':
          'Get official solution of selected problem',
      },
    },
  },
};

export const getApiOverview: RequestHandler = (_req, res) => {
  res.json(rootPayload);
};
