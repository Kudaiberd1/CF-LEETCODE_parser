import axios from 'axios';

type LeetCodeProfile = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

type LeetCodeCalendar = {
  submissionCalendar: string | Record<string, number>;
};

function buildDateToCountFromSubmissionCalendar(
  calendar: string | Record<string, number>,
): Map<string, number> {
  const raw =
    typeof calendar === 'string'
      ? (JSON.parse(calendar) as Record<string, number>)
      : calendar;
  const dateToCount = new Map<string, number>();
  for (const [tsKey, rawCount] of Object.entries(raw || {})) {
    const seconds = Number(tsKey);
    if (!Number.isFinite(seconds)) continue;
    const dateKey = new Date(seconds * 1000).toISOString().slice(0, 10);
    dateToCount.set(dateKey, Number(rawCount || 0));
  }
  return dateToCount;
}

export async function computeLeetCodeScore(username: string) {
  const apiBase = (
    process.env.SCREENSHOT_API_BASE || 'http://127.0.0.1:3000'
  ).replace(/\/$/, '');

  const [profileRes, calendarRes] = await Promise.all([
    axios.get<LeetCodeProfile>(
      `${apiBase}/${encodeURIComponent(username)}/profile`,
    ),
    axios.get<LeetCodeCalendar>(
      `${apiBase}/${encodeURIComponent(username)}/calendar`,
    ),
  ]);

  const profile = profileRes.data;
  const calendar = calendarRes.data;

  const dateToCount = buildDateToCountFromSubmissionCalendar(
    calendar.submissionCalendar,
  );

  let submissionsLastYear = 0;
  for (const [, count] of dateToCount.entries()) {
    submissionsLastYear += count || 0;
  }

  let proactivenessScore = 0;
  let proactivenessReason = `Only ${submissionsLastYear} submissions in the last year`;
  if (submissionsLastYear > 250) {
    proactivenessScore = 5;
    proactivenessReason = 'More than 250 submissions in the past year';
  } else if (submissionsLastYear > 200) {
    proactivenessScore = 4;
    proactivenessReason = 'More than 200 submissions in the past year';
  } else if (submissionsLastYear > 150) {
    proactivenessScore = 3;
    proactivenessReason = 'More than 150 submissions in the past year';
  } else if (submissionsLastYear > 100) {
    proactivenessScore = 2;
    proactivenessReason = 'More than 100 submissions in the past year';
  } else if (submissionsLastYear > 50) {
    proactivenessScore = 1;
    proactivenessReason = 'More than 50 submissions in the past year';
  }

  const { easySolved, mediumSolved, hardSolved, totalSolved } = profile;

  let difficultyScore = 0;
  let difficultyReason = 'Solved mostly easy or no problems';
  if (mediumSolved >= 10 || hardSolved >= 3) {
    difficultyScore = 3;
    difficultyReason = 'Solved at least 10 medium or at least 3 hard problems';
  } else if (mediumSolved >= 5) {
    difficultyScore = 2;
    difficultyReason = 'Solved at least 5 medium problems';
  } else if (easySolved >= 10) {
    difficultyScore = 1;
    difficultyReason = 'Solved at least 10 easy problems';
  }

  let solvedScore = 0;
  let solvedReason = 'Solved 10 or fewer problems';
  if (totalSolved > 100) {
    solvedScore = 3;
    solvedReason = 'Solved more than 100 problems';
  } else if (totalSolved > 50) {
    solvedScore = 2;
    solvedReason = 'Solved more than 50 problems';
  } else if (totalSolved > 10) {
    solvedScore = 1;
    solvedReason = 'Solved more than 10 problems';
  }

  const skillScore = difficultyScore + solvedScore;
  const rawScore = (proactivenessScore + skillScore) / 2;
  const finalScore = Math.floor(rawScore);

  return {
    platform: 'leetcode' as const,
    submissions_last_year: submissionsLastYear,
    proactiveness: {
      score: proactivenessScore,
      reason: proactivenessReason,
    },
    skill: {
      score: skillScore,
      breakdown: {
        difficulty: {
          value: {
            easy: easySolved,
            medium: mediumSolved,
            hard: hardSolved,
          },
          score: difficultyScore,
          reason: difficultyReason,
        },
        solved_problems: {
          value: totalSolved,
          score: solvedScore,
          reason: solvedReason,
        },
      },
    },
    final_score: finalScore,
  };
}
