# KhetBazaar (ಖೇತ್ ಬಜಾರ್ / खेत बाज़ार)
### Direct Soil-to-Table Agricultural Market Information System

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-1B4332?style=flat)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌾 Overview & Purpose

In India's conventional agricultural supply chains, smallholder farmers lose **30% to 55% of their crop value** across 4–5 tiers of unregulated intermediaries, village aggregators, and commission cartels. A farmer selling tomatoes in Kolar for ₹12/kg frequently watches city consumers buy them for ₹48/kg—yet the grower absorbs all the climatic and economic volatility.

**KhetBazaar** is an open digital public utility engineered to eliminate intermediary exploitation by:
1. **Juxtaposing Direct Farm Prices with Real-time APMC Mandi Benchmarks:** Buyers and farmers see prevailing wholesale and retail modal rates (Agmarknet) side-by-side with farm-gate asking prices.
2. **Direct Producer-to-Consumer Connection:** 100% direct trade settlements with zero broker commissions or take-rates.
3. **Verified Agricultural Traceability:** Harvest lots specify exact harvest dates (down to 24 hours), village origin, soil type, and Agmarknet quality grade (Grade A+, Grade A, Grade B).
4. **Anti-Scraper Bot Shield:** Farmer mobile numbers are masked and rate-limited behind human interaction triggers to prevent predatory loan sharks and telemarketers from scraping rural databases.
5. **Trilingual Rural-First Accessibility:** Full native interfaces in **Kannada (ಕನ್ನಡ)**, **Hindi (हिन्दी)**, and **English**, coupled with an offline-capable Progressive Web App (PWA).

---

## 🏛️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       KhetBazaar Core                       │
├───────────────────────────────┬─────────────────────────────┤
│ Frontend Presentation Layer   │ Next.js 16 (Turbopack)      │
│                               │ React 19 (Server Components)│
│                               │ Tailwind CSS v4             │
├───────────────────────────────┼─────────────────────────────┤
│ 3D Spatial Storytelling       │ Three.js + @react-three/fiber│
│                               │ GSAP ScrollTrigger + Lenis  │
├───────────────────────────────┼─────────────────────────────┤
│ Geospatial & Mapping          │ MapLibre GL + OpenStreetMap │
├───────────────────────────────┼─────────────────────────────┤
│ Offline PWA & Persistence     │ Service Worker CacheStorage │
│                               │ Offline Vault (localStorage)│
├───────────────────────────────┼─────────────────────────────┤
│ Validation & Security         │ Zod + Token Bucket Rate Limiter│
│                               │ Anti-Bot Honeypots & Masking │
├───────────────────────────────┼─────────────────────────────┤
│ Database & Storage Layer      │ Supabase (PostgreSQL + RLS)  │
│                               │ In-Memory Fallback Repository│
└───────────────────────────────┴─────────────────────────────┘
```

### 📁 Repository Structure

```text
Local farmer management/
├── frontend/                     # Web Application (Next.js 16, React 19, Tailwind CSS v4)
│   ├── src/
│   │   ├── app/                  # App Router Pages & API Routes
│   │   ├── components/           # UI, 3D Canvas, Home, Crops, Layout
│   │   ├── lib/                  # Utilities, Auth, Repositories, i18n
│   │   └── messages/             # Localization (en.json, kn.json, hi.json)
│   ├── public/                   # Static assets, icons, manifest, service worker
│   └── package.json              # Frontend dependencies and scripts
│
└── backend/                      # Database & Backend Infrastructure
    ├── supabase/
    │   ├── schema.sql            # Core PostgreSQL schema & RLS policies
    │   ├── seed.sql              # Static Mandis and Crops catalog reference
    │   └── migrations/           # Reviewable zero-data & admin migration
    └── scripts/                  # Automated verification and audit test scripts
```

- **Framework:** Next.js 16.4 with Turbopack, App Router, Cache Components, and Partial Prerendering.
- **Styling:** Tailwind CSS v4 with curated earthy color palette (`--forest-900`, `--harvest-600`, `--canvas: #FAF8F3`, subtle grain texture).
- **3D Visualization:** Dynamic `@react-three/fiber` canvas rendering the interactive 5-stage Harvest Journey with fallback graceful degradation.
- **Geographic Exploration:** High-performance MapLibre GL map with interactive markers across 18 Karnataka APMC mandis.
- **Type Safety & Validation:** End-to-end TypeScript with Zod schemas for all listings, inquiries, and contact submissions.

---

## ⚡ Key Features

### 1. Marketplace with Split List & Map View (`/crops`)
- Real-time debounced search by crop name, Kannada name, farmer, or district.
- Multi-dimensional filters: Crop Category (Vegetables, Grains, Pulses, Spices), Karnataka District (Kolar, Haveri, Dharwad, Mandya, Belagavi), 100% Organic, and Quality Grade.
- URL-synchronized state enabling instant link sharing and bookmarking.

### 2. Crop Lot Detail & Mandi Price Benchmarking (`/crops/[id]`)
- Interactive price calculator (per kg & per quintal bulk conversion).
- Historical mandi trend charts juxtaposing APMC market rates with farm-gate price.
- Direct contact modal with bot-shielded phone reveal.
- Schema.org `Product` and `Offer` structured data.

### 3. APMC Mandi Network Directory (`/markets`)
- Interactive MapLibre GL map pinpointing major Karnataka agricultural yards:
  - Yeshwanthpur APMC (Bengaluru)
  - Bandipalya APMC (Mysuru)
  - Amargol APMC (Hubballi)
  - Kolar Tomato Market Yard
  - APMC Haveri & Belagavi
- Operating hours, contact numbers, and district lot filtering.

### 4. Verified Farmers Directory & Profile (`/farmers`, `/farmers/[id]`)
- Verified grower credentials: Land acres, farming experience, FPO affiliation, soil health card, KSOCA organic certification.
- Community reviews and trust ratings (1 to 5 stars).
- Schema.org `LocalBusiness` / `AgriculturalProducer` structured data.

### 5. Farmer 30-Second Listing Dashboard (`/dashboard/farmer`)
- Rapid harvest listing form designed for rural mobile screens.
- Tracks contact reveals, active stock, and mandi price alerts.

### 6. PWA & Offline Harvest Vault
- Progressive Web App installable on Android, iOS, and Desktop.
- Service Worker caching app shell and static resources.
- Automatically stores recently browsed crops in the device's local vault, viewable even during cellular blackouts.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.18.0 or later (v20+ recommended)
- **npm:** v9+ or **pnpm** / **yarn**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/khetbazaar.git
cd "Local farmer management"
npm install
```

### 2. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Next.js Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Supabase (Optional: in-memory mock repository works automatically)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Map Tile Configuration
NEXT_PUBLIC_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/bright

# Security
RATE_LIMIT_CONTACT_PER_MIN=5
ENCRYPTION_SECRET=your-32-char-random-secret-here
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Seeding & Mock Fallback

KhetBazaar contains a production-ready dual data layer:
1. **Supabase PostgreSQL Schema:** Located in `supabase/migrations/`. Contains tables for `crops`, `farmers`, `markets`, `listings`, `inquiries`, and `reviews` with Row-Level Security (RLS) policies.
2. **In-Memory Fallback Repository:** (`src/lib/data/listings-repository.ts` and `farmers-repository.ts`):
   - Pre-seeded with 10 realistic Karnataka harvest lots (Kolar hybrid tomatoes, Hassan heirloom ragi, Byadgi chillies, Dharwad green capsicum, Mandya jaggery sugarcane).
   - Functions automatically without any external database configuration out of the box.

To run the Supabase seed script manually:
```bash
npm run seed # or node scripts/seed.mjs
```

---

## 🌐 Vercel Deployment

Deploying KhetBazaar to Vercel takes under 2 minutes:

### Option A: One-Click Deploy via Vercel Dashboard
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Configure the Project Settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Add the Environment Variables:
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (e.g., `https://khetbazaar.vercel.app`)
   - `NEXT_PUBLIC_DEFAULT_LOCALE`: `en`
   - (Optional) `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

### Option B: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🛡️ Security & Anti-Bot Protection

- **Input Sanitization:** All API endpoints (`/api/inquiries`, `/api/listings`, `/api/contact`) validate payloads against strict Zod schemas with regex checks for Indian mobile numbers (`indianPhoneRegex`).
- **Token Bucket Rate Limiting:** Sliding-window in-memory rate limiter (`src/lib/security/rate-limit.ts`) prevents automated DDOS and rapid-fire listing submissions.
- **Bot Honeypots:** Contact forms feature hidden honeypot fields that trap automated spam crawlers.
- **Phone Masking & Rate-Limited Reveal:** Grower telephone numbers are disguised in public DOM trees. Unlocking contacts requires user clicks and is limited to 5 reveals per session.

---

## ♿ Accessibility (WCAG 2.1 AA)

- **Skip Navigation:** Jump directly to `#main-content` for keyboard and screen-reader users.
- **Focus Rings:** Visible high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-[var(--forest-700)]`) across all interactive buttons, inputs, and tab triggers.
- **ARIA Semantics:** Proper roles (`role="alert"`, `aria-busy`, `aria-invalid`, `aria-describedby`, `aria-expanded`).
- **Color Contrast:** All body typography, badges, and status labels exceed the 4.5:1 WCAG AA contrast ratio threshold.
- **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` automatically silences Three.js, GSAP, and CSS animations.

---

## 📄 License & Community Covenant

Distributed under the MIT License. Built with pride for Karnataka's and India's agricultural community.

**KhetBazaar Initiative — Direct from the Soil to Your Table.**
