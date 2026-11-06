-- ============================================================================
-- KHETBAZAAR: MIGRATION 20261019_clear_all_seed_data.sql
-- Reviewable Migration: Safely remove all seeded mock data in FK dependency order.
-- Preserves: Database structure, tables, columns, RLS policies, crops catalog, mandis.
-- Adds: Trigger to automatically designate first signed-up user as system admin.
-- ============================================================================

BEGIN;

-- 1. DELETE FROM TRANSACTIONAL & LEAF TABLES (Foreign Key Dependency Order)
-- Remove all price tracking history rows
DELETE FROM public.price_history;

-- Remove all farmer and listing reviews
DELETE FROM public.reviews;

-- Remove all user bookmarks / favorites
DELETE FROM public.favorites;

-- Remove all price and arrival alert subscriptions
DELETE FROM public.alerts;

-- Remove all consumer buyer inquiries
DELETE FROM public.inquiries;

-- Remove all listing images metadata
DELETE FROM public.listing_images;

-- 2. DELETE FROM CORE DOMAIN ENTITY TABLES
-- Remove all crop listings
DELETE FROM public.listings;

-- Remove all farmer profiles
DELETE FROM public.farmers;

-- 3. DELETE FROM IDENTITY & AUTH TABLES
-- Remove all profiles
DELETE FROM public.profiles;

-- Remove synthetic users from Supabase auth schema if table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    DELETE FROM auth.users;
  END IF;
END $$;

-- 4. CONFIGURE FIRST SIGN-UP AS SYSTEM ADMIN
-- Automatically grants 'admin' role to the very first user who creates an account.
CREATE OR REPLACE FUNCTION public.set_first_user_as_admin()
RETURNS TRIGGER AS $$
DECLARE
  existing_count integer;
BEGIN
  -- Check if any user already exists in profiles
  SELECT COUNT(*) INTO existing_count FROM public.profiles;
  
  -- If this is the first user, promote to administrator
  IF existing_count = 0 THEN
    NEW.role := 'admin';
    NEW.is_verified := true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_set_first_user_as_admin ON public.profiles;

CREATE TRIGGER trg_set_first_user_as_admin
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_first_user_as_admin();

COMMIT;

-- 5. VERIFICATION QUERY: PROVE ALL COUNTS ARE AT EXACTLY 0
SELECT
  (SELECT COUNT(*) FROM public.farmers) AS count_farmers,
  (SELECT COUNT(*) FROM public.listings) AS count_listings,
  (SELECT COUNT(*) FROM public.price_history) AS count_price_history,
  (SELECT COUNT(*) FROM public.reviews) AS count_reviews,
  (SELECT COUNT(*) FROM public.favorites) AS count_favorites,
  (SELECT COUNT(*) FROM public.alerts) AS count_alerts,
  (SELECT COUNT(*) FROM public.inquiries) AS count_inquiries;
