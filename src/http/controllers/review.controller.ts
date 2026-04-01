import type { Request, Response } from 'express';
import { computeLeetCodeScore } from '../../services/leetcode/leetcode-score.service';

export async function getLeetCodeReview(
  req: Request,
  res: Response,
): Promise<Response | void> {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ error: 'Missing username parameter' });
  }

  try {
    const scores = await computeLeetCodeScore(username);
    return res.json(scores);
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to compute LeetCode score',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
