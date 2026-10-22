-- Feature sheets are built first (free) in the Sheet Builder; social posts are then created from them.

create table if not exists public.feature_sheets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  language text not null default 'en' check (language in ('en', 'fr', 'bilingual')),
  headline text not null default '',
  photo_index integer,
  -- Rates, scenarios, realtor, display and design options (validated in the app: readSheetConfig).
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feature_sheets_user on public.feature_sheets (user_id, updated_at desc);
create index if not exists feature_sheets_listing on public.feature_sheets (listing_id);

create trigger feature_sheets_updated_at before update on public.feature_sheets
  for each row execute function public.set_updated_at();

alter table public.feature_sheets enable row level security;
create policy "own feature sheets" on public.feature_sheets for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Posts made from a sheet remember it (the post keeps its own copy of the numbers it was published with).
alter table public.posts add column if not exists sheet_id uuid references public.feature_sheets (id) on delete set null;
create index if not exists posts_sheet on public.posts (sheet_id);
