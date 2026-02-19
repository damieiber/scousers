-- Create a table for public profiles using Supabase structure
create table public.user_profiles (
  id uuid not null references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  primary_team_id uuid references public.teams(id),
  secondary_team_ids uuid[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id),
  constraint username_length check (char_length(full_name) >= 3)
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.user_profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.user_profiles for update
  using ( auth.uid() = id );

-- Create a function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
