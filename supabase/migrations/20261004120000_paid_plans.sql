-- Paid plans (Starter / Professional) with monthly allowances, plus revised free limits.
-- Limits are mirrored in src/lib/plans.ts for display; this function is the source of truth.

alter table public.entitlements drop constraint if exists entitlements_plan_check;
update public.entitlements set plan = 'free' where plan not in ('free', 'starter', 'professional');
alter table public.entitlements
  add constraint entitlements_plan_check check (plan in ('free', 'starter', 'professional')),
  add column if not exists period_posts_used integer not null default 0,
  add column if not exists period_regens_used integer not null default 0,
  add column if not exists period_start timestamptz,
  add column if not exists period_end timestamptz,
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text unique,
  add column if not exists stripe_price_id text,
  add column if not exists subscription_status text,
  add column if not exists cancel_at_period_end boolean not null default false;

-- Old single-argument version is replaced by one that knows new posts from regenerations.
drop function if exists public.consume_generation();

/**
 * Atomically uses one allowance. p_kind is 'post' (a new post) or 'regen' (regenerating one).
 * Free users (guests and registered) share one lifetime pool of attempts: guest 1, registered 3,
 * where any generation counts. Paid users have monthly pools for posts and regenerations.
 */
create or replace function public.consume_generation(p_kind text default 'post')
returns table (allowed boolean, used integer, lim integer, is_guest boolean, plan text, kind text, resets_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_guest boolean := coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
  e public.entitlements%rowtype;
  v_paid boolean;
  v_kind text := case when p_kind = 'regen' then 'regen' else 'post' end;
  v_used integer;
  v_limit integer;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into e from public.entitlements where user_id = v_uid for update;
  if not found then
    insert into public.entitlements (user_id) values (v_uid) returning * into e;
  end if;

  v_paid := e.plan in ('starter', 'professional')
    and e.subscription_status in ('active', 'trialing')
    and (e.period_end is null or e.period_end > now());

  if not v_paid then
    v_used := e.generations_used;
    v_limit := case when v_guest then 1 else 3 end;
    if v_used >= v_limit then
      return query select false, v_used, v_limit, v_guest, 'free'::text, v_kind, null::timestamptz; return;
    end if;
    update public.entitlements set generations_used = generations_used + 1, updated_at = now() where user_id = v_uid;
    return query select true, v_used + 1, v_limit, v_guest, 'free'::text, v_kind, null::timestamptz; return;
  end if;

  if v_kind = 'post' then
    v_used := e.period_posts_used;
    v_limit := case e.plan when 'professional' then 20 else 10 end;
  else
    v_used := e.period_regens_used;
    v_limit := case e.plan when 'professional' then 10 else 5 end;
  end if;

  if v_used >= v_limit then
    return query select false, v_used, v_limit, false, e.plan, v_kind, e.period_end; return;
  end if;

  if v_kind = 'post' then
    update public.entitlements set period_posts_used = period_posts_used + 1, updated_at = now() where user_id = v_uid;
  else
    update public.entitlements set period_regens_used = period_regens_used + 1, updated_at = now() where user_id = v_uid;
  end if;
  return query select true, v_used + 1, v_limit, false, e.plan, v_kind, e.period_end;
end;
$$;

revoke all on function public.consume_generation(text) from public, anon;
grant execute on function public.consume_generation(text) to authenticated;

-- Server-only refund for failed generations: gives back the allowance that was just used.
drop function if exists public.refund_generation(uuid);
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
  if e.plan in ('starter', 'professional') and e.subscription_status in ('active', 'trialing') then
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
