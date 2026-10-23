#!/usr/bin/env python3
"""Word-timed caption groups for templates/captions.html.

  python3 captions.py <vo_dir> <out.json> [--lang en|fr] [--max-words 4] [--max-chars 24] [--no-whisper]

Reads <vo_dir>/vo.wav and vo.timing.json (from voice.py). Word times come from whisper
(cached `small` model); the words themselves always come from the script, so brand names and
French accents are spelled right. Without whisper, words are spread across each line by length.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def whisper_words(wav, lang):
    exe = shutil.which("whisper")
    if not exe:
        return None
    out = Path(tempfile.mkdtemp())
    r = subprocess.run([exe, str(wav), "--model", "small", "--language", lang, "--word_timestamps", "True",
                        "--output_format", "json", "--output_dir", str(out), "--fp16", "False"],
                       capture_output=True, text=True)
    files = list(out.glob("*.json"))
    if r.returncode != 0 or not files:
        print("whisper failed; using proportional timing", file=sys.stderr)
        return None
    data = json.loads(files[0].read_text())
    return [{"w": w["word"].strip(), "start": w["start"], "end": w["end"]}
            for seg in data["segments"] for w in seg.get("words", [])]


def proportional(line):
    words = line["text"].split()
    total = sum(len(w) + 1 for w in words)
    t, span, out = line["start"], line["end"] - line["start"], []
    for w in words:
        d = span * (len(w) + 1) / total
        out.append({"w": w, "start": round(t, 3), "end": round(t + d, 3)})
        t += d
    return out


def align(line, heard):
    """Script words with whisper times, when whisper heard the same number of words in this line."""
    words = line["text"].split()
    inside = [h for h in heard if h["start"] >= line["start"] - 0.15 and h["end"] <= line["end"] + 0.15]
    if len(inside) != len(words):
        return proportional(line)
    return [{"w": w, "start": round(h["start"], 3), "end": round(h["end"], 3)} for w, h in zip(words, inside)]


def group(words, max_words, max_chars):
    groups, cur = [], []
    for w in words:
        text = " ".join(x["w"] for x in cur + [w])
        if cur and (len(cur) >= max_words or len(text) > max_chars):
            groups.append(cur)
            cur = []
        cur.append(w)
        if re.search(r"[.!?;:,—]$", w["w"]):  # break on punctuation
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    return groups


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        sys.exit(__doc__)
    vo_dir, out = Path(a[0]), Path(a[1])
    opt = lambda k, d: a[a.index(k) + 1] if k in a else d
    lang = opt("--lang", "en")
    max_words, max_chars = int(opt("--max-words", 4)), int(opt("--max-chars", 24))
    timing = json.loads((vo_dir / "vo.timing.json").read_text())
    heard = None if "--no-whisper" in a else whisper_words(vo_dir / "vo.wav", lang)
    groups = []
    for line in timing["lines"]:
        words = align(line, heard) if heard else proportional(line)
        for g in group(words, max_words, max_chars):
            groups.append({"start": g[0]["start"], "end": g[-1]["end"], "words": g})
    # Hold each group until the next starts (no flicker), but not across long pauses.
    for i, g in enumerate(groups):
        nxt = groups[i + 1]["start"] if i + 1 < len(groups) else g["end"] + 0.4
        g["end"] = round(min(nxt, g["end"] + 0.5), 3)
    out.write_text(json.dumps({"groups": groups}, ensure_ascii=False, indent=1))
    print(f"{len(groups)} caption groups → {out} ({'whisper' if heard else 'proportional'} timing)")


if __name__ == "__main__":
    main()
