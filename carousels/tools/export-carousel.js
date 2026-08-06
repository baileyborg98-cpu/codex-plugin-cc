// Carousel exporter — 1080x1350 stills + silent H.264 MP4s, one per slide.
//
// Usage:
//   DECK=/path/to/index.html OUT=/path/to/exportdir N=10 node export-carousel.js
//
// CRITICAL — the first frame of every MP4 must be its OWN slide.
// Video recording begins the instant the page is created, so anything the
// browser paints before we reach the target slide ends up as the poster frame
// (the still Instagram shows before playback). Two rules keep that clean:
//
//   1. The deck must open DIRECTLY on the target slide. A boot script in
//      <head> sets window.__START_SLIDE before the deck's own script runs, so
//      slide 1 is never painted. (Navigating after load = slide 1 bleed.)
//   2. The export CSS must also live in <head>, so the chrome is stripped and
//      the stage is locked to 1080x1350 at first paint — not after it.
//
// The deck needs two one-line hooks for this (harmless defaults when absent):
//   go(window.__START_SLIDE || 0);
//   function play(i){ if(window.__NO_AUTOPLAY){window.__NO_AUTOPLAY=false;return;} ... }
//
// Verify before delivering: extract frame 0 of every MP4 and confirm it shows
// that slide, not slide 1.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DECK = process.env.DECK;
const OUT = process.env.OUT;
const N = Number(process.env.N);
const HOLD_MS = Number(process.env.HOLD_MS || 1000);   // static, composed, correct slide
const RUN_MS = Number(process.env.RUN_MS || 7600);     // animation runtime captured

if (!DECK || !OUT || !N) {
  console.error('Set DECK, OUT and N. e.g. DECK=deck.html OUT=./export N=10 node export-carousel.js');
  process.exit(1);
}

const deck = fs.readFileSync(DECK, 'utf8');
for (const d of ['stills', 'videos', 'webm']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

function pageHtml(i) {
  return '<!doctype html><html><head><meta charset="utf-8"><style>' +
    'html,body{background:#000!important;overflow:hidden!important}' +
    'body{padding:0!important;margin:0!important}' +
    '.masthead,.controls,.replay,.hint,.caption{display:none!important}' +
    '.stagewrap{margin:0!important}' +
    '#stage{width:1080px!important;height:1350px!important;border:none!important;border-radius:0!important}' +
    '#frame{transform:none!important}' +
    '</style><script>' +
    'window.__START_SLIDE=' + i + ';window.__NO_AUTOPLAY=true;' +
    '<\/script></head><body>' + deck + '</body></html>';
}

const pad = (i) => String(i + 1).padStart(2, '0');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

  // Stills: composed slide with its animation settled.
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let i = 0; i < N; i++) {
    await page.setContent(pageHtml(i), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((k) => window.__go(k), i);
    await page.waitForTimeout(4600);
    await page.screenshot({ path: path.join(OUT, 'stills', `slide-${pad(i)}.png`) });
    console.log('still', i + 1);
  }
  await page.close();

  // Videos: one recording context per slide.
  for (let i = 0; i < N; i++) {
    const ctx = await browser.newContext({
      viewport: { width: 1080, height: 1350 },
      recordVideo: { dir: path.join(OUT, 'webm'), size: { width: 1080, height: 1350 } }
    });
    const vp = await ctx.newPage();
    await vp.setContent(pageHtml(i), { waitUntil: 'load' });
    await vp.evaluate(() => document.fonts.ready);
    await vp.waitForTimeout(HOLD_MS);
    await vp.evaluate((k) => window.__go(k), i);
    await vp.waitForTimeout(RUN_MS);
    const video = vp.video();
    await vp.close();
    const p = await video.path();
    await ctx.close();
    fs.renameSync(p, path.join(OUT, 'webm', `slide-${pad(i)}.webm`));
    console.log('video', i + 1);
  }

  await browser.close();
})();
