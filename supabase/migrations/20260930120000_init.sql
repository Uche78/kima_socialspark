-- SocialSpark initial schema

-- ---------------------------------------------------------------------------
-- Profiles: brand kit, voice, and compliance details (user-editable)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'realtor' check (role in ('realtor', 'mortgage_broker')),
  full_name text,
  title text,
  brokerage_name text,
  license_number text,
  phone text,
  email text,
  website text,
  logo_path text,
  headshot_path text,
  brand_primary text not null default '#0f2a44',
  brand_secondary text not null default '#ffffff',
  brand_accent text not null default '#d4a24c',
  default_language text not null default 'en' check (default_language in ('en', 'fr', 'bilingual')),
  tone_preset text not null default 'professional',
  tone_notes text,
  writing_samples text[] not null default '{}',
  include_logo boolean not null default true,
  include_headshot boolean not null default true,
  include_contact boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Entitlements: plan + usage. Readable by the owner, writable only by the
-- server (service role) or the consume_generation() function below.
-- ---------------------------------------------------------------------------
create table public.entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  generations_used integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Listings retrieved from a URL (or entered manually)
-- ---------------------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_url text,
  source_site text,
  extraction_status text not null default 'complete' check (extraction_status in ('complete', 'partial', 'manual')),
  extraction_notes text,
  address text,
  city text,
  province text,
  postal_code text,
  price numeric,
  transaction_type text not null default 'sale' check (transaction_type in ('sale', 'rent')),
  property_type text,
  bedrooms numeric,
  bathrooms numeric,
  square_feet numeric,
  lot_size text,
  year_built integer,
  mls_number text,
  description text,
  features text[] not null default '{}',
  listing_brokerage text,
  open_house text,
  photos jsonb not null default '[]'::jsonb, -- [{ path, url, source_url }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index listings_user_id_idx on public.listings (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Posts: generated copy + design, and publishing state
-- ---------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  platform text not null check (platform in ('instagram', 'facebook', 'linkedin')),
  format text not null check (format in ('single', 'carousel')),
  post_type text not null default 'just_listed',
  language text not null default 'en' check (language in ('en', 'fr', 'bilingual')),
  highlights text,
  caption text not null default '',
  hashtags text[] not null default '{}',
  slides jsonb not null default '[]'::jsonb,
  design jsonb not null default '{}'::jsonb,
  mortgage jsonb,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'publishing', 'published', 'failed')),
  social_account_id uuid,
  scheduled_at timestamptz,
  published_at timestamptz,
  external_post_id text,
  external_url text,
  error text,
  image_paths text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_user_id_idx on public.posts (user_id, created_at desc);
create index posts_due_idx on public.posts (scheduled_at) where status = 'scheduled';

-- ---------------------------------------------------------------------------
-- Connected social accounts (public info) + tokens (server-only)
-- ---------------------------------------------------------------------------
create table public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (platform in ('instagram', 'facebook', 'linkedin')),
  external_id text not null,
  account_name text not null,
  account_type text, -- 'page' | 'ig_business' | 'member' | 'organization'
  avatar_url text,
  created_at timestamptz not null default now(),
  unique (user_id, platform, external_id)
);

alter table public.posts
  add constraint posts_social_account_fk foreign key (social_account_id)
  references public.social_accounts (id) on delete set null;

create table public.social_tokens (
  social_account_id uuid primary key references public.social_accounts (id) on delete cascade,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New user bootstrap (covers anonymous guests too)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.entitlements (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Paywall: atomically consume one generation if the user is under their limit.
-- Guests (anonymous users) get a small free allowance; signed-up users on the
-- free plan get a larger one; 'pro' is unlimited.
-- ---------------------------------------------------------------------------
create or replace function public.consume_generation()
returns table (allowed boolean, used integer, lim integer, is_guest boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_guest boolean := coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
  v_plan text;
  v_used integer;
  v_limit integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select e.plan, e.generations_used into v_plan, v_used
  from public.entitlements e where e.user_id = v_uid for update;

  if not found then
    insert into public.entitlements (user_id) values (v_uid)
    returning plan, generations_used into v_plan, v_used;
  end if;

  v_limit := case
    when v_plan = 'pro' then null
    when v_guest then 3
    else 10
  end;

  if v_limit is not null and v_used >= v_limit then
    return query select false, v_used, v_limit, v_guest;
    return;
  end if;

  update public.entitlements set generations_used = generations_used + 1, updated_at = now()
  where user_id = v_uid;

  return query select true, v_used + 1, v_limit, v_guest;
end;
$$;

revoke all on function public.consume_generation() from public, anon;
grant execute on function public.consume_generation() to authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.listings enable row level security;
alter table public.posts enable row level security;
alter table public.social_accounts enable row level security;
alter table public.social_tokens enable row level security; -- no policies: service role only

create policy "own profile read" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "own profile update" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "own entitlement read" on public.entitlements for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "own listings" on public.listings for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own posts" on public.posts for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own social accounts read" on public.social_accounts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "own social accounts delete" on public.social_accounts for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Storage: one public media bucket, each user writes under <uid>/...
-- Public read is required so Instagram/Facebook/LinkedIn can fetch images.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 15728640, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "media select own folder" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "media insert own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "media update own folder" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "media delete own folder" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Trigger functions must not be callable over the REST API
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
