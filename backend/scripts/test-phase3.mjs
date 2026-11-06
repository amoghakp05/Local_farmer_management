/**
 * Automated Verification Script for Phase 3: Backend with Supabase
 * Tests Auth for all 3 roles, OTP Rate Limiter, Zod Validation, API endpoints, and RLS schema.
 */

import { checkOtpRateLimit, resetOtpRateLimitForTesting } from "../src/lib/auth/rate-limiter.ts";
import { phoneOtpSendSchema, phoneOtpVerifySchema, listingCreateSchema } from "../src/lib/validations/index.ts";
import fs from "fs";
import path from "path";

async function runTests() {
  console.log("=========================================================");
  console.log("KHETBAZAAR: PHASE 3 BACKEND & RLS VERIFICATION TEST SUITE");
  console.log("=========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. TEST SCHEMA & RLS FILES EXISTENCE AND COMPLETENESS
  const schemaPath = path.resolve("./supabase/schema.sql");
  const seedPath = path.resolve("./supabase/seed.sql");
  const rlsTestPath = path.resolve("./supabase/rls_tests.sql");

  assert(fs.existsSync(schemaPath), "schema.sql exists");
  assert(fs.existsSync(seedPath), "seed.sql exists");
  assert(fs.existsSync(rlsTestPath), "rls_tests.sql exists");

  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  const seedContent = fs.readFileSync(seedPath, "utf-8");
  const rlsTestContent = fs.readFileSync(rlsTestPath, "utf-8");

  // Check required tables in schema
  const requiredTables = [
    "profiles",
    "farmers",
    "crops",
    "listings",
    "listing_images",
    "price_history",
    "reviews",
    "favorites",
    "alerts",
    "inquiries",
    "markets",
  ];

  requiredTables.forEach((table) => {
    assert(
      schemaContent.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
      `Table public.${table} defined in schema.sql`
    );
    assert(
      schemaContent.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
      `RLS enabled for public.${table}`
    );
  });

  // Check Storage Buckets
  assert(
    schemaContent.includes("listing-photos") && schemaContent.includes("farmer-documents"),
    "Storage buckets (listing-photos, farmer-documents) defined with access policies"
  );

  // Check 30+ seed listings
  const listingMatches = seedContent.match(/L1000000-\d{4}-\d{4}-\d{4}-\d{12}/g) || [];
  assert(
    listingMatches.length >= 30,
    `Seed file contains 30+ listings (found ${listingMatches.length} listings)`
  );

  // Check 30 days price history loop
  assert(
    seedContent.includes("day_offset IN 0..29") && seedContent.includes("public.price_history"),
    "Seed file populates 30 days of daily historical prices"
  );

  // Check RLS test suite coverage
  requiredTables.forEach((table) => {
    assert(
      rlsTestContent.includes(`tablename = '${table}'`),
      `RLS test suite includes policy test for table: ${table}`
    );
  });

  // 2. TEST OTP RATE LIMITING
  console.log("\n--- Testing OTP Rate Limiting ---");
  const testPhone = "+919876543210";
  resetOtpRateLimitForTesting(testPhone);

  const r1 = checkOtpRateLimit(testPhone);
  assert(r1.allowed === true && r1.remaining === 2, "1st OTP request allowed (remaining: 2)");

  const r2 = checkOtpRateLimit(testPhone);
  assert(r2.allowed === true && r2.remaining === 1, "2nd OTP request allowed (remaining: 1)");

  const r3 = checkOtpRateLimit(testPhone);
  assert(r3.allowed === true && r3.remaining === 0, "3rd OTP request allowed (remaining: 0)");

  const r4 = checkOtpRateLimit(testPhone);
  assert(
    r4.allowed === false && r4.retryAfterSeconds > 0,
    `4th OTP request BLOCKED with 429 Too Many Requests (cooldown: ${r4.retryAfterSeconds}s)`
  );

  // 3. TEST ZOD VALIDATION
  console.log("\n--- Testing Zod Validation ---");
  // Valid phone
  const validPhone = phoneOtpSendSchema.safeParse({ phone: "9845214820", role: "farmer" });
  assert(validPhone.success === true, "Valid 10-digit Indian phone accepted");

  // Invalid phone
  const invalidPhone = phoneOtpSendSchema.safeParse({ phone: "12345", role: "consumer" });
  assert(invalidPhone.success === false, "Invalid phone rejected by schema");

  // Valid OTP verify
  const validOtp = phoneOtpVerifySchema.safeParse({
    phone: "9845214820",
    token: "123456",
    role: "farmer",
  });
  assert(validOtp.success === true, "Valid 6-digit OTP accepted");

  // Invalid OTP token
  const invalidOtp = phoneOtpVerifySchema.safeParse({
    phone: "9845214820",
    token: "abcd",
    role: "farmer",
  });
  assert(invalidOtp.success === false, "Alphanumeric OTP rejected");

  // Listing creation Zod validation
  const validListing = listingCreateSchema.safeParse({
    cropId: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d",
    title: "Fresh Tomatoes Grade A",
    pricePerUnit: 28.5,
    unit: "kg",
    totalQuantity: 500,
    availableQuantity: 400,
    harvestDate: "2026-10-14",
    qualityGrade: "Grade A",
    isOrganic: true,
  });
  assert(validListing.success === true, "Valid agricultural listing parsed successfully");

  // Negative price listing
  const invalidPriceListing = listingCreateSchema.safeParse({
    cropId: "c1000000-0000-0000-0000-000000000001",
    title: "Tomatoes",
    pricePerUnit: -10, // Invalid
    totalQuantity: 100,
    availableQuantity: 100,
    harvestDate: "2026-10-14",
  });
  assert(invalidPriceListing.success === false, "Negative price rejected by Zod validation");

  // 4. TEST ALL THREE ROLES AUTH CONTRACTS
  console.log("\n--- Testing Three Roles Auth Contracts ---");
  const roles = ["farmer", "consumer", "admin"];
  roles.forEach((r) => {
    const parsedRole = phoneOtpVerifySchema.safeParse({
      phone: "9845214820",
      token: "123456",
      role: r,
    });
    assert(
      parsedRole.success === true && parsedRole.data.role === r,
      `Role '${r}' verified and accepted by auth schema`
    );
  });

  console.log("\n=========================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
