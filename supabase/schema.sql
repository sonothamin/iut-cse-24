-- Tables
create table if not exists public.users (
  id uuid primary key,
  first_name text,
  last_name text,
  bio text,
  email text unique,
  phone text,
  roll text,
  section text,
  batch_year int,
  blood_group text,
  avatar_url text,
  github text,
  facebook text,
  linkedin text,
  instagram text,
  twitter text,
  website text,
  visible boolean default true,
  role text check (role in ('admin','moderator','user')) default 'user',
  onboarded boolean default false,
  tags text[],
  last_active timestamptz,
  created_at timestamptz default now()
);

-- Create profile row from auth metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, first_name, last_name, email, roll, section, batch_year, role, visible, onboarded)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', null),
    coalesce(new.raw_user_meta_data->>'last_name', null),
    new.email,
    coalesce(new.raw_user_meta_data->>'roll', null),
    coalesce(new.raw_user_meta_data->>'section', null),
    nullif(new.raw_user_meta_data->>'batch_year', '')::int,
    'user',
    true,
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  image_url text,
  organizer text,
  created_at timestamptz default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  notice_date timestamptz default now(),
  posted_by uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  members uuid[],
  admin_id uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  link text,
  description text,
  submitted_by uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  subject text,
  message text,
  user_email text,
  timestamp timestamptz default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.notices enable row level security;
alter table public.clubs enable row level security;
alter table public.resources enable row level security;
alter table public.feedback enable row level security;

-- Users policies
drop policy if exists "users_select_self_visible" on public.users;
create policy "users_select_self_visible" on public.users
  for select using (
    auth.uid() = id or visible = true
  );

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self" on public.users
  for insert with check (auth.uid() = id);

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self" on public.users
  for update using (auth.uid() = id);

-- Helper: check if current user is admin or moderator (bypass RLS via security definer)
create or replace function public.is_admin(p_user uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users where id = p_user and role in ('admin','moderator')
  );
$$;
grant execute on function public.is_admin(uuid) to anon, authenticated;

-- Admin/Moderator policies for users table
drop policy if exists "users_select_admin_mod" on public.users;
create policy "users_select_admin_mod" on public.users
  for select using (
    public.is_admin(auth.uid())
  );

drop policy if exists "users_update_admin_mod" on public.users;
create policy "users_update_admin_mod" on public.users
  for update using (
    public.is_admin(auth.uid())
  );

-- Promote a specific user to admin (run separately if needed)
-- Example: update role for given UUID
-- UPDATE public.users SET role = 'admin' WHERE id = '882d4f4e-e5b9-40df-84c3-cd0381ca9ec3';

-- Events policies (read all, write admin)
drop policy if exists "events_select_all" on public.events;
create policy "events_select_all" on public.events for select using (true);
drop policy if exists "events_modify_admin" on public.events;
create policy "events_modify_admin" on public.events for all using (
  public.is_admin(auth.uid())
);

-- Notices policies
drop policy if exists "notices_select_all" on public.notices;
create policy "notices_select_all" on public.notices for select using (true);
drop policy if exists "notices_modify_admin" on public.notices;
create policy "notices_modify_admin" on public.notices for all using (
  public.is_admin(auth.uid())
);

-- Clubs policies (read all, admin manage)
drop policy if exists "clubs_select_all" on public.clubs;
create policy "clubs_select_all" on public.clubs for select using (true);
drop policy if exists "clubs_modify_admin" on public.clubs;
create policy "clubs_modify_admin" on public.clubs for all using (
  public.is_admin(auth.uid())
);

-- Resources policies (read all, insert authenticated)
drop policy if exists "resources_select_all" on public.resources;
create policy "resources_select_all" on public.resources for select using (true);
drop policy if exists "resources_insert_auth" on public.resources;
create policy "resources_insert_auth" on public.resources for insert with check (auth.uid() is not null);
drop policy if exists "resources_update_admin" on public.resources;
create policy "resources_update_admin" on public.resources for update using (
  public.is_admin(auth.uid())
);

-- Feedback policies (insert all incl. anon, read admin)
drop policy if exists "feedback_insert_all" on public.feedback;
create policy "feedback_insert_all" on public.feedback for insert with check (true);
drop policy if exists "feedback_select_admin" on public.feedback;
create policy "feedback_select_admin" on public.feedback for select using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Storage: avatar bucket policies (bucket should be non-public)
-- Allow authenticated users to read avatar objects (not anonymous)
drop policy if exists "avatar_read_auth" on storage.objects;
create policy "avatar_read_auth" on storage.objects
  for select using (
    bucket_id = 'avatar' and auth.role() = 'authenticated'
  );

-- Only allow users to manage files within their own folder {user_id}/...
drop policy if exists "avatar_insert_own_folder" on storage.objects;
create policy "avatar_insert_own_folder" on storage.objects
  for insert with check (
    bucket_id = 'avatar' and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "avatar_update_own_folder" on storage.objects;
create policy "avatar_update_own_folder" on storage.objects
  for update using (
    bucket_id = 'avatar' and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "avatar_delete_own_folder" on storage.objects;
create policy "avatar_delete_own_folder" on storage.objects
  for delete using (
    bucket_id = 'avatar' and auth.uid()::text = split_part(name, '/', 1)
  );


