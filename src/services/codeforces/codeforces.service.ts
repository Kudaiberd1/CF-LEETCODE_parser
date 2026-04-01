import axios from 'axios';

type CodeforcesUser = {
  rating?: number;
};

type CodeforcesSubmission = {
  verdict?: string;
  creationTimeSeconds?: number;
  submissionTimeSeconds?: number;
  problem?: {
    contestId?: number | string;
    index?: string;
  };
};

export type CodeforcesAggregate = {
  user: CodeforcesUser | null;
  ratingHistory: unknown[];
  submissions: CodeforcesSubmission[];
};

function getSubmissionSeconds(submission: CodeforcesSubmission): number | null {
  const seconds = Number(
    submission?.creationTimeSeconds ?? submission?.submissionTimeSeconds,
  );
  return Number.isFinite(seconds) ? seconds : null;
}

export function computeCodeforcesScore(payload: CodeforcesAggregate) {
  const rating = Number(payload.user?.rating ?? 0) || 0;
  const submissions = payload.submissions || [];
  const accepted = submissions.filter((s) => s.verdict === 'OK');

  const uniqueSolved = new Set<string>();
  const today = new Date();
  let submissionsLastYear = 0;

  for (const sub of accepted) {
    const seconds = getSubmissionSeconds(sub);
    if (seconds === null) continue;

    const d = new Date(seconds * 1000);
    const diffDays = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 364) {
      submissionsLastYear += 1;
    }

    const contestId = sub.problem?.contestId ?? 'x';
    const index = sub.problem?.index ?? 'x';
    uniqueSolved.add(`${contestId}-${index}`);
  }

  const solvedProblems = uniqueSolved.size;

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

  let ratingScore = 0;
  let ratingReason = 'Unrated or rating ≤ 300';
  if (rating > 1200) {
    ratingScore = 3;
    ratingReason = 'Rating greater than 1200';
  } else if (rating > 900) {
    ratingScore = 2;
    ratingReason = 'Rating greater than 900';
  } else if (rating > 300) {
    ratingScore = 1;
    ratingReason = 'Rating greater than 300';
  }

  let solvedScore = 0;
  let solvedReason = 'Solved 10 or fewer problems';
  if (solvedProblems > 200) {
    solvedScore = 3;
    solvedReason = 'Solved more than 200 problems';
  } else if (solvedProblems > 100) {
    solvedScore = 2;
    solvedReason = 'Solved more than 100 problems';
  } else if (solvedProblems > 10) {
    solvedScore = 1;
    solvedReason = 'Solved more than 10 problems';
  }

  const skillScore = ratingScore + solvedScore;
  const rawScore = (proactivenessScore + skillScore) / 2;
  const finalScore = Math.floor(rawScore);

  return {
    platform: 'codeforces' as const,
    submissions_last_year: submissionsLastYear,
    proactiveness: {
      score: proactivenessScore,
      reason: proactivenessReason,
    },
    skill: {
      score: skillScore,
      breakdown: {
        rating: {
          value: rating,
          score: ratingScore,
          reason: ratingReason,
        },
        solved_problems: {
          value: solvedProblems,
          score: solvedScore,
          reason: solvedReason,
        },
      },
    },
    final_score: finalScore,
  };
}

export async function fetchCodeforcesAggregate(
  handle: string,
): Promise<CodeforcesAggregate> {
  const [infoRes, ratingRes, statusRes] = await Promise.all([
    axios.get('https://codeforces.com/api/user.info', {
      params: { handles: handle },
    }),
    axios.get('https://codeforces.com/api/user.rating', {
      params: { handle },
    }),
    axios.get('https://codeforces.com/api/user.status', {
      params: { handle, from: 1, count: 10000 },
    }),
  ]);

  const infoData = infoRes.data;
  const ratingData = ratingRes.data;
  const statusData = statusRes.data;

  if (
    infoData?.status !== 'OK' ||
    ratingData?.status !== 'OK' ||
    statusData?.status !== 'OK'
  ) {
    const err = new Error('Codeforces API returned an error');
    (err as Error & { details?: unknown }).details = {
      info: infoData?.comment || null,
      rating: ratingData?.comment || null,
      status: statusData?.comment || null,
    };
    throw err;
  }

  return {
    user: infoData.result?.[0] || null,
    ratingHistory: ratingData.result || [],
    submissions: statusData.result || [],
  };
}
