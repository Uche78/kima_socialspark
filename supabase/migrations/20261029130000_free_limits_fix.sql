-- Fix for 20261029120000_free_limits.sql: in consume_generation_for, "used" was ambiguous (it's both an
-- output column and free_caption_usage.used), so every free-plan caption failed. Same function, with the
-- column qualified. Safe to run more than once.

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

revoke execute on function public.consume_generation_for(uuid, boolean, text, uuid) from public, anon, authenticated;
grant execute on function public.consume_generation_for(uuid, boolean, text, uuid) to service_role;
