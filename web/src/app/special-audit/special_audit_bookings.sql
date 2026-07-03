-- Run this in Supabase SQL Editor
create table if not exists special_audit_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  phone text not null,
  biz_type text not null,
  city text,
  website text,
  date date not null,
  slot text not null,
  created_at timestamptz default now()
);

-- Index for fast slot lookup
create index if not exists idx_special_audit_bookings_date_slot on special_audit_bookings(date, slot);

create table if not exists special_audit_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  phone text not null,
  biz_type text,
  city text,
  website text,
  created_at timestamptz default now()
);
