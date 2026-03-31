import axios from 'axios';

type CodeforcesAggregate = {
  user: unknown;
  ratingHistory: unknown[];
  submissions: unknown[];
};

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
