#!/usr/bin/env python3
"""Technical QC for a finished ad, plus frames to look at.

  python3 qc.py <video.mp4> [--min 30 --max 45] [--lufs -14] [--frames 0,1.5,3,...] [--sheet]

Checks: codec/size/fps, duration window, integrated loudness and true peak, black frames,
frozen stretches, silence in the first second (the hook must be heard), VO running past the end.
--sheet writes <video>.sheet.jpg: one frame per second in a grid, to review the cut at a glance.
Exit code 1 if any FAIL.
"""
import json
import re
import subprocess
import sys
from pathlib import Path


def ffprobe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
                       capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def ff_log(*args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True).stderr


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__)
    path = Path(a[0])
    opt = lambda k, d: a[a.index(k) + 1] if k in a else d
    lo, hi, lufs = float(opt("--min", 15)), float(opt("--max", 60)), float(opt("--lufs", -14))
    results = []
    ok = lambda name, cond, detail, warn=False: results.append(("PASS" if cond else ("WARN" if warn else "FAIL"), name, detail))

    info = ffprobe(path)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    au = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    dur = float(info["format"]["duration"])
    w, h = int(v["width"]), int(v["height"])
    num, den = map(int, v["r_frame_rate"].split("/"))
    fps = num / den
    ok("video codec", v["codec_name"] == "h264" and v.get("pix_fmt") == "yuv420p", f"{v['codec_name']} {v.get('pix_fmt')}")
    ok("resolution", (w, h) in {(1080, 1920), (1080, 1350), (1080, 1080), (1920, 1080)}, f"{w}×{h}", warn=True)
    ok("frame rate", abs(fps - 30) < 0.1 or abs(fps - 25) < 0.1 or abs(fps - 24) < 0.1, f"{fps:.2f}")
    ok("duration", lo <= dur <= hi, f"{dur:.2f}s (target {lo:.0f}–{hi:.0f}s)")
    ok("audio stream", au is not None and au["codec_name"] == "aac", au["codec_name"] if au else "none")
    ok("file size", path.stat().st_size < 4e9, f"{path.stat().st_size / 1e6:.1f} MB")

    if au:
        log = ff_log("-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-")
        m_i = re.findall(r"I:\s+(-?[\d.]+) LUFS", log)
        m_tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", log)
        if m_i:
            I = float(m_i[-1])
            ok("loudness", abs(I - lufs) <= 1.0, f"{I:.1f} LUFS (target {lufs:.0f})")
        if m_tp:
            tp = float(m_tp[-1])
            ok("true peak", tp <= -0.5, f"{tp:.1f} dBTP (≤ -1 ideal)")
        log = ff_log("-i", str(path), "-af", "silencedetect=n=-45dB:d=0.6", "-f", "null", "-")
        starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", log)]
        ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
        opening = next((e for s, e in zip(starts, ends) if s <= 0.05), 0)
        ok("hook audible", opening < 0.8, f"first sound at {opening:.2f}s" if opening else "sound from 0s")
        long_gaps = [(s, e) for s, e in zip(starts, ends) if e - s > 1.5 and s > 0.05]
        ok("no dead air", not long_gaps, ", ".join(f"{s:.1f}–{e:.1f}s" for s, e in long_gaps) or "none > 1.5s", warn=True)
        tail = next((s for s in starts if s > dur - 3), None)
        ok("VO ends before the cut", tail is not None,
           f"quiet from {tail:.2f}s" if tail else "sound runs to the last frame — check the VO isn't clipped", warn=True)

    log = ff_log("-i", str(path), "-vf", "blackdetect=d=0.25:pix_th=0.08", "-an", "-f", "null", "-")
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", log)
    ok("no black frames", not blacks, ", ".join(f"{float(s):.1f}–{float(e):.1f}s" for s, e in blacks) or "none")
    log = ff_log("-i", str(path), "-vf", "freezedetect=n=0.002:d=2.5", "-an", "-f", "null", "-")
    freezes = re.findall(r"freeze_start: ([\d.]+)", log)
    ok("no frozen stretches > 2.5s", not freezes, ", ".join(f"{float(s):.1f}s" for s in freezes) or "none", warn=True)

    stem = path.with_suffix("")
    if "--frames" in a:
        for t in opt("--frames", "0").split(","):
            out = f"{stem}.t{float(t):05.2f}.jpg"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", str(path), "-frames:v", "1", "-q:v", "3", out])
            print(f"frame {t}s → {out}")
    if "--sheet" in a:
        cols = 6
        rows = -(-int(dur) // cols)
        tw = 270 if h > w else 320
        out = f"{stem}.sheet.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-vf",
                        f"fps=1,scale={tw}:-2,tile={cols}x{rows}:padding=6:margin=6:color=white", "-frames:v", "1",
                        "-q:v", "3", out])
        print(f"contact sheet (1 frame/s, read left→right) → {out}")

    width = max(len(n) for _, n, _ in results)
    for status, name, detail in results:
        print(f"{status:4}  {name:<{width}}  {detail}")
    sys.exit(1 if any(s == "FAIL" for s, _, _ in results) else 0)


if __name__ == "__main__":
    main()
