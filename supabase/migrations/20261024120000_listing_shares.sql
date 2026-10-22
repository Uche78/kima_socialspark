-- Listings a realtor has sent to a mortgage broker ("Sent to Priya · Oct 22" on the listing card).
-- Written by the share API after the email goes out; realtors only read their own.

create table if not exists public.listing_shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  to_email text not null,
  to_name text,
  created_at timestamptz not null default now()
);

create index if not exists listing_shares_listing on public.listing_shares (listing_id, created_at desc);

alter table public.listing_shares enable row level security;
create policy "own listing shares read" on public.listing_shares for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own listing shares insert" on public.listing_shares for insert to authenticated
  with check ((select auth.uid()) = user_id);
