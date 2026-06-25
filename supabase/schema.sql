-- Lifemaxx schema — paste into Supabase SQL Editor and run once.

create extension if not exists "uuid-ossp";

-- exercises: personal exercise library (no user_id column was specified for this
-- table, so RLS just requires an authenticated session rather than ownership).
create table if not exists exercises (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  muscle_group text,
  day_slot int,
  default_sets int,
  rep_scheme text,
  cue text
);

alter table exercises enable row level security;

create policy "Authenticated users can manage exercises"
  on exercises for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- workout_sets
create table if not exists workout_sets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid references exercises (id) on delete set null,
  date date not null default current_date,
  set_number int,
  weight_lbs numeric,
  reps int,
  created_at timestamptz not null default now()
);

alter table workout_sets enable row level security;

create policy "Users manage their own workout sets"
  on workout_sets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- cardio_sessions
create table if not exists cardio_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  type text,
  duration_min int,
  notes text
);

alter table cardio_sessions enable row level security;

create policy "Users manage their own cardio sessions"
  on cardio_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- habit_logs
create table if not exists habit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  pushups int not null default 0,
  situps int not null default 0,
  pullups int not null default 0,
  unique (user_id, date)
);

alter table habit_logs enable row level security;

create policy "Users manage their own habit logs"
  on habit_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- habit_streaks
create table if not exists habit_streaks (
  user_id uuid not null references auth.users (id) on delete cascade,
  habit text not null,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_completed date,
  primary key (user_id, habit)
);

alter table habit_streaks enable row level security;

create policy "Users manage their own habit streaks"
  on habit_streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- meals
create table if not exists meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  name text,
  protein_g int,
  calories int,
  created_at timestamptz not null default now()
);

alter table meals enable row level security;

create policy "Users manage their own meals"
  on meals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- photos
create table if not exists photos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  storage_path text,
  created_at timestamptz not null default now()
);

alter table photos enable row level security;

create policy "Users manage their own photos"
  on photos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- avatar_state
create table if not exists avatar_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  level int not null default 1,
  streak int not null default 0,
  last_progress_date date
);

alter table avatar_state enable row level security;

create policy "Users manage their own avatar state"
  on avatar_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
