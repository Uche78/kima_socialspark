-- Gives back a generation when post generation fails after it was consumed.
-- Server-only (service role): users must not be able to reset their own usage.
create or replace function public.refund_generation(p_user uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.entitlements
  set generations_used = greatest(generations_used - 1, 0), updated_at = now()
  where user_id = p_user;
$$;

revoke execute on function public.refund_generation(uuid) from public, anon, authenticated;
grant execute on function public.refund_generation(uuid) to service_role;
