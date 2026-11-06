"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  SproutIcon,
  WheatIcon,
  ShieldVerifiedIcon,
} from "@/components/icons";
import { ArrowDown, Search, PlusCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function HeroSection({ onExploreClick }: { onExploreClick?: () => void }) {
  const { t } = useI18n();

  return (
    <section className="relative w-full pt-8 pb-10 sm:pt-14 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
      {/* Editorial Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-5">
        <Badge variant="forest" size="md" icon={<SproutIcon size={14} />}>
          Direct Farmer-to-Consumer Network
        </Badge>
        <Badge variant="harvest" size="md" icon={<WheatIcon size={14} />}>
          Daily Mandi Rate Transparency
        </Badge>
        <Badge variant="neutral" size="md" icon={<ShieldVerifiedIcon size={14} />}>
          0% Middleman Cut
        </Badge>
      </div>

      {/* Main Serif Headline */}
      <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--forest-900)] max-w-4xl leading-[1.1]">
        Direct from Living Soil to Your Family&apos;s Table
      </h1>

      {/* Editorial Subtitle */}
      <p className="mt-4 text-sm sm:text-lg text-[var(--earth-muted)] max-w-2xl leading-relaxed">
        {t("brand.description")} Connect with local growers across Karnataka, check transparent APMC mandi price benchmarks, and buy harvest-fresh crops with zero broker commission.
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/crops">
          <Button
            size="md"
            variant="primary"
            leftIcon={<Search className="w-4 h-4" />}
            className="cursor-pointer"
          >
            Explore Available Crops
          </Button>
        </Link>

        <Link href="/register?role=farmer">
          <Button
            size="md"
            variant="accent"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="cursor-pointer"
          >
            + Register as Farmer
          </Button>
        </Link>

        <Link href="/design-system">
          <Button
            size="md"
            variant="secondary"
            leftIcon={<SproutIcon size={16} className="text-[var(--forest-700)]" />}
            className="cursor-pointer"
          >
            Design System Specs
          </Button>
        </Link>
      </div>

      {/* 3D Journey Scroll Hint (Clickable Clean Pill with Smooth Scroll Offset) */}
      <div className="mt-8">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("harvest-journey");
            if (el) {
              const navHeight = 72; // Header height in px
              const targetTop = el.getBoundingClientRect().top + window.scrollY - navHeight;
              window.scrollTo({ top: targetTop, behavior: "smooth" });
            } else if (onExploreClick) {
              onExploreClick();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[var(--forest-900)] text-xs font-bold border border-[var(--earth-border)] shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          aria-label="Scroll down to the 3D Harvest Journey"
        >
          <span>Explore 3D Harvest Journey</span>
          <ArrowDown className="w-3.5 h-3.5 text-[var(--harvest-700)] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
