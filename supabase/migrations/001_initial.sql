-- Run in Supabase SQL editor or via supabase db push

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  digest_frequency text not null default 'none'
    check (digest_frequency in ('none', 'daily', 'weekly')),
  created_at timestamptz not null default now()
);

create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null default 'My watchlist',
  created_at timestamptz not null default now()
);

create table public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid not null references public.watchlists on delete cascade,
  ticker text not null,
  created_at timestamptz not null default now(),
  unique (watchlist_id, ticker)
);

create table public.market_events (
  id uuid primary key default gen_random_uuid(),
  ticker text,
  title text not null,
  event_type text not null
    check (event_type in ('earnings', 'macro', 'catalyst')),
  event_date timestamptz not null,
  why_it_matters text not null,
  watch_for text not null,
  created_at timestamptz not null default now()
);

create index market_events_event_date_idx on public.market_events (event_date);
create index market_events_ticker_idx on public.market_events (ticker) where ticker is not null;

alter table public.profiles enable row level security;
alter table public.watchlists enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.market_events enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users manage own watchlists"
  on public.watchlists for all
  using (auth.uid() = user_id);

create policy "Users manage items in own watchlists"
  on public.watchlist_items for all
  using (
    exists (
      select 1 from public.watchlists w
      where w.id = watchlist_items.watchlist_id and w.user_id = auth.uid()
    )
  );

create policy "Authenticated read market events"
  on public.market_events for select
  to authenticated
  using (true);

-- No client inserts for market_events in MVP (seed via SQL or service role)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.watchlists (user_id, name) values (new.id, 'My watchlist');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
