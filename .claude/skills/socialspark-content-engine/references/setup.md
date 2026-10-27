# Setup (once per machine)

## 1. Install gum

gum is [ehmo/gum](https://github.com/ehmo/gum) ([docs](https://gumcli.dev/)). Note that `brew install gum` installs a *different* tool (Charmbracelet's). Use the qualified name:

```bash
brew tap ehmo/tap https://github.com/ehmo/homebrew-tap
brew install ehmo/tap/gum
gum describe searchconsole.searchanalytics.query   # works without auth: the catalog is embedded
```

If Charmbracelet's gum is also installed, set `"gum_bin"` in `marketing/seo/config.json` to the full path of this one.

## 2. Google OAuth client (Search Console + Google Ads)

In Google Cloud (any project you own):
1. Enable the **Google Search Console API** and the **Google Ads API**.
2. OAuth consent screen: External, testing mode, add your Google account as a test user. Add the scopes `webmasters.readonly`, `webmasters` (for sitemap submit) and `adwords`.
3. Create an OAuth client ID, type **Desktop app**.

```bash
printf '%s' "$GOOGLE_OAUTH_CLIENT_SECRET" | gum auth use-oauth-client --client-id "$GOOGLE_OAUTH_CLIENT_ID" --secret-stdin
gum login --service searchconsole
gum auth status --scopes webmasters,webmasters.readonly
```

The account must have access to the Search Console property. The config uses the URL-prefix property `https://socialspark.usekima.com/` (the owner account also has `sc-domain:usekima.com`, which mixes in the Kima site). `gum read searchconsole.sites.list --format json` shows the exact strings.

If the browser login comes back with only `openid` granted, or times out, run `gum login --no-browser --scope <scopes>` and open the printed link in a browser on the same Mac, ticking every permission box. Scopes: `https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/adwords`.

gum's Search Console calls take path parameters (`siteUrl`) at the top level and the request body under `body`, e.g. `{"siteUrl":"…","body":{"startDate":…}}`.

## 3. Keyword Planner (Google Ads API)

Keyword Planner needs a **manager account** with a **developer token** (https://ads.google.com/aw/apicenter) and a regular client account under it whose setup is finished (billing added, campaign paused): an unfinished account is rejected as "not yet enabled". The token needs **Basic access**: Explorer is granted in minutes but rejects KeywordPlanIdeaService ("not allowed for use with explorer access"). Access levels are now requested in Google Cloud (APIs & Services → Google Ads API → Access levels → Manage), not through the API Center form, which leads to the App Conversion Tracking application. Basic is reviewed by hand; the design document Google asks for is an internal, read-only Keyword Planner tool with fewer than 10 calls a day.

```bash
printf '%s' "$GOOGLE_ADS_DEVELOPER_TOKEN" | gum auth use-ads-developer-token --stdin
gum login --service googleads
gum auth status --scopes adwords
```

Put the 10-digit account id in `ads_customer_id` in `marketing/seo/config.json`. If the account sits under a manager account, put the manager's id in `ads_login_customer_id`. Geo `2124` is Canada; languages `1000` (English) and `1002` (French).

Without an Ads account, the engine still works from Search Console alone; Keyword Planner rows are skipped.

## 4. Check

```bash
python3 .claude/skills/socialspark-content-engine/scripts/pull.py
python3 .claude/skills/socialspark-content-engine/scripts/analyse.py opportunities
```

A new site has few impressions for the first weeks. The analyser then leans on Keyword Planner volumes for the seed keywords. Lower `min_impressions` in the config if it returns nothing while Search Console clearly has data.

## 5. Daily schedule (only when the user asks)

The run uses gum's local credentials, so it runs on this Mac: it needs the Mac on and the user logged in (a run missed while asleep starts on wake; one missed while shut down is skipped). The project doesn't need to be open.

`scripts/daily.sh` is the morning run. It works in its own git worktree (`~/socialspark-content-engine`, created on first run, reset to local `main` each morning, sharing the main checkout's `node_modules` and `.env.local`), so it never touches the checkout the user works in. It runs `claude -p` in `dontAsk` mode with a fixed tool allowlist (the engine's scripts, `gum read`, tests, lint, the render check on port 3199, commits on `guides/*` branches) and `git push` disallowed, then posts a macOS notification with the run's one-line summary. The full report is in `~/socialspark-content-engine/marketing/seo/data/run-<date>.log`.

The worktree runs from local `main`, so skill changes take effect once they're committed there.

launchd job, `~/Library/LaunchAgents/com.usekima.socialspark-content.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.usekima.socialspark-content</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>/Users/uche/Desktop/kima_socialspark/.claude/skills/socialspark-content-engine/scripts/daily.sh</string>
  </array>
  <key>StartCalendarInterval</key><dict><key>Hour</key><integer>7</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>/Users/uche/Library/Logs/socialspark-content.log</string>
  <key>StandardErrorPath</key><string>/Users/uche/Library/Logs/socialspark-content.log</string>
</dict>
</plist>
```

- Turn on: `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.usekima.socialspark-content.plist`
- Run now: `launchctl kickstart gui/$(id -u)/com.usekima.socialspark-content`
- Turn off: `launchctl bootout gui/$(id -u)/com.usekima.socialspark-content`
- Review a guide: `git checkout guides/<slug>` in the main checkout (branches are shared between worktrees).

In `review` mode every run leaves a `guides/<slug>` branch to approve. Switch `publish_mode` to `auto` only when the guides have been consistently good without edits (and add `git push` to the allowlist in `daily.sh` then).
