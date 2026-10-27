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

Keyword Planner needs a Google Ads account (no spend required) and a **developer token** (Google Ads → Tools → API Center; an Explorer or Basic access token is enough for keyword planning).

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

The run uses gum's local credentials, so it runs on this Mac. Save as `~/Library/LaunchAgents/com.usekima.socialspark-content.plist`, replacing the paths, then `launchctl load ~/Library/LaunchAgents/com.usekima.socialspark-content.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.usekima.socialspark-content</string>
  <key>WorkingDirectory</key><string>/Users/uche/Desktop/kima_socialspark</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string><string>-lc</string>
    <string>claude -p "/socialspark-content-engine daily run" --permission-mode acceptEdits >> marketing/seo/data/run.log 2>&amp;1</string>
  </array>
  <key>StartCalendarInterval</key><dict><key>Hour</key><integer>7</integer><key>Minute</key><integer>0</integer></dict>
</dict>
</plist>
```

In `review` mode every run leaves a `guides/<slug>` branch to approve. Switch `publish_mode` to `auto` only when the guides have been consistently good without edits.
