import puppeteer from 'puppeteer';

let browserPromise: Promise<import('puppeteer').Browser> | null = null;

async function getBrowser(): Promise<import('puppeteer').Browser> {
  if (!browserPromise) {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
    browserPromise = puppeteer.launch({
      headless: true,
      executablePath: executablePath || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });
  }
  return browserPromise;
}

const CF_MODES = new Set(['all', 'contest', 'practice', 'virtual']);

/**
 * Opens the real dashboard (same React UI as the site), waits for data, then
 * screenshots `#screenshot-capture` so PNG output matches the website.
 */
export async function captureLiveDashboardPng(opts: {
  platform: 'leetcode' | 'codeforces';
  user: string;
  cfMode?: string;
}): Promise<Buffer> {
  const dashboardBase = (
    process.env.DASHBOARD_URL || 'http://127.0.0.1:8080'
  ).replace(/\/$/, '');
  const apiBase = (
    process.env.SCREENSHOT_API_BASE || 'http://127.0.0.1:3000'
  ).replace(/\/$/, '');
  const cfMode = opts.cfMode && CF_MODES.has(opts.cfMode) ? opts.cfMode : 'all';

  const q = new URLSearchParams({
    screenshot: '1',
    platform: opts.platform,
    user: opts.user,
    apiBase,
    cfMode,
  });
  const url = `${dashboardBase}/?${q.toString()}`;

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: 'load', timeout: 120_000 });
    await page.waitForSelector('[data-screenshot-ready="true"]', {
      timeout: 120_000,
    });
    await new Promise((r) => setTimeout(r, 800));
    const el = await page.$('#screenshot-capture');
    if (!el) {
      throw new Error('#screenshot-capture not found');
    }
    const png = await el.screenshot({ type: 'png' });
    return png as Buffer;
  } finally {
    await page.close();
  }
}
