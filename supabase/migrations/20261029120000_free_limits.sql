-- Free plan limits: 3 listing imports (guests 1), and 2 captions per listing (new posts and rewrites).
-- Everything else on those listings is free: sheets, edits, downloads, PDFs, publishing.
-- Paid plans: unchanged caption allowances, unlimited imports. No backfill: there are no real users yet.

alter table public.entitlements add column if not exists imports_used integer not null default 0;

-- Free captions written per listing. Its own table, not a listings column: users can edit their listings,
-- and must not be able to reset this. They can read their own counts; only the server writes them.
create table if not exists public.free_caption_usage (
  listing_id uuid primary key references public.listings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  used integer not null default 0
);
alter table public.free_caption_usage enable row level security;
create policy "own free caption usage read" on public.free_caption_usage for select to authenticated
  using ((select auth.uid()) = user_id);

-- True when the account is on an active paid plan (the same test the caption functions use).
create or replace function public.has_paid_plan(e public.entitlements)
returns boolean
language sql
stable
set search_path = ''
as $$
  select e.plan in ('starter', 'professional', 'top_producer')
    and e.subscription_status in ('active', 'trialing')
    and (e.period_end is null or e.period_end > now());
$$;

-- Uses one free listing import (guests 1, accounts 3). Paid plans aren't counted. Called before Claude reads the page.
create or replace function public.consume_import_for(p_user uuid, p_guest boolean)
returns table (allowed boolean, used integer, lim integer, is_guest boolean, plan text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  e public.entitlements%rowtype;
  v_limit integer := case when p_guest then 1 else 3 end;
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found then
    insert into public.entitlements (user_id) values (p_user) returning * into e;
  end if;
  if public.has_paid_plan(e) then
    return query select true, e.imports_used, null::integer, false, e.plan; return;
  end if;
  if e.imports_used >= v_limit then
    return query select false, e.imports_used, v_limit, p_guest, 'free'::text; return;
  end if;
  update public.entitlements set imports_used = imports_used + 1, updated_at = now() where user_id = p_user;
  return query select true, e.imports_used + 1, v_limit, p_guest, 'free'::text;
end;
$$;

-- Gives back a free import when the import failed (page unreadable, not a listing, save error).
create or replace function public.refund_import(p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e public.entitlements%rowtype;
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found or public.has_paid_plan(e) then return; end if;
  update public.entitlements set imports_used = greatest(imports_used - 1, 0), updated_at = now() where user_id = p_user;
end;
$$;

-- Captions: paid plans use their monthly allowances as before; the free plan now allows 2 per listing
-- (new posts and rewrites alike) instead of 3 in total. The listing is passed in.
drop function if exists public.consume_generation_for(uuid, boolean, text);
create or replace function public.consume_generation_for(p_user uuid, p_guest boolean, p_kind text default 'post', p_listing uuid default null)
returns table (allowed boolean, used integer, lim integer, is_guest boolean, plan text, kind text, resets_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  e public.entitlements%rowtype;
  v_kind text := case when p_kind = 'regen' then 'regen' else 'post' end;
  v_used integer;
  v_limit integer;
  v_anchor timestamptz;
  v_n integer := 0;
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found then
    insert into public.entitlements (user_id) values (p_user) returning * into e;
  end if;

  if not public.has_paid_plan(e) then
    v_limit := 2;
    -- The listing must be the user's own.
    perform 1 from public.listings where id = p_listing and user_id = p_user;
    if not found then
      return query select false, 0, v_limit, p_guest, 'free'::text, v_kind, null::timestamptz; return;
    end if;
    insert into public.free_caption_usage (listing_id, user_id) values (p_listing, p_user) on conflict (listing_id) do nothing;
    select u.used into v_used from public.free_caption_usage u where u.listing_id = p_listing for update;
    if v_used >= v_limit then
      return query select false, v_used, v_limit, p_guest, 'free'::text, v_kind, null::timestamptz; return;
    end if;
    -- Qualified: "used" is also one of this function's output columns.
    update public.free_caption_usage u set used = u.used + 1 where u.listing_id = p_listing;
    return query select true, v_used + 1, v_limit, p_guest, 'free'::text, v_kind, null::timestamptz; return;
  end if;

  -- Paid: a new month of allowance rolls forward from the billing period start (yearly plans too).
  if e.allowance_end is null or e.allowance_end <= now() then
    v_anchor := coalesce(e.period_start, e.allowance_start, now());
    while v_anchor + make_interval(months => v_n + 1) <= now() loop
      v_n := v_n + 1;
    end loop;
    update public.entitlements
    set allowance_start = v_anchor + make_interval(months => v_n),
        allowance_end = v_anchor + make_interval(months => v_n + 1),
        period_posts_used = 0,
        period_regens_used = 0,
        updated_at = now()
    where user_id = p_user
    returning * into e;
  end if;

  if v_kind = 'post' then
    v_used := e.period_posts_used;
    v_limit := case e.plan when 'top_producer' then 50 when 'professional' then 20 else 10 end;
  else
    v_used := e.period_regens_used;
    v_limit := case e.plan when 'top_producer' then 25 when 'professional' then 10 else 5 end;
  end if;

  if v_used >= v_limit then
    return query select false, v_used, v_limit, false, e.plan, v_kind, e.allowance_end; return;
  end if;

  if v_kind = 'post' then
    update public.entitlements set period_posts_used = period_posts_used + 1, updated_at = now() where user_id = p_user;
  else
    update public.entitlements set period_regens_used = period_regens_used + 1, updated_at = now() where user_id = p_user;
  end if;
  return query select true, v_used + 1, v_limit, false, e.plan, v_kind, e.allowance_end;
end;
$$;

drop function if exists public.refund_generation(uuid, text);
create or replace function public.refund_generation(p_user uuid, p_kind text default 'post', p_listing uuid default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e public.entitlements%rowtype;
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found then return; end if;
  if public.has_paid_plan(e) then
    if p_kind = 'regen' then
      update public.entitlements set period_regens_used = greatest(period_regens_used - 1, 0), updated_at = now() where user_id = p_user;
    else
      update public.entitlements set period_posts_used = greatest(period_posts_used - 1, 0), updated_at = now() where user_id = p_user;
    end if;
  else
    update public.free_caption_usage set used = greatest(used - 1, 0) where listing_id = p_listing and user_id = p_user;
  end if;
end;
$$;

revoke execute on function public.has_paid_plan(public.entitlements) from public, anon, authenticated;
revoke execute on function public.consume_import_for(uuid, boolean) from public, anon, authenticated;
revoke execute on function public.refund_import(uuid) from public, anon, authenticated;
revoke execute on function public.consume_generation_for(uuid, boolean, text, uuid) from public, anon, authenticated;
revoke execute on function public.refund_generation(uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.has_paid_plan(public.entitlements) to service_role;
grant execute on function public.consume_import_for(uuid, boolean) to service_role;
grant execute on function public.refund_import(uuid) to service_role;
grant execute on function public.consume_generation_for(uuid, boolean, text, uuid) to service_role;
grant execute on function public.refund_generation(uuid, text, uuid) to service_role;
