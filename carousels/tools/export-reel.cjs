// Reel exporter — one continuous 1080x1920 silent H.264 MP4, plus a cover still
// and a still of every scene's finished state.
//
// Usage:
//   REEL=/path/to/index.html OUT=/path/to/export N=7 node export-reel.cjs
//
// Same poster frame rule as the carousel exporter: video recording begins the
// instant the page is created, so anything painted before the reel is composed
// becomes the cover Instagram shows before playback. Two things keep it clean:
//
//   1. The export CSS lives in <head>, so the chrome is stripped and the stage
//      is locked to 1080x1920 at FIRST paint, not after it.
//   2. window.__NO_AUTOPLAY holds the reel on a fully composed scene 1 until
//      the recorder has a settled frame, then calls window.__startReel().
//
// The reel deck needs these hooks (harmless defaults when absent):
//   window.__startReel = start;  window.__reelTotal = TOTAL;
//   if(!window.__NO_AUTOPLAY) start();
//
// Every scene's base CSS must render its FINISHED composition. Anything parked
// at opacity:0 or a stroke-dashoffset in a base rule shows up as an empty
// frame during the hold. Put the hidden value in the keyframes `from` instead.

const fs = require('fs');
const path = require('path');

function loadPlaywright() {
  try {
    return require('playwright');
  } catch (e) {
    const { createRequire } = require('module');
    const fromCwd = createRequire(path.join(process.cwd(), 'noop.js'));
    return fromCwd('playwright');
  }
}
const { chromium } = loadPlaywright();

const REEL = process.env.REEL;
const OUT = process.env.OUT;
const N = Number(process.env.N || 0);
const HOLD_MS = Number(process.env.HOLD_MS || 1000);   // static, composed scene 1
const TAIL_MS = Number(process.env.TAIL_MS || 500);    // beat after the last cue

if (!REEL || !OUT) {
  console.error('Set REEL and OUT. e.g. REEL=index.html OUT=./export node export-reel.cjs');
  process.exit(1);
}

const deck = fs.readFileSync(REEL, 'utf8');
for (const d of ['stills', 'videos', 'webm']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const EXPORT_CSS =
  'html,body{background:#000!important;overflow:hidden!important}' +
  'body{padding:0!important;margin:0!important}' +
  '.masthead,.controls,.replay,.hint,.caption{display:none!important}' +
  '.stagewrap{margin:0!important}' +
  '#stage{width:1080px!important;height:1920px!important;border:none!important;border-radius:0!important}' +
  '#frame{transform:none!important}';

function pageHtml(noAutoplay) {
  return '<!doctype html><html><head><meta charset="utf-8"><style>' + EXPORT_CSS +
    '</style><script>' +
    (noAutoplay ? 'window.__NO_AUTOPLAY=true;' : '') +
    '<\/script></head><body>' + deck + '</body></html>';
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'],
  });

  // ---- stills: cover frame plus the finished state of every scene ----
  {
    const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.setContent(pageHtml(true), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, 'stills', 'cover.png') });

    const count = N || await page.evaluate(() => document.querySelectorAll('.scene').length);
    for (let i = 0; i < count; i++) {
      await page.evaluate((k) => {
        document.querySelectorAll('.scene').forEach((s, j) => {
          s.classList.toggle('on', j === k);
          s.classList.remove('play');
        });
      }, i);
      await page.waitForTimeout(460);
      await page.screenshot({ path: path.join(OUT, 'stills', 'scene-' + String(i + 1).padStart(2, '0') + '.png') });
    }
    await ctx.close();
    console.log('stills: cover + ' + count + ' scenes');
  }

  // ---- video: one continuous take ----
  {
    const ctx = await browser.newContext({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
      recordVideo: { dir: path.join(OUT, 'webm'), size: { width: 1080, height: 1920 } },
    });
    const page = await ctx.newPage();
    await page.setContent(pageHtml(true), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(HOLD_MS);

    const total = await page.evaluate(() => {
      window.__startReel();
      return window.__reelTotal || 29000;
    });
    await page.waitForTimeout(total + TAIL_MS);

    const video = page.video();
    await ctx.close();
    const src = await video.path();
    fs.renameSync(src, path.join(OUT, 'webm', 'reel.webm'));
    console.log('video: reel.webm (' + ((total + HOLD_MS + TAIL_MS) / 1000).toFixed(1) + 's captured)');
  }

  await browser.close();
})();
