-- Run this in Supabase SQL Editor
create table if not exists seo_course_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  phone text not null,
  biz_type text not null,
  website text,
  date date not null,
  slot text not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  paid boolean default false,
  created_at timestamptz default now()
);

-- Index for fast slot lookup
create index if not exists idx_seo_bookings_date_slot on seo_course_bookings(date, slot);
