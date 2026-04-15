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

-- Anonymous calculation events — logged every time someone hits Calculate
-- No user ID required — this is aggregate market data, not personal data
create table public.calc_events (
  id           uuid default gen_random_uuid() primary key,
  created_at   timestamptz default now(),
  discipline   text not null,
  experience   text not null,
  location     text not null,
  day_rate     numeric not null,   -- computed result
  below_floor  boolean not null,   -- was the rate below market floor?
  has_kit      boolean not null,
  billable_days integer not null
  -- intentionally no take_home — we don't store personal income goals
);

-- Anyone can insert — no auth required (anonymous logging)
alter table public.calc_events enable row level security;

create policy "Anyone can log a calculation"
  on public.calc_events for insert with check (true);

-- Only authenticated users (future admin) can read aggregate data
create policy "Authenticated users can read calc events"
  on public.calc_events for select using (auth.role() = 'authenticated');

-- Current rate disclosures — what people actually charge right now
-- Anonymous — discipline/experience/location only, no user ID, no income goal
-- This is the raw material for community median averages in the market range panel
create table public.current_rate_reports (
  id           uuid default gen_random_uuid() primary key,
  created_at   timestamptz default now(),
  discipline   text not null,
  experience   text not null,
  location     text not null,
  current_rate numeric not null
);

alter table public.current_rate_reports enable row level security;

create policy "Anyone can submit a rate report"
  on public.current_rate_reports for insert with check (true);

create policy "Authenticated users can read rate reports"
  on public.current_rate_reports for select using (auth.role() = 'authenticated');

-- Survey responses — did this inspire them to raise their rate?
create table public.survey_responses (
  id             uuid default gen_random_uuid() primary key,
  created_at     timestamptz default now(),
  response       text not null,
  increase_range text,        -- only set if "Yes, I'm raising it"
  discipline     text,
  experience     text,
  location       text
);

alter table public.survey_responses enable row level security;

create policy "Anyone can submit a survey response"
  on public.survey_responses for insert with check (true);

create policy "Authenticated users can read survey responses"
  on public.survey_responses for select using (auth.role() = 'authenticated');

-- Email captures — "save your results" prompt after calculating
-- Stores email + their calculated rate for follow-up marketing
create table public.email_captures (
  id           uuid default gen_random_uuid() primary key,
  created_at   timestamptz default now(),
  email        text not null,
  discipline   text,
  experience   text,
  location     text,
  day_rate     numeric,     -- their calculated minimum
  current_rate numeric      -- what they said they're currently charging (optional)
);

alter table public.email_captures enable row level security;

create policy "Anyone can submit an email capture"
  on public.email_captures for insert with check (true);

create policy "Authenticated users can read email captures"
  on public.email_captures for select using (auth.role() = 'authenticated');

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
