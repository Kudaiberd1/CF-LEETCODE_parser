import type { Request, Response } from 'express';
import {
  computeCodeforcesScore,
  fetchCodeforcesAggregate,
} from '../../services/codeforces/codeforces.service';

export async function getCodeforcesAggregate(
  req: Request,
  res: Response,
): Promise<Response | void> {
  const { handle } = req.params;
  if (!handle) {
    return res.status(400).json({ error: 'Missing handle parameter' });
  }

  try {
    const payload = await fetchCodeforcesAggregate(handle);
    const scores = computeCodeforcesScore(payload);
    return res.json({ ...payload, scores });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Codeforces API returned an error'
    ) {
      return res.status(404).json({
        error: error.message,
        details: (error as Error & { details?: unknown }).details ?? null,
      });
    }
    return res.status(502).json({
      error: 'Failed to fetch Codeforces data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function getCodeforcesReview(
  req: Request,
  res: Response,
): Promise<Response | void> {
  const { handle } = req.params;
  if (!handle) {
    return res.status(400).json({ error: 'Missing handle parameter' });
  }

  try {
    const payload = await fetchCodeforcesAggregate(handle);
    const scores = computeCodeforcesScore(payload);
    return res.json(scores);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Codeforces API returned an error'
    ) {
      return res.status(404).json({
        error: error.message,
        details: (error as Error & { details?: unknown }).details ?? null,
      });
    }
    return res.status(502).json({
      error: 'Failed to fetch Codeforces data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
