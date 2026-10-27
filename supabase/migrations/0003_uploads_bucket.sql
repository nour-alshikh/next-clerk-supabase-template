-- Private Storage bucket for user files. Each user owns the folder named after
-- their Clerk user id: uploads/<user_id>/<file>. Files are served via signed URLs.
insert into storage.buckets (id, name, public, file_size_limit)
values ('uploads', 'uploads', false, 10485760) -- 10 MB per file
on conflict (id) do nothing;

create policy "Users read own uploads" on storage.objects
  for select to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));

create policy "Users upload to own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));

create policy "Users update own uploads" on storage.objects
  for update to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'))
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));

create policy "Users delete own uploads" on storage.objects
  for delete to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.jwt()->>'sub'));
