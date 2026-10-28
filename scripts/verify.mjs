/**
 * Runtime verification for the QUINTIX site.
 * Uses the system-installed Chrome (no browser download needed).
 *   node scripts/verify.mjs [url]
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const URL = process.argv[2] || 'http://localhost:5173/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

mkdirSync('screenshots', { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--window-size=1440,900',
  ],
});

const issues = [];
const notes = [];

const BENIGN = [/mailto/i, /Not allowed to launch/i, /Failed to launch/i, /external protocol/i];

function attachLogging(page, tag) {
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      const text = msg.text();
      if (BENIGN.some((re) => re.test(text))) return; // expected: headless can't open mail apps
      issues.push(`[${tag}][console.${type}] ${text}`);
    }
  });
  page.on('pageerror', (err) => issues.push(`[${tag}][pageerror] ${err.message}`));
  page.on('requestfailed', (req) => {
    const url = req.url();
    if (url.startsWith('data:')) return;
    if (BENIGN.some((re) => re.test(url) || re.test(req.failure()?.errorText || ''))) return;
    issues.push(`[${tag}][requestfailed] ${url} — ${req.failure()?.errorText}`);
  });
}

/* ---------------- DESKTOP ---------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  attachLogging(page, 'desktop');

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(3200); // preloader + hero intro

  const heroVisible = await page.evaluate(() => {
    const h1 = document.querySelector('.hero__title');
    if (!h1) return false;
    const rect = h1.getBoundingClientRect();
    return rect.width > 50 && rect.height > 20 && getComputedStyle(h1).opacity !== '0';
  });
  notes.push(`hero title visible: ${heroVisible}`);
  if (!heroVisible) issues.push('[desktop] hero title not visible after intro');

  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  notes.push(`canvases mounted (hero only so far): ${canvasCount}`);
  if (canvasCount < 1) issues.push('[desktop] no WebGL canvas mounted in hero');

  await page.screenshot({ path: 'screenshots/01-hero-desktop.png' });

  // Scroll the page the way a user would (Lenis listens to wheel events)
  const steps = 26;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel({ deltaY: 420 });
    await sleep(160);
  }
  await sleep(800);
  await page.screenshot({ path: 'screenshots/02-mid-desktop.png' });

  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel({ deltaY: 600 });
    await sleep(120);
  }
  await sleep(1200);
  await page.screenshot({ path: 'screenshots/03-bottom-desktop.png' });

  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    canvases: document.querySelectorAll('canvas').length,
    scrollY: window.scrollY,
    docHeight: document.documentElement.scrollHeight,
  }));
  notes.push(`layout: ${JSON.stringify(layout)}`);
  if (layout.scrollWidth > layout.clientWidth + 2) {
    issues.push(
      `[desktop] horizontal overflow: scrollWidth ${layout.scrollWidth} > clientWidth ${layout.clientWidth}`
    );
  }
  if (layout.canvases < 3) notes.push(`expected 3 canvases (hero, monolith, cta), got ${layout.canvases}`);

  // Section anchors present?
  const anchors = await page.evaluate(() =>
    ['top', 'manifesto', 'about', 'services', 'work', 'contact'].map((id) => ({
      id,
      exists: Boolean(document.getElementById(id)),
    }))
  );
  notes.push(`anchors: ${JSON.stringify(anchors)}`);
  anchors.filter((a) => !a.exists).forEach((a) => issues.push(`[desktop] missing section #${a.id}`));

  // Showcase filters
  const filterResult = await page.evaluate(async () => {
    const buttons = [...document.querySelectorAll('.filter-btn')];
    const fitness = buttons.find((b) => b.textContent.trim() === 'Fitness');
    fitness?.click();
    await new Promise((r) => setTimeout(r, 500));
    const countFitness = document.querySelectorAll('.project').length;
    const all = buttons.find((b) => b.textContent.trim() === 'All');
    all?.click();
    await new Promise((r) => setTimeout(r, 500));
    const countAll = document.querySelectorAll('.project').length;
    return { countFitness, countAll, totalButtons: buttons.length };
  });
  notes.push(`filters: ${JSON.stringify(filterResult)}`);
  if (filterResult.countFitness !== 1) issues.push('[desktop] Fitness filter should show exactly 1 project');
  if (filterResult.countAll !== 3) issues.push('[desktop] All filter should show 3 projects');

  // Inquiry form validation
  await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
  await sleep(1000);

  const emptySubmit = await page.evaluate(() => {
    const form = document.querySelector('.inquiry__form');
    form?.querySelector('button[type="submit"]')?.click();
    return new Promise((r) =>
      setTimeout(
        () =>
          r({
            errorCount: document.querySelectorAll('.field.has-error').length,
            focused: document.activeElement?.name || null,
          }),
        300
      )
    );
  });
  notes.push(`empty submit -> ${JSON.stringify(emptySubmit)}`);
  if (emptySubmit.errorCount !== 4) issues.push('[desktop] expected 4 validation errors on empty submit');

  const invalidEmail = await page.evaluate(async () => {
    const set = (name, value) => {
      const el = document.querySelector(`[name="${name}"]`);
      const setter = Object.getOwnPropertyDescriptor(
        name === 'details' ? HTMLTextAreaElement.prototype : name === 'businessType' ? HTMLSelectElement.prototype : HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(el, value);
      // React listens to `change` on selects and `input` on text fields.
      el.dispatchEvent(new Event(name === 'businessType' ? 'change' : 'input', { bubbles: true }));
    };
    set('name', 'Test User');
    set('businessType', 'Fitness');
    set('email', 'not-an-email');
    set('details', 'We run a boutique gym and need reels.');
    document.querySelector('.inquiry__form button[type="submit"]').click();
    await new Promise((r) => setTimeout(r, 300));
    return {
      emailError: document.querySelector('#email-error')?.textContent?.trim() || '',
    };
  });
  notes.push(`invalid email -> "${invalidEmail.emailError}"`);
  if (!invalidEmail.emailError) issues.push('[desktop] no email validation error shown for invalid email');

  const validSubmit = await page.evaluate(async () => {
    const el = document.querySelector('[name="email"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(el, 'hello@brand.com');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.inquiry__form button[type="submit"]').click();
    await new Promise((r) => setTimeout(r, 900));
    return {
      status: document.querySelector('.inquiry__status')?.className || 'none',
      text: document.querySelector('.inquiry__status')?.textContent?.slice(0, 80) || '',
    };
  });
  notes.push(`valid submit -> ${JSON.stringify(validSubmit)}`);
  if (!validSubmit.status.includes('success')) issues.push('[desktop] valid submit did not reach success state');
  await page.screenshot({ path: 'screenshots/04-form-desktop.png' });

  // Contact links sanity
  const links = await page.evaluate(() => {
    const pick = (sel) => [...document.querySelectorAll(sel)].map((a) => a.getAttribute('href'));
    return {
      instagram: pick('a[href*="instagram.com/quintix_studio"]'),
      mailto: pick('a[href^="mailto:"]'),
      wa: pick('a[href*="wa.me/"]'),
    };
  });
  notes.push(
    `links -> instagram:${links.instagram.length} mailto:${links.mailto.length} whatsapp:${links.wa.length}`
  );
  if (!links.instagram.length) issues.push('[desktop] instagram link missing');
  if (!links.wa.length) issues.push('[desktop] whatsapp links missing');
  if (!links.mailto.length) issues.push('[desktop] mailto link missing');
  const badWa = links.wa.filter((h) => !/^https:\/\/wa\.me\/\d{10,15}/.test(h));
  if (badWa.length) issues.push(`[desktop] malformed wa.me links: ${badWa.join(', ')}`);

  await page.close();
}

/* ---------------- MOBILE ---------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  attachLogging(page, 'mobile');

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(3200);
  await page.screenshot({ path: 'screenshots/05-hero-mobile.png' });

  const mobileLayout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  notes.push(`mobile layout: ${JSON.stringify(mobileLayout)}`);
  if (mobileLayout.scrollWidth > mobileLayout.clientWidth + 2) {
    issues.push(
      `[mobile] horizontal overflow: ${mobileLayout.scrollWidth} > ${mobileLayout.clientWidth}`
    );
  }

  // Mobile menu
  const menuOpen = await page.evaluate(async () => {
    const toggle = document.querySelector('.nav__toggle');
    if (!toggle) return false;
    toggle.click();
    await new Promise((r) => setTimeout(r, 700));
    return document.querySelector('.menu')?.classList.contains('is-open');
  });
  await page.screenshot({ path: 'screenshots/06-menu-mobile.png' });

  const menuClosed = await page.evaluate(async () => {
    document.querySelector('.menu__link')?.click();
    await new Promise((r) => setTimeout(r, 900));
    return !document.querySelector('.menu')?.classList.contains('is-open');
  });
  const menuState = { open: menuOpen, closed: menuClosed };
  notes.push(`mobile menu: ${JSON.stringify(menuState)}`);
  if (!menuState.open) issues.push('[mobile] menu did not open');
  if (!menuState.closed) issues.push('[mobile] menu did not close after link click');

  // Scroll through on mobile
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel({ deltaY: 700 });
    await sleep(90);
  }
  await sleep(1000);
  await page.screenshot({ path: 'screenshots/07-bottom-mobile.png' });

  const finalOverflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (finalOverflow.scrollWidth > finalOverflow.clientWidth + 2) {
    issues.push(`[mobile] overflow after scroll: ${finalOverflow.scrollWidth} > ${finalOverflow.clientWidth}`);
  }

  await page.close();
}

/* ---------------- REDUCED MOTION ---------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  attachLogging(page, 'reduced');

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(1800);

  const state = await page.evaluate(() => {
    const title = document.querySelector('.hero__title');
    const style = title ? getComputedStyle(title) : null;
    return {
      titleVisible: Boolean(title) && style.opacity !== '0' && title.getBoundingClientRect().height > 20,
      preloaderGone: !document.querySelector('.preloader'),
      tickerAnimation: getComputedStyle(document.querySelector('.ticker__track')).animationName,
    };
  });
  notes.push(`reduced motion: ${JSON.stringify(state)}`);
  if (!state.titleVisible) issues.push('[reduced] hero title hidden with reduced motion');
  if (!state.preloaderGone) issues.push('[reduced] preloader stuck with reduced motion');
  await page.screenshot({ path: 'screenshots/08-reduced-motion.png' });
  await page.close();
}

/* ---------------- WEBGL BLOCKED (fallback check) ---------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (String(type).includes('webgl')) return null;
      return original.call(this, type, ...args);
    };
  });
  attachLogging(page, 'no-webgl');
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(3400);

  const fallbackState = await page.evaluate(() => ({
    fallbacks: document.querySelectorAll('.webgl-fallback').length,
    heroText: document.querySelector('.hero__title')?.textContent?.trim().slice(0, 40) || '',
    preloaderGone: !document.querySelector('.preloader'),
  }));
  notes.push(`no-webgl: ${JSON.stringify(fallbackState)}`);
  if (fallbackState.fallbacks < 1) issues.push('[no-webgl] CSS fallback did not render');
  if (!fallbackState.preloaderGone) issues.push('[no-webgl] preloader stuck');
  await page.screenshot({ path: 'screenshots/09-no-webgl.png' });
  await page.close();
}

await browser.close();

console.log('\n===== NOTES =====');
notes.forEach((n) => console.log(' •', n));
console.log('\n===== ISSUES =====');
if (issues.length === 0) console.log(' ✅ none');
else issues.forEach((i) => console.log(' ✗', i));
console.log(`\nTotal issues: ${issues.length}`);
process.exit(issues.length ? 1 : 0);
