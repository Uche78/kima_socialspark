#!/usr/bin/env python3
"""Pull today's search data with gum into marketing/seo/data/<date>/.

  python3 pull.py            # Search Console (28 days and the 28 before) + Keyword Planner for the seeds
  python3 pull.py --gsc      # Search Console only
  python3 pull.py --kp "kw one" "kw two"   # Keyword Planner historical metrics for these phrases

Reads marketing/seo/config.json. Every call is read-only (gum read). Search Console data lags about
two days, so windows end three days ago.
"""
import datetime as dt
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CONFIG = json.loads((ROOT / "marketing/seo/config.json").read_text())
OUT = ROOT / "marketing/seo/data" / dt.date.today().isoformat()


def gum(op: str, args: dict, out: str):
    cmd = [CONFIG["gum_bin"], "read", op, "--args", json.dumps(args), "--format", "json", "--max-items", "all"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    path = OUT / out
    if res.returncode != 0:
        print(f"✗ {op} → {out}\n{res.stderr.strip() or res.stdout.strip()}", file=sys.stderr)
        return None
    path.write_text(res.stdout)
    print(f"✓ {op} → {path.relative_to(ROOT)}")
    return path


def gsc():
    end = dt.date.today() - dt.timedelta(days=3)
    windows = {"28d": (end - dt.timedelta(days=27), end), "prev28d": (end - dt.timedelta(days=55), end - dt.timedelta(days=28))}
    for name, (start, stop) in windows.items():
        # siteUrl is a path parameter; the query itself goes in `body` (gum rejects body fields at the top level).
        body = {"startDate": start.isoformat(), "endDate": stop.isoformat(), "rowLimit": 25000, "dataState": "final", "type": "web"}
        query = lambda dims: {"siteUrl": CONFIG["gsc_property"], "body": {**body, "dimensions": dims}}
        gum("searchconsole.searchanalytics.query", query(["query", "page"]), f"gsc-query-page-{name}.json")
        if name == "28d":
            gum("searchconsole.searchanalytics.query", query(["page"]), "gsc-page-28d.json")


def kp(keywords: list[str]):
    if not CONFIG.get("ads_customer_id"):
        print("· Keyword Planner skipped: set ads_customer_id in marketing/seo/config.json", file=sys.stderr)
        return
    base = {"customerId": CONFIG["ads_customer_id"], "geoTargetConstants": CONFIG["geo_target_constants"]}
    if CONFIG.get("ads_login_customer_id"):
        base["loginCustomerId"] = CONFIG["ads_login_customer_id"]
    for lang, code in CONFIG["languages"].items():
        kws = [k for k in keywords if (lang == "fr") == looks_french(k)]
        if not kws:
            continue
        # Product probes (adjacent things SocialSpark doesn't make) get volumes for the product ideas list, but
        # aren't keyword-idea seeds: they'd pull the guide candidates off-topic.
        probes = [k for k in CONFIG.get("product_probe_keywords", []) if (lang == "fr") == looks_french(k)] if keywords is CONFIG["seed_keywords"] else []
        # The API takes up to 10,000 keywords per call for historical metrics and 20 seeds for ideas.
        gum("googleads.keywordPlanIdeas.generateKeywordHistoricalMetrics", {**base, "language": code, "keywords": list(dict.fromkeys(kws + probes))[:1000]}, f"kp-historical-{lang}.json")
        ideas = gum("googleads.keywordPlanIdeas.generateKeywordIdeas", {**base, "language": code, "keywords": kws[:20], "pageSize": 500}, f"kp-ideas-{lang}.json")
        # US volumes only rank the Canadian candidates against each other (Canadian phrases mostly sit in the
        # same 10-a-month bucket). English only, and no US keyword ideas, so US-only topics never come up.
        tiebreak = CONFIG.get("tiebreak_geo_target_constants")
        if lang == "en" and tiebreak:
            phrases = list(dict.fromkeys(kws + probes + idea_texts(ideas)))
            gum("googleads.keywordPlanIdeas.generateKeywordHistoricalMetrics", {**base, "geoTargetConstants": tiebreak, "language": code, "keywords": phrases[:1000]}, "kp-tiebreak-historical-en.json")


def idea_texts(path):
    """The phrases in a keyword-ideas response, wherever gum's envelope puts them."""
    if not path:
        return []
    found = []
    def walk(node):
        if isinstance(node, dict):
            if isinstance(node.get("text"), str):
                found.append(node["text"])
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)
    walk(json.loads(path.read_text()))
    return found


def looks_french(k: str):
    return any(c in k for c in "éèêàçôû") or any(w in k.split() for w in ("publication", "immobilier", "immobilière", "courtier", "visite", "inscription", "maison"))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    argv = sys.argv[1:]
    if "--kp" in argv:
        kp(argv[argv.index("--kp") + 1 :])
    elif "--gsc" in argv:
        gsc()
    else:
        gsc()
        kp(CONFIG["seed_keywords"])
