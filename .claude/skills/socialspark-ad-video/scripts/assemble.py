#!/usr/bin/env python3
"""Cuts a SocialSpark ad from an edit decision list (EDL) with ffmpeg.

  python3 assemble.py <edl.json> [--draft]      (--draft: fast encode for review)

Paths in the EDL are relative to the EDL file. Example:
{
  "size": [1080, 1920], "fps": 30, "bg": "#0f2a44",
  "video": [                                   # one track, played in order
    {"src": "gfx/hook.mp4"},                   # whole file
    {"src": "rec/demo.mp4", "in": 2.1, "out": 6.4, "fit": "phone",
     "transition": {"type": "fade", "dur": 0.25}},             # into this clip; any xfade name
    {"src": "rec/demo.mp4", "in": 31.0, "out": 34.0, "speed": 1.5, "fit": "phone",
     "zoom": {"from": 1.0, "to": 1.18, "x": 0.5, "y": 0.35}},  # punch-in toward a point (0–1)
    {"src": "rec/editor.mp4", "in": 0, "out": 3, "crop": {"x": 0, "y": 0.2, "w": 1, "h": 0.45}, "fit": "contain"},
    {"src": "stills/post.png", "dur": 2.5, "fit": "blur", "zoom": {"from": 1.0, "to": 1.06}},
    {"src": "gfx/endcard.mp4", "transition": {"type": "fade", "dur": 0.3}}
  ],
  "phone": {"height": 0.80, "y": 0.47},       # screen height (fraction of frame) and centre for fit "phone"
  "overlays": [                                # alpha .mov / .png, laid over the cut
    {"src": "gfx/super1.mov", "start": 0.0},
    {"src": "gfx/captions.mov", "start": 0.0, "end": 38.5}
  ],
  "audio": {
    "vo": {"src": "vo/vo.wav", "start": 0.2, "gain_db": 0},
    "music": {"src": "music/bed.wav", "start": 0, "gain_db": -17, "duck": true, "fade_in": 0.3, "fade_out": 1.5},
    "sfx": [{"src": "sfx/whoosh.wav", "start": 2.0, "gain_db": -8}]
  },
  "loudness": {"I": -14, "TP": -1.0},
  "out": "out/master_9x16.mp4"
}
Fits: cover (fill + crop), contain (letterbox on bg), blur (blurred fill behind), phone (inside a phone frame).
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp"}


def run(args, capture=False):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(map(str, args))[:400]}\n{r.stderr[-2000:]}")
    return r.stderr if capture else None


def probe_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return float(out) if out and out != "N/A" else None


def even(x):
    return int(round(x / 2) * 2)


def fit_chain(fit, W, H, bg, phone_rect):
    """Filter (from [src] to [fit]) placing the source in a W×H frame."""
    if fit == "cover":
        return f"[src]scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1[fit]"
    if fit == "contain":
        return (f"[src]scale={W}:{H}:force_original_aspect_ratio=decrease:flags=lanczos,"
                f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color={bg},setsar=1[fit]")
    if fit == "blur":
        return (f"[src]split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
                f"boxblur=40:2,eq=brightness=-0.08:saturation=0.9[bgv];"
                f"[b]scale={W}:{H}:force_original_aspect_ratio=decrease:flags=lanczos[fg];"
                f"[bgv][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[fit]")
    if fit == "phone":
        x, y, w, h = phone_rect
        return (f"[src]scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h},"
                f"pad={W}:{H}:{x}:{y}:color={bg}[scr];[scr][bezel]overlay=0:0,setsar=1[fit]")
    sys.exit(f"unknown fit: {fit}")


def render_bezel(W, H, rect, work):
    out = work / f"bezel_{W}x{H}.png"
    data = work / "bezel.json"
    x, y, w, h = rect
    data.write_text(json.dumps({"screen": {"x": x, "y": y, "w": w, "h": h}}))
    run(["node", str(HERE / "render_html.mjs"), str(HERE.parent / "templates/phone.html"), str(out),
         "--width", str(W), "--height", str(H), "--alpha", "--data", str(data), "--still", "0", "--duration", "1"])
    return out


def phone_rect(W, H, cfg, src_aspect):
    h = even(H * cfg.get("height", 0.80))
    w = even(h * src_aspect)
    if w > W * 0.86:
        w = even(W * 0.86)
        h = even(w / src_aspect)
    x = even((W - w) / 2)
    y = even(H * cfg.get("y", 0.47) - h / 2)
    return x, y, w, h


def src_aspect(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                          "-of", "csv=p=0", str(path)], capture_output=True, text=True).stdout.strip().split(",")
    return int(out[0]) / int(out[1])


def render_clip(i, clip, base, edl, work, draft):
    W, H = edl["size"]
    fps = edl.get("fps", 30)
    bg = edl.get("bg", "#0f2a44")
    src = (base / clip["src"]).resolve()
    is_image = src.suffix.lower() in IMAGE_EXT
    speed = float(clip.get("speed", 1.0))
    if is_image:
        dur = float(clip.get("dur", 3.0))
        inputs = ["-loop", "1", "-framerate", str(fps), "-t", str(dur), "-i", str(src)]
    else:
        t_in = float(clip.get("in", 0))
        t_out = float(clip.get("out", probe_duration(src)))
        dur = (t_out - t_in) / speed
        inputs = ["-ss", str(t_in), "-t", str(t_out - t_in), "-i", str(src)]
    frames = max(1, round(dur * fps))
    fit = clip.get("fit", "cover")
    zoom = clip.get("zoom")
    k = 2 if zoom else 1  # work at 2× when zooming, so the punch-in doesn't jitter
    pre = [f"[0:v]setpts=PTS/{speed}" if speed != 1 else "[0:v]null"]
    if "crop" in clip:
        c = clip["crop"]
        pre.append(f"crop=iw*{c['w']}:ih*{c['h']}:iw*{c['x']}:ih*{c['y']}")
    graph = [",".join(pre) + "[src]"]
    extra_inputs = []
    rect = None
    if fit == "phone":
        aspect = src_aspect(src) * (clip["crop"]["w"] / clip["crop"]["h"] if "crop" in clip else 1)
        rect = phone_rect(W * k, H * k, edl.get("phone", {}), aspect)
        bezel = render_bezel(W * k, H * k, rect, work)
        extra_inputs = ["-i", str(bezel)]
        graph.append("[1:v]format=rgba[bezel]")
    graph.append(fit_chain(fit, W * k, H * k, bg, rect))
    if zoom:
        z0, z1 = float(zoom.get("from", 1.0)), float(zoom.get("to", 1.1))
        zx, zy = float(zoom.get("x", 0.5)), float(zoom.get("y", 0.5))
        n = max(1, frames - 1)
        # Smoothstep ease from z0 to z1 over the clip.
        p = f"(on/{n})*(on/{n})*(3-2*(on/{n}))"
        graph.append(f"[fit]zoompan=z='{z0}+({z1 - z0})*{p}':x='(iw-iw/zoom)*{zx}':y='(ih-ih/zoom)*{zy}'"
                     f":d=1:s={W}x{H}:fps={fps}[z]")
        last = "[z]"
    else:
        last = "[fit]"
    graph.append(f"{last}fps={fps},scale=out_range=tv,format=yuv420p,trim=end_frame={frames},setpts=PTS-STARTPTS[out]")
    out = work / f"seg{i:02d}.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, *extra_inputs, "-filter_complex", ";".join(graph),
         "-map", "[out]", "-an", "-c:v", "libx264", "-preset", "ultrafast" if draft else "medium",
         "-crf", "20" if draft else "12", "-pix_fmt", "yuv420p", "-r", str(fps), str(out)])
    return out, frames / fps


def build_video(edl, base, work, draft):
    segs = []
    for i, clip in enumerate(edl["video"]):
        path, dur = render_clip(i, clip, base, edl, work, draft)
        segs.append((path, dur, clip.get("transition")))
        print(f"  clip {i}: {clip['src']} → {dur:.2f}s")
    fps = edl.get("fps", 30)
    inputs, graph = [], []
    for p, _, _ in segs:
        inputs += ["-i", str(p)]
    # Same timebase and rate everywhere, or xfade refuses to join segments.
    for i in range(len(segs)):
        graph.append(f"[{i}:v]settb=AVTB,fps={fps},setpts=PTS-STARTPTS[s{i}]")
    acc, length = "[s0]", segs[0][1]
    for i, (_, dur, tr) in enumerate(segs[1:], start=1):
        label = f"[v{i}]"
        if tr and tr.get("type", "cut") != "cut":
            d = float(tr.get("dur", 0.3))
            graph.append(f"{acc}[s{i}]xfade=transition={tr['type']}:duration={d}:offset={length - d:.4f},"
                         f"settb=AVTB,fps={fps}{label}")
            length += dur - d
        else:
            graph.append(f"{acc}[s{i}]concat=n=2:v=1:a=0,settb=AVTB,fps={fps}{label}")
            length += dur
        acc = label
    # Overlays.
    n_in = len(segs)
    for j, ov in enumerate(edl.get("overlays", [])):
        src = (base / ov["src"]).resolve()
        start = float(ov.get("start", 0))
        if src.suffix.lower() in IMAGE_EXT:
            inputs += ["-loop", "1", "-framerate", str(fps), "-t", str(float(ov.get("end", length)) - start), "-i", str(src)]
        else:
            inputs += ["-i", str(src)]
        end = float(ov.get("end", length))
        pos = f"{ov.get('x', 0)}:{ov.get('y', 0)}"
        scale = f",scale=iw*{ov['scale']}:-1" if "scale" in ov else ""
        graph.append(f"[{n_in + j}:v]format=yuva444p{scale},setpts=PTS+{start}/TB[o{j}]")
        graph.append(f"{acc}[o{j}]overlay={pos}:eof_action=pass:enable='between(t,{start},{end})'[ov{j}]")
        acc = f"[ov{j}]"
    graph.append(f"{acc}scale=out_range=tv,format=yuv420p[vout]")
    out = work / "video.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(graph), "-map", "[vout]",
         "-t", f"{length:.4f}", "-c:v", "libx264", "-preset", "ultrafast" if draft else "medium",
         "-crf", "20" if draft else "12", "-pix_fmt", "yuv420p", "-r", str(fps), str(out)])
    return out, length


def build_audio(edl, base, work, length):
    a = edl.get("audio", {})
    inputs, graph, mix = [], [], []
    idx = 0

    def add(src):
        nonlocal idx
        inputs.extend(["-i", str((base / src).resolve())])
        idx += 1
        return idx - 1

    vo = a.get("vo")
    if vo:
        i = add(vo["src"])
        ms = int(float(vo.get("start", 0)) * 1000)
        graph.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={ms}|{ms},"
                     f"volume={vo.get('gain_db', 0)}dB,asplit=2[vo][vosc]")
        mix.append("[vo]")
    music = a.get("music")
    if music:
        i = add(music["src"])
        start = float(music.get("start", 0))
        fi, fo = float(music.get("fade_in", 0.3)), float(music.get("fade_out", 1.5))
        ms = int(start * 1000)
        graph.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{length - start:.3f},"
                     f"afade=t=in:d={fi},afade=t=out:st={max(0, length - start - fo):.3f}:d={fo},"
                     f"volume={music.get('gain_db', -17)}dB,adelay={ms}|{ms}[mus]")
        if vo and music.get("duck", True):
            # Music dips under the voice and comes back up in the gaps.
            graph.append("[mus][vosc]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350:makeup=1[musd]")
            mix.append("[musd]")
        else:
            mix.append("[mus]")
            if vo:
                graph.append("[vosc]anullsink")
    elif vo:
        graph.append("[vosc]anullsink")
    for s in a.get("sfx", []):
        i = add(s["src"])
        ms = int(float(s["start"]) * 1000)
        graph.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={ms}|{ms},"
                     f"volume={s.get('gain_db', -8)}dB[s{i}]")
        mix.append(f"[s{i}]")
    out = work / "mix.wav"
    if not mix:
        run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
             "-t", f"{length:.3f}", str(out)])
        return out, False
    graph.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,"
                 f"apad,atrim=0:{length:.3f}[aout]")
    run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(graph), "-map", "[aout]",
         "-c:a", "pcm_s24le", str(out)])
    return out, True


def loudnorm_args(mix, target):
    I, TP = target.get("I", -14), target.get("TP", -1.0)
    log = run(["ffmpeg", "-hide_banner", "-i", str(mix), "-af",
               f"loudnorm=I={I}:TP={TP}:LRA=11:print_format=json", "-f", "null", "-"], capture=True)
    m = json.loads(log[log.rindex("{"):log.rindex("}") + 1])
    return (f"loudnorm=I={I}:TP={TP}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
            f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
            "aresample=48000")


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    edl_path = Path(args[0]).resolve()
    draft = "--draft" in args
    edl = json.loads(edl_path.read_text())
    base = edl_path.parent
    out = (base / edl.get("out", "out/master.mp4")).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="ss-ad-") as tmp:
        work = Path(tmp)
        print(f"Cutting {edl_path.name} at {edl['size'][0]}×{edl['size'][1]}{' (draft)' if draft else ''}")
        video, length = build_video(edl, base, work, draft)
        mix, has_audio = build_audio(edl, base, work, length)
        af = loudnorm_args(mix, edl.get("loudness", {})) if has_audio else "anull"
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-i", str(mix), "-map", "0:v", "-map", "1:a",
             "-c:v", "libx264", "-preset", "veryfast" if draft else "slow", "-crf", "23" if draft else "17",
             "-profile:v", "high", "-pix_fmt", "yuv420p", "-color_range", "tv", "-maxrate", "16M", "-bufsize", "32M",
             "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
             "-movflags", "+faststart", "-shortest", str(out)])
    print(f"→ {out} ({length:.2f}s)")


if __name__ == "__main__":
    main()
