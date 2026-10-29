#!/bin/zsh
# The unattended morning run of the socialspark-content-engine skill (started by launchd; see references/setup.md).
#
# It works in its own clone of the GitHub repo (~/socialspark-content-engine), outside ~/Desktop, because macOS
# doesn't let launchd jobs read Desktop. Each morning the clone is reset to origin/main. Claude runs with a fixed
# tool allowlist in dontAsk mode: anything else is refused. It may push guides/<slug> branches to GitHub for
# review, never main. The run's report is written to marketing/seo/data/run-<date>.log in the clone and
# summarised in a macOS notification.
set -uo pipefail

# The reset below rewrites this file in the clone, so run from a copy (zsh reads scripts as it goes).
if [ -z "${SS_ENGINE_COPY:-}" ]; then
  copy="$(mktemp -t socialspark-engine)" && cp "$0" "$copy" && SS_ENGINE_COPY=1 exec /bin/zsh "$copy" "$@"
fi

ENGINE="${SOCIALSPARK_ENGINE:-$HOME/socialspark-content-engine}"
CLAUDE="${CLAUDE_BIN:-$HOME/.local/bin/claude}"
REPO_URL="https://github.com/Uche78/kima_socialspark"

notify() { osascript -e "display notification \"${1//\"/\'}\" with title \"SocialSpark content engine\"" >/dev/null 2>&1 || true; }

cd "$ENGINE" 2>/dev/null || { notify "The engine clone is missing at $ENGINE (see setup.md)."; exit 1; }

# launchd starts with a bare PATH: use the newest installed Node matching .nvmrc (e.g. "22" → v22.x), plus gum and claude.
NODE_MAJOR="$(tr -d 'v \n' < .nvmrc 2>/dev/null)"
NODE_BIN="$(ls -d "$HOME"/.nvm/versions/node/v${NODE_MAJOR}*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NODE_BIN:+$NODE_BIN:}/usr/local/bin:/opt/homebrew/bin:$HOME/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

DAY="$(date +%F)"
mkdir -p marketing/seo/data
LOG="marketing/seo/data/run-$DAY.log"
echo "=== $(date) ===" >> "$LOG"

# Start clean from GitHub's main. Kept: the data folder (past pulls, run logs), the product ideas list, the local
# env file and installed dependencies, all gitignored.
if ! git fetch -q --prune origin >> "$LOG" 2>&1; then notify "Couldn't fetch from GitHub. See $ENGINE/$LOG"; exit 1; fi
git checkout -q --detach origin/main && git reset -q --hard origin/main
git clean -qfd -e marketing/seo/data -e marketing/seo/product-ideas.md -e marketing/seo/product-ideas.json -e node_modules -e .env.local

# Reinstall dependencies only when the lockfiles changed.
for dir in . .claude/skills/socialspark-ad-video/scripts; do
  stamp="marketing/seo/data/.lock-$(echo "$dir" | tr '/.' '__')"
  lock="$dir/package-lock.json"; [ -f "$lock" ] || lock="$dir/package.json"
  sum="$(shasum "$lock" | cut -d' ' -f1)"
  if [ ! -d "$dir/node_modules" ] || [ "$(cat "$stamp" 2>/dev/null)" != "$sum" ]; then
    (cd "$dir" && { [ -f package-lock.json ] && npm ci --no-audit --no-fund || npm install --no-audit --no-fund; }) >> "$LOG" 2>&1 && echo "$sum" > "$stamp"
  fi
done

PROMPT="Run the socialspark-content-engine skill's daily run (all steps in its SKILL.md), unattended.
Context: you're in the engine's own clone at $ENGINE, detached at origin/main. Nobody is watching, so don't ask questions: decide, and list anything that needs the user under 'Needs you' in the hand-off.
- publish_mode is review: if you write or refresh a guide, create branch guides/<slug> with git switch -c, commit there (with the attribution lines), then push it with 'git push -u origin guides/<slug>'. Never push main or any other branch. Put the review link in the hand-off: $REPO_URL/compare/main...guides/<slug>?expand=1. On a no-action day, don't commit or push anything.
- For the render check use port 3199 (npx next dev -p 3199), name screenshot scripts _shot.mjs at the repo root, and stop the server and delete the script when done.
- End your final message with one line starting 'SUMMARY:' (under 150 characters) saying what you did, plus any new product ideas."

ALLOWED=(
  Read Edit Write Glob Grep WebSearch WebFetch Skill
  "Bash(python3 .claude/skills/socialspark-content-engine/scripts/pull.py*)"
  "Bash(python3 .claude/skills/socialspark-content-engine/scripts/analyse.py*)"
  "Bash(gum read *)" "Bash(gum describe *)"
  "Bash(npx next typegen*)" "Bash(npx tsc *)" "Bash(npx eslint *)" "Bash(npx vitest *)" "Bash(npx next dev -p 3199*)"
  "Bash(node _shot.mjs*)" "Bash(rm _shot.mjs)" "Bash(rm -f _shot.mjs)" "Bash(pkill -f next dev -p 3199*)"
  "Bash(curl -s *)" "Bash(lsof *)" "Bash(touch src/app/guides/*)" "Bash(sleep *)"
  "Bash(git status*)" "Bash(git diff*)" "Bash(git log*)" "Bash(git switch -c guides/*)" "Bash(git add *)" "Bash(git commit *)"
  "Bash(git push -u origin guides/*)" "Bash(git push origin guides/*)"
  "Bash(ls *)" "Bash(cat *)" "Bash(head *)" "Bash(tail *)" "Bash(grep *)" "Bash(wc *)" "Bash(date*)"
)
# Deny rules win over the allowlist: no refspecs ("guides/x:main"), no force, no deleting, no other targets.
DENIED=("Bash(git push*:*)" "Bash(git push*--force*)" "Bash(git push*-f *)" "Bash(git push*--delete*)" "Bash(git push*--mirror*)" "Bash(git push*--all*)" "Bash(git push*main*)" "Bash(git push*HEAD*)")

# A dropped connection to the API ("API Error: Connection closed mid-response") ends the run with nothing done.
# Retry up to twice, 10 minutes apart, from a clean main, but only if that attempt pushed no guides/* branch.
PUSHED_BEFORE="$(git ls-remote -q origin 'refs/heads/guides/*' 2>/dev/null)"
for ATTEMPT in 1 2 3; do
  START_LINE=$(($(wc -l < "$LOG") + 1))
  "$CLAUDE" -p "$PROMPT" --permission-mode dontAsk --allowedTools "${ALLOWED[@]}" --disallowedTools "${DENIED[@]}" >> "$LOG" 2>&1
  STATUS=$?
  [ $STATUS -eq 0 ] || [ $ATTEMPT -eq 3 ] && break
  tail -n +$START_LINE "$LOG" | grep -q '^API Error' || break
  [ "$(git ls-remote -q origin 'refs/heads/guides/*' 2>/dev/null)" = "$PUSHED_BEFORE" ] || break
  echo "=== $(date): API error, retrying in 10 minutes (attempt $((ATTEMPT + 1)) of 3) ===" >> "$LOG"
  /bin/sleep 600
  git checkout -q --detach origin/main && git reset -q --hard origin/main
  git clean -qfd -e marketing/seo/data -e marketing/seo/product-ideas.md -e marketing/seo/product-ideas.json -e node_modules -e .env.local
  git for-each-ref --format='%(refname:short)' 'refs/heads/guides/*' | xargs -n1 git branch -qD 2>/dev/null
done

git checkout -q --detach origin/main 2>/dev/null || true

SUMMARY="$(grep -h '^SUMMARY:' "$LOG" | tail -1 | sed 's/^SUMMARY: *//')"
if [ $STATUS -ne 0 ]; then notify "The run failed (exit $STATUS). See $ENGINE/$LOG"
elif [ -n "$SUMMARY" ]; then notify "$SUMMARY"
else notify "Run finished. Report: $ENGINE/$LOG"; fi
[ -n "${SS_ENGINE_COPY:-}" ] && rm -f "$0"
exit $STATUS
