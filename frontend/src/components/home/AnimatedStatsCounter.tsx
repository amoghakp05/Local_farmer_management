"use client";

import React, { useEffect, useState, useRef } from "react";
import { RupeeIcon, SproutIcon, MarketStallIcon, ShieldVerifiedIcon } from "@/components/icons";
import { getAllFarmers } from "@/lib/data/farmers-repository";
import { getListings } from "@/lib/data/listings-repository";

interface StatItem {
  id: string;
  label: string;
  kannada: string;
  value: number;
  prefix?: string;
  suffix: string;
  icon: React.ReactNode;
}

export function AnimatedStatsCounter() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [displayValues, setDisplayValues] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const farmers = getAllFarmers();
    const listings = getListings({});
    const totalRevenueCr = listings.reduce((acc, l) => acc + (l.pricePerUnit * l.totalQuantity), 0) / 10000000;

    const computedStats: StatItem[] = [
      {
        id: "earnings",
        label: "Direct Farmer Revenue",
        kannada: "ರೈತರ ನೇರ ಆದಾಯ",
        value: Number(totalRevenueCr.toFixed(2)),
        prefix: "₹",
        suffix: " Cr",
        icon: <RupeeIcon size={24} className="text-[var(--harvest-600)]" />,
      },
      {
        id: "producers",
        label: "Verified Growers",
        kannada: "ದೃಢೀಕೃತ ರೈತರು",
        value: farmers.length,
        suffix: farmers.length === 1 ? " Grower" : " Growers",
        icon: <SproutIcon size={24} className="text-[var(--forest-700)]" />,
      },
      {
        id: "mandis",
        label: "APMC Mandis Monitored",
        kannada: "ಸಂಪರ್ಕಿತ ಎಪಿಎಂಸಿ ಮಂಡಿಗಳು",
        value: 48,
        suffix: " Yards",
        icon: <MarketStallIcon size={24} className="text-[var(--forest-700)]" />,
      },
      {
        id: "commission",
        label: "Intermediary Commission",
        kannada: "ದಲಾಲಿ ಕಡಿತ",
        value: 0,
        suffix: "% Zero",
        icon: <ShieldVerifiedIcon size={24} className="text-[var(--harvest-600)]" />,
      },
    ];

    setStats(computedStats);
  }, []);

  useEffect(() => {
    if (!containerRef.current || stats.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const duration = 1600;

          const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            setDisplayValues(
              stats.map((s) => {
                if (s.id === "commission") return 0;
                if (s.id === "earnings") {
                  return Number((s.value * ease).toFixed(2));
                }
                return Math.floor(s.value * ease);
              })
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValues(stats.map((s) => s.value));
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, stats]);

  if (stats.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="w-full py-12 sm:py-16 bg-white border-y border-[var(--earth-line)]"
      aria-label="KhetBazaar Operational Metrics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[var(--forest-50)]/40 border border-[var(--forest-100)]/60 shadow-[0_2px_8px_rgba(27,67,50,0.03)]"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-[var(--earth-line)]">
                {stat.icon}
              </div>

              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--forest-900)] tracking-tight">
                {stat.prefix}
                {hasAnimated ? displayValues[idx] : 0}
                {stat.suffix}
              </div>

              <span className="text-xs sm:text-sm font-bold text-[var(--earth-ink)] mt-2">
                {stat.label}
              </span>

              <span className="text-[11px] text-[var(--earth-muted)] mt-0.5">
                {stat.kannada}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
