#!/usr/bin/env python3
"""Voice-over, music and sound effects for SocialSpark ad videos.

  python3 voice.py vo <script.json> <out_dir>
      One WAV per line + vo.wav (all lines with their pauses) + vo.timing.json.
  python3 voice.py voices [elevenlabs|edge]
      List available voices.
  python3 voice.py sfx "<description>" <out.wav> [--seconds 1.5]          (ElevenLabs)
  python3 voice.py music "<description>" <out.wav> [--seconds 40]         (ElevenLabs)

script.json:
{
  "voice": {
    "provider": "elevenlabs" | "openai" | "edge" | "say",
    "voice": "<voice id or name>",
    "model": "eleven_multilingual_v2",          # elevenlabs; "gpt-4o-mini-tts" for openai
    "settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25, "speed": 1.0},
    "instructions": "Warm, confident Canadian colleague. Conversational, not an announcer.",  # openai
    "rate": "+0%"                                 # edge
  },
  "lead_in": 0.25,                                # silence before the first line (s)
  "lines": [
    {"id": "hook", "text": "Just listed at four p.m.?", "pause_after": 0.25},
    {"id": "demo", "text": "Paste the link. That's it.", "pause_after": 0.4,
     "next_text": "optional: what follows in the cut, for intonation", "reuse": false}
  ]
}

Keys come from the environment or the repo's .env.local: ELEVENLABS_API_KEY, OPENAI_API_KEY.
Licensing: ElevenLabs (paid plan) and OpenAI output may be used in ads. Edge voices and macOS
`say` are for drafts and animatics only — never ship them in a paid ad.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
SR = 48000


def env(name):
    if os.environ.get(name):
        return os.environ[name]
    f = REPO / ".env.local"
    if f.exists():
        for line in f.read_text().splitlines():
            if line.startswith(name + "="):
                v = line.split("=", 1)[1].strip().strip('"').strip("'")
                if v:
                    return v
    return None


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def to_wav(src, dst):
    ff("-i", str(src), "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(dst))


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def post(url, headers, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", **headers})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"{url}: HTTP {e.code} {e.read().decode(errors='replace')[:500]}")


def tts_elevenlabs(text, v, out, prev_text=None, next_text=None):
    key = env("ELEVENLABS_API_KEY") or sys.exit("ELEVENLABS_API_KEY is not set (env or .env.local).")
    s = {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True, **v.get("settings", {})}
    body = {"text": text, "model_id": v.get("model", "eleven_multilingual_v2"), "voice_settings": s}
    # Context from neighbouring lines keeps intonation continuous across separate takes.
    if prev_text:
        body["previous_text"] = prev_text
    if next_text:
        body["next_text"] = next_text
    if v.get("language"):
        body["language_code"] = v["language"]
    # mp3_44100_128 works on every tier; Creator+ can set "format": "mp3_44100_192" or "pcm_44100".
    fmt = v.get("format", "mp3_44100_128")
    mp3 = post(f"https://api.elevenlabs.io/v1/text-to-speech/{v['voice']}?output_format={fmt}",
               {"xi-api-key": key}, body)
    tmp = Path(tempfile.mkstemp(suffix=".mp3")[1])
    tmp.write_bytes(mp3)
    to_wav(tmp, out)
    tmp.unlink()


def tts_openai(text, v, out, **_):
    key = env("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY is not set (env or .env.local).")
    body = {"model": v.get("model", "gpt-4o-mini-tts"), "voice": v.get("voice", "coral"), "input": text,
            "response_format": "wav"}
    if v.get("instructions"):
        body["instructions"] = v["instructions"]
    if v.get("settings", {}).get("speed"):
        body["speed"] = v["settings"]["speed"]
    wav = post("https://api.openai.com/v1/audio/speech", {"Authorization": f"Bearer {key}"}, body)
    tmp = Path(tempfile.mkstemp(suffix=".wav")[1])
    tmp.write_bytes(wav)
    to_wav(tmp, out)
    tmp.unlink()


def tts_edge(text, v, out, **_):
    exe = shutil.which("edge-tts") or sys.exit("edge-tts not installed: pipx install edge-tts (drafts only).")
    tmp = Path(tempfile.mkstemp(suffix=".mp3")[1])
    subprocess.run([exe, "--voice", v.get("voice", "en-CA-ClaraNeural"), f"--rate={v.get('rate', '+0%')}",
                    "--text", text, "--write-media", str(tmp)], check=True, capture_output=True)
    to_wav(tmp, out)
    tmp.unlink()


def tts_say(text, v, out, **_):
    tmp = Path(tempfile.mkstemp(suffix=".aiff")[1])
    cmd = ["say", "-o", str(tmp)]
    if v.get("voice"):
        cmd += ["-v", v["voice"]]
    if v.get("rate"):
        cmd += ["-r", str(v["rate"])]
    subprocess.run(cmd + [text], check=True)
    to_wav(tmp, out)
    tmp.unlink()


PROVIDERS = {"elevenlabs": tts_elevenlabs, "openai": tts_openai, "edge": tts_edge, "say": tts_say}


def trim_silence(path):
    """Trim leading/trailing silence so pauses are exactly what the script asks for."""
    tmp = path.with_suffix(".trim.wav")
    f = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,"
         "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse")
    ff("-i", str(path), "-af", f, str(tmp))
    tmp.replace(path)


def cmd_vo(script_path, out_dir):
    script = json.loads(Path(script_path).read_text())
    v = script["voice"]
    fn = PROVIDERS.get(v["provider"]) or sys.exit(f"unknown provider {v['provider']}")
    if v["provider"] in ("edge", "say"):
        print(f"NOTE: {v['provider']} voices are for drafts/animatics only, not for a paid ad.")
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    lines = script["lines"]
    timing, parts = [], []
    t = float(script.get("lead_in", 0.25))
    if t > 0:
        sil = out / "_lead.wav"
        ff("-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono", "-t", str(t), str(sil))
        parts.append(sil)
    for i, line in enumerate(lines):
        wav = out / f"{i:02d}_{line['id']}.wav"
        if line.get("reuse") and wav.exists():
            pass  # keep an approved take
        else:
            # Context for intonation: neighbouring lines, or explicit prev_text/next_text (e.g. a hook
            # generated on its own but cut in front of the shared body).
            fn(line["text"], v, wav,
               prev_text=line.get("prev_text") or (lines[i - 1]["text"] if i else None),
               next_text=line.get("next_text") or (lines[i + 1]["text"] if i + 1 < len(lines) else None))
            trim_silence(wav)
        d = duration(wav)
        timing.append({"id": line["id"], "text": line["text"], "start": round(t, 3), "end": round(t + d, 3), "file": wav.name})
        parts.append(wav)
        t += d
        gap = float(line.get("pause_after", 0.3))
        if gap > 0 and i + 1 < len(lines):
            sil = out / f"_gap{i:02d}.wav"
            ff("-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono", "-t", str(gap), str(sil))
            parts.append(sil)
            t += gap
    lst = out / "_concat.txt"
    lst.write_text("".join(f"file '{p.resolve()}'\n" for p in parts))
    ff("-f", "concat", "-safe", "0", "-i", str(lst), "-c:a", "pcm_s16le", str(out / "vo.wav"))
    for p in out.glob("_*"):
        p.unlink()
    words = sum(len(l["text"].split()) for l in lines)
    (out / "vo.timing.json").write_text(json.dumps({"duration": round(t, 3), "words": words, "lines": timing}, indent=2))
    print(f"vo.wav: {t:.2f}s, {words} words, {words / t * 60:.0f} wpm (aim for 150–170)")
    for x in timing:
        print(f"  {x['start']:6.2f}–{x['end']:6.2f}  {x['id']}: {x['text']}")


def cmd_voices(provider="elevenlabs"):
    if provider == "edge":
        exe = shutil.which("edge-tts") or sys.exit("edge-tts not installed")
        out = subprocess.run([exe, "--list-voices"], capture_output=True, text=True).stdout
        print("\n".join(l for l in out.splitlines() if "en-CA" in l or "fr-CA" in l or l.startswith("Name")))
        return
    key = env("ELEVENLABS_API_KEY") or sys.exit("ELEVENLABS_API_KEY is not set.")
    req = urllib.request.Request("https://api.elevenlabs.io/v1/voices", headers={"xi-api-key": key})
    for vc in json.loads(urllib.request.urlopen(req).read())["voices"]:
        labels = ", ".join(f"{k}={v}" for k, v in (vc.get("labels") or {}).items())
        print(f"{vc['voice_id']}  {vc['name']:<24} {labels}")


def cmd_generate(kind, prompt, out, seconds):
    key = env("ELEVENLABS_API_KEY") or sys.exit("ELEVENLABS_API_KEY is not set.")
    if kind == "sfx":
        audio = post("https://api.elevenlabs.io/v1/sound-generation", {"xi-api-key": key},
                     {"text": prompt, "duration_seconds": seconds})
    else:
        audio = post("https://api.elevenlabs.io/v1/music", {"xi-api-key": key},
                     {"prompt": prompt, "music_length_ms": int(seconds * 1000)})
    tmp = Path(tempfile.mkstemp(suffix=".mp3")[1])
    tmp.write_bytes(audio)
    ff("-i", str(tmp), "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", out)
    tmp.unlink()
    print(f"{kind}: {out} ({duration(out):.2f}s)")


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    secs = float(a[a.index("--seconds") + 1]) if "--seconds" in a else None
    if a[0] == "vo":
        cmd_vo(a[1], a[2])
    elif a[0] == "voices":
        cmd_voices(a[1] if len(a) > 1 else "elevenlabs")
    elif a[0] in ("sfx", "music"):
        cmd_generate(a[0], a[1], a[2], secs or (1.5 if a[0] == "sfx" else 40))
    else:
        sys.exit(__doc__)
