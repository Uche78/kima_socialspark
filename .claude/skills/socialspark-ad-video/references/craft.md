# Craft: directing a SocialSpark spot

## What this kind of ad has to do

A realtor or broker in a feed gives you about **1.5 seconds** before deciding to stay, usually with the sound off, on a phone, half-distracted. A social video ad is a salesman given three seconds at the door:
1. **Stop the thumb** (0–2 s) with a picture of the result or a scene they recognise, plus a line that names them.
2. **Prove it** (the middle) with the real product doing the real thing, which is Hopkins' sample. Demonstration beats description every time.
3. **Remove the risk and ask softly** (the end): free, no card, nothing posts without you. Then one clear action.

Sound-on is a bonus. Design every frame to work muted (supers and captions), then make the VO and music lift it for people who listen.

## Structures

Timecodes for a 30 s spot; scale proportionally. Use the length the story needs, not the maximum.

### A. Demonstration: the default and usually the winner
| Time | Beat | Picture | VO / super |
|---|---|---|---|
| 0–2.5 | Hook | The finished post filling the frame, or the listing link → post transformation in one move | Names the reader + the result: "Realtors: this post took one link." |
| 2.5–6 | Recognise | The pain *as it happens now*, shown lightly (a blank caption box, a 9:47 p.m. clock super). Never misery, never a stressed actor. | "Still writing listing captions at ten p.m.?" |
| 6–20 | Demo | Phone-framed app recording: paste link → photos pulled → Generate → post appears → swipe the carousel → template switch | Narrate what they're seeing, in their words. One action per line. |
| 20–25 | Pains taken | Punch-ins on the details: their headshot and colours, the caption in their voice, EN/FR toggle, "nothing posts until you click" | One keystone fact per shot |
| 25–30 | Offer + CTA | End card | "See your listing as a post. Three free posts, no credit card." |

### B. Before / after
Split-second contrast: a plain listing page (or a dull text-only post) → the SocialSpark post. Repeat 2–3 times across post types (Just Listed, Open House, Sold). The contrast does the selling, so keep the VO minimal.

### C. One listing, every post
Follow one listing through its life: Coming Soon → Just Listed → Open House → Price Reduced → Sold. Each is 3–4 s of real generated output, with a showcase fan at the end. Works for a "post every listing, every stage" appeal.

### D. Broker: the sheet that wins referrals
Hook: a finished co-branded feature sheet, with a super naming mortgage agents. Demo: listing → Sheet Builder → four down-payment scenarios appear → licence number and "rates as of" date called out → letter PDF and 9:16 story export. Close on referral value (the realtor partner's name on the sheet). Never show or speak a rate as an offer. The numbers on screen come from the app's own math with its disclaimer visible.

### E. Québec / bilingual
The same structures, made in French from the start, not dubbed. A strong beat: one tap switching the caption between English, Québec French and bilingual. Super: « En français québécois. Ou les deux. »

### Lengths
- **15 s:** hook (0–2) → one demo beat (2–11) → end card (11–15). For Stories and retargeting.
- **30 s:** structure A or B. The workhorse.
- **45 s:** A with two proof beats (e.g. voice-matching *and* EN/FR), or C. Use when the appeal needs proof the person won't believe from one beat.
- **60 s+:** only for a founder story (with a real founder and their real words) or a full walkthrough for retargeting warm audiences. Hopkins: the more you tell, the more you sell, *once you have their attention*. Long spots go to people who already clicked.

## Hooks

Write ten, shoot three, test two. A hook is the picture *and* the line together. Patterns that fit SocialSpark (copy comes from ad-copy; these are shapes):
- **Result first:** open on the gorgeous finished carousel. Super: "One listing link made this."
- **Timestamp:** "Listed 4:00. Posted 4:01." Only if the recorded real time supports it, otherwise use the measured time.
- **Call-out:** "Realtors in Ontario:" / "Mortgage agents:" over the product. Names the reader, as Hopkins did with "Hey there, Bill Jones".
- **Recognised moment:** the Canva tab, the blinking caption cursor, 10:12 p.m.
- **Curiosity, honestly paid off:** "Your listing photos are hiding a better post." The body must pay it off in the next 10 s.
- **The demonstration itself:** the paste → generate transformation as the first frame, no preamble.

Banned: logo intros, "Introducing…", stock footage of smiling people at laptops, countdowns, fake notifications, anything that looks like a system UI or an Instagram feature (Meta rejects it and viewers feel tricked).

## Pacing and editing

- **Cut to the voice.** Picture changes land on stressed words. Leave the first frame of a new shot exactly where the line's key noun begins.
- **Something new every 1.5–3 s:** a cut, a punch-in, a super or a UI change. Demo shots can run 4–5 s if the UI is visibly moving.
- **Never show waiting.** Spinners, page loads and AI generation get cut, or shown as a 0.5 s beat with a light super ("Writing your post…"). Use `speed` 1.5–2× for scrolls and typing that would otherwise drag, never on a moment the viewer needs to read.
- **Punch-ins guide the eye.** `zoom` 1.0 → 1.12–1.25 toward the thing the VO names (the caption, the headshot, the licence line). One punch-in per shot, eased, never whip zooms.
- **Transitions:** cuts by default. Use a 0.2–0.3 s `fade` into and out of the end card or between sections. No spins, no wipes, no glitch effects. They read as cheap and fight the product.
- **The cursor/tap is the actor.** It moves with purpose, pauses 0.2 s before a tap, and never wanders. If a shot needs the viewer to read, the cursor stays still.
- **Hold the end card ≥ 2.5 s** with the VO landing the CTA on it. The last frame should still read as the offer if a viewer pauses.

## Picture

- **Phone frame** (`fit: "phone"`) for app recordings in 9:16: it says "this is an app" instantly and leaves room for supers above and below. Use `blur` or `contain` when the full-bleed UI is the point.
- **Show their brand, not ours.** The most persuasive frame is a post with *the agent's* name, headshot and colours. Record with a profile that has realistic (permitted or fictional) branding filled in. Never use a real agent's identity without permission.
- **Finished work only.** Creative shows beautiful outputs, never empty states, errors or stressed people.
- **Brand look:** navy `#0f2a44`, gold `#d4a24c`, cream `#f3f1ec`; Montserrat for supers, Playfair Display for the wordmark and occasional serif lines, Inter for small text. Gold is the accent for one word per super, not a fill colour.
- **Supers:** ≤ 6 words, 1–2 lines, high contrast (a plate over footage), in the safe zones, on screen ≥ 1.2 s plus 0.3 s per word.

## Sound

- **VO** carries the logic; **music** carries the energy; **SFX** carry the UI. Mix VO first and duck the rest under it.
- **Music:** a modern, warm, mid-tempo bed (95–115 BPM), light percussion, no vocals, no dramatic swells. A small lift into the demo payoff and a clean button ending on the end card. Cut the music on a bar line at the end, don't fade it out mid-phrase when you can avoid it.
- **SFX:** sparing and soft. A tap tick on key taps, a gentle whoosh as the post appears, a paper slide as the showcase cards land. At most 4–6 in a 30 s spot.
- **Silence is a tool.** A 0.3–0.5 s gap before the payoff line makes it land.

## Hopkins, applied to video

- **Salesman test for every VO line:** would a good rep say it across a desk to one agent? Cut anything else.
- **Specific beats general:** show the actual post types, the actual languages, the measured time. Say "three free posts", not "try it free today!".
- **Sample it:** the demo *is* the sample, and the CTA offers the same sample ("See your listing as a post").
- **Pains taken:** close-ups of the details nobody else bothers with (your voice learned from past posts; Canadian mortgage rules; licence number on every sheet; data stored in Canada). They're surprising to the buyer even if they look ordinary to us.
- **Rewards, not fear:** end on the polished feed and the referrals, not on mistakes avoided.
- **Your taste isn't the test:** ship hook and appeal variants with a test plan; keep the winner as the control.

## Variants and testing

- **Test the hook first** (biggest lever): same body, 2–3 hooks. Metric: 3-second view rate / thumb-stop, then cost per sign-up.
- **Then the appeal** (demo vs. voice vs. bilingual), each a separate cut.
- **Then length** (15 vs. 30 vs. 45) for the winning appeal.
- Decide on **cost per sign-up** (or cost per first generated post) once each variant has enough conversions to read (state the threshold, e.g. ≥ 30 conversions or a set spend each). Winners stay as the control until beaten. When frequency rises and CTR falls, refresh the execution (new hook shot, new listing), not the appeal.
