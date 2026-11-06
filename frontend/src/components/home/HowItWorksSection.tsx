"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { SproutIcon, ScaleIcon, CrateIcon, ShieldVerifiedIcon } from "@/components/icons";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Farmer Lists Fresh Lot",
      kannada: "ರೈತರ ಸರಳ ನೋಂದಣಿ",
      desc: "Farmers upload produce details in 2 minutes: crop variety, harvest date, mandi location, and available crates. No paperwork or tech hurdles.",
      icon: <SproutIcon size={26} className="text-[var(--forest-700)]" />,
      tag: "Minimal Typing",
    },
    {
      num: "02",
      title: "Fair APMC Benchmark",
      kannada: "ಮಂಡಿ ದರ ಪಾರದರ್ಶಕತೆ",
      desc: "Daily mandi rates from APMC yards are benchmarked openly. Buyers see honest market rates and farmers get compensated without deceptive cuts.",
      icon: <ScaleIcon size={26} className="text-[var(--harvest-600)]" />,
      tag: "Certified MSP",
    },
    {
      num: "03",
      title: "Direct Soil-to-Table Contact",
      kannada: "ನೇರ ಸಂಪರ್ಕ & ಶೂನ್ಯ ದಲ್ಲಾಳಿ",
      desc: "Consumers and institutional buyers reveal farmer phone numbers with bot protection, arrange pickup or delivery, and pay 100% directly.",
      icon: <ShieldVerifiedIcon size={26} className="text-[var(--forest-700)]" />,
      tag: "0% Commission",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="forest" size="md" icon={<SproutIcon size={14} />}>
          Transparent Architecture
        </Badge>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] mt-3">
          How KhetBazaar Connects You
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[var(--earth-muted)] leading-relaxed">
          A direct three-stage workflow engineered to eliminate commission layers and restore dignity and profit to agricultural growers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-8 rounded-2xl bg-white border border-[var(--earth-border)] shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-md)] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-2xl font-black text-[var(--harvest-600)]">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {step.icon}
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                {step.title}
              </h3>
              <p className="text-xs font-semibold text-[var(--forest-800)] mt-0.5">
                {step.kannada}
              </p>
              <p className="text-sm text-[var(--earth-muted)] mt-3 leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--earth-line)]">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--surface-warm)] text-[var(--earth-charcoal)] border border-[var(--earth-border-subtle)]">
                {step.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
