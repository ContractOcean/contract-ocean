-- ═══════════════════════════════════════════════════════════════════════
-- Contract Ocean — Database Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════

-- ── Profiles (extends Supabase auth.users) ────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'admin' check (role in ('admin', 'manager', 'member')),
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Contracts ─────────────────────────────────────────────────────────
create table if not exists public.contracts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  counterparty text not null default '',
  owner_id uuid references public.profiles(id) on delete set null,
  owner_name text not null default '',
  category text not null default 'Service',
  status text not null default 'draft' check (status in ('draft', 'in_review', 'sent', 'awaiting_signature', 'signed', 'completed', 'expiring_soon', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expiry_date timestamptz not null default (now() + interval '1 year'),
  value numeric not null default 0,
  signature_status text not null default 'Not sent',
  content jsonb
);

alter table public.contracts enable row level security;

create policy "Users can read own contracts"
  on public.contracts for select
  using (owner_id = auth.uid());

create policy "Users can insert own contracts"
  on public.contracts for insert
  with check (owner_id = auth.uid());

create policy "Users can update own contracts"
  on public.contracts for update
  using (owner_id = auth.uid());

create policy "Users can delete own contracts"
  on public.contracts for delete
  using (owner_id = auth.uid());

-- ── Contacts ──────────────────────────────────────────────────────────
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null default '',
  role text not null default '',
  company text not null default '',
  phone text not null default '',
  tags text[] not null default '{}',
  contract_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  last_activity timestamptz not null default now(),
  owner_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "Users can read own contacts"
  on public.contacts for select
  using (owner_id = auth.uid());

create policy "Users can insert own contacts"
  on public.contacts for insert
  with check (owner_id = auth.uid());

create policy "Users can update own contacts"
  on public.contacts for update
  using (owner_id = auth.uid());

create policy "Users can delete own contacts"
  on public.contacts for delete
  using (owner_id = auth.uid());

-- ── Templates (shared, read-only for all users) ──────────────────────
create table if not exists public.templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null default '',
  description text not null default '',
  use_case text not null default '',
  estimated_time text not null default '10 min',
  popular boolean not null default false,
  recommended boolean not null default false,
  usage_count integer not null default 0,
  content jsonb,
  created_at timestamptz not null default now()
);

alter table public.templates enable row level security;

create policy "Templates are readable by all authenticated users"
  on public.templates for select
  using (auth.role() = 'authenticated');

-- ── Activity Feed ────────────────────────────────────────────────────
create table if not exists public.activity_feed (
  id uuid default gen_random_uuid() primary key,
  action text not null,
  description text not null,
  contract_id uuid references public.contracts(id) on delete set null,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.activity_feed enable row level security;

create policy "Users can read own activity"
  on public.activity_feed for select
  using (user_id = auth.uid());

create policy "Users can insert own activity"
  on public.activity_feed for insert
  with check (user_id = auth.uid());

-- ── Updated_at trigger ───────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger contracts_updated_at
  before update on public.contracts
  for each row execute procedure public.update_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();
