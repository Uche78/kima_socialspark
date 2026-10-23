-- Tokens used by each Claude call (listing imports, posts, regenerations), to work out the real
-- cost per post, per import and per plan. Written by the server with the service role; no user access.

create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Kept (set null) if the account is deleted, so past costs still add up.
  user_id uuid references auth.users (id) on delete set null,
  kind text not null check (kind in ('import', 'post', 'regen')),
  post_type text,
  listing_id uuid,
  job_id uuid,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cache_read_tokens integer not null default 0,
  cache_write_tokens integer not null default 0,
  duration_ms integer
);

create index if not exists ai_usage_created on public.ai_usage (created_at desc);
create index if not exists ai_usage_user on public.ai_usage (user_id, created_at desc);

alter table public.ai_usage enable row level security;
