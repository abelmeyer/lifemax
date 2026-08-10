-- Lifemaxx Sprint 10 migration — paste into Supabase SQL Editor and run once.
-- Avatar customization: appearance chosen at account setup (skin tone, hair
-- style/color, facial hair), editable later from the Dashboard.
--
-- Lives in its own table rather than on avatar_state because avatar_state is
-- engine-managed (level/streak cursors upserted wholesale by syncAvatarProgress)
-- while this row is user-authored identity — mixing them risks one write path
-- clobbering the other.

create table if not exists avatar_customization (
  user_id uuid primary key references auth.users (id) on delete cascade,
  skin_tone text not null default 'tan',
  hair_style text not null default 'short',
  hair_color text not null default 'brown',
  facial_hair text not null default 'none',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table avatar_customization enable row level security;

drop policy if exists "Users manage their own avatar customization" on avatar_customization;

create policy "Users manage their own avatar customization"
  on avatar_customization for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
