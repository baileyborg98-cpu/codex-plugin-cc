# Master prompt — animated on-brand Instagram carousels

Paste everything below into a new session, add the script at the bottom.

---

Turn the script below into an animated Instagram carousel using my skills and brand system.

SKILLS TO USE
Use my carousel-post skill (Naked Hook + Curiosity Chain structure — hook slide,
one idea per slide, tease line at the bottom of each slide pulling into the next),
my baileys-dna-voice / bailey-content skills for voice (raw, direct, punchy short
lines, sentence case with full stops, swears naturally where it fits, no emoji,
endings hit hard), viral-content-bailey for the hook, and design skills for layout.

BRAND SYSTEM (Verto brand guidelines — follow exactly)
- Canvas: 1080×1350 (4:5), black #000000 ground (~80% of the design)
- Type: Montserrat only — Black 900 for headlines, SemiBold 600 for eyebrow
  labels (letterspaced uppercase), Regular 400 for support lines. White #FFFFFF.
- Accents: tan #CEB890 and #AB9370 only (~10%) — for eyebrows, key glowing words,
  and the animated graphics. Never more than one accent moment per slide.
- Effect: low-intensity neon glow (soft tan text-shadow) on ONE key word or line.
- Slide anatomy: eyebrow at top (e.g. "SWAP 1 OF 6 · CALORIES") → struck-through
  "kill" line (the old belief, dim, tan strikethrough) → bold white headline (the
  keep) → animated graphic zone → support line → tan tease line at the bottom.
- Photos (if attached): crop to 4:5, dim with a dark gradient shade so text
  stays readable, use as the hero slide and optionally the CTA slide bookend.

ANIMATION RULES
- ALL words stay completely still and readable at all times. Animate ONLY the
  graphic/diagram zone. Aesthetic, on-brand, tan-and-white motion.
- Each concept gets a purpose-built animated diagram that makes the idea visual:
  gauges filling, counters ticking up, timeline blocks sliding in, bars growing
  or dissolving, lines drawing across charts, tags popping in — that style.
- Photo slides get a slow cinematic Ken Burns zoom (unless told static).
- CTA slide: pulsing pill button. Default CTA is "Follow for more" unless the
  script has its own comment keyword — then keep the script's CTA.

EXPORT RULE — POSTER FRAMES (do not skip)
The first frame of every exported MP4 must be that slide's own content.
Video recording starts the instant the page is created, so if the deck loads on
slide 1 and only then navigates to the target slide, slide 1 becomes the poster
frame and viewers see a flash of the hook before every slide. To prevent it:
- Open the deck DIRECTLY on the target slide via a boot script in <head>
  (window.__START_SLIDE), so slide 1 is never painted.
- Put the export CSS in <head> too, so the chrome is stripped and the stage is
  locked to 1080x1350 at first paint rather than after load.
- The deck needs two hooks: `go(window.__START_SLIDE || 0);` and a first-play
  suppressor in `play()` keyed off `window.__NO_AUTOPLAY`.
- ALWAYS audit before delivering: extract frame 0 of every MP4 and confirm it
  shows that slide, not slide 1.
Reusable tooling lives in carousels/tools/ (export-carousel.js + finish-export.sh).

DELIVERABLES
1. Build it as a self-contained HTML deck (Montserrat embedded, swipe/arrows,
   replay button, caption card with copy button) and publish a live preview.
2. Render-test every slide in a headless browser and show the slides.
3. Export for posting: 1080×1350 PNG of every slide AND a ~7-second silent
   H.264 MP4 of every animated slide, then send the files individually in
   posting order for saving to camera roll (posting from mobile — Instagram
   carousels mix photos and videos, videos loop automatically).
4. Write the post caption in my voice, ending with the CTA.
5. Commit everything to the repo branch.

SCRIPT
[PASTE SCRIPT HERE]

PHOTOS (optional)
[ATTACH PHOTOS — say which is the hero, otherwise Claude picks]

---

# Standalone variant — no skills connected

Use this version in sessions without the skill library. Everything the skills
provide (voice, framework, hooks) is written in.

---

Turn the script below into an animated Instagram carousel. Follow every rule here exactly.

VOICE (write like me, Bailey)
- Raw, direct, motivational. Punchy short sentences mixed with the odd longer one.
- Sentence case with full stops. No emoji, no hashtags in slides, no corporate words.
- Swears naturally where it adds punch ("worth a damn", "not the same fucking thing").
- Dry asides land as their own beats ("Cool." / "That's it. That's the hack.").
- Talk TO the reader: "you", "your". Endings hit hard — the last line is the mic drop.
- Never sound like AI: no "unlock", "elevate", "game-changer", no rule-of-three fluff.

CAROUSEL STRUCTURE (scroll-stopping swipe framework)
- Slide 1 = naked hook: one bold claim, no context, big type. It must make someone
  stop mid-scroll ("Stop dieting harder." / "Everything you've been told about
  cheap flights is wrong.").
- One idea per slide. Never two.
- Curiosity chain: every slide ends with a short tan tease line pulling into the
  next slide ("the next one's even more wrong →", "here's what actually works →").
- Myth/fix content uses kill-and-keep: the old belief struck through and dim, the
  new rule as the bold headline.
- Second-to-last slide = the payoff/why. Last slide = CTA.
- CTA default: "Follow for more." + one voice line ("Your next cut is counting
  on it."). If my script has a comment keyword CTA, keep that instead.

BRAND SYSTEM (follow exactly — this is the Verto look)
- Canvas: 1080×1350 (4:5). Black #000000 ground (~80% of the design), subtle
  dark radial vignette so it isn't flat.
- Type: Montserrat ONLY — Black 900 headlines, SemiBold 600 for letterspaced
  uppercase eyebrow labels, Regular 400 support lines. White #FFFFFF text.
- Accents: tan #CEB890 (light) and #AB9370 (dark) only, ~10% of the design —
  eyebrows, one glowing key word, and the animated graphics. One accent moment
  per slide, no more.
- Effect: "low intensity neon" — a soft tan glow (layered text-shadow) on ONE
  key word or line per slide, gently pulsing.
- Slide anatomy top to bottom: eyebrow ("SWAP 1 OF 6 · CALORIES" style) →
  struck-through kill line (dim, tan strikethrough) → bold white headline →
  animated graphic zone → support line (white at ~70% opacity, 1.6 line-height)
  → tan uppercase tease line at the bottom.
- Photos (if attached): crop to 4:5, dark gradient shade over them so text is
  always readable, use as the hero slide and optionally bookend the CTA slide.

ANIMATION RULES
- Words NEVER move. All copy is static and readable the whole time. Motion lives
  only in the graphic/diagram zone.
- Every key concept gets a purpose-built animated diagram in the tan/white style:
  gauges filling, numbers counting up, timeline blocks sliding in one by one,
  bars growing or dissolving, dashed lines drawing across charts, tags and pills
  popping in with a glow. Make the animation SHOW the idea, not decorate it.
- Photo slides get a slow cinematic Ken Burns zoom unless I say static.
- CTA slide: pulsing pill button ("+ FOLLOW" style, tan outline, soft glow).

EXPORT RULE — POSTER FRAMES (do not skip)
The first frame of every exported MP4 must be that slide's own content.
Video recording starts the instant the page is created, so if the deck loads on
slide 1 and only then navigates to the target slide, slide 1 becomes the poster
frame and viewers see a flash of the hook before every slide. To prevent it:
- Open the deck DIRECTLY on the target slide via a boot script in <head>
  (window.__START_SLIDE), so slide 1 is never painted.
- Put the export CSS in <head> too, so the chrome is stripped and the stage is
  locked to 1080x1350 at first paint rather than after load.
- The deck needs two hooks: `go(window.__START_SLIDE || 0);` and a first-play
  suppressor in `play()` keyed off `window.__NO_AUTOPLAY`.
- ALWAYS audit before delivering: extract frame 0 of every MP4 and confirm it
  shows that slide, not slide 1.
Reusable tooling lives in carousels/tools/ (export-carousel.js + finish-export.sh).

DELIVERABLES
1. Self-contained HTML deck (embed Montserrat as a data URI — no CDN links),
   with swipe/arrow navigation, per-slide animation replay, and a caption card
   with a copy button. Publish a live preview.
2. Render-test every slide in a headless browser and show me each slide.
3. Export for posting: a 1080×1350 PNG of every slide AND a ~7-second silent
   H.264/MP4 (yuv420p, 30fps) of every animated slide. Send the files to me
   individually, named in posting order — I post from my phone, and Instagram
   carousels can mix photos and videos (videos loop automatically).
4. Write the post caption in my voice: hook line, the numbered takeaways, the
   why, then the CTA.

SCRIPT
[PASTE SCRIPT HERE]

PHOTOS (optional)
[ATTACH PHOTOS — tell Claude which one is the hero, or let it pick]
