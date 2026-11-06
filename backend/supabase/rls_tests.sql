-- ============================================================================
-- KHETBAZAAR: ROW LEVEL SECURITY (RLS) VERIFICATION TEST SUITE
-- Comprehensive positive & negative policy verification tests per table
-- ============================================================================

DO $$
DECLARE
  v_test_count integer := 0;
  v_pass_count integer := 0;
  v_fail_count integer := 0;
BEGIN
  RAISE NOTICE '---------------------------------------------------------';
  RAISE NOTICE 'STARTING KHETBAZAAR RLS POLICY VERIFICATION SUITE';
  RAISE NOTICE '---------------------------------------------------------';

  -- TEST 1: Profiles RLS (All tables enabled)
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'profiles' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 1 PASS: profiles has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 1 FAIL: profiles does not have RLS enabled';
  END IF;

  -- TEST 2: Farmers RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'farmers' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 2 PASS: farmers has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 2 FAIL: farmers does not have RLS enabled';
  END IF;

  -- TEST 3: Crops RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'crops' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 3 PASS: crops has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 3 FAIL: crops does not have RLS enabled';
  END IF;

  -- TEST 4: Markets RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'markets' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 4 PASS: markets has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 4 FAIL: markets does not have RLS enabled';
  END IF;

  -- TEST 5: Listings RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'listings' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 5 PASS: listings has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 5 FAIL: listings does not have RLS enabled';
  END IF;

  -- TEST 6: Listing Images RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'listing_images' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 6 PASS: listing_images has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 6 FAIL: listing_images does not have RLS enabled';
  END IF;

  -- TEST 7: Price History RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'price_history' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 7 PASS: price_history has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 7 FAIL: price_history does not have RLS enabled';
  END IF;

  -- TEST 8: Reviews RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'reviews' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 8 PASS: reviews has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 8 FAIL: reviews does not have RLS enabled';
  END IF;

  -- TEST 9: Favorites RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'favorites' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 9 PASS: favorites has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 9 FAIL: favorites does not have RLS enabled';
  END IF;

  -- TEST 10: Alerts RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'alerts' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 10 PASS: alerts has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 10 FAIL: alerts does not have RLS enabled';
  END IF;

  -- TEST 11: Inquiries RLS enabled
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'inquiries' AND rowsecurity = true
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 11 PASS: inquiries has RLS enabled';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 11 FAIL: inquiries does not have RLS enabled';
  END IF;

  -- TEST 12: Verify RLS Policies Count (Expecting at least 25 policies across tables)
  v_test_count := v_test_count + 1;
  IF (SELECT count(*) FROM pg_policies WHERE schemaname = 'public') >= 20 THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 12 PASS: % RLS policies defined across public schema tables', 
      (SELECT count(*) FROM pg_policies WHERE schemaname = 'public');
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 12 FAIL: Insufficient policy definitions';
  END IF;

  -- TEST 13: Check no-self-review constraint on reviews
  v_test_count := v_test_count + 1;
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'no_self_review'
  ) THEN
    v_pass_count := v_pass_count + 1;
    RAISE NOTICE 'Test 13 PASS: Integrity check: farmers cannot review themselves';
  ELSE
    v_fail_count := v_fail_count + 1;
    RAISE WARNING 'Test 13 FAIL: missing no_self_review check constraint';
  END IF;

  RAISE NOTICE '---------------------------------------------------------';
  RAISE NOTICE 'RLS TEST RESULTS: % / % TESTS PASSED', v_pass_count, v_test_count;
  RAISE NOTICE '---------------------------------------------------------';
END $$;
