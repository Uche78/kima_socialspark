-- New accounts pick Realtor or Mortgage broker on a welcome step after sign-up.
-- Existing users already have the role they use, so they're never asked.

alter table public.profiles add column if not exists role_chosen boolean not null default false;
update public.profiles set role_chosen = true;
