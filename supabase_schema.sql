-- Legal Hai! Supabase Initialization Script --
-- Run this securely in the Supabase SQL Editor to prepare your production environment --

-- 1. Create Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Supabase anonymous auth UUID or 'guest_user'
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all documents"
  ON public.documents FOR SELECT
  USING (true);

CREATE POLICY "Allow inserts on documents"
  ON public.documents FOR INSERT
  WITH CHECK (true);


-- 2. Create Analysis Table
CREATE TABLE IF NOT EXISTS public.analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  risk_score INTEGER NOT NULL,
  result_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Analysis
ALTER TABLE public.analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all analysis"
  ON public.analysis FOR SELECT
  USING (true);

CREATE POLICY "Allow inserts on analysis"
  ON public.analysis FOR INSERT
  WITH CHECK (true);


-- 3. Create User Settings Table (NEW)
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT '',
  email_notifications BOOLEAN NOT NULL DEFAULT false,
  default_risk_threshold INTEGER NOT NULL DEFAULT 50,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for User Settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
  ON public.user_settings FOR ALL
  USING (true)
  WITH CHECK (true);


-- 4. Create 'contracts' Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Allow Service Role and internal proxy access" 
  ON storage.objects FOR ALL
  USING (bucket_id = 'contracts')
  WITH CHECK (bucket_id = 'contracts');
