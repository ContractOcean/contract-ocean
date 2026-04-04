-- ═══════════════════════════════════════════════════════════════════════
-- Contract Ocean — Onboarding Fields Migration
-- Run in Supabase SQL Editor AFTER schema.sql
-- ═══════════════════════════════════════════════════════════════════════

-- Add onboarding columns to profiles
alter table public.profiles
  add column if not exists business_type text,
  add column if not exists use_case text[],
  add column if not exists country text,
  add column if not exists company_size text,
  add column if not exists industry text,
  add column if not exists plan_selected text,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists starting_point text;
