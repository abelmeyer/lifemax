-- Lifemaxx Sprint 4 migration — paste into Supabase SQL Editor and run once.

-- meals: macros are now calculated automatically (USDA lookup or the meal
-- bank), so we store carbs/fat alongside the protein/calories columns that
-- already existed.
alter table meals add column if not exists carbs_g int;
alter table meals add column if not exists fat_g int;

-- photos: one photo per day, so re-uploading on the same date should
-- overwrite rather than create a second row.
do $$ begin
  alter table photos add constraint photos_user_date_key unique (user_id, date);
exception when duplicate_object or duplicate_table then null;
end $$;

-- Private storage bucket for progress photos — not public, served to the
-- owning user only via signed URLs from the app.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own photos" on storage.objects;
drop policy if exists "Users can view own photos" on storage.objects;
drop policy if exists "Users can update own photos" on storage.objects;
drop policy if exists "Users can delete own photos" on storage.objects;

-- Photos are stored at "<user_id>/<date>.jpg" — the first path segment
-- must match the uploader's own auth.uid().
create policy "Users can upload own photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view own photos"
  on storage.objects for select
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own photos"
  on storage.objects for update
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
