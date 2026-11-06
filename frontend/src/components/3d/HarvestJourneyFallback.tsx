"use client";

import React from "react";
import {
  SproutIcon,
  WheatIcon,
  CrateIcon,
  MarketStallIcon,
  ScaleIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/Badge";

export function HarvestJourneyFallback() {
  const chapters = [
    {
      step: "01",
      title: "The Living Field",
      kannada: "ಜೀವಂತ ಕೃಷಿ ಭೂಮಿ",
      desc: "Nourished soil, heirloom seeds, and morning dew on tender shoots.",
      icon: <SproutIcon size={24} className="text-[var(--forest-700)]" />,
      tag: "Regenerative Soil",
    },
    {
      step: "02",
      title: "The Dawn Harvest",
      kannada: "ಮುಂಜಾನೆಯ ಕೊಯ್ಲು",
      desc: "Handpicked at sunrise at peak crispness before market transport.",
      icon: <WheatIcon size={24} className="text-[var(--harvest-600)]" />,
      tag: "Fresh Produce",
    },
    {
      step: "03",
      title: "Fair Crating & Weighing",
      kannada: "ನ್ಯಾಯಯುತ ತೂಕ ಮತ್ತು ಕ್ರೇಟಿಂಗ್",
      desc: "Zero deceptive deductions. Graded and packed in clean crates.",
      icon: <ScaleIcon size={24} className="text-[var(--forest-700)]" />,
      tag: "Certified MSP",
    },
    {
      step: "04",
      title: "The Open Mandi",
      kannada: "ಮುಕ್ತ ಮಾರುಕಟ್ಟೆ",
      desc: "Transparent price boards connecting growers directly with buyers.",
      icon: <MarketStallIcon size={24} className="text-[var(--harvest-600)]" />,
      tag: "0% Commission",
    },
    {
      step: "05",
      title: "Your Family's Table",
      kannada: "ಗ್ರಾಹಕರ ಮನೆ ಊಟ",
      desc: "Wholesome food with complete farm-level grower traceability.",
      icon: <CrateIcon size={24} className="text-[var(--forest-700)]" />,
      tag: "Soil-to-Table",
    },
  ];

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-[#FAF8F3] via-[#F5EFE4] to-[#FAF8F3] border-y border-[var(--earth-line)]">
      <div className="max-w-4xl w-full text-center mb-8">
        <Badge variant="harvest" size="sm" icon={<WheatIcon size={12} />}>
          The Harvest Journey (Illustrated Overview)
        </Badge>
        <h3 className="font-serif text-2xl sm:text-4xl font-black text-[var(--forest-900)] mt-2">
          From Morning Dew to Your Table
        </h3>
        <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1 max-w-lg mx-auto">
          Five essential chapters linking local Indian farmers directly with consumer kitchens.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl w-full">
        {chapters.map((ch) => (
          <div
            key={ch.step}
            className="p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-[var(--shadow-warm-sm)] flex flex-col justify-between text-left hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-[var(--harvest-700)]">
                  {ch.step}
                </span>
                <span className="p-2 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)]">
                  {ch.icon}
                </span>
              </div>
              <h4 className="font-serif text-base font-bold text-[var(--earth-ink)]">
                {ch.title}
              </h4>
              <p className="text-[11px] font-medium text-[var(--forest-800)] mt-0.5">
                {ch.kannada}
              </p>
              <p className="text-xs text-[var(--earth-muted)] mt-2 leading-relaxed">
                {ch.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--earth-line)]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--earth-charcoal)]">
                {ch.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
