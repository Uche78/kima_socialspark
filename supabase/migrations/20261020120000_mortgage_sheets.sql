-- Mortgage feature sheets (phase 1): listing costs, broker defaults, saved partner realtors.

-- Listing costs used by the sheet (also useful context for realtor posts).
alter table public.listings
  add column if not exists monthly_fee numeric check (monthly_fee is null or monthly_fee >= 0),
  add column if not exists property_tax_yearly numeric check (property_tax_yearly is null or property_tax_yearly >= 0),
  add column if not exists monthly_rent numeric check (monthly_rent is null or monthly_rent >= 0);

-- Broker settings: province (titles and compliance wording vary by province) and sheet defaults
-- (rates, frequency, scenarios, fee label, display options), stored as JSON and validated in the app.
alter table public.profiles
  add column if not exists province text check (province is null or province in ('AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT')),
  add column if not exists mortgage_settings jsonb not null default '{}'::jsonb;

-- Realtors a broker co-brands sheets with.
create table if not exists public.partner_realtors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  title text,
  brokerage_name text,
  phone text,
  email text,
  website text,
  headshot_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists partner_realtors_user on public.partner_realtors (user_id, full_name);

create trigger partner_realtors_updated_at before update on public.partner_realtors
  for each row execute function public.set_updated_at();

alter table public.partner_realtors enable row level security;

create policy "own partner realtors read" on public.partner_realtors for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own partner realtors insert" on public.partner_realtors for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "own partner realtors update" on public.partner_realtors for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own partner realtors delete" on public.partner_realtors for delete to authenticated
  using ((select auth.uid()) = user_id);
