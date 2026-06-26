-- Lifemaxx Sprint 6 migration — paste into Supabase SQL Editor and run once.
-- Prestige + Aura economy + Store.

-- user_economy: aura balance, prestige level, and the evaluation cursors
-- that make syncEconomy() idempotent (mirrors the avatar_state pattern).
create table if not exists user_economy (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table user_economy add column if not exists aura_balance int not null default 0;
alter table user_economy add column if not exists prestige_level int not null default 0;
alter table user_economy add column if not exists last_aura_evaluated_date date;
alter table user_economy add column if not exists today_aura_date date;
alter table user_economy add column if not exists today_aura_flags jsonb not null default '{}'::jsonb;
alter table user_economy add column if not exists last_swim_aura_week date;
alter table user_economy add column if not exists last_prestige_evaluated_week date;

alter table user_economy enable row level security;

drop policy if exists "Users manage their own economy" on user_economy;
create policy "Users manage their own economy"
  on user_economy for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- store_items: shared catalog, read-only for any authenticated user
-- (same pattern as the exercises table).
create table if not exists store_items (
  id uuid primary key default uuid_generate_v4(),
  name text not null
);

alter table store_items add column if not exists description text;
alter table store_items add column if not exists category text;
alter table store_items add column if not exists required_prestige int not null default 0;
alter table store_items add column if not exists cost_aura int not null default 0;
alter table store_items add column if not exists sort_order int not null default 0;

do $$ begin
  alter table store_items add constraint store_items_name_key unique (name);
exception when duplicate_object or duplicate_table then null;
end $$;

alter table store_items enable row level security;

drop policy if exists "Authenticated users can view store items" on store_items;
create policy "Authenticated users can view store items"
  on store_items for select
  using (auth.uid() is not null);

-- owned_items: purchase receipts, one per (user, item).
create table if not exists owned_items (
  id uuid primary key default uuid_generate_v4()
);

alter table owned_items add column if not exists user_id uuid references auth.users (id) on delete cascade;
alter table owned_items add column if not exists item_id uuid references store_items (id) on delete cascade;
alter table owned_items add column if not exists purchased_at timestamptz not null default now();
alter table owned_items alter column user_id set not null;
alter table owned_items alter column item_id set not null;

do $$ begin
  alter table owned_items add constraint owned_items_user_item_key unique (user_id, item_id);
exception when duplicate_object or duplicate_table then null;
end $$;

alter table owned_items enable row level security;

drop policy if exists "Users manage their own owned items" on owned_items;
create policy "Users manage their own owned items"
  on owned_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Seed placeholder items across all 4 prestige tiers.
insert into store_items (name, description, category, required_prestige, cost_aura, sort_order) values
  ('Classic Tank Top', 'A clean training tank.', 'Basic Fits', 1, 80, 1),
  ('Training Shorts', 'Lightweight shorts for the gym.', 'Basic Fits', 1, 60, 2),
  ('Gym Socks', 'Comfortable crew socks.', 'Basic Fits', 1, 40, 3),
  ('Lifting Belt', 'Leather belt for heavy pulls.', 'Gear', 3, 250, 1),
  ('Wrist Wraps', 'Support for max-effort presses.', 'Gear', 3, 180, 2),
  ('Chalk Bag', 'Keep your grip locked in.', 'Gear', 3, 220, 3),
  ('Pro Singlet', 'Competition-grade singlet.', 'Premium', 5, 600, 1),
  ('Carbon Knee Sleeves', 'Premium knee support.', 'Premium', 5, 700, 2),
  ('Signature Hoodie', 'Limited training hoodie.', 'Premium', 5, 850, 3),
  ('Golden Championship Belt', 'A belt worthy of a champion.', 'Exclusive', 10, 1500, 1),
  ('Diamond Avatar Aura', 'A radiant aura effect.', 'Exclusive', 10, 1800, 2),
  ('Legacy Trophy Case', 'Display your accolades.', 'Exclusive', 10, 2000, 3)
on conflict (name) do update set
  description = excluded.description,
  category = excluded.category,
  required_prestige = excluded.required_prestige,
  cost_aura = excluded.cost_aura,
  sort_order = excluded.sort_order;
