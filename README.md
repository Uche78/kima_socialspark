# SocialSpark

Turn a property listing link into ready-to-publish Instagram, Facebook and LinkedIn posts — in the user's voice, with their branding.

**Stack:** Next.js 16 (App Router) · Supabase (auth, Postgres, storage — project `kima-socialspark`, ca-central-1) · Claude (`claude-opus-5-5`) · Netlify

## How it works

1. **Retrieve** — `POST /api/listings/import` fetches the page (SSRF-guarded), collects JSON-LD, meta tags, page text and image candidates, and has Claude extract structured details and pick the property's photos. Photos are copied into Supabase Storage. Sites that block bots (REALTOR.ca today) fall back to manual entry. The DDF integration will slot in here as a new source.
2. **Review** — `/listings/[id]`: edit details, reorder/remove/upload photos.
3. **Generate** — `POST /api/posts/generate`: consumes one generation (`consume_generation()` — the paywall), then Claude writes the caption, hashtags and slide plan for the chosen platform, format, post type and language (EN / Québec FR / bilingual), looking at the photos and following the user's tone + writing samples. Mortgage brokers get a payment-estimate slide (Canadian semi-annual compounding, CMHC premiums).
4. **Design & edit** — `/posts/[id]`: three templates (Classic / Modern / Minimal) rendered at each platform's size, editable text/photos/colours, branding toggles, compliance warnings.
5. **Deliver** — Download (JPEG or ZIP + caption), copy caption, publish now, or schedule. A Netlify scheduled function calls `/api/cron/publish-due` every 5 minutes.

## Paywall

| Who | Posts |
|---|---|
| Guest (anonymous session, no account) | 3 |
| Free account | 10 |
| Pro | unlimited (billing not built yet) |

Limits live in `consume_generation()` in `supabase/migrations/20260930120000_init.sql`.

## Setup

1. `cp .env.example .env.local` and fill in `SUPABASE_SECRET_KEY`, `ANTHROPIC_API_KEY`, `CRON_SECRET`.
2. In Supabase → Authentication:
   - **Sign In / Providers → enable "Allow anonymous sign-ins"** (required for guest mode).
   - **URL Configuration** → Site URL = your Netlify URL; add `http://localhost:3000/auth/callback` and `https://<your-site>/auth/callback` to Redirect URLs.
3. `npm install && npm run dev`

## Social publishing

- **Meta:** create an app at developers.facebook.com, add Facebook Login, set the redirect URI to `<site>/api/connect/meta/callback`. Needs app review for `pages_manage_posts`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management`, `instagram_basic`.
- **LinkedIn:** create an app, add "Sign In with LinkedIn using OpenID Connect" and "Share on LinkedIn", redirect URI `<site>/api/connect/linkedin/callback`. Posts go to the member's personal profile (company pages need Community Management API approval).

## Deploying to Netlify

Set every variable from `.env.example` in Netlify (set `NEXT_PUBLIC_SITE_URL` to the production URL). `netlify.toml` pins Node 22 and registers `netlify/functions/publish-scheduled.mts`.
