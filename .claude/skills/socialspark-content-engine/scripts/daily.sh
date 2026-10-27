#!/bin/zsh
# The unattended morning run of the socialspark-content-engine skill (started by launchd; see references/setup.md).
#
# It works in its own git worktree, reset to local `main` each morning, so it never touches the checkout you
# work in. Claude runs with a fixed tool allowlist in dontAsk mode: anything else is refused, and it can't push.
# A guide ends up on a local guides/<slug> branch for you to review. The run's report is written to
# <worktree>/marketing/seo/data/run-<date>.log and summarised in a macOS notification.
set -uo pipefail

REPO="${SOCIALSPARK_REPO:-$HOME/Desktop/kima_socialspark}"
WT="${SOCIALSPARK_ENGINE_WORKTREE:-$HOME/socialspark-content-engine}"
CLAUDE="${CLAUDE_BIN:-$HOME/.local/bin/claude}"
# launchd starts with a bare PATH: use the newest installed Node matching .nvmrc (e.g. "22" → v22.x), plus gum and claude.
NODE_MAJOR="$(tr -d 'v \n' < "$REPO/.nvmrc" 2>/dev/null)"
NODE_BIN="$(ls -d "$HOME"/.nvm/versions/node/v${NODE_MAJOR}*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NODE_BIN:+$NODE_BIN:}/usr/local/bin:/opt/homebrew/bin:$HOME/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

notify() { osascript -e "display notification \"${1//\"/\'}\" with title \"SocialSpark content engine\"" >/dev/null 2>&1 || true; }

# First run: create the worktree and share the main checkout's dependencies and local env.
if [ ! -d "$WT/.git" ] && [ ! -f "$WT/.git" ]; then
  git -C "$REPO" worktree add --detach "$WT" main || { notify "Couldn't create the worktree at $WT"; exit 1; }
fi
[ -e "$WT/node_modules" ] || ln -s "$REPO/node_modules" "$WT/node_modules"
[ -e "$WT/.env.local" ] || { [ -f "$REPO/.env.local" ] && ln -s "$REPO/.env.local" "$WT/.env.local"; }
[ -e "$WT/.claude/skills/socialspark-ad-video/scripts/node_modules" ] || ln -s "$REPO/.claude/skills/socialspark-ad-video/scripts/node_modules" "$WT/.claude/skills/socialspark-ad-video/scripts/node_modules"

cd "$WT" || exit 1
# Start clean from the latest local main. The data folder (gitignored) is kept: it holds past pulls and run logs.
git checkout -q --detach main && git reset -q --hard main && git clean -qfd -e marketing/seo/data -e node_modules -e .env.local

DAY="$(date +%F)"
mkdir -p marketing/seo/data
LOG="marketing/seo/data/run-$DAY.log"

PROMPT="Run the socialspark-content-engine skill's daily run (all steps in its SKILL.md), unattended.
Context: you're in the engine's own worktree at $WT, detached at local main. Nobody is watching, so don't ask questions: decide, and list anything that needs the user under 'Needs you' in the hand-off.
- publish_mode is review: if you write or refresh a guide, create branch guides/<slug> with git switch -c, commit there (with the attribution lines), and don't push. On a no-action day, don't commit anything.
- For the render check use port 3199 (npx next dev -p 3199), name screenshot scripts _shot.mjs at the repo root, and stop the server and delete the script when done.
- End your final message with one line starting 'SUMMARY:' (under 150 characters) saying what you did."

ALLOWED=(
  Read Edit Write Glob Grep WebSearch WebFetch Skill
  "Bash(python3 .claude/skills/socialspark-content-engine/scripts/pull.py*)"
  "Bash(python3 .claude/skills/socialspark-content-engine/scripts/analyse.py*)"
  "Bash(gum read *)" "Bash(gum describe *)"
  "Bash(npx next typegen*)" "Bash(npx tsc *)" "Bash(npx eslint *)" "Bash(npx vitest *)" "Bash(npx next dev -p 3199*)"
  "Bash(node _shot.mjs*)" "Bash(rm _shot.mjs)" "Bash(rm -f _shot.mjs)" "Bash(pkill -f next dev -p 3199*)"
  "Bash(curl -s *)" "Bash(lsof *)" "Bash(touch src/app/guides/*)" "Bash(sleep *)"
  "Bash(git status*)" "Bash(git diff*)" "Bash(git log*)" "Bash(git switch -c guides/*)" "Bash(git add *)" "Bash(git commit *)"
  "Bash(ls *)" "Bash(cat *)" "Bash(head *)" "Bash(tail *)" "Bash(grep *)" "Bash(wc *)" "Bash(date*)"
)

echo "=== $(date) ===" >> "$LOG"
"$CLAUDE" -p "$PROMPT" --permission-mode dontAsk --allowedTools "${ALLOWED[@]}" --disallowedTools "Bash(git push*)" >> "$LOG" 2>&1
STATUS=$?

# Free the guides/<slug> branch so it can be checked out in the main checkout for review.
git checkout -q --detach main 2>/dev/null || true

SUMMARY="$(grep -h '^SUMMARY:' "$LOG" | tail -1 | sed 's/^SUMMARY: *//')"
if [ $STATUS -ne 0 ]; then notify "The run failed (exit $STATUS). See $WT/$LOG"
elif [ -n "$SUMMARY" ]; then notify "$SUMMARY"
else notify "Run finished. Report: $WT/$LOG"; fi
exit $STATUS
