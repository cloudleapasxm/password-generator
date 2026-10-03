/**
 * Visual + interaction verification for the SecurePass redesign.
 * Run: node scripts/verify.mjs [baseUrl]
 * Requires the dev server running (npm run dev).
 */
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4321/password-generator/';
const SHOT_DIR = '/tmp/securepass-shots';
const WIDTHS = [320, 360, 390, 768, 1024, 1440];

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

const browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  // ---- Responsive sweep (light) ----
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('output', { timeout: 15000 });

    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      password: document.querySelector('output')?.textContent?.trim().slice(0, 12) ?? '',
      clipped: (() => {
        const out = document.querySelector('output');
        if (!out) return true;
        return out.scrollWidth > out.clientWidth + 1 && getComputedStyle(out).overflowX !== 'visible';
      })(),
    }));
    check(`no horizontal overflow @ ${width}px`, metrics.scrollW <= width, `scrollW=${metrics.scrollW}`);
    check(`password rendered @ ${width}px`, metrics.password.length > 0, metrics.password);
    await page.screenshot({ path: `${SHOT_DIR}/light-${width}.png` });
    await ctx.close();
  }

  // ---- Dark theme ----
  for (const width of [390, 1440]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: 'dark',
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('output', { timeout: 15000 });
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    check(`dark theme applied @ ${width}px`, isDark);
    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
    }));
    check(`no horizontal overflow (dark) @ ${width}px`, metrics.scrollW <= width, `scrollW=${metrics.scrollW}`);
    await page.screenshot({ path: `${SHOT_DIR}/dark-${width}.png` });
    await ctx.close();
  }

  // ---- Interactions ----
  {
    const ctx = await browser.newContext({
      viewport: { width: 1024, height: 900 },
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('output', { timeout: 15000 });

    // Regenerate changes the password, preserving config
    const before = await page.locator('output').textContent();
    await page.getByRole('button', { name: /generate a new password/i }).click();
    await page.waitForFunction((prev) => document.querySelector('output')?.textContent !== prev, before, { timeout: 5000 });
    const after = await page.locator('output').textContent();
    check('regenerate produces a new password', !!before && !!after && before !== after);

    // Copy feedback
    await page.getByRole('button', { name: /copy password/i }).click();
    await page.getByRole('button', { name: /copied!/i }).waitFor({ timeout: 5000 });
    check('copy shows "Copied!" feedback', true);
    const announced = await page.locator('[role="status"]').textContent();
    check('copy announced to screen readers', /copied to clipboard/i.test(announced ?? ''));
    const clipText = await page.evaluate(() => navigator.clipboard.readText());
    check('clipboard holds the password', clipText === after?.trim());
    await page.screenshot({ path: `${SHOT_DIR}/copied-state.png` });

    // Advanced options expand/collapse with animation
    const adv = page.getByRole('button', { name: /advanced options/i });
    await adv.click();
    await page.waitForFunction(() => {
      const el = document.querySelector('.sp-collapse-inner');
      return el && getComputedStyle(el).visibility === 'visible';
    }, { timeout: 5000 });
    check('advanced options expand', true);
    await page.screenshot({ path: `${SHOT_DIR}/advanced-open.png` });
    const focusableWhenOpen = await page.evaluate(() => {
      const panel = document.getElementById('advanced-options-panel');
      return panel?.querySelectorAll('input,button').length ?? 0;
    });
    check('advanced panel exposes controls', focusableWhenOpen > 0, `${focusableWhenOpen} controls`);
    await adv.click();
    await page.waitForFunction(() => {
      const el = document.querySelector('.sp-collapse-inner');
      return el && getComputedStyle(el).visibility === 'hidden';
    }, { timeout: 5000 });
    check('advanced options collapse', true);

    // Character options toggle
    const sym = page.getByLabel(/symbols/i);
    await sym.uncheck();
    await page.waitForFunction((prev) => document.querySelector('output')?.textContent !== prev, after, { timeout: 5000 });
    const pwNoSym = await page.locator('output').textContent();
    check('unchecking symbols regenerates', pwNoSym !== after);
    check('symbols excluded', !/[^A-Za-z0-9]/.test(pwNoSym?.trim() ?? 'x'));
    await sym.check();
    await page.waitForFunction((prev) => document.querySelector('output')?.textContent !== prev, pwNoSym, { timeout: 5000 });

    // Length slider
    await page.locator('#pw-length').fill('24');
    const lenVal = await page.locator('#pw-length-number').inputValue();
    check('slider syncs numeric input', lenVal === '24', `value=${lenVal}`);
    const pw24 = (await page.locator('output').textContent())?.trim() ?? '';
    check('length 24 applied', pw24.length === 24, `len=${pw24.length}`);

    // Mode tabs
    await page.getByRole('tab', { name: /pin/i }).click();
    await page.waitForFunction(() => /^\d+$/.test(document.querySelector('output')?.textContent?.trim() ?? ''), null, { timeout: 5000 });
    const pin = (await page.locator('output').textContent())?.trim() ?? '';
    check('PIN mode digits-only', /^\d+$/.test(pin), pin.slice(0, 12));
    await page.getByRole('tab', { name: /passphrase/i }).click();
    await page.waitForFunction(() => {
      const t = document.querySelector('output')?.textContent?.trim() ?? '';
      return t.includes('-') && /^[a-z-]+$/.test(t);
    }, null, { timeout: 5000 });
    const phrase = (await page.locator('output').textContent())?.trim() ?? '';
    check('passphrase mode', phrase.split('-').length >= 3 || phrase.split(' ').length >= 3, phrase.slice(0, 30));

    // Theme switcher persists + toggles class
    await page.getByRole('button', { name: /^dark theme$/i }).click();
    const darkOn = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    check('theme switch toggles dark class', darkOn);
    const stored = await page.evaluate(() => localStorage.getItem('securepass-theme'));
    check('theme preference persisted', stored === 'dark', `stored=${stored}`);
    await page.waitForTimeout(600); // let the 200ms theme transition settle
    await page.screenshot({ path: `${SHOT_DIR}/toggled-dark.png` });

    // Reveal toggle
    await page.getByRole('button', { name: /hide password/i }).click();
    const reveal = page.getByRole('button', { name: /show password/i });
    const pressed = await reveal.getAttribute('aria-pressed');
    const masked = await page.locator('output').textContent();
    check('reveal toggles masking', pressed === 'false' && /^•+$/.test(masked?.trim() ?? ''), (masked?.trim() ?? '').slice(0, 10));

    await ctx.close();
  }

  // ---- Reduced motion ----
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('output', { timeout: 15000 });
    const dur = await page.evaluate(() => {
      const el = document.querySelector('.sp-collapse');
      return el ? getComputedStyle(el).transitionDuration : 'n/a';
    });
    check('reduced motion disables transitions', dur === '0.01ms' || dur === '0s' || dur === '1e-05s', `duration=${dur}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length > 0) process.exit(1);
