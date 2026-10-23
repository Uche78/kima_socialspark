-- Top Producer plan, yearly billing, and Team enquiries.
--
-- Yearly plans renew once a year but their allowances are still monthly: each paid account has a
-- one-month allowance window (allowance_start/end) that rolls forward from the billing period start.
-- Monthly plans get the same window, which matches their billing period.

alter table public.entitlements drop constraint if exists entitlements_plan_check;
alter table public.entitlements
  add constraint entitlements_plan_check check (plan in ('free', 'starter', 'professional', 'top_producer')),
  add column if not exists allowance_start timestamptz,
  add column if not exists allowance_end timestamptz,
  add column if not exists billing_interval text check (billing_interval in ('month', 'year'));

-- Current subscribers are all monthly: their allowance window is their billing period.
update public.entitlements
set allowance_start = period_start, allowance_end = period_end, billing_interval = 'month'
where plan in ('starter', 'professional') and period_start is not null;

-- Unused since generation moved to background jobs (consume_generation_for).
drop function if exists public.consume_generation(text);

create or replace function public.consume_generation_for(p_user uuid, p_guest boolean, p_kind text default 'post')
returns table (allowed boolean, used integer, lim integer, is_guest boolean, plan text, kind text, resets_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  e public.entitlements%rowtype;
  v_paid boolean;
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

  v_paid := e.plan in ('starter', 'professional', 'top_producer')
    and e.subscription_status in ('active', 'trialing')
    and (e.period_end is null or e.period_end > now());

  if not v_paid then
    v_used := e.generations_used;
    v_limit := case when p_guest then 1 else 3 end;
    if v_used >= v_limit then
      return query select false, v_used, v_limit, p_guest, 'free'::text, v_kind, null::timestamptz; return;
    end if;
    update public.entitlements set generations_used = generations_used + 1, updated_at = now() where user_id = p_user;
    return query select true, v_used + 1, v_limit, p_guest, 'free'::text, v_kind, null::timestamptz; return;
  end if;

  -- New month of allowance: count whole months from the billing period start (a stable anchor,
  -- so the 31st doesn't drift to the 28th) and reset the counters.
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

revoke execute on function public.consume_generation_for(uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.consume_generation_for(uuid, boolean, text) to service_role;

create or replace function public.refund_generation(p_user uuid, p_kind text default 'post')
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
  if e.plan in ('starter', 'professional', 'top_producer') and e.subscription_status in ('active', 'trialing') then
    if p_kind = 'regen' then
      update public.entitlements set period_regens_used = greatest(period_regens_used - 1, 0), updated_at = now() where user_id = p_user;
    else
      update public.entitlements set period_posts_used = greatest(period_posts_used - 1, 0), updated_at = now() where user_id = p_user;
    end if;
  else
    update public.entitlements set generations_used = greatest(generations_used - 1, 0), updated_at = now() where user_id = p_user;
  end if;
end;
$$;

revoke execute on function public.refund_generation(uuid, text) from public, anon, authenticated;
grant execute on function public.refund_generation(uuid, text) to service_role;

-- Team and brokerage enquiries from the pricing section (also emailed). Server only.
create table if not exists public.team_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  company text not null,
  agents text not null,
  audience text not null check (audience in ('realtors', 'mortgage_brokers', 'both')),
  province text,
  message text,
  ip text
);
create index if not exists team_enquiries_ip on public.team_enquiries (ip, created_at desc);
alter table public.team_enquiries enable row level security;
