-- Post generation runs as a background job (Netlify cuts normal requests off at 30 s),
-- and an allowance is used only once the post has actually been created.

create table if not exists public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  kind text not null check (kind in ('post', 'regen')),
  is_guest boolean not null default false,
  params jsonb not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  post_id uuid references public.posts (id) on delete set null,
  error text,
  paywall text check (paywall in ('signup', 'upgrade', 'limit')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists generation_jobs_user_created on public.generation_jobs (user_id, created_at desc);

alter table public.generation_jobs enable row level security;
-- Users can watch their own jobs; only the server creates and updates them.
create policy "own generation jobs read" on public.generation_jobs for select to authenticated
  using ((select auth.uid()) = user_id);

/**
 * Server-only version of consume_generation for background jobs (no user session there).
 * Same rules: free users share one lifetime pool (guest 1, registered 3); paid users have
 * monthly pools for new posts and regenerations.
 */
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
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found then
    insert into public.entitlements (user_id) values (p_user) returning * into e;
  end if;

  v_paid := e.plan in ('starter', 'professional')
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
    update public.entitlements set period_posts_used = period_posts_used + 1, updated_at = now() where user_id = p_user;
  else
    update public.entitlements set period_regens_used = period_regens_used + 1, updated_at = now() where user_id = p_user;
  end if;
  return query select true, v_used + 1, v_limit, false, e.plan, v_kind, e.period_end;
end;
$$;

revoke execute on function public.consume_generation_for(uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.consume_generation_for(uuid, boolean, text) to service_role;
