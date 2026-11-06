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
    <section className="relative w-full pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Editorial Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
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
      <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[var(--forest-900)] max-w-5xl leading-[1.06]">
        Direct from Living Soil to Your Family&apos;s Table
      </h1>

      {/* Editorial Subtitle */}
      <p className="mt-6 text-base sm:text-xl text-[var(--earth-muted)] max-w-3xl leading-relaxed">
        {t("brand.description")} Connect with local growers across Karnataka, check transparent APMC mandi price benchmarks, and buy harvest-fresh crops with zero broker commission.
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/crops">
          <Button
            size="lg"
            variant="primary"
            leftIcon={<Search className="w-5 h-5" />}
            className="cursor-pointer"
          >
            Explore Available Crops
          </Button>
        </Link>

        <Link href="/register?role=farmer">
          <Button
            size="lg"
            variant="accent"
            leftIcon={<PlusCircle className="w-5 h-5" />}
            className="cursor-pointer"
          >
            + Register as Farmer
          </Button>
        </Link>

        <Link href="/design-system">
          <Button
            size="lg"
            variant="secondary"
            leftIcon={<SproutIcon size={18} className="text-[var(--forest-700)]" />}
            className="cursor-pointer"
          >
            Design System Specs
          </Button>
        </Link>
      </div>

      {/* 3D Journey Scroll Hint (Clickable Smooth Scroll) */}
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById("harvest-journey");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else if (onExploreClick) {
            onExploreClick();
          }
        }}
        className="mt-12 flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--forest-800)] hover:text-[var(--forest-900)] cursor-pointer group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)] rounded-lg p-2"
        aria-label="Scroll down to the 3D Harvest Journey"
      >
        <span className="group-hover:underline">Explore the 3D Harvest Journey Below</span>
        <ArrowDown className="w-4 h-4 text-[var(--harvest-600)] animate-bounce" />
      </button>
    </section>
  );
}
