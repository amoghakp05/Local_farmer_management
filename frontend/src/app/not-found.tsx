import Link from "next/link";
import { SproutIcon, WheatIcon } from "@/components/icons";
import { Search, ArrowLeft, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 py-16 bg-[#FAF8F3]">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Visual Badge Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[var(--forest-100)] border border-[var(--forest-200)] text-[var(--forest-800)] flex items-center justify-center shadow-xs">
          <SproutIcon size={40} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--harvest-700)]">
            Error 404 • Missing Furrow
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-[var(--forest-900)] tracking-tight">
            Harvest Lot or Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-[var(--earth-muted)] max-w-md mx-auto leading-relaxed">
            The crop lot, farmer profile, or page you were looking for may have been sold out,
            completed its harvest cycle, or moved to a different mandi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto justify-center"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return Home
            </Button>
          </Link>
          <Link href="/crops" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto justify-center"
              leftIcon={<Compass className="w-4 h-4" />}
            >
              Browse Available Crops
            </Button>
          </Link>
        </div>

        {/* Quick Links Card */}
        <div className="pt-6 border-t border-[var(--earth-line)]">
          <p className="text-xs font-semibold text-[var(--earth-muted)] mb-3">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link
              href="/markets"
              className="px-3 py-1.5 rounded-lg bg-white border border-[var(--earth-border)] text-[var(--earth-ink)] hover:border-[var(--forest-600)] transition-colors"
            >
              APMC Mandi Rates
            </Link>
            <Link
              href="/farmers"
              className="px-3 py-1.5 rounded-lg bg-white border border-[var(--earth-border)] text-[var(--earth-ink)] hover:border-[var(--forest-600)] transition-colors"
            >
              Verified Farmers
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-lg bg-white border border-[var(--earth-border)] text-[var(--earth-ink)] hover:border-[var(--forest-600)] transition-colors"
            >
              About KhetBazaar
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 rounded-lg bg-white border border-[var(--earth-border)] text-[var(--earth-ink)] hover:border-[var(--forest-600)] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
