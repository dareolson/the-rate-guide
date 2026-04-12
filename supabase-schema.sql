-- URWorthy database schema
-- Run this in Supabase SQL Editor

-- Profiles — one per user, linked to auth.users
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  created_at    timestamptz default now(),
  email         text,
  discipline    text,
  experience    text,
  location      text,
  current_rate  numeric,   -- their actual day rate right now
  target_rate   numeric,   -- where they want to be
  has_kit       boolean default false
);

-- Rate history — log of rate changes over time
create table public.rate_history (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade,
  created_at  timestamptz default now(),
  rate        numeric not null,
  note        text     -- optional context ("raised after DC Shoes gig", etc.)
);

-- Row Level Security — users can only see their own data
alter table public.profiles     enable row level security;
alter table public.rate_history enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own rate history"
  on public.rate_history for select using (auth.uid() = user_id);

create policy "Users can insert own rate history"
  on public.rate_history for insert with check (auth.uid() = user_id);

create policy "Users can delete own rate history"
  on public.rate_history for delete using (auth.uid() = user_id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
