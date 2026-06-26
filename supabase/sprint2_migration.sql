-- Lifemaxx Sprint 2 migration — paste into Supabase SQL Editor and run once.

-- Friends can now sign up too, so the shared exercise library needs to be
-- read-only for everyone instead of editable by any authenticated user.
drop policy if exists "Authenticated users can manage exercises" on exercises;
drop policy if exists "Authenticated users can view exercises" on exercises;

create policy "Authenticated users can view exercises"
  on exercises for select
  using (auth.uid() is not null);

alter table exercises add column if not exists sort_order int;

do $$ begin
  alter table exercises add constraint exercises_name_key unique (name);
exception when duplicate_object or duplicate_table then null;
end $$;

-- Seed the 6-day Push/Pull/Legs split. day_slot: 1 = Push, 2 = Pull, 3 = Legs.
-- The app maps the 7-day cycle (Push/Pull/Legs/Push/Pull/Legs/Rest) to these
-- three categories, so each exercise only needs to be stored once.
insert into exercises (name, muscle_group, day_slot, default_sets, rep_scheme, cue, sort_order)
values
  ('Barbell Bench Press', 'Chest', 1, 4, '8-12', 'Control down 2s, pause, press', 1),
  ('Incline Dumbbell Press', 'Chest', 1, 4, '10-12', '30-45° angle only', 2),
  ('Overhead Press', 'Shoulders', 1, 4, '8-10', 'Press vertically, don''t flare', 3),
  ('Lateral Raises', 'Shoulders', 1, 4, '12-15', 'Light, lead with elbow', 4),
  ('Tricep Cable Pushdowns', 'Triceps', 1, 3, '10-12', 'Elbows pinned, start 30-40 lbs', 5),

  ('Pull-Ups / Lat Pulldown', 'Back', 2, 4, '6-10', 'Elbows to hips', 1),
  ('Single-Arm Dumbbell Row', 'Back', 2, 4, '8-10', '2s negative', 2),
  ('Seated Cable Row', 'Back', 2, 3, '10-12', '1s pause, start 50-60 lbs', 3),
  ('Face Pulls', 'Rear Delts', 2, 3, '15-20', 'Light, start 20-30 lbs', 4),
  ('Barbell/Dumbbell Curl', 'Biceps', 2, 3, '10-12', 'Strict form only', 5),

  ('Barbell Squat', 'Legs', 3, 4, '6-8', 'At least parallel, heavy', 1),
  ('Romanian Deadlift', 'Hamstrings', 3, 4, '8-10', 'Hinge at hips, feel the stretch', 2),
  ('Reverse Lunges', 'Legs', 3, 3, '10 each', 'Step back, easier on knees', 3),
  ('Hanging Leg Raises', 'Core', 3, 3, '10-15', 'No swing, controlled', 4),
  ('Plank + Side Plank', 'Core', 3, 3, '45-60s', 'Add 10s per week', 5)
on conflict (name) do update set
  muscle_group = excluded.muscle_group,
  day_slot = excluded.day_slot,
  default_sets = excluded.default_sets,
  rep_scheme = excluded.rep_scheme,
  cue = excluded.cue,
  sort_order = excluded.sort_order;
