#!/usr/bin/env python3
"""Compliance and spec linter for SocialSpark paid-social ads (Meta, LinkedIn, TikTok).

A linter, not a reviewer: it flags phrases and gaps that commonly cause rejections or breach
Canadian advertising law, so a human reads every flag. A clean run is not an approval.

Input, either:
  * JSON: a list of ads (or {"ads": [...]}) with any of these fields:
      name, platform (meta|linkedin|tiktok), language (en|fr), geo (e.g. "CA-ON", "QC", "Canada"),
      primary_text, intro_text, ad_text, headline, description, overlay, cta, url
  * Markdown in the socialspark-ad-copy format: "## <name>" sections with "Primary text: …",
    "Headline: …", "Description: …", "Overlay: …", "Ad text: …", "Intro text: …", "URL: …" lines.

Usage:
  preflight.py ads.json [--platform meta|linkedin|tiktok] [--geo QC] [--language fr]
Exit code 1 if any ERROR, else 0.
"""
import argparse
import json
import re
import sys
from pathlib import Path

# Visible/recommended limits (characters). Hard maxima are larger; truncation is the real risk.
LIMITS = {
    "meta": {"primary_text": 125, "headline": 40, "description": 30, "overlay": 60},
    "linkedin": {"intro_text": 150, "primary_text": 150, "headline": 70, "description": 100},
    "tiktok": {"ad_text": 100, "primary_text": 100, "overlay": 60},
}
HARD_MAX = {"linkedin": {"intro_text": 600, "primary_text": 600, "headline": 200}, "tiktok": {"ad_text": 100, "primary_text": 100}}

TEXT_FIELDS = ["primary_text", "intro_text", "ad_text", "headline", "description", "overlay", "cta"]

ACRONYMS = {"CAD", "MLS", "CREA", "PDF", "CMHC", "OACIQ", "AMF", "FSRA", "RECO", "BCFSA", "GTA", "FAQ",
            "USD", "URL", "CTA", "UTM", "HD", "TV", "VA", "QC", "ON", "BC", "AB", "SMS", "API", "FR", "EN", "NB", "NS"}

# (regex, severity, message). Case-insensitive.
RULES = [
    # Personal attributes (Meta Advertising Standards; LinkedIn and TikTok similar)
    (r"\b(are you|you're|you are)\s+(struggling|broke|in debt|behind|failing|desperate|depressed|anxious|overweight|single|divorced|unemployed|over \d+|under \d+)",
     "ERROR", "Asserts a personal attribute about the viewer. Address the profession, not the person's circumstances."),
    (r"\b(your|ur)\s+(debt|credit score|bankruptcy|divorce|health|religion|age|disability|diagnosis|income)\b",
     "ERROR", "Refers to the viewer's personal attributes (finances, health, age…)."),
    (r"\b(struggling|failing|broke|desperate)\b", "WARN", "Negative-state wording often read as a personal-attribute assertion. Rephrase as a situation, not a trait."),
    (r"\b(behind on|tired of being|sick of being)\b", "WARN", "Close to implying a personal attribute; check the whole sentence."),
    # Unsubstantiated / prohibited claims (Competition Act general-impression test; all platforms)
    (r"\bguarantee(d|s)?\b|\bgaranti(e|es|s)?\b", "ERROR", "'Guaranteed' results/approval are unsubstantiable and a common rejection reason."),
    (r"#\s?1\b|\bnumber one\b|\bno\.? ?1\b|\bnuméro un\b", "ERROR", "'#1' needs independent, current substantiation. Remove unless you can cite it."),
    (r"\b(best|only|leading|fastest|cheapest|easiest)\b", "WARN", "Superlative: true, provable and current? Otherwise cut it (Competition Act)."),
    (r"\b(le|la|les) (meilleur|meilleure|seul|seule|plus rapide)s?\b", "WARN", "Superlatif : prouvable et actuel ? Sinon, à retirer."),
    (r"\b\d[\d,]*\+?\s*(agents|realtors|customers|users|brokers|courtiers|clients)\b", "WARN", "Customer/user count: must be real and current; cite the source."),
    (r"\b(under|in) (a|one|\d+) (minute|minutes|seconds?)\b|\ben moins d'une minute\b|\b\d+ ?(hours?|heures?) (a|per|par) (week|semaine)\b",
     "INFO", "Speed/time-saved claim: needs prior testing (Competition Act). Confirm it's measured."),
    (r"[\"“«][^\"”»]{12,}[\"”»]\s*[—-]\s*\w+", "WARN", "Looks like a testimonial: must be a real, consenting user with typical results; disclose incentives."),
    (r"\b(risk[- ]free|no risk|sans risque)\b", "WARN", "'Risk-free': true only if there's nothing to lose (no card, cancel anytime). State the condition."),
    # Mortgage-specific
    (r"\b\d+(\.\d+)?\s?%\s*(rate|apr|interest|taux)|\b(rate|taux)s?\b.{0,20}\d+(\.\d+)?\s?%", "ERROR",
     "Quotes a rate. SocialSpark ad copy never quotes rates (and it turns the ad into a financial-product ad)."),
    (r"\b(pre-?approv|approval|approved|get a mortgage|lowest rate|best rate|préapprob)", "WARN",
     "Mortgage-offer language: may be classed as a financial-product ad. Frame as a tool for brokers' marketing."),
    # Housing look-alike (Meta Special Ad Category: Housing)
    (r"\b(open house|for sale|just listed|à vendre|portes ouvertes)\b.{0,40}\$\s?\d", "WARN",
     "Listing + price in ad copy can trigger Meta's Housing classifier. Make clear it's a sample post made by the software."),
    # Trademarks
    (r"\brealtor\.ca\b", "ERROR", "Don't use realtor.ca branding in ads (CREA)."),
    (r"\bMLS\b(?!®)", "WARN", "MLS® is a CREA trademark: avoid it, or use it with ® and correctly."),
    (r"\bREALTORS?\b(?!®)", "WARN", "All-caps REALTOR is the CREA trademark form; use REALTOR® only as CREA intends, or say 'real estate agents'."),
    # Format hygiene (all platforms' editorial standards)
    (r"!{2,}", "WARN", "Multiple exclamation marks read as spammy and draw rejections."),
    (r"[\$€£]\s?\d+(?:[.,]\d{2})?(?!.{0,25}(CAD|plus tax|\+ ?tax|taxes en sus|\+ ?tx))", "WARN",
     "Price without 'CAD' / 'plus tax' nearby. Show an attainable price (no drip pricing)."),
]

FREE_RE = re.compile(r"\b(free|gratuit|gratuits|gratuite|gratuites)\b", re.I)
FREE_CONDITION_RE = re.compile(r"(no (credit )?card|sans carte|\b\d+\s+(free|posts?|publications?)|cancel anytime|annulez en tout temps|sans engagement)", re.I)
EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F1E6-\U0001F1FF]")
HASHTAG_RE = re.compile(r"(?<!\w)#\w+")
FRENCH_HINT = re.compile(r"\b(le|la|les|des|vos|votre|pour|avec|une|est|sans|courtier|inscription|publication)\b", re.I)


def parse_markdown(text):
    ads, cur = [], None
    keymap = {"primary text": "primary_text", "intro text": "intro_text", "introductory text": "intro_text", "ad text": "ad_text",
              "headline": "headline", "description": "description", "overlay": "overlay", "text overlay": "overlay",
              "cta": "cta", "cta button": "cta", "url": "url", "platform": "platform", "language": "language", "geo": "geo"}
    for line in text.splitlines():
        h = re.match(r"^#{2,3}\s+(.*)", line)
        if h:
            cur = {"name": h.group(1).strip()}
            low = cur["name"].lower()
            if "linkedin" in low:
                cur["platform"] = "linkedin"
            elif "tiktok" in low:
                cur["platform"] = "tiktok"
            elif any(k in low for k in ("facebook", "instagram", "meta")):
                cur["platform"] = "meta"
            if re.search(r"\b(fr|french|français|québec|quebec)\b", low):
                cur.setdefault("language", "fr")
            ads.append(cur)
            continue
        m = re.match(r"^\s*[-*]?\s*\**([A-Za-z ]+?)\**\s*:\s*(.+)$", line)
        if m and cur is not None:
            key = keymap.get(m.group(1).strip().lower())
            if key:
                cur[key] = (cur.get(key, "") + " " + m.group(2).strip()).strip() if key in cur else m.group(2).strip()
    return [a for a in ads if any(a.get(f) for f in TEXT_FIELDS)]


def load(path):
    raw = Path(path).read_text(encoding="utf-8")
    if path.endswith(".json"):
        data = json.loads(raw)
        return data["ads"] if isinstance(data, dict) else data
    return parse_markdown(raw)


def check_ad(ad, default_platform, default_geo, default_lang):
    out = []
    platform = (ad.get("platform") or default_platform or "").lower()
    geo = (ad.get("geo") or default_geo or "").upper()
    lang = (ad.get("language") or default_lang or "").lower()
    texts = {f: ad[f] for f in TEXT_FIELDS if ad.get(f)}
    alltext = " \n".join(texts.values())

    def add(sev, msg, field=None):
        out.append((sev, f"{field}: {msg}" if field else msg))

    # Lengths
    for field, val in texts.items():
        lim = LIMITS.get(platform, {}).get(field)
        hard = HARD_MAX.get(platform, {}).get(field)
        n = len(val)
        if hard and n > hard:
            add("ERROR", f"{n} chars exceeds the {platform} maximum of {hard}.", field)
        elif lim and n > lim:
            add("WARN", f"{n} chars; {platform} shows about {lim} before truncating. Make sure the first {lim} work alone.", field)

    # Phrase rules
    for pattern, sev, msg in RULES:
        for field, val in texts.items():
            m = re.search(pattern, val, re.I if "REALTOR" not in pattern and "MLS" not in pattern else 0)
            if m:
                add(sev, f"'{m.group(0).strip()}': {msg}", field)

    # Free without conditions
    if FREE_RE.search(alltext) and not FREE_CONDITION_RE.search(alltext + " " + ad.get("description", "")):
        add("WARN", "'Free' without its material condition nearby (e.g. '3 free posts, no credit card').")

    # ALL CAPS words
    caps = [w for w in re.findall(r"\b[A-ZÀ-Ý]{4,}\b", alltext) if w not in ACRONYMS and w not in ("REALTOR", "REALTORS")]
    if caps:
        add("WARN", f"ALL-CAPS words {sorted(set(caps))[:5]}: excessive capitals are rejected on LinkedIn and Google, and look spammy elsewhere.")

    # Platform-specific
    emojis = EMOJI_RE.findall(alltext)
    if platform == "linkedin":
        if re.search(r"\blinked ?in\b", alltext, re.I):
            add("WARN", "Mentions LinkedIn. LinkedIn's brand policy disallows referencing LinkedIn or implying affiliation in ads (except 'Find me on LinkedIn').")
        if len(emojis) > 2:
            add("WARN", f"{len(emojis)} emojis: LinkedIn rejects excessive emojis.")
        if len(HASHTAG_RE.findall(alltext)) > 3:
            add("WARN", "More than 3 hashtags: LinkedIn rejects unrelated or excessive hashtags.")
    if platform == "tiktok":
        if emojis and ad.get("ad_text", ad.get("primary_text")):
            add("WARN", "Emojis in TikTok ad text: some placements reject them. Remove them.")
    if platform == "meta" and re.search(r"\b(facebook|instagram|meta)\b.{0,15}\b(approved|official|partner|certified)\b", alltext, re.I):
        add("ERROR", "Implies Meta endorsement or partnership.")

    # Québec language
    targets_qc = bool(re.search(r"\b(QC|QUEBEC|QUÉBEC|CA-QC)\b", geo))
    looks_fr = len(FRENCH_HINT.findall(alltext)) >= 3
    if targets_qc and lang != "fr" and not looks_fr:
        add("ERROR", "Targets Québec but the copy isn't French. The Charter of the French language requires French commercial advertising (another language may accompany it, never more prominent).")
    if lang == "fr" and not looks_fr:
        add("INFO", "Marked French but few French words detected: check the right copy is attached.")

    # URL hygiene
    url = ad.get("url", "")
    if url:
        if "utm_" not in url:
            add("WARN", "URL has no UTM parameters.", "url")
        if not url.startswith("https://"):
            add("WARN", "URL is not https.", "url")
        if targets_qc and "/for/" in url and "publications" not in url and lang == "fr":
            add("INFO", "Québec French ad: confirm the landing page is in French.", "url")
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file")
    ap.add_argument("--platform", choices=["meta", "linkedin", "tiktok"])
    ap.add_argument("--geo", default="")
    ap.add_argument("--language", default="")
    args = ap.parse_args()

    ads = load(args.file)
    if not ads:
        print("No ads found. Use JSON, or Markdown with '## name' sections and 'Primary text:'/'Headline:' lines.")
        sys.exit(2)

    errors = 0
    for i, ad in enumerate(ads, 1):
        name = ad.get("name") or f"ad {i}"
        flags = check_ad(ad, args.platform, args.geo, args.language)
        plat = ad.get("platform") or args.platform or "unspecified platform"
        print(f"\n== {name} [{plat}]")
        if not flags:
            print("   no flags (still needs human review against references/rulebook.md)")
        order = {"ERROR": 0, "WARN": 1, "INFO": 2}
        for sev, msg in sorted(flags, key=lambda f: order[f[0]]):
            errors += sev == "ERROR"
            print(f"   {sev:5} {msg}")
    print(f"\n{len(ads)} ad(s) checked, {errors} error(s). Linter only: read references/rulebook.md §2 before launch.")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
