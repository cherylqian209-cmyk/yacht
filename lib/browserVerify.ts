import fs from 'node:fs/promises';
import path from 'node:path';
import { closeBrowserSession, launchBrowserSession } from '@/lib/browser';

export interface BrowserVerifyResult {
  passed: boolean;
  issues: string[];
  screenshotPath?: string;
  checkedAt: string;
}

const CTA_SELECTOR = 'button, [role="button"], input[type="submit"], a';
const EMAIL_SELECTOR = 'input[type="email"], input[name*="email" i], input[placeholder*="email" i]';

function screenshotName(): string {
  return `browser-verify-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
}

export async function verifyDeployedPage(url: string, sampleEmail = 'demo@example.com'): Promise<BrowserVerifyResult> {
  const issues: string[] = [];
  const session = await launchBrowserSession();

  try {
    await session.page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });

    const emailInput = session.page.locator(EMAIL_SELECTOR).first();
    const emailInputCount = await session.page.locator(EMAIL_SELECTOR).count();
    if (!emailInputCount) {
      issues.push('Could not find an email input on the deployed page.');
    } else {
      await emailInput.fill(sampleEmail);
    }

    const cta = session.page.locator(CTA_SELECTOR).filter({ hasText: /join|sign up|get started|submit|waitlist|start|launch/i }).first();
    const fallbackCta = session.page.locator(CTA_SELECTOR).first();

    let clicked = false;
    if (await cta.count()) {
      await cta.click({ timeout: 5_000 });
      clicked = true;
    } else if (await fallbackCta.count()) {
      await fallbackCta.click({ timeout: 5_000 });
      clicked = true;
      issues.push('Clicked a fallback CTA because no explicit waitlist-style CTA label was found.');
    }

    if (!clicked) {
      issues.push('Could not find a CTA button on the deployed page.');
    }

    const screenshotDir = path.join(process.cwd(), 'public', 'verification');
    await fs.mkdir(screenshotDir, { recursive: true });
    const fileName = screenshotName();
    const filePath = path.join(screenshotDir, fileName);
    await session.page.screenshot({ path: filePath, fullPage: true });

    return {
      passed: issues.length === 0,
      issues,
      screenshotPath: `/verification/${fileName}`,
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      passed: false,
      issues: [
        `Browser verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      ],
      checkedAt: new Date().toISOString()
    };
  } finally {
    await closeBrowserSession(session);
  }
}
