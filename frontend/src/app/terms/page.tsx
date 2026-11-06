import { Metadata } from "next";
import Link from "next/link";
import { Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { WheatIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Terms of Service & Agrarian Trading Standards | KhetBazaar",
  description:
    "Direct-to-consumer trading charter, APMC mandi rate disclaimers, farmer grading standards, and fair settlement terms on KhetBazaar.",
  openGraph: {
    title: "Terms of Service — Direct Agricultural Standards | KhetBazaar",
    description:
      "Open informational standard connecting farmers and consumers without intermediary fees. Read our fair-trading terms and grading covenants.",
    url: "https://khetbazaar.org/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="w-full bg-[#FAF8F3] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-[var(--earth-ink)]">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[var(--earth-line)]">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="harvest" size="md" icon={<Scale className="w-4 h-4" />}>
            Fair Trade Charter
          </Badge>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight mb-4">
          Terms of Service &amp; Community Standards
        </h1>
        <p className="text-sm text-[var(--earth-muted)]">
          Last Updated: January 2026 • Governing Law: Jurisdiction of Karnataka, India
        </p>
      </div>

      <div className="prose prose-stone max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-[var(--earth-charcoal)]">
        {/* Preamble */}
        <section className="bg-white rounded-2xl p-6 border border-[var(--earth-border)] shadow-2xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--forest-900)] flex items-center gap-2 m-0">
            <WheatIcon size={20} className="text-[var(--harvest-700)]" />
            Preamble: Direct Soil-to-Market Covenant
          </h2>
          <p>
            Welcome to <strong>KhetBazaar</strong>. By accessing or listing agricultural produce on this
            platform, you agree to uphold our community standards of agrarian fairness, transparency,
            and mutual respect. KhetBazaar is an open market discovery network engineered to empower
            producers and eliminate intermediary rent-seeking.
          </p>
        </section>

        {/* 1. Informational Directory Status */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
            1. Platform Status &amp; Direct Transaction Model
          </h2>
          <p>
            KhetBazaar acts solely as an <strong>informational discovery medium</strong> between
            independent cultivators and consumers/buyers. Specifically:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              <strong>Zero Commission:</strong> KhetBazaar charges no platform fees, brokerage
              commissions, or transaction percentage on trades arranged through our platform.
            </li>
            <li>
              <strong>Direct Settlement:</strong> Physical delivery, inspection, weight verification,
              and cash or UPI payment settlements occur directly between buyer and seller.
            </li>
            <li>
              <strong>No Custody:</strong> KhetBazaar does not take physical possession of produce,
              nor do we operate holding warehouses.
            </li>
          </ul>
        </section>

        {/* 2. Farmer Listing Standards */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
            2. Farmer Listing Integrity &amp; Quality Grading
          </h2>
          <p>
            Farmers listing crops certify that the information provided represents honest farm-gate
            realities:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white border border-[var(--earth-border)]">
              <strong className="block text-[var(--forest-900)] mb-1">Quality Grading</strong>
              Listings marked <em>Grade A+</em> or <em>Grade A</em> must conform to standard Agmarknet
              ripeness, uniform sizing, and pest-free criteria.
            </div>
            <div className="p-4 rounded-xl bg-white border border-[var(--earth-border)]">
              <strong className="block text-[var(--forest-900)] mb-1">Organic Claims</strong>
              Produce tagged as &quot;100% Organic&quot; must be cultivated without prohibited synthetic
              pesticides or hold certification (e.g. KSOCA, PGS-India, NPOP).
            </div>
          </div>
        </section>

        {/* 3. APMC Mandi Price Benchmarks */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
            3. APMC Mandi Price Guidance Disclaimer
          </h2>
          <p>
            The APMC Mandi rates displayed on KhetBazaar (e.g. Yeshwanthpur, Mysuru, Hubballi daily
            modal prices) are sourced from open agricultural market committees and Agmarknet feeds for
            informational benchmarking only.
          </p>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] bg-[var(--surface-warm)] p-3 rounded-xl border border-[var(--earth-border-subtle)]">
            <strong>Notice:</strong> Mandi prices fluctuate hourly based on truck arrivals and seasonal
            yields. The final selling price of any crop is set entirely at the discretion of the
            independent farmer and buyer through mutual consensus.
          </p>
        </section>

        {/* 4. Anti-Abuse & Buyer Conduct */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
            4. Buyer Conduct &amp; Zero Tolerance for Telemarketing Harassment
          </h2>
          <p>
            Access to farmer phone numbers is granted solely for legitimate harvest inquiries and
            produce purchases. Any user who uses revealed numbers for commercial telemarketing,
            unsolicited financial services, harassment, or mass spam will have their IP permanently
            blacklisted and may be reported to the Cyber Crime authorities under Indian telecom regulations.
          </p>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
            5. Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] leading-relaxed">
            KhetBazaar provides its services on an &quot;as is&quot; and &quot;as available&quot; basis.
            While our administrative team verifies farmer registrations against APMC databases, we
            cannot guarantee the shelf-life, taste, or transit resilience of perishable crops once
            purchased. We encourage buyers to inspect produce at pickup or delivery.
          </p>
        </section>

        <div className="pt-6 border-t border-[var(--earth-line)] flex items-center justify-between text-xs text-[var(--earth-muted)]">
          <Link href="/privacy" className="hover:text-[var(--forest-800)] underline">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:text-[var(--forest-800)] underline">
            Dispute Resolution Helpdesk
          </Link>
        </div>
      </div>
    </div>
  );
}
