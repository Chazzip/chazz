create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.account_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  login_id text,
  email text,
  display_name text,
  focus text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.account_profiles
add column if not exists login_id text;

create unique index if not exists account_profiles_login_id_lower_idx
on public.account_profiles(lower(login_id))
where login_id is not null;

create table if not exists public.oracle_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default '主档案',
  full_name text,
  former_name_note text,
  solar_birthday date,
  lunar_birthday_text text,
  birth_time_text text,
  shichen text,
  gender text default 'unknown',
  birth_location text,
  is_alive boolean not null default true,
  life_status_confirmed boolean not null default true,
  deceased_year integer,
  notes text,
  is_primary boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists oracle_profiles_one_primary_per_user_idx
on public.oracle_profiles(user_id)
where is_primary = true;

create table if not exists public.oracle_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  oracle_profile_id uuid not null references public.oracle_profiles(id) on delete cascade,
  title text not null default '新命理会话',
  stage text not null default 'intake',
  summary text,
  last_message_preview text,
  last_message_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint oracle_sessions_stage_check check (stage in ('intake', 'verification', 'chart', 'analysis'))
);

create table if not exists public.oracle_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.oracle_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  constraint oracle_messages_role_check check (role in ('user', 'assistant'))
);

create table if not exists public.oracle_readings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.oracle_sessions(id) on delete cascade,
  oracle_profile_id uuid not null references public.oracle_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chart_payload jsonb not null default '{}'::jsonb,
  analysis_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_account_profiles_updated_at on public.account_profiles;
create trigger set_account_profiles_updated_at
before update on public.account_profiles
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_oracle_profiles_updated_at on public.oracle_profiles;
create trigger set_oracle_profiles_updated_at
before update on public.oracle_profiles
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_oracle_sessions_updated_at on public.oracle_sessions;
create trigger set_oracle_sessions_updated_at
before update on public.oracle_sessions
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.account_profiles enable row level security;
alter table public.oracle_profiles enable row level security;
alter table public.oracle_sessions enable row level security;
alter table public.oracle_messages enable row level security;
alter table public.oracle_readings enable row level security;

drop policy if exists "Users manage own account profile" on public.account_profiles;
create policy "Users manage own account profile"
on public.account_profiles
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own oracle profiles" on public.oracle_profiles;
create policy "Users manage own oracle profiles"
on public.oracle_profiles
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own oracle sessions" on public.oracle_sessions;
create policy "Users manage own oracle sessions"
on public.oracle_sessions
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own oracle messages" on public.oracle_messages;
create policy "Users manage own oracle messages"
on public.oracle_messages
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own oracle readings" on public.oracle_readings;
create policy "Users manage own oracle readings"
on public.oracle_readings
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.handle_new_oracle_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.account_profiles (user_id, login_id, email, display_name, focus)
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'login_id', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    'cyber-suanming'
  )
  on conflict (user_id) do nothing;

  insert into public.oracle_profiles (user_id, label, is_primary, is_alive, life_status_confirmed)
  values (new.id, '主档案', true, true, true)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_for_oracle on auth.users;
create trigger on_auth_user_created_for_oracle
after insert on auth.users
for each row
execute procedure public.handle_new_oracle_user();
