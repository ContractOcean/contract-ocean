-- ═══════════════════════════════════════════════════════════════════════
-- Contract Ocean — Phase 1: Production Schema Updates
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. Add template type + user ownership ─────────────────────────────
alter table public.templates
  add column if not exists type text not null default 'system' check (type in ('system', 'custom')),
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

-- ── 2. Mark all existing templates as system ──────────────────────────
update public.templates set type = 'system', user_id = null where type = 'system';

-- ── 3. Update RLS for templates ───────────────────────────────────────
-- Drop old policy and recreate with system + custom logic
drop policy if exists "Templates are readable by all authenticated users" on public.templates;

-- System templates: readable by all authenticated users
create policy "System templates readable by all"
  on public.templates for select
  using (type = 'system' and auth.role() = 'authenticated');

-- Custom templates: only readable by owner
create policy "Custom templates readable by owner"
  on public.templates for select
  using (type = 'custom' and user_id = auth.uid());

-- Users can insert their own custom templates
create policy "Users can insert custom templates"
  on public.templates for insert
  with check (type = 'custom' and user_id = auth.uid());

-- Users can update their own custom templates
create policy "Users can update custom templates"
  on public.templates for update
  using (type = 'custom' and user_id = auth.uid());

-- Users can delete their own custom templates
create policy "Users can delete custom templates"
  on public.templates for delete
  using (type = 'custom' and user_id = auth.uid());

-- ── 4. Add workspace support to profiles ──────────────────────────────
alter table public.profiles
  add column if not exists workspace_id uuid default gen_random_uuid();
