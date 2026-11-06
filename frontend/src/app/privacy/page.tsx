import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, MapPin, Database, UserCheck, Mail } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SproutIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy Policy & Agricultural Data Shield | KhetBazaar",
  description:
    "Plain-language privacy policy explaining how KhetBazaar protects farmer phone numbers from automated scrapers, complies with DPDP Act 2023, and respects user data.",
  openGraph: {
    title: "Privacy Policy — Protecting Rural Cultivators | KhetBazaar",
    description:
      "Compliant with India's DPDP Act 2023. Anti-scraping farmer phone protection, minimal data footprint, and zero commercial data brokering.",
    url: "https://khetbazaar.org/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full bg-[#FAF8F3] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-[var(--earth-ink)]">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[var(--earth-line)]">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="forest" size="md" icon={<ShieldCheck className="w-4 h-4" />}>
            DPDP Act 2023 Compliant
          </Badge>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight mb-4">
          Privacy Policy &amp; Agricultural Data Protection
        </h1>
        <p className="text-sm text-[var(--earth-muted)]">
          Effective Date: January 1, 2026 • Last Reviewed: October 2026
        </p>
      </div>

      <div className="prose prose-stone max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-[var(--earth-charcoal)]">
        {/* Intro */}
        <section className="bg-white rounded-2xl p-6 border border-[var(--earth-border)] shadow-2xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--forest-900)] flex items-center gap-2 m-0">
            <SproutIcon size={20} className="text-[var(--forest-700)]" />
            Our Agrarian Privacy Promise
          </h2>
          <p>
            KhetBazaar (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is operated as an open digital public
            utility for India’s agricultural community. Unlike commercial aggregators that harvest and
            monetize rural data, we believe a farmer’s personal contact details and harvest history
            belong solely to them. We strictly abide by the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
          </p>
        </section>

        {/* Section 1: Farmer Phone Number Protection */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)] flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-[var(--forest-800)]" />
            1. Farmer Phone Number Masking &amp; Anti-Scraper Shield
          </h2>
          <p>
            One of the greatest hazards facing rural Indian growers when publishing harvest availability
            online is commercial harassment: unsolicited telemarketing, high-interest micro-loan spam,
            and fraudulent intermediary middlemen scraping numbers into mass databases.
          </p>
          <p>To shield our farmers:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              Farmer contact numbers are <strong>masked by default</strong> in all publicly rendered HTML
              (e.g., <code>+91 98452 •••••</code>).
            </li>
            <li>
              Contact details can only be revealed by intentional human user interaction (&quot;Reveal
              Contact&quot;).
            </li>
            <li>
              Reveals are strictly capped via <strong>session rate limiting</strong> (maximum 5 reveals
              per 10-minute session) to defeat automated crawler scripts.
            </li>
          </ul>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)] flex items-center gap-2">
            <Database className="w-5 h-5 text-[var(--forest-800)]" />
            2. Data We Collect &amp; Why
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white border border-[var(--earth-border)]">
              <strong className="block text-[var(--forest-900)] font-serif mb-1">
                For Farmers &amp; Growers
              </strong>
              Name, village/district, mobile number (for buyer SMS/Call/WhatsApp connection), harvest
              lot details (crop name, quantity, grade, harvest date, asking price).
            </div>
            <div className="p-4 rounded-xl bg-white border border-[var(--earth-border)]">
              <strong className="block text-[var(--forest-900)] font-serif mb-1">
                For Consumers &amp; Buyers
              </strong>
              Name and contact number submitted voluntarily via inquiries or contact forms. We do not
              require registration or mandatory credit card storage to browse crops.
            </div>
          </div>
        </section>

        {/* Section 3: Geolocation */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--forest-800)]" />
            3. Geolocation &amp; APMC Mandi Proximity
          </h2>
          <p>
            When you search for crops or filter by location, we compute the distance between your
            selected district and the farmer’s village or designated APMC Mandi. We do not track your
            precise real-time GPS location in the background.
          </p>
        </section>

        {/* Section 4: PWA Offline Storage */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--forest-800)]" />
            4. Progressive Web App (PWA) Offline Storage
          </h2>
          <p>
            To accommodate rural areas with intermittent cellular coverage, our Progressive Web App
            stores recently viewed harvest listings inside your device&apos;s local browser storage
            (<code>localStorage</code> / <code>CacheStorage</code>). This data resides entirely on
            your physical phone or computer and can be purged at any time by clearing your browser cache.
          </p>
        </section>

        {/* Section 5: Third Parties & Ads */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
            5. No Advertisements &amp; No Data Brokering
          </h2>
          <p>
            We run zero third-party commercial ad networks (no Google AdSense, no Facebook tracking
            pixels, no data brokers). We will never sell, lease, or monetize your contact information.
          </p>
        </section>

        {/* Section 6: Grievance Officer */}
        <section className="p-6 rounded-2xl bg-[#F4EFE6] border border-[var(--earth-border)] space-y-3">
          <h2 className="font-serif text-lg font-bold text-[var(--forest-900)] flex items-center gap-2 m-0">
            <UserCheck className="w-5 h-5 text-[var(--forest-800)]" />
            6. Grievance Officer &amp; Redressal
          </h2>
          <p className="text-xs sm:text-sm">
            In accordance with the Information Technology Act 2000 and the DPDP Act 2023, the details
            of our appointed Grievance Officer are:
          </p>
          <div className="text-xs space-y-1 font-mono bg-white p-3 rounded-lg border border-[var(--earth-border-subtle)]">
            <div><strong>Officer:</strong> Agronomic Data Compliance Desk, KhetBazaar Initiative</div>
            <div><strong>Address:</strong> APMC Yard Complex, Yeshwanthpur, Bengaluru, Karnataka 560022</div>
            <div><strong>Email:</strong> privacy@khetbazaar.org</div>
            <div><strong>Toll-Free Helpline:</strong> 1800-425-5438 (KHET)</div>
          </div>
        </section>

        <div className="pt-6 border-t border-[var(--earth-line)] flex items-center justify-between text-xs text-[var(--earth-muted)]">
          <Link href="/terms" className="hover:text-[var(--forest-800)] underline">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-[var(--forest-800)] underline">
            Contact Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
