-- ============================================================================
-- KHETBAZAAR: LOCAL FARMER MARKET INFORMATION SYSTEM
-- Complete Supabase Postgres Database Schema with Row Level Security (RLS)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS FOR ROLE-BASED ACCESS CONTROL
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_farmer()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'farmer'
  );
$$;

-- ============================================================================
-- 3. CORE TABLES DEFINITION
-- ============================================================================

-- Table 1: User Profiles (Synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text UNIQUE,
  email text UNIQUE,
  role text NOT NULL DEFAULT 'consumer' CHECK (role IN ('farmer', 'consumer', 'admin')),
  avatar_url text,
  preferred_locale text NOT NULL DEFAULT 'en' CHECK (preferred_locale IN ('en', 'kn', 'hi')),
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table 2: Farmers Detail (1:1 with Profiles where role = 'farmer')
CREATE TABLE IF NOT EXISTS public.farmers (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_name text NOT NULL,
  village text NOT NULL,
  taluk text NOT NULL,
  district text NOT NULL,
  state text NOT NULL DEFAULT 'Karnataka',
  farm_size_acres numeric(6, 2) NOT NULL CHECK (farm_size_acres > 0),
  organic_certified boolean NOT NULL DEFAULT false,
  ksoca_cert_number text,
  experience_years integer CHECK (experience_years >= 0),
  bio text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table 3: Local Mandis & Markets (APMC / Rythu Bazaars)
CREATE TABLE IF NOT EXISTS public.markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_kn text,
  name_hi text,
  market_type text NOT NULL CHECK (market_type IN ('apmc', 'rythu_bazaar', 'private_yard', 'fpo_hub')),
  district text NOT NULL,
  state text NOT NULL DEFAULT 'Karnataka',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  operating_hours text NOT NULL DEFAULT '05:00 AM - 02:00 PM',
  contact_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 4: Crops Catalog (Standardized produce reference)
CREATE TABLE IF NOT EXISTS public.crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_kn text NOT NULL,
  name_hi text NOT NULL,
  category text NOT NULL CHECK (category IN ('vegetables', 'fruits', 'grains', 'pulses', 'spices', 'oilseeds')),
  season text NOT NULL CHECK (season IN ('kharif', 'rabi', 'zaid', 'all_year')),
  standard_unit text NOT NULL DEFAULT 'kg' CHECK (standard_unit IN ('kg', 'quintal', 'bag', 'crate', 'dozen')),
  msp_benchmark_price numeric(10, 2) CHECK (msp_benchmark_price >= 0),
  shelf_life_days integer NOT NULL DEFAULT 5,
  icon_name text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 5: Farmer Listings (Active lots with price, quantity & quality grade)
CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  crop_id uuid NOT NULL REFERENCES public.crops(id) ON DELETE RESTRICT,
  market_id uuid REFERENCES public.markets(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  price_per_unit numeric(10, 2) NOT NULL CHECK (price_per_unit > 0),
  unit text NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'quintal', 'bag', 'crate', 'dozen')),
  total_quantity numeric(10, 2) NOT NULL CHECK (total_quantity > 0),
  available_quantity numeric(10, 2) NOT NULL CHECK (available_quantity >= 0),
  minimum_order_quantity numeric(10, 2) NOT NULL DEFAULT 1 CHECK (minimum_order_quantity > 0),
  harvest_date date NOT NULL,
  quality_grade text NOT NULL DEFAULT 'Grade A' CHECK (quality_grade IN ('Grade A+', 'Grade A', 'Grade B', 'Standard')),
  is_organic boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'expired', 'under_review', 'delisted')),
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table 6: Listing Images
CREATE TABLE IF NOT EXISTS public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 7: Historical Price Records (30-day daily tracking per crop & market)
CREATE TABLE IF NOT EXISTS public.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id uuid NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  market_id uuid NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  recorded_date date NOT NULL,
  modal_price numeric(10, 2) NOT NULL CHECK (modal_price >= 0),
  min_price numeric(10, 2) NOT NULL CHECK (min_price >= 0),
  max_price numeric(10, 2) NOT NULL CHECK (max_price >= min_price),
  arrivals_quintals numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(crop_id, market_id, recorded_date)
);

-- Table 8: Farmer Reviews & Trust Ratings
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  consumer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_verified_buyer boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_review CHECK (farmer_id <> consumer_id)
);

-- Table 9: User Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Table 10: Price & Arrival Alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_id uuid NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  market_id uuid REFERENCES public.markets(id) ON DELETE SET NULL,
  target_price numeric(10, 2),
  alert_type text NOT NULL CHECK (alert_type IN ('price_drop', 'new_arrival', 'mandi_rate')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 11: Buyer Inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  consumer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consumer_name text NOT NULL,
  consumer_phone text NOT NULL,
  quantity_requested numeric(10, 2) CHECK (quantity_requested > 0),
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table 12: Rate Limiting Store for OTP Verification & Bot Protection
CREATE TABLE IF NOT EXISTS public.otp_rate_limits (
  phone text PRIMARY KEY,
  request_count integer NOT NULL DEFAULT 1,
  first_request_at timestamptz NOT NULL DEFAULT now(),
  last_request_at timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz
);

-- ============================================================================
-- 4. PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_listings_farmer ON public.listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_crop ON public.listings(crop_id);
CREATE INDEX IF NOT EXISTS idx_listings_market ON public.listings(market_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_price_history_lookup ON public.price_history(crop_id, market_id, recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_farmer ON public.inquiries(farmer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_consumer ON public.inquiries(consumer_id);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- 5.1 PROFILES POLICIES
-- Anyone can view public basic profile details
CREATE POLICY "Public profiles are readable by all"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- 5.2 FARMERS POLICIES
-- Anyone can view farmers directory
CREATE POLICY "Public can view farmers"
  ON public.farmers FOR SELECT
  USING (true);

-- Farmers can edit only their own farm record
CREATE POLICY "Farmers can update own farm record"
  ON public.farmers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Farmers can insert own farm record"
  ON public.farmers FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all farmer records"
  ON public.farmers FOR ALL
  USING (public.is_admin());

-- 5.3 CROPS POLICIES
CREATE POLICY "Anyone can view crops catalog"
  ON public.crops FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify crops catalog"
  ON public.crops FOR ALL
  USING (public.is_admin());

-- 5.4 MARKETS POLICIES
CREATE POLICY "Anyone can view markets"
  ON public.markets FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify markets"
  ON public.markets FOR ALL
  USING (public.is_admin());

-- 5.5 LISTINGS POLICIES
-- Public can view active listings
CREATE POLICY "Public can view active listings"
  ON public.listings FOR SELECT
  USING (status = 'active' OR farmer_id = auth.uid() OR public.is_admin());

-- Farmers can insert their own listings
CREATE POLICY "Farmers can insert own listings"
  ON public.listings FOR INSERT
  WITH CHECK (farmer_id = auth.uid() AND public.is_farmer());

-- Farmers can update their own listings
CREATE POLICY "Farmers can update own listings"
  ON public.listings FOR UPDATE
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

-- Farmers can delete own listings
CREATE POLICY "Farmers can delete own listings"
  ON public.listings FOR DELETE
  USING (farmer_id = auth.uid());

-- Admins can manage all listings (moderation)
CREATE POLICY "Admins can moderate all listings"
  ON public.listings FOR ALL
  USING (public.is_admin());

-- 5.6 LISTING IMAGES POLICIES
CREATE POLICY "Public can view listing images"
  ON public.listing_images FOR SELECT
  USING (true);

CREATE POLICY "Farmers can add images to own listings"
  ON public.listing_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = listing_id AND farmer_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can delete images from own listings"
  ON public.listing_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = listing_id AND farmer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage listing images"
  ON public.listing_images FOR ALL
  USING (public.is_admin());

-- 5.7 PRICE HISTORY POLICIES
CREATE POLICY "Anyone can read price history"
  ON public.price_history FOR SELECT
  USING (true);

CREATE POLICY "Only admins or automated ingest can write price history"
  ON public.price_history FOR ALL
  USING (public.is_admin());

-- 5.8 REVIEWS POLICIES
CREATE POLICY "Public can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Consumers can write reviews for farmers"
  ON public.reviews FOR INSERT
  WITH CHECK (consumer_id = auth.uid() AND farmer_id <> auth.uid());

CREATE POLICY "Consumers can update own review"
  ON public.reviews FOR UPDATE
  USING (consumer_id = auth.uid())
  WITH CHECK (consumer_id = auth.uid());

CREATE POLICY "Admins can delete inappropriate reviews"
  ON public.reviews FOR DELETE
  USING (public.is_admin());

-- 5.9 FAVORITES POLICIES
CREATE POLICY "Users can only read own favorites"
  ON public.favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can only insert own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only delete own favorites"
  ON public.favorites FOR DELETE
  USING (user_id = auth.uid());

-- 5.10 ALERTS POLICIES
CREATE POLICY "Users can only read own alerts"
  ON public.alerts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can only insert own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only update own alerts"
  ON public.alerts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only delete own alerts"
  ON public.alerts FOR DELETE
  USING (user_id = auth.uid());

-- 5.11 INQUIRIES POLICIES
-- Buyer who inquired or the farmer who received inquiry can view it
CREATE POLICY "Involved parties can view inquiries"
  ON public.inquiries FOR SELECT
  USING (consumer_id = auth.uid() OR farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Consumers can submit inquiry"
  ON public.inquiries FOR INSERT
  WITH CHECK (consumer_id = auth.uid());

CREATE POLICY "Involved parties can update inquiry status"
  ON public.inquiries FOR UPDATE
  USING (consumer_id = auth.uid() OR farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (consumer_id = auth.uid() OR farmer_id = auth.uid() OR public.is_admin());

-- 5.12 OTP RATE LIMITS POLICIES
CREATE POLICY "Only server role or admin can manage rate limits"
  ON public.otp_rate_limits FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 6. STORAGE BUCKETS CONFIGURATION
-- ============================================================================

-- Insert storage buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('listing-photos', 'listing-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('farmer-documents', 'farmer-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
CREATE POLICY "Public Access for Listing Photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-photos');

CREATE POLICY "Authenticated Farmers Upload Listing Photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Farmers Can Delete Own Listing Photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-photos'
    AND (auth.uid() = owner OR public.is_admin())
  );
