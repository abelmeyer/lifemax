-- Lifemaxx Sprint 13 migration — paste into Supabase SQL Editor and run once.
-- Second training cycle (Full Body A/B/C) alongside PPL.
--
-- Additive only: one new table, one new nullable column. No existing row is
-- rewritten, so logged sets, PRs, aura and prestige are untouched. Safe to
-- run before or after the code deploy — until it runs, the app keeps the
-- active cycle in the browser and logs sets without a program day.
--
-- No exercise rows are created: every Full Body exercise already exists in
-- the PPL library, and the program (src/lib/cycles.js) reuses those rows by
-- name so history, last-session weights and PRs carry across both cycles.

-- training_settings: which cycle the Workouts tab shows. One row per user.
-- The cycle catalog lives in code; the check only guards against typos.
create table if not exists training_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  active_cycle text not null default 'ppl' check (active_cycle in ('ppl', 'full_body')),
  updated_at timestamptz not null default now()
);

alter table training_settings enable row level security;

drop policy if exists "Users manage their own training settings" on training_settings;

create policy "Users manage their own training settings"
  on training_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- workout_sets.program_day: which program day a set was logged under
-- ('ppl-1'…'ppl-6', 'fb-A'/'fb-B'/'fb-C'). It's what makes the A → B → C
-- rotation possible: exercises are shared between days and between cycles,
-- so the exercise alone can't say which day a session was. Null for sets
-- logged before this migration — they still count everywhere they did.
alter table workout_sets add column if not exists program_day text;

-- "Last full-body day logged" is a newest-first lookup on this column.
create index if not exists workout_sets_user_program_day_idx
  on workout_sets (user_id, program_day, date desc);
