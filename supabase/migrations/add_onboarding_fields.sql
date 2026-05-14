-- Migration: Add Onboarding Fields to Profiles and Websites Tables
-- Purpose: Support 5-step onboarding flow with domain verification
-- Date: 2026-05-14

-- ============================================
-- 1. Add Onboarding Fields to PROFILES Table
-- ============================================

-- Basic Business Info
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_category VARCHAR(100);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_city VARCHAR(100);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_maps_link TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_description TEXT;

-- Branding
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS existing_website_url TEXT;

-- Domain Management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS domain_name VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS domain_purchased BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS domain_skipped_until TIMESTAMPTZ;

-- Services & Gallery (JSON arrays)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';

-- Onboarding Status
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- ============================================
-- 2. Add Preview & Admin Fields to WEBSITES Table
-- ============================================

ALTER TABLE public.websites ADD COLUMN IF NOT EXISTS preview_website_url TEXT;
ALTER TABLE public.websites ADD COLUMN IF NOT EXISTS awaiting_admin_review BOOLEAN DEFAULT true;
ALTER TABLE public.websites ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Note: domain_name field already exists in websites table (line 98 in schema.sql references it in custom_domain)
-- For clarity, we're using custom_domain field that already exists. No need to add domain_name again.
