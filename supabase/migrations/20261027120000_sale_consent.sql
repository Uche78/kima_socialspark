-- Written consent for Sold posts. Advertising a property as sold needs the parties' written consent
-- (in Ontario, RECO Bulletin 5.4: the seller's before closing, the buyer's after, both to show the price
-- or terms). The app records that the user confirmed it; the consent document stays with the brokerage.
--
-- { "confirmed_at": "<when the user confirmed, set by the server>", "covers_price": <both parties agreed to the price> }
-- null = not confirmed. Existing rows are left null: their owners confirm before publishing.
--
-- No policy change: the existing "own posts" policy already lets users update only their own rows.

alter table public.posts add column if not exists sale_consent jsonb;
