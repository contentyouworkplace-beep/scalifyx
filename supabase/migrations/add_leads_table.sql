-- Migration: Add Leads Table for website contact form submissions
-- Date: 2026-05-15

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  email TEXT,
  message TEXT,
  source TEXT DEFAULT 'website_form',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_website_id ON public.leads(website_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- Allow public inserts (contact forms are public)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a lead" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);
