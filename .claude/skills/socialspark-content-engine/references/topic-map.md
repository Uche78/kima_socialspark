# Topic map

Clusters SocialSpark can credibly own, each tied to what the product does, so a reader of the guide is one step from pasting a listing link. Seed phrases are starting points for Keyword Planner, not proven demand. Record real volumes in the log as you get them.

| Cluster (the `cluster` value) | Reader | Seed questions | Product tie-in | Link out to |
|---|---|---|---|---|
| **Listing posts** | Realtors | just listed post ideas ✓, open house post, price reduced post, coming soon post, sold post, featured property | The six post types (`POST_TYPES`), the post-type goals in `generate.ts` | `/` or the matching `/for/` page |
| **Captions and copy** | Realtors | real estate captions for instagram, listing description to caption, real estate call to action, emojis in real estate posts | Captions in the agent's voice (Brand & voice), the clichés list, the CTA per post type | `/` |
| **Platforms** | Realtors | real estate instagram post ideas, realtor facebook page posts, realtor linkedin posts, carousel vs single image, best image size for instagram real estate | The platform playbooks, carousels, publish/schedule | `/` |
| **Hashtags** | Realtors | real estate hashtags canada, hashtags for <city> real estate | The hashtag counts per platform the generator uses | `/` |
| **Bilingual and French** | Québec and Ottawa–Gatineau agents | bilingual real estate posts, publication immobilière instagram, nouvelle inscription publication | English, Québec French or bilingual captions | `/for/bilingual-real-estate-social-media-posts`; French guides need template support first |
| **Rules and compliance** | Realtors, brokerages | realtor social media rules ontario, RECO advertising rules, REALTOR® trademark use, can I post another agent's listing, listing photo copyright | The sign-off with brokerage and "Listing courtesy of", the human-rights and no-value-promise rules | `/` (no compliance promises: SocialSpark doesn't make anyone compliant) |
| **Listing marketing** | Realtors, part-timers, new agents | how to market a listing on social media, listing marketing plan, social media for new realtors, posting schedule for a listing | The 3-step flow, scheduling | `/for/social-media-posts-for-new-real-estate-agents`, `/for/listing-posts-for-part-time-realtors` |
| **Condos and property types** | Condo, cottage and rural agents | condo listing post, cottage listing marketing | Demo condo posts, focus chips | `/for/social-media-posts-for-condo-realtors`, `/for/social-media-for-cottage-and-rural-realtors` |
| **Mortgage brokers** | Brokers | mortgage broker social media post ideas, mortgage feature sheet, open house mortgage flyer, co-marketing with realtors | Feature sheets (`mortgage-sheet.ts`, `feature-sheet.ts`), partners, PDFs | `/mortgage-brokers` (set `audience: "broker"`) |
| **Teams and coordinators** | Marketing coordinators, team leads | real estate marketing coordinator tasks, social media for real estate teams | Volume, scheduling; Team banner only (seats aren't in the app) | `/for/listing-posts-for-real-estate-marketing-coordinators` |

✓ = published. Off-limits even with volume: anything SocialSpark can't help with (salaries, licensing exams, listings for sale, rentals), competitor comparisons by name, and anything needing legal or financial advice beyond citing the rule.

Persona pages (`/for/…`) are sales pages for the same readers. A guide links to the one that matches; the analyser treats their slugs as covered phrases so guides don't compete with them.
