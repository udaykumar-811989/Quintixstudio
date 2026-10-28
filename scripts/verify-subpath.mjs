/**
 * Verify the production build works when hosted under a sub-path,
 * exactly like GitHub Pages: http://localhost:4174/Quintixstudio/
 */
import puppeteer from 'puppeteer-core';

const URL = 'http://localhost:4174/Quintixstudio/';
console.log('launching browser…');
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});

const issues = [];
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on('console', (m) => {
  if ((m.type() === 'error' || m.type() === 'warning') && !/mailto|launch/i.test(m.text()))
    issues.push(`[console.${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => issues.push('[pageerror] ' + e.message));
page.on('requestfailed', (r) => {
  if (!/mailto/i.test(r.url())) issues.push('[requestfailed] ' + r.url() + ' — ' + r.failure()?.errorText);
});
page.on('response', (r) => {
  if (r.status() >= 400) issues.push(`[http ${r.status()}] ${r.url()}`);
});

console.log('navigating…');
await page
  .goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 })
  .catch((e) => issues.push('[goto] ' + e.message));
console.log('loaded, waiting for intro…');
await new Promise((r) => setTimeout(r, 4500));

console.log('scrolling to showcase (lazy images)…');
await page.evaluate(() => document.getElementById('work')?.scrollIntoView({ block: 'center' }));
await new Promise((r) => setTimeout(r, 2500));

console.log('measuring state…');
const state = await page.evaluate(async () => {
  const imgs = [...document.querySelectorAll('.project__media img')];
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((res) => {
            const done = () => res();
            img.onload = done;
            img.onerror = done;
            setTimeout(done, 5000); // never hang
          })
    )
  );
  return {
    heroVisible: document.querySelector('.hero__title')?.getBoundingClientRect().height > 20,
    canvases: document.querySelectorAll('canvas').length,
    preloaderGone: !document.querySelector('.preloader'),
    images: imgs.map((i) => ({
      src: i.getAttribute('src'),
      ok: i.naturalWidth > 0,
      w: i.naturalWidth,
      currentSrc: i.currentSrc.split('/').slice(-1)[0],
    })),
    favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
    cssLoaded: [...document.styleSheets].length,
    docHeight: document.documentElement.scrollHeight,
  };
});

console.log('=== SUB-PATH BUILD STATE ===');
console.log(JSON.stringify(state, null, 2));

// Scroll through to make sure lazy 3D + scroll triggers are fine
for (let i = 0; i < 20; i++) {
  await page.mouse.wheel({ deltaY: 800 });
  await new Promise((r) => setTimeout(r, 110));
}
await new Promise((r) => setTimeout(r, 1000));

const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  scrollY: Math.round(window.scrollY),
}));
console.log('scroll:', JSON.stringify(overflow));

await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: 'screenshots/subpath-hero.png' });

await browser.close();

console.log('\n=== ISSUES ===');
if (!issues.length) console.log('✅ none');
else issues.forEach((i) => console.log('✗', i));
process.exit(issues.length ? 1 : 0);
