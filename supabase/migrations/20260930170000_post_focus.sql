-- focus: features the user asked the post to lead with (optional, max 3)
-- focused_on: the selling points Claude actually led with, shown back to the user
-- highlights now holds the agent's free-text notes (facts not in the listing)
alter table public.posts
  add column focus text[] not null default '{}',
  add column focused_on text[] not null default '{}';
