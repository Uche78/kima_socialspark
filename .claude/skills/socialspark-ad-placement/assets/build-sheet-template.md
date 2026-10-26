# Build sheet: <Campaign name>

**Prepared:** <YYYY-MM-DD> · **Rules verified:** <YYYY-MM-DD or "unverified since …">
**Persona:** <one persona> · **Market/language:** <e.g. Canada ex-QC EN / QC FR>
**Goal:** <free sign-up | first post | paid plan | Team enquiry> · **Deciding metric:** <cost per …>
**Budget:** CAD <x>/day, <dates> · **Expected results/week:** <budget ÷ assumed CPA, with the assumption stated>

## Naming convention

`SS_<PLATFORM>_<OBJECTIVE>_<GOAL>_<LANG>_<YYYY-MM>` for campaigns
`<LANG>_<GEO>_<AUDIENCE>_<PLACEMENT>` for ad sets/ad groups
`<ANGLE>_<FORMAT>_<HOOK>_v<n>` for ads (e.g. `DEMO_9x16_POV10pm_v1`)

## Compliance decisions

| Item | Decision | Reason |
|---|---|---|
| Special Ad Category (Meta) | None / Housing / Financial | |
| Personal-attribute check | Passed / rewritten | |
| Claims to substantiate | | source file / measurement |
| "Free" conditions shown | | |
| Québec: French creative + FR landing page | | |
| AI disclosure needed | | |
| Trademarks (REALTOR®, platform marks) | | |
| Lead form privacy + CASL consent | | |
| Preflight script result | | |

## Account checklist

- [ ] Business portfolio / Campaign Manager / Business Center owned by Kima Technologies Inc.
- [ ] Ad account in CAD, Toronto time zone
- [ ] Two admins, two-factor on
- [ ] Domain verified (Meta)
- [ ] Payment method + account spending limit
- [ ] Pixel/tag + server API sending test events (or objective chosen that doesn't need it)
- [ ] Consent handling for Québec visitors

## Build (in screen order)

### Campaign
| Setting | Value | Why |
|---|---|---|

### Ad set / ad group: <name>
| Setting | Value | Why |
|---|---|---|

### Ads
| Ad name | Format | Creative files (placement → file) | Primary/intro text | Headline | CTA | URL + UTMs |
|---|---|---|---|---|---|---|

## Launch checklist

- [ ] Test event received for the optimisation event
- [ ] UTMs on every URL; landing page loads on mobile in < 3 s
- [ ] Creatives rendered with no errors (render_creatives.mjs) and each image looked at
- [ ] Previews checked in every placement (safe zones, cropping, French accents render)
- [ ] Advantage+/Smart creative auto-text features off (or reviewed)
- [ ] End dates on tests; budget caps set
- [ ] Existing customers excluded from prospecting
- [ ] Someone owns lead follow-up within 24 h (lead forms)

## Test plan

- **Control:** <existing winner or "none yet">
- **Challengers:** <distinct angles>
- **Call it when:** <≥ 30 conversions per variant, or 3× target CPA spent, or 2 weeks>
- **Kill rule:** <…> · **Scale rule:** <…>
- **Review dates:** <day 3 (delivery sanity), day 7, day 14>
