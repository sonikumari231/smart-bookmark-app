-- ============================================================
-- Smart Bookmark App — Supabase Setup SQL
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT '',
  favicon_url TEXT,
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Index for fast lookups per user
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx
  ON public.bookmarks(user_id);

CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx
  ON public.bookmarks(created_at DESC);

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER bookmarks_updated_at
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (CRITICAL)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Users can only SELECT their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only INSERT bookmarks for themselves
CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own bookmarks
CREATE POLICY "Users can update own bookmarks"
  ON public.bookmarks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only DELETE their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Enable Realtime for the bookmarks table
-- Go to: Supabase Dashboard > Database > Replication
-- Enable replication for the "bookmarks" table
-- OR run:
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;

-- ============================================================
-- VERIFICATION
-- Run these to verify setup:
-- SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
-- SELECT * FROM pg_publication_tables WHERE tablename = 'bookmarks';
-- ============================================================
