#!/usr/bin/env python3
"""Check ad copy against Google and Meta character limits.

Input: a text file (or stdin) with one asset per line as `kind: text`.
Kinds: h (RSA headline), d (RSA description), path, sitelink, sitelink_desc,
callout, snippet, meta_primary, meta_headline, meta_desc, overlay.
Lines that don't start with a known kind are ignored, so you can keep notes in the file.

Usage: python3 check_lengths.py ads.txt
"""
import sys

LIMITS = {
    "h": 30,
    "d": 90,
    "path": 15,
    "sitelink": 25,
    "sitelink_desc": 35,
    "callout": 25,
    "snippet": 25,
    "meta_primary": 125,  # soft: the visible part before "See more"
    "meta_headline": 40,
    "meta_desc": 30,
    "overlay": 50,
}
SOFT = {"meta_primary", "meta_headline", "meta_desc", "overlay"}


def main():
    src = open(sys.argv[1], encoding="utf-8") if len(sys.argv) > 1 else sys.stdin
    over = 0
    seen = {}
    for n, raw in enumerate(src, 1):
        kind, sep, text = raw.partition(":")
        kind = kind.strip().lower()
        if not sep or kind not in LIMITS:
            continue
        text = text.strip()
        size, limit = len(text), LIMITS[kind]
        if size > limit:
            over += kind not in SOFT
            flag = "LONG (truncates)" if kind in SOFT else "OVER"
        else:
            flag = "ok"
        if kind in ("h", "d"):
            key = (kind, text.lower())
            if key in seen:
                flag += f" DUPLICATE of line {seen[key]}"
            seen.setdefault(key, n)
        print(f"{flag:>16}  {kind:<13} {size:>3}/{limit}  {text}")
    sys.exit(1 if over else 0)


if __name__ == "__main__":
    main()
