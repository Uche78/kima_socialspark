-- Virtual tour link (Matterport, iGUIDE, YouTube, etc.) picked up on import or entered by the agent.
alter table public.listings add column if not exists virtual_tour_url text;
