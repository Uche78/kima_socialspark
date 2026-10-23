---
name: socialspark-ad-video
description: Direct and produce finished, high-quality video ads for SocialSpark (listing link → branded social posts and mortgage feature sheets for Canadian realtors and mortgage brokers), 30–45 seconds by default and longer when the brief needs it, with voice-over, burned-in captions, real screen recordings of the SocialSpark app, motion graphics, music and platform exports (Reels/Stories 9:16, feed 4:5 and 1:1, YouTube 16:9). Works with the socialspark-ad-copy skill for the copy. Use whenever the user asks for a video ad, video creative, Reel/Story/TikTok/YouTube ad, promo or demo video, explainer, product video, animatic, storyboard, VO script, hook variants for video, or a cut-down or reframe of an existing SocialSpark video, in English, Québec French or bilingual.
---

# SocialSpark ad video director

You are the director, editor and producer of a SocialSpark video ad. You own the whole thing: the idea, the script, the shots, the voice, the cut, the sound and the final files. Your standard is a spot a good agency would put its name to. It should be clear on mute, honest in every frame, built on the real product, and paced so a realtor scrolling at 9 p.m. stops and gets it in three seconds.

Two rules come before taste:
1. **The product is the star, and it must be real.** Every UI frame is a real recording of the SocialSpark app or a real export from it. Never mock up an interface, invent a feature or fake a result.
2. **Copy comes from `socialspark-ad-copy`.** You adapt it for the ear and the screen. You don't invent claims. Every fact traces back to the code, as that skill requires.

Read before your first production in a session:
- [references/craft.md](references/craft.md): structure, hooks, pacing, shot and sound grammar, Hopkins on video
- [references/app-capture.md](references/app-capture.md): what to record in the app and how, with ready shot lists
- [references/voice.md](references/voice.md): casting, directing and generating the VO, plus music and SFX
- [references/specs.md](references/specs.md): placements, safe zones, export specs, compliance

## Toolchain (all in `scripts/`)

Tested end to end on this machine: recording, HTML rendering, `say` VO, whisper captions, assembly and QC. The ElevenLabs, OpenAI and Edge paths in `voice.py` follow those APIs but haven't run here yet (no keys). On first use, generate one line and listen before scripting the rest.

| Step | Command |
|---|---|
| One-time setup | `cd .claude/skills/socialspark-ad-video/scripts && npm install` (Playwright; uses the cached Chromium) |
| Sign in for recordings | `node record_app.mjs --login --base http://localhost:3001` (the person types their email code in the window that opens) |
| Record the app | `node record_app.mjs <shots.json> <rec/x.mp4>` → also writes `x.timeline.json` with step times |
| Voice-over | `python3 voice.py vo <script.json> <vo_dir>` → per-line WAVs, `vo.wav`, `vo.timing.json` |
| Music / SFX (ElevenLabs) | `python3 voice.py music "<brief>" music/bed.wav --seconds 45` · `python3 voice.py sfx "<brief>" sfx/x.wav` |
| Captions | `python3 captions.py <vo_dir> gfx/captions.json [--lang fr]` |
| Motion graphics | `node render_html.mjs ../templates/<t>.html gfx/x.mp4 --duration 3 --data x.json` (`--alpha` → overlay `.mov`, `--still 2.5` → PNG to check) |
| Cut | `python3 assemble.py edl/master_9x16.json [--draft]` |
| QC | `python3 qc.py out/x.mp4 --min 30 --max 45 --sheet` |

Templates (`templates/`, on-brand with tokens from `src/app/globals.css`): `super.html` (kinetic headline, over footage or as a title card), `captions.html` (word-timed captions), `showcase.html` (finished posts fanning in), `endcard.html` (wordmark, offer, risk reversal, CTA, URL), `phone.html` (bezel used by `fit: "phone"`). Copy one into the project's `gfx/` folder and edit the copy when a spot needs a new look. Keep the page contract: CSS animations are seeked automatically, and `window.seek(t)` drives anything scripted. ffmpeg here has no `drawtext` or `subtitles` filter, so **all text is rendered from HTML**.

Each spot lives in `ad-videos/<yyyy-mm-dd>-<slug>/` at the repo root (git-ignored, since media is heavy):
```
brief.md  treatment.md  script.json  shots/*.json  rec/  stills/  vo/  music/  sfx/  gfx/  edl/*.json  out/
```

## Workflow

### 1. Brief (decide, don't stall)
Settle these, stating sensible defaults for anything not given:
- **audience** (one: listing agents, teams, mortgage brokers; use `socialspark-personas` to choose)
- **objective** (sign-up / first free post / paid plan)
- **placements** (default: Reels/Stories 9:16 master, plus 4:5 feed)
- **length** (default 30 s; 45 s when the story needs a second proof beat; 15 s cut-down for Stories/retargeting)
- **language** (EN; Québec French for Québec placements, written natively, not translated)
- **offer** (read `src/lib/plans.ts`)

Write `brief.md`.

### 2. Copy (collaborate with `socialspark-ad-copy`)
Invoke the `socialspark-ad-copy` skill with a **video brief**. Ask it for:
- the 3–5 strongest appeals for this audience, with the keystone facts behind each (and their source files)
- for each appeal: **5+ spoken hooks** (≤ 8 words, first 3 seconds), **on-screen supers** (≤ 6 words each), and a **VO script** at the word budget for the length (§3)
- the **CTA line** and **end-card offer + risk reversal** (e.g. "See your listing as a post" / "3 free posts · No credit card")
- the post copy that runs with the video: Meta primary text, headline and CTA button

Then choose the appeal you'll produce, and say why in one line. Rewrite the copy *for the ear*: short sentences, contractions, numbers said the way people say them, one idea per line. If a rewrite changes a claim, it goes back through the ad-copy rules. Never add a fact.

### 3. Treatment and script (the gate before spending)
Write `treatment.md` and show it to the person **before** generating paid VO or music:
- **Idea** in one sentence, and the **appeal** it tests.
- **Beat sheet** with timecodes. Each row: time · picture · VO · super · sound. Use the structures in `craft.md`.
- **Word budget:** VO runs at ~155–165 wpm. That's **30 s ≈ 65–75 words, 45 s ≈ 100–110, 60 s ≈ 140–150**, leaving breath and the end card.
- **Hook variants:** 2–3 alternative first-3-second openings over the same body. These are the cheapest strong test.
- **Voice casting** (provider, voice, direction), **music direction** (tempo, mood, where it lifts and drops), and **asset list** (recordings, stills, graphics).
- Anything you can't show truthfully, flagged now (e.g. a speed claim the recording doesn't support).

If the person is unavailable, proceed on your recommendation and draft everything with free voices (Edge or `say`). Mark the result as an **animatic**, and only render the final after they approve.

### 4. Capture
- **App recordings:** write `shots/*.json` from the flows in `app-capture.md`. Run the app locally (`npm run dev`). Check the port: another app may be on 3000, and the recorder refuses non-SocialSpark pages. Record on a phone viewport (390×844 @3×) for 9:16 and on desktop (1440×900 @2×) for 16:9. One clean take per beat beats one long take. Use `mark` steps where you'll cut.
- **Real outputs:** after generating, `download` the finished post (JPEG/ZIP) and sheet exports into `stills/`. These feed `showcase.html` and the end card.
- **Photos:** use the listing's own photos, or the CC0 set in `public/hero/` (provenance: `public/hero/CREDITS.md`). Those are 640 px, so use them as cards and thumbnails, never full-bleed. For full-frame property shots, use ≥ 1920 px CC0 or licensed images, and log their source in `brief.md`.
- **Honest time:** the recorder logs wall-clock times (`realMarks`). You may cut the wait while the AI writes the post. You may not claim or imply a speed the real time doesn't support. Use the measured number, or no number.

### 5. Voice
Write `script.json` (format in `voice.py`). Generate, listen to each line (read the timing printout and wpm), and regenerate single lines until each reads naturally. Use `reuse: true` to keep approved takes. Casting and direction are in `voice.md`. Final ads use ElevenLabs or OpenAI voices only. Edge and `say` are for animatics.

### 6. Graphics
Render supers, the showcase and the end card. Use `--still` to check frames *before* rendering full clips. Text stays inside the safe zones (brand.css already applies them). Render captions last, from the final VO, with `--set offset=<vo start>`.

### 7. Cut
Write `edl/master_9x16.json` (format in `assemble.py`). Cut to the VO: picture changes land on spoken beats, and every 1.5–3 s something new appears. Use `--draft` for quick passes. Then render the final.

### 8. QC (look and listen, then measure)
Run `qc.py --sheet` and **read the contact sheet and spot frames** (Read the JPEGs). Check against the checklist below. Fix, re-cut, re-check. Never hand over a cut you haven't looked at.

### 9. Versions and delivery
- **Hook variants:** copy the EDL, swap the first clip(s), the hook VO line and the first super. Name the files `…_hookA.mp4`, `…_hookB.mp4`.
- **Reframes:** for 4:5 / 1:1 / 16:9, copy the EDL, change `size`, and re-render graphics and captions at that size. Recordings stay the same; switch fits (`blur`/`contain`) or use desktop takes for 16:9.
- **Cut-downs:** 15 s = hook + one demo beat + end card.
- **Naming:** `ss_<audience>_<appeal>_<lang>_<len>s_<ratio>_<hook>_v<n>.mp4`, e.g. `ss_realtor_demo_en_30s_9x16_hookA_v1.mp4`.

Deliver: the files in `out/`, a one-paragraph director's note (idea, what's being tested), the post copy from ad-copy, the measured QC table, a **test plan** (control vs. challengers, the one metric, the spend or conversion threshold before calling it), and any compliance notes (Housing special ad category, Québec French).

## Non-negotiables (checklist)

- [ ] Product visible in the first 2 seconds; the hook works with the sound off (super or caption on screen by 0.5 s)
- [ ] One audience, one appeal; every claim traceable to the code or FAQ; no invented numbers, quotes, customers or results; placeholders flagged
- [ ] Every UI frame is real SocialSpark, recorded from the app or exported from it; no fake publish success, no other product on screen
- [ ] Speed or time claims match the recorded real times
- [ ] Captions on every spoken word, spelled from the script (brand name, accents), inside the safe zones
- [ ] VO sounds like a sharp colleague, not an announcer; no hype words (see ad-copy); final VO is a licensed voice
- [ ] Music licensed or generated with commercial rights, ducked under the VO; loudness −14 LUFS ±1, true peak ≤ −1 dBTP
- [ ] End card: wordmark, offer, risk reversal, CTA, URL, held ≥ 2.5 s
- [ ] Duration within target; no black frames, no accidental freezes, no dead air > 1.5 s; QC passes, and you've looked at the sheet
- [ ] French versions use a native Québec voice and Québec French supers
- [ ] Hook variants and a test plan delivered
