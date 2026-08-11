-- Lifemaxx Sprint 11 migration — paste into Supabase SQL Editor and run once.
-- Gratitude journal + accomplishments (achievement badges).
--
-- Note: workout session timing (start/end/duration) needs NO new columns —
-- workout_sets.created_at already timestamps every set, so the first and last
-- set of a day bound the session.

-- gratitude_entries: one row per user per day. Items is an ordered JSON array
-- of strings (the prompt asks for three, but fewer/more is allowed rather
-- than forcing three columns and empty-string padding).
create table if not exists gratitude_entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

alter table gratitude_entries enable row level security;

drop policy if exists "Users manage their own gratitude entries" on gratitude_entries;

create policy "Users manage their own gratitude entries"
  on gratitude_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- accomplishments: an earned-badge receipt. The catalog itself lives in code
-- (src/lib/accomplishments.js) rather than the database, so adding an
-- achievement is a deploy and never a migration; this table only records
-- which ids a user has already earned, which is what makes the unlock
-- animation fire exactly once.
create table if not exists accomplishments (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null,
  earned_at timestamptz not null default now(),
  earned_date date not null default current_date,
  primary key (user_id, achievement_id)
);

alter table accomplishments enable row level security;

drop policy if exists "Users manage their own accomplishments" on accomplishments;

create policy "Users manage their own accomplishments"
  on accomplishments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists accomplishments_user_date_idx
  on accomplishments (user_id, earned_date);
