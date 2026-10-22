-- Partners for both roles: brokers save the realtors they co-brand with; realtors save their mortgage brokers.
-- Existing rows were all brokers' realtors, so they default to kind 'realtor'.

alter table public.partner_realtors
  add column if not exists kind text not null default 'realtor' check (kind in ('realtor', 'broker')),
  add column if not exists license_number text;

create index if not exists partner_realtors_user_kind on public.partner_realtors (user_id, kind, full_name);
