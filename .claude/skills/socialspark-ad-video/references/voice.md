# Voice, music and sound

## Casting the VO

The voice is SocialSpark's salesman. Cast a **warm, confident Canadian colleague in their 30s–40s**: the sharpest agent in the office telling you a shortcut. Not an announcer, not a hype reader, not a robot-perfect narrator.

| Audience | Default direction |
|---|---|
| Listing agents (EN) | Friendly, quick, a little wry. Smiles on "that's it". |
| Mortgage brokers (EN) | Calm and precise, professional but not stiff. Trustworthy on the compliance lines. |
| Québec (FR) | A native Québec French voice with a natural Québec accent and rhythm, never a European French voice. Warm and direct. |
| Bilingual | Two voices (EN, then FR) or one fluently bilingual Québec voice. Mention bilingual in the copy only if the spot really shows it. |

Pick 2–3 candidates and generate the **hook line and the CTA line** with each. Choose by ear on those two lines, then generate the rest.

## Providers (`scripts/voice.py`)

| Provider | Use | Notes |
|---|---|---|
| `elevenlabs` | **Final ads (preferred)** | `ELEVENLABS_API_KEY`. Model `eleven_multilingual_v2` (most natural; FR as well). Commercial use needs a paid plan. Pick voices from `python3 voice.py voices`, filtering for Canadian/North American accents and, for French, `fr-CA`/Québécois voices from the Voice Library. Neighbouring lines are passed as context so intonation flows across takes. |
| `openai` | Final ads (alternative) | `OPENAI_API_KEY`. `gpt-4o-mini-tts` takes free-text `instructions`, which is good for directing tone ("smile on the last line, relaxed pace"). Voices: coral, sage, ash, ballad, verse, etc. |
| `edge` | **Drafts / animatics only** | Free neural voices: `en-CA-ClaraNeural`, `en-CA-LiamNeural`, `fr-CA-SylvieNeural`, `fr-CA-JeanNeural`, `fr-CA-AntoineNeural`, `fr-CA-ThierryNeural`. `pipx install edge-tts`. No commercial licence, so never ship it. |
| `say` | Animatic timing only | macOS voices (`Samantha`; `Amélie` for fr_CA). Robotic, so use it to time the cut, never for review with a client. |

If no paid key is set, draft with `edge` (or `say`), deliver the animatic, and tell the person which key to add (`ELEVENLABS_API_KEY` or `OPENAI_API_KEY` in `.env.local`) for the final.

Starting settings for ElevenLabs: `stability 0.40–0.50` (lower = more expressive, less consistent), `similarity_boost 0.75–0.85`, `style 0.15–0.35`, `speed 1.0–1.08`. If a read sounds sing-song, raise stability. If it's flat, lower it and raise style.

## Writing for the ear

- **Pace:** 155–165 wpm for EN, about 10% slower for FR (French runs longer: budget ~15% more time per line). `voice.py` prints wpm. Over 175 sounds rushed, under 140 drags.
- **One idea per line**, 4–12 words. Each line is one take with its own `pause_after` (0.2–0.4 s usually; 0.5 s before a payoff).
- **Write numbers as spoken:** "four p.m.", "three free posts", "fourteen ninety-nine a month" (plus tax on screen). Keep the digits on screen.
- **Pronunciation:**
  - SocialSpark: one word, stress on both halves ("SOH-shul-spark"). If a voice says "Social Spark" with a long gap, write "SocialSpark" and regenerate, or try "Social-Spark".
  - Québec in English: "kay-BECK" (write "Kebec" only if a voice gets it wrong).
  - CMHC: letters ("C-M-H-C").
  - URL: say "socialspark dot usekima dot com" only if the brief needs it spoken; usually it's on the end card only.
  - Realtor: "REEL-ter", never "REE-luh-ter". REALTOR® is a trademark, so prefer "agents" or "realtors" in lower case in supers.
- **Contractions and plain words:** "you'll", "that's it", "no card". Read every line aloud in your head. If it sounds written, rewrite it.
- **No hype words** (game-changing, effortless, unlock, supercharge, seamless, elevate).

## Directing takes

Generate, then judge each line by the timing printout and by listening (play it with `afplay vo/02_demo.wav`, or ask the person to). Regenerate single lines, and set `"reuse": true` on approved lines so they're kept. Common fixes:
- Rushed line: split it in two, or add a comma.
- Wrong stress: italicise in your head and rephrase so the stressed word comes last ("It writes the caption in *your* voice" → "The caption? It's in your voice.").
- Flat CTA: give it its own line with a 0.4 s pause before it.

## Music

Sources, best first:
1. A **licensed track** the person provides (Artlist, Epidemic Sound, Musicbed, or the platform's commercial library). Log the licence in `brief.md`.
2. **ElevenLabs Music**: `python3 voice.py music "<prompt>" music/bed.wav --seconds 45`, on a plan whose terms allow commercial use. Verify current terms before shipping. Prompt with tempo, instruments, mood and structure, e.g. *"Warm modern instrumental, 104 BPM, soft electric piano, light claps and kick, optimistic and confident, gentle lift at 0:18, clean ending at 0:30, no vocals."*
3. **Meta's Sound Collection** or YouTube Audio Library tracks cleared for ads, downloaded by the person.

Never use commercial songs, trending audio or anything without ad rights. In the EDL, music sits at `gain_db` −16 to −20 with `duck: true`. Check that the VO is clearly on top on phone speakers.

## Sound effects

`python3 voice.py sfx "soft UI tap, short, clean" sfx/tap.wav --seconds 0.5`, or "gentle airy whoosh", "paper card sliding onto a table". Place them in `audio.sfx` at −8 to −14 dB. Keep 4–6 per 30 s spot, all quiet, all motivated by something on screen.

## Mix targets

- Integrated loudness **−14 LUFS** (±1), true peak **≤ −1 dBTP**. `assemble.py` normalises in two passes and `qc.py` measures.
- The VO peaks clearly above the music. No VO in the first 0.1 s (it clicks); first sound by 0.3–0.5 s.
- The end card has the VO CTA plus music ending. Let the last 0.3 s breathe.
