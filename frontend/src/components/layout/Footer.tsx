"use client";

import React from "react";
import Link from "next/link";
import { SproutIcon, WheatIcon, ShieldVerifiedIcon } from "@/components/icons";
import { useI18n, LOCALES } from "@/lib/i18n";

export function Footer() {
  const { t, setLocale } = useI18n();

  return (
    <footer className="w-full bg-[#F3EFE6] border-t border-[var(--earth-border)] mt-auto pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[var(--earth-border)]">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--forest-700)] text-[#FAF8F3] flex items-center justify-center shadow-sm">
                <SproutIcon size={20} />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[var(--forest-900)]">
                KhetBazaar
              </span>
            </div>
            <p className="text-sm text-[var(--earth-muted)] max-w-sm leading-relaxed">
              {t("brand.description")}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-medium text-[var(--forest-800)]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--forest-100)] border border-[var(--forest-200)]">
                <ShieldVerifiedIcon size={14} />
                WCAG AA Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--harvest-100)] text-[var(--harvest-900)] border border-[var(--harvest-200)]">
                <WheatIcon size={14} />
                Open Mandi Standards
              </span>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="font-serif text-base font-bold text-[var(--earth-ink)]">
              Marketplace
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[var(--earth-charcoal)]">
              <li>
                <Link
                  href="/crops"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  {t("nav.crops")}
                </Link>
              </li>
              <li>
                <Link
                  href="/markets"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  {t("nav.markets")}
                </Link>
              </li>
              <li>
                <Link
                  href="/farmers"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  {t("nav.farmers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/design-system"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  {t("nav.designSystem")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company Links */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="font-serif text-base font-bold text-[var(--earth-ink)]">
              Initiative
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[var(--earth-charcoal)]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  About Our Roots
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  APMC Support Desk
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-purple-900 font-bold hover:text-purple-950 hover:underline underline-offset-4 transition-colors flex items-center gap-1"
                >
                  <ShieldVerifiedIcon size={14} className="text-purple-700" />
                  APMC Admin Console
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  Privacy &amp; Data Shield
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[var(--forest-700)] hover:underline underline-offset-4 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Switcher Footer Column */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-serif text-base font-bold text-[var(--earth-ink)]">
              Regional Language / ಪ್ರಾದೇಶಿಕ ಭಾಷೆ
            </h4>
            <p className="text-xs text-[var(--earth-muted)] leading-relaxed">
              KhetBazaar provides native language support to ensure equal access for all farmers across Karnataka and India.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {LOCALES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLocale(item.code)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[var(--earth-border)] text-[var(--earth-ink)] hover:border-[var(--forest-600)] hover:text-[var(--forest-800)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)]"
                >
                  {item.nativeLabel} ({item.label})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--earth-muted)]">
          <p>© 2026 KhetBazaar. Direct Soil-to-Market Infrastructure. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/privacy" className="hover:text-[var(--forest-800)] underline">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[var(--forest-800)] underline">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[var(--forest-800)] underline">
              Support
            </Link>
            <span>•</span>
            <p>{t("footer.accessibility")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
