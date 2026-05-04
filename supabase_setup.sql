-- ============================================================
-- Scalify — Supabase Tables Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- 1. Web Push Subscriptions (browser push notifications)
create table if not exists web_push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  subscription jsonb not null,
  endpoint    text unique not null,
  created_at  timestamptz default now()
);

-- Index for fast lookup by user
create index if not exists web_push_subscriptions_user_id_idx
  on web_push_subscriptions (user_id);

-- RLS: only backend service role can read/write
alter table web_push_subscriptions enable row level security;

create policy "service role only" on web_push_subscriptions
  using (auth.role() = 'service_role');


-- 2. Contact Form Submissions
create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text default 'Other',
  message    text not null,
  created_at timestamptz default now()
);

-- RLS: only backend service role can read/write
alter table contact_submissions enable row level security;

create policy "service role only" on contact_submissions
  using (auth.role() = 'service_role');


-- 3. Add razorpay_payment_link_url column to offers table
-- (skip if column already exists)
alter table offers
  add column if not exists razorpay_payment_link_url text;

-- ============================================================
-- DONE. Tables created successfully.
-- ============================================================
