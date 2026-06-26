-- Lifemaxx Sprint 3 migration — paste into Supabase SQL Editor and run once.

-- Tracks the last day the avatar's daily success/miss criteria were
-- evaluated, so we never double-count a day when the app is reopened.
alter table avatar_state add column if not exists last_evaluated_date date;

-- Your pullup target is personal (the others have fixed ranges), so it
-- lives in its own small settings table instead of being hardcoded.
create table if not exists habit_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  pullup_target int not null default 10
);

alter table habit_settings enable row level security;

drop policy if exists "Users manage their own habit settings" on habit_settings;

create policy "Users manage their own habit settings"
  on habit_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
