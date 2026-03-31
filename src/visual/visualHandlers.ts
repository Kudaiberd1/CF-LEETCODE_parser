import type { Request, Response } from 'express';
import { captureLiveDashboardPng } from './screenshot';

export async function visualLeetCodePng(
  req: Request,
  res: Response,
): Promise<void> {
  const username = req.params.username?.trim();
  if (!username) {
    res.status(400).json({ error: 'Missing username' });
    return;
  }

  try {
    const png = await captureLiveDashboardPng({
      platform: 'leetcode',
      user: username,
    });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(png);
  } catch (err) {
    console.error('visualLeetCodePng:', err);
    res.status(500).json({
      error: 'Failed to render visualization',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

export async function visualCodeforcesPng(
  req: Request,
  res: Response,
): Promise<void> {
  const handle = req.params.handle?.trim();
  if (!handle) {
    res.status(400).json({ error: 'Missing handle' });
    return;
  }

  const cfMode =
    typeof req.query.cfMode === 'string' ? req.query.cfMode : undefined;

  try {
    const png = await captureLiveDashboardPng({
      platform: 'codeforces',
      user: handle,
      cfMode,
    });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(png);
  } catch (err) {
    console.error('visualCodeforcesPng:', err);
    res.status(500).json({
      error: 'Failed to render visualization',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
