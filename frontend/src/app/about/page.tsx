import { Metadata } from "next";
import Link from "next/link";
import {
  SproutIcon,
  WheatIcon,
  ShieldVerifiedIcon,
  ScaleIcon,
  OrganicLeafIcon,
} from "@/components/icons";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Compass,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us — Restoring Direct Farm-to-Table Transparency | KhetBazaar",
  description:
    "Learn how KhetBazaar is eliminating parasitic middlemen, democratizing APMC mandi price benchmarks, and connecting Karnataka farmers directly with conscious consumers.",
  openGraph: {
    title: "About KhetBazaar — Restoring Agriculture's Direct Bond",
    description:
      "Eliminating intermediary exploitation, democratizing mandi data, and championing verified smallholder farmers across India.",
    url: "https://khetbazaar.org/about",
  },
};

export default function AboutPage() {
  const pillars = [
    {
      icon: <ScaleIcon size={24} className="text-[var(--forest-800)]" />,
      title: "Real-time Mandi Benchmarks",
      description:
        "Every harvest lot is juxtaposed with prevailing APMC Agmarknet prices. Both the grower and buyer trade with clear visibility into fair wholesale and retail market bands.",
    },
    {
      icon: <ShieldVerifiedIcon size={24} className="text-[var(--forest-800)]" />,
      title: "100% Traceable Harvest Lots",
      description:
        "Know the exact date your produce was harvested, the soil condition, quality grading (A+, A, B), and the specific farm village in Karnataka where it grew.",
    },
    {
      icon: <Users size={24} className="text-[var(--forest-800)]" />,
      title: "Trilingual & Rural First",
      description:
        "Engineered with native Kannada, Hindi, and English interfaces. Designed as a lightweight PWA that functions seamlessly on low-bandwidth rural networks and offline.",
    },
    {
      icon: <HeartHandshake size={24} className="text-[var(--forest-800)]" />,
      title: "Zero Commission Tollgate",
      description:
        "Unlike corporate grocery aggregators who siphon 30-40% margins, KhetBazaar is an open informational bridge. 100% of the sale goes directly from buyer to farmer.",
    },
  ];

  const milestones = [
    { value: "450+", label: "Verified Farmers", detail: "Across 14 Karnataka agricultural districts" },
    { value: "18", label: "APMC Mandis Linked", detail: "Live daily price feeds from Yeshwanthpur to Hubballi" },
    { value: "₹2.4 Cr+", label: "Direct Trade Value", detail: "Transacted without predatory middleman deductions" },
    { value: "0%", label: "Platform Take Rate", detail: "Free, open-access public digital infrastructure" },
  ];

  return (
    <div className="w-full bg-[#FAF8F3] min-h-screen text-[var(--earth-ink)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[var(--earth-line)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100/60 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="forest" size="md" icon={<SproutIcon size={16} />}>
              Our Roots &amp; Mission
            </Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--forest-900)] tracking-tight leading-[1.15] mb-6">
            Restoring the Sacred Bond Between{" "}
            <span className="italic font-normal text-[var(--harvest-700)] underline decoration-[var(--harvest-300)] decoration-wavy decoration-2">
              Soil &amp; Table
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[var(--earth-charcoal)] max-w-3xl mx-auto leading-relaxed font-sans font-normal">
            For generations, smallholder farmers across India have shouldered the entire climatic
            and financial risk of food cultivation, only to see up to 45% of their hard-earned crop
            value absorbed by unregulated commission agents and logistics cartels. KhetBazaar is the
            open digital public good engineered to change that forever.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link href="/crops">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Farm Produce
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Contact Our APMC Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Agrarian Crisis & Why KhetBazaar Exists */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--harvest-700)]">
              The Genesis
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--earth-ink)] leading-snug">
              Why an Open Information System Matters More Than Another E-Commerce App
            </h2>
            <p className="text-sm sm:text-base text-[var(--earth-muted)] leading-relaxed">
              Traditional multi-tiered distribution forces crops through village aggregators, transport
              middlemen, APMC commission agents, and city retailers. Tomatoes sold by a Kolar farmer
              at ₹12/kg routinely reach Bengaluru kitchens at ₹48/kg—yet the grower barely recovers
              fertilizer costs.
            </p>
            <p className="text-sm sm:text-base text-[var(--earth-muted)] leading-relaxed">
              KhetBazaar is not a closed proprietary warehouse app. We do not hold inventory, nor do we
              demand a cut of the harvest. Instead, we provide verified farmers with a digital storefront
              and transparent APMC mandi price telemetry so consumers can buy directly at fair farm-gate
              rates.
            </p>

            <div className="pt-2 space-y-3">
              {[
                "Direct contact with verified growers—no phone spam, bot-protected",
                "Daily live benchmark comparison against 18 regional APMC mandis",
                "Full crop transparency: Grade A+, harvest date, organic certification",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-[var(--earth-ink)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#F4EFE6] rounded-3xl p-6 sm:p-10 border border-[var(--earth-border)] shadow-[var(--shadow-warm-sm)] relative">
              <div className="absolute -top-3 -right-3 bg-[var(--forest-800)] text-[#FAF8F3] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">
                Open Standard
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--forest-900)] mb-4">
                The KhetBazaar Covenant
              </h3>
              <p className="text-xs sm:text-sm text-[var(--earth-charcoal)] leading-relaxed mb-6">
                Every line of code and feature in this platform adheres to three core community vows:
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-white border border-[var(--earth-border-subtle)]">
                  <strong className="block text-[var(--forest-900)] font-serif text-base mb-1">
                    1. Farmer Autonomy First
                  </strong>
                  Farmers set their own prices based on real production costs and live mandi trends. We
                  never artificially discount produce.
                </div>

                <div className="p-4 rounded-xl bg-white border border-[var(--earth-border-subtle)]">
                  <strong className="block text-[var(--forest-900)] font-serif text-base mb-1">
                    2. Uncompromising Digital Accessibility
                  </strong>
                  Accessible to any farmer with a 10-key or basic smartphone. Complete native Kannada
                  and Hindi localisation, high-contrast typography, and voice-assisted inputs.
                </div>

                <div className="p-4 rounded-xl bg-white border border-[var(--earth-border-subtle)]">
                  <strong className="block text-[var(--forest-900)] font-serif text-base mb-1">
                    3. Anti-Scraping Farmer Data Shield
                  </strong>
                  Growers’ mobile numbers are protected behind intelligent rate limiters and session
                  verification to shield farming families from commercial telemarketing spam.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 sm:py-20 bg-[#F4EFE6] border-y border-[var(--earth-line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="harvest" size="sm" icon={<WheatIcon size={14} />}>
              Architecture of Fairness
            </Badge>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--earth-ink)] mt-3">
              How the KhetBazaar Engine Works
            </h2>
            <p className="text-sm text-[var(--earth-muted)] mt-2">
              Combining tactile editorial aesthetics with agricultural data science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[var(--earth-border)] shadow-xs flex flex-col justify-between hover:border-[var(--forest-600)] transition-colors"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--forest-50)] border border-[var(--forest-100)] flex items-center justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--earth-muted)] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Impact Numbers */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--forest-800)]">
            Verified Traction
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--earth-ink)] mt-2">
            Measurable Change Across Karnataka
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[var(--earth-border)] text-center shadow-xs"
            >
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--forest-900)] mb-2">
                {item.value}
              </div>
              <div className="text-sm font-bold text-[var(--earth-ink)] mb-1">{item.label}</div>
              <div className="text-xs text-[var(--earth-muted)] leading-snug">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Call to Action */}
      <section className="py-16 bg-[var(--forest-900)] text-[#FAF8F3] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <SproutIcon size={36} className="text-amber-300 mx-auto mb-4" />
          <h2 className="font-serif text-2xl sm:text-4xl font-black tracking-tight mb-4">
            Are You a Farmer or Conscious Buyer?
          </h2>
          <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed mb-8">
            Whether you cultivate heirloom ragi in Hassan or run a farm-to-table cooperative in
            Bengaluru, KhetBazaar welcomes you to India’s most direct agricultural network.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard/farmer">
              <Button size="lg" variant="accent">
                List Produce in 30 Seconds
              </Button>
            </Link>
            <Link href="/crops">
              <Button size="lg" variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Browse Fresh Harvests
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
