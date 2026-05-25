-- ============================================
-- Work progress & task comments tables
-- Run this in Supabase SQL Editor
-- ============================================

-- Task completion tracking
CREATE TABLE IF NOT EXISTS public.website_progress (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_key TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, task_key)
);

CREATE INDEX IF NOT EXISTS idx_website_progress_user_id ON public.website_progress(user_id);

ALTER TABLE public.website_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.website_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all progress"
  ON public.website_progress FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Task comments (also used for work chat with task_key = '__chat__')
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_key TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT NOT NULL DEFAULT '',
  author_role TEXT NOT NULL DEFAULT 'user' CHECK (author_role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON public.task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_key ON public.task_comments(task_key);

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task comments"
  ON public.task_comments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task comments"
  ON public.task_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON public.task_comments FOR DELETE
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all task comments"
  ON public.task_comments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Admin coupon table (used by apply-coupon endpoint)
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL DEFAULT 1499,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coupons"
  ON public.admin_coupons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all coupons"
  ON public.admin_coupons FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Admin SELECT policy on profiles
-- (was missing — caused admin dashboard to show empty users list)
-- Uses a SECURITY DEFINER function to avoid infinite RLS recursion
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  )
$$;

-- Drop existing profile policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());
