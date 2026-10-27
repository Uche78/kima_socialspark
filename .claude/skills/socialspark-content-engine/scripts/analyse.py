#!/usr/bin/env python3
"""Turn the day's pull into decisions.

  python3 analyse.py opportunities [--date YYYY-MM-DD]   # ranked: new guide / refresh a guide / fix a title
  python3 analyse.py links "<keyword>" [--date …]         # existing pages to link FROM to a new guide on <keyword>
  python3 analyse.py checkin <slug> [--date …]            # how one guide is doing: queries, clicks, position

Inputs: marketing/seo/data/<date>/ (from pull.py), the guides in src/lib/guides/*.ts, the persona pages,
and marketing/seo/config.json. Writes opportunities.json next to the data. Standard library only.
"""
import datetime as dt
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CONFIG = json.loads((ROOT / "marketing/seo/config.json").read_text())
SITE = CONFIG["site_url"].rstrip("/")

# Rough organic CTR by position (industry averages, web results). Only used to flag titles that
# underperform their position by a wide margin, never as a target.
EXPECTED_CTR = {1: 0.28, 2: 0.15, 3: 0.10, 4: 0.07, 5: 0.05, 6: 0.04, 7: 0.03, 8: 0.025, 9: 0.02, 10: 0.018}
MERGE_AT = 0.6
STOP = {"a", "an", "the", "to", "for", "of", "in", "on", "and", "or", "how", "what", "is", "do", "you", "your", "with", "my", "de", "la", "le", "les", "des", "pour", "en", "un", "une"}


# ---------- loading ----------

def data_dir(argv):
    if "--date" in argv:
        return ROOT / "marketing/seo/data" / argv[argv.index("--date") + 1]
    days = sorted(p for p in (ROOT / "marketing/seo/data").glob("20*") if p.is_dir())
    if not days:
        sys.exit("No data yet: run pull.py first.")
    return days[-1]


def load(path: Path):
    if not path.exists():
        return None
    text = path.read_text().strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        sys.exit(f"{path} isn't JSON. Re-run pull.py (it asks gum for --format json).")


def find_lists(node, test):
    """Every list of dicts in a JSON envelope whose items pass `test` (gum may wrap the API response)."""
    if isinstance(node, list):
        if node and all(isinstance(x, dict) for x in node) and test(node[0]):
            yield node
        for x in node:
            yield from find_lists(x, test)
    elif isinstance(node, dict):
        for v in node.values():
            yield from find_lists(v, test)


def gsc_rows(path: Path):
    doc = load(path)
    if doc is None:
        return []
    rows = next(find_lists(doc, lambda r: "keys" in r and "impressions" in r), [])
    return [{"keys": r["keys"], "clicks": float(r.get("clicks", 0)), "impressions": float(r.get("impressions", 0)), "position": float(r.get("position", 0))} for r in rows]


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def kp_volumes(d: Path, tiebreak=False):
    """Keyword → {searches, competition} from Keyword Planner files, whatever gum's exact field names.
    Canada by default; `tiebreak` reads the US file, used only to order Canadian candidates."""
    out = {}
    files = d.glob("kp-tiebreak-*.json") if tiebreak else (f for f in d.glob("kp-*.json") if not f.name.startswith("kp-tiebreak-"))
    for f in files:
        doc = load(f)
        test = lambda r: any(k in r for k in ("text", "keyword", "keywordText"))
        for items in find_lists(doc, test):
            for r in items:
                text = r.get("text") or r.get("keyword") or r.get("keywordText")
                m = r.get("keywordMetrics") or r.get("keywordIdeaMetrics") or r.get("metrics") or r
                searches = num(m.get("avgMonthlySearches") or m.get("avg_monthly_searches") or m.get("averageMonthlySearches") or m.get("searchVolume"))
                if text and searches is not None:
                    out[norm(text)] = {"searches": searches, "competition": m.get("competition") or m.get("competitionLevel")}
    return out


def inventory():
    """The site's pages that already answer search phrases: guides (keyword + alsoAnswers) and persona pages."""
    pages = []
    for f in sorted((ROOT / "src/lib/guides").glob("*.ts")):
        if f.name == "index.ts":
            continue
        src = f.read_text()
        slug = re.search(r'slug:\s*"([^"]+)"', src)
        kw = re.search(r'keyword:\s*"([^"]+)"', src)
        also = re.search(r"alsoAnswers:\s*\[([^\]]*)\]", src)
        if slug and kw:
            phrases = [kw.group(1)] + (re.findall(r'"([^"]+)"', also.group(1)) if also else [])
            pages.append({"path": f"/guides/{slug.group(1)}", "kind": "guide", "file": str(f.relative_to(ROOT)), "phrases": phrases})
    persona = (ROOT / "src/lib/persona-pages.ts").read_text()
    for slug in re.findall(r'^\s{2}slug:\s*"([^"]+)"', persona, re.M):
        pages.append({"path": f"/for/{slug}", "kind": "persona", "file": "src/lib/persona-pages.ts", "phrases": [slug.replace("-", " ")]})
    pages += [{"path": "/", "kind": "home", "phrases": ["listing to social media posts for realtors"]}, {"path": "/mortgage-brokers", "kind": "home", "phrases": ["mortgage feature sheets"]}, {"path": "/pricing", "kind": "home", "phrases": ["socialspark pricing"]}]
    return pages


# ---------- text ----------

def norm(s: str):
    return re.sub(r"\s+", " ", s.lower().strip())


# Words searchers use interchangeably, mapped to one form before comparing phrases.
SYNONYMS = [(r"\brealtors?\b", "real estate agent"), (r"\bagents\b", "agent"), (r"\big\b", "instagram"), (r"\bfb\b", "facebook")]


def tokens(s: str):
    s = s.lower()
    for pattern, repl in SYNONYMS:
        s = re.sub(pattern, repl, s)
    return {w[:5] for w in re.split(r"[^a-z0-9àâçéèêëîïôûùüÿœ]+", s) if w and w not in STOP}


def similar(a: str, b: str):
    ta, tb = tokens(a), tokens(b)
    return len(ta & tb) / len(ta | tb) if ta and tb else 0.0


def has_term(text: str, term: str):
    """Whole-word (or whole-phrase) match, so "exam" doesn't match "examples"."""
    return re.search(rf"(?<![a-z0-9]){re.escape(term.lower())}(?![a-z0-9])", text) is not None


def relevant(q: str):
    ql = q.lower()
    if any(has_term(ql, x) for x in CONFIG["exclude_terms"]):
        return False
    return any(has_term(ql, t) for t in CONFIG["relevant_terms"])


def path_of(url: str):
    return re.sub(r"^https?://[^/]+", "", url).split("?")[0].split("#")[0] or "/"


def covered_by(q: str, pages):
    best = max(((similar(q, ph), p) for p in pages for ph in p["phrases"]), default=(0, None), key=lambda x: x[0])
    return best if best[0] >= 0.5 else (best[0], None)


# ---------- commands ----------

def opportunities(d: Path):
    pages = inventory()
    rows = gsc_rows(d / "gsc-query-page-28d.json")
    prev = {(r["keys"][0]): r for r in gsc_rows(d / "gsc-query-page-prev28d.json")}
    vol = kp_volumes(d)
    us = kp_volumes(d, tiebreak=True)
    us_of = lambda phrase: (us.get(norm(phrase)) or {}).get("searches")

    # Per query: totals, impression-weighted position, the page Google ranks best.
    q = defaultdict(lambda: {"clicks": 0.0, "impressions": 0.0, "pos_x_imp": 0.0, "pages": defaultdict(float), "best": (999, None)})
    for r in rows:
        query, page = r["keys"][0], path_of(r["keys"][1])
        e = q[query]
        e["clicks"] += r["clicks"]
        e["impressions"] += r["impressions"]
        e["pos_x_imp"] += r["position"] * r["impressions"]
        e["pages"][page] += r["impressions"]
        if r["position"] < e["best"][0]:
            e["best"] = (r["position"], page)

    found = []
    for query, e in q.items():
        if e["impressions"] < CONFIG["min_impressions"] or not relevant(query) or "socialspark" in query.lower():
            continue
        pos = e["pos_x_imp"] / e["impressions"]
        ctr = e["clicks"] / e["impressions"]
        top_page = max(e["pages"], key=e["pages"].get)
        score_sim, cover = covered_by(query, pages)
        searches = (vol.get(norm(query)) or {}).get("searches")
        trend = e["impressions"] - prev.get(query, {}).get("impressions", 0)
        base = {"query": query, "impressions": int(e["impressions"]), "clicks": int(e["clicks"]), "ctr": round(ctr, 4), "position": round(pos, 1), "top_page": top_page, "searches_ca": searches, "searches_us": us_of(query), "impressions_change": int(trend)}
        is_guide = top_page.startswith("/guides/")
        if cover and cover["path"] == top_page and is_guide and 4 <= pos <= 20:
            found.append({**base, "action": "refresh", "target": top_page, "why": f"{top_page} already targets it and sits at {pos:.0f}: add the missing answer, tighten the title, add links to it"})
        elif pos <= 10 and ctr < EXPECTED_CTR.get(max(1, round(pos)), 0.02) / 3:
            found.append({**base, "action": "title", "target": top_page, "why": f"page 1 (position {pos:.1f}) but CTR {ctr:.1%}: the title and description don't match what the searcher wants"})
        elif not cover:
            found.append({**base, "action": "new", "target": None, "why": f"{int(e['impressions'])} impressions at position {pos:.0f} and no page written for it ({top_page} is ranking by accident)"})
        elif cover and not cover["path"].startswith("/guides/") and pos > 10:
            found.append({**base, "action": "new", "target": None, "why": f"only {cover['path']} (a sales page) covers it, at position {pos:.0f}: a guide can rank where a sales page won't"})

    # Keyword Planner demand with no impressions yet (cold start, or phrases Google doesn't show us for).
    # Niche Canadian phrases mostly report 10 a month (the lowest bucket), so the threshold applies to a
    # family of variants after merging, not to each phrase.
    for k, v in vol.items():
        if k in q or v["searches"] <= 0 or not relevant(k):
            continue
        if covered_by(k, pages)[1]:
            continue
        found.append({"query": k, "impressions": 0, "clicks": 0, "ctr": 0, "position": None, "top_page": None, "searches_ca": v["searches"], "searches_us": us_of(k), "competition": v.get("competition"), "impressions_change": 0, "action": "new", "target": None, "why": f"{int(v['searches'])} searches a month in Canada (Keyword Planner), nothing on the site for it"})

    # Merge near-duplicate phrases into one opportunity: one guide answers them all. Stricter than coverage
    # (0.5): "real estate captions for instagram" and "real estate instagram post ideas" are two guides.
    found.sort(key=score, reverse=True)
    merged = []
    for o in found:
        home = next((m for m in merged if m["action"] == o["action"] and similar(m["query"], o["query"]) >= MERGE_AT), None)
        if home:
            home["variants"].append(o["query"])
            home["impressions"] += o["impressions"]
            for key in ("searches_ca", "searches_us"):
                if o.get(key):
                    home[key] = (home.get(key) or 0) + o[key]
        else:
            merged.append({**o, "variants": []})
    merged = [m for m in merged if m["impressions"] > 0 or (m.get("searches_ca") or 0) >= CONFIG["min_monthly_searches"]]
    for m in merged:
        if m["impressions"] == 0:
            m["why"] = f"about {int(m['searches_ca'])} searches a month in Canada across {len(m['variants']) + 1} phrasings (Keyword Planner), nothing on the site for it"
        m["score"] = round(score(m), 1)
    merged.sort(key=lambda m: m["score"], reverse=True)

    (d / "opportunities.json").write_text(json.dumps(merged, indent=2))
    print(f"# Opportunities, {d.name} ({len(rows)} Search Console rows, {len(vol)} Keyword Planner phrases, {len(us)} with US volumes)\n")
    print("| # | Action | Query | Impr. 28d | Pos. | CTR | Searches/mo CA | US (tiebreak) | Variants | Why |")
    print("|---|---|---|---|---|---|---|---|---|---|")
    for i, m in enumerate(merged[:25], 1):
        print(f"| {i} | {m['action']} | {m['query']} | {m['impressions']} | {m['position'] or '–'} | {m['ctr']:.1%} | {int(m['searches_ca']) if m['searches_ca'] is not None else '–'} | {int(m['searches_us']) if m.get('searches_us') is not None else '–'} | {', '.join(m['variants'][:4]) or '–'} | {m['why']} |")
    if not merged:
        print("Nothing clears the bar today. That's a valid result: don't publish to fill the day.")
    print(f"\nSaved {(d / 'opportunities.json').relative_to(ROOT)}")


def score(o):
    """Missed clicks first: impressions we get but don't convert, weighted up for page 2 (closest to moving)."""
    imp, pos, ctr = o["impressions"], o.get("position"), o.get("ctr", 0)
    s = imp * (1 - ctr)
    if pos and 8 <= pos <= 25:
        s *= 1.5
    if o["action"] == "title":
        s *= 1.2
    if o.get("searches_ca"):
        s += 0.5 * o["searches_ca"]
    # US demand only orders candidates that already passed the Canadian bar; it never qualifies one.
    if o.get("searches_us"):
        s += 0.25 * o["searches_us"]
    return s


def links(keyword: str, d: Path):
    """Pages to add a contextual link FROM: guides that already earn impressions for related queries."""
    rows = gsc_rows(d / "gsc-query-page-28d.json")
    pages = {p["path"]: p for p in inventory()}
    by_page = defaultdict(lambda: {"impressions": 0.0, "clicks": 0.0, "queries": []})
    for r in rows:
        query, page = r["keys"][0], path_of(r["keys"][1])
        rel = similar(keyword, query)
        if rel >= 0.25:
            e = by_page[page]
            e["impressions"] += r["impressions"]
            e["clicks"] += r["clicks"]
            e["queries"].append(query)
    # Guides with no data yet still count when their own phrases are related.
    for p in pages.values():
        if p["kind"] == "guide" and p["path"] not in by_page and max(similar(keyword, ph) for ph in p["phrases"]) >= 0.25:
            by_page[p["path"]]["queries"].append("(topic match, no Search Console data yet)")
    print(f"# Link sources for \"{keyword}\"\n")
    print("| Page | Kind | Impr. 28d (related queries) | Clicks | Related queries | Edit |")
    print("|---|---|---|---|---|---|")
    for path, e in sorted(by_page.items(), key=lambda kv: kv[1]["impressions"] + 10 * kv[1]["clicks"], reverse=True)[:12]:
        kind = pages.get(path, {}).get("kind", "?")
        edit = pages.get(path, {}).get("file", "–") if kind == "guide" else "don't link from here (one-goal page)" if kind == "persona" else "only with the user's OK"
        print(f"| {path} | {kind} | {int(e['impressions'])} | {int(e['clicks'])} | {', '.join(e['queries'][:4])} | {edit} |")


def checkin(slug: str, d: Path):
    path = f"/guides/{slug}"
    rows = [r for r in gsc_rows(d / "gsc-query-page-28d.json") if path_of(r["keys"][1]) == path]
    imp = sum(r["impressions"] for r in rows)
    clicks = sum(r["clicks"] for r in rows)
    print(f"# {path}, 28 days to {d.name}: {int(imp)} impressions, {int(clicks)} clicks\n")
    print("| Query | Impr. | Clicks | Pos. |")
    print("|---|---|---|---|")
    for r in sorted(rows, key=lambda r: r["impressions"], reverse=True)[:20]:
        print(f"| {r['keys'][0]} | {int(r['impressions'])} | {int(r['clicks'])} | {r['position']:.1f} |")
    if not rows:
        print("No impressions yet. Check indexing with the URL Inspection call in the skill before changing anything.")


if __name__ == "__main__":
    argv = sys.argv[1:]
    if not argv:
        sys.exit(__doc__)
    d = data_dir(argv)
    if argv[0] == "opportunities":
        opportunities(d)
    elif argv[0] == "links":
        links(argv[1], d)
    elif argv[0] == "checkin":
        checkin(argv[1], d)
    else:
        sys.exit(__doc__)
