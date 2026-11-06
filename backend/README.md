# KhetBazaar — Backend & Database

This directory contains the database schema, migrations, security policies, and automated verification scripts for KhetBazaar.

## Directory Structure

```text
backend/
├── supabase/
│   ├── schema.sql         # Base PostgreSQL schema, tables, constraints & RLS policies
│   ├── seed.sql           # Reference catalog seed (APMC Mandis & Standard Crops)
│   ├── rls_tests.sql      # Row Level Security test suite across all 11 tables
│   └── migrations/        # Timestamped, reviewable SQL migrations
│       └── 20261019_clear_all_seed_data.sql  # Zero-data cleanup & first-user admin trigger
├── scripts/
│   ├── verify-zero-data.mjs # Automated audit asserting 0 fake rows and testing duplicate phone shield
│   └── test-phase3.mjs      # Backend, OTP rate limiter, and Zod verification tests
└── .env.example           # Supabase environment variables template
```

## Running Database Migrations

Apply migrations to your Supabase PostgreSQL database using the Supabase CLI or SQL Editor:

```bash
# Using Supabase CLI
supabase db push
# or run the migration directly via psql / Supabase SQL dashboard:
# supabase/migrations/20261019_clear_all_seed_data.sql
```

## Verification

To run the automated zero-data and admin promotion test suite:

```bash
node scripts/verify-zero-data.mjs
```
