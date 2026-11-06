"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HarvestJourneyFallback } from "@/components/3d/HarvestJourneyFallback";
import { CanvasErrorBoundary } from "@/components/3d/CanvasErrorBoundary";
import { Badge } from "@/components/ui/Badge";
import {
  SproutIcon,
  WheatIcon,
  CrateIcon,
  MarketStallIcon,
  ScaleIcon,
} from "@/components/icons";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowDown, Sparkles, Layers } from "lucide-react";

// Register GSAP ScrollTrigger safely in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Clean loading placeholder for 3D canvas (prevents card layout overlap while loading)
function CanvasLoadingPlaceholder() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8F3] to-[#F5EFE4]/80">
      <div className="w-10 h-10 rounded-full border-3 border-[var(--forest-600)] border-t-transparent animate-spin" />
      <span className="text-xs font-bold text-[var(--forest-800)] mt-3">
        Loading 3D Harvest Scene...
      </span>
    </div>
  );
}

// Dynamically import 3D Canvas with ssr: false
const HarvestJourneyCanvas = dynamic(
  () => import("@/components/3d/HarvestJourneyCanvas"),
  {
    ssr: false,
    loading: () => <CanvasLoadingPlaceholder />,
  }
);

export function HarvestJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [useFallbackMode, setUseFallbackMode] = useState(false);

  const chapters = [
    {
      id: "field",
      step: "01",
      title: "The Living Field",
      kannada: "ಜೀವಂತ ಕೃಷಿ ಭೂಮಿ",
      hindi: "जीवंत खेत",
      headline: "Rooted in Soil, Not Speculation",
      description:
        "Every crop starts in living soil. Our farmers cultivate heritage varieties using compost, natural mulching, and sustainable irrigation. When you view a lot on KhetBazaar, you see the exact field, taluk, and soil type it grew in.",
      icon: <SproutIcon size={20} className="text-[var(--forest-700)]" />,
      stat: "100% Traceable Roots",
      tag: "Soil Health",
    },
    {
      id: "harvest",
      step: "02",
      title: "The Dawn Harvest",
      kannada: "ಮುಂಜಾನೆಯ ಕೊಯ್ಲು",
      hindi: "सुबह की कटाई",
      headline: "Plucked at First Light",
      description:
        "Produce is handpicked between 5:00 AM and 7:00 AM when sugar and moisture levels peak. Instead of sitting in distributor cold storages for weeks, harvest timestamps are verified and uploaded directly to the live board.",
      icon: <WheatIcon size={20} className="text-[var(--harvest-600)]" />,
      stat: "Zero Cold Storage Lag",
      tag: "Peak Crispness",
    },
    {
      id: "crate",
      step: "03",
      title: "Fair Crating & Weights",
      kannada: "ನ್ಯಾಯಯುತ ತೂಕ ಮತ್ತು ಕ್ರೇಟಿಂಗ್",
      hindi: "ಸಚ್ಚಾ ತೌಲ್ ಮತ್ತು ಕ್ರೇಟಿಂಗ್",
      headline: "Zero Deceptive Deductions",
      description:
        "Traditional middlemen take 8-15% in arbitrary grading cuts, moisture deductions, and unloading fees. On KhetBazaar, crates are weighed on calibrated scales with clear photograph proof and net weight guarantees.",
      icon: <ScaleIcon size={20} className="text-[var(--forest-700)]" />,
      stat: "Calibrated Net Weight",
      tag: "Fair Scales",
    },
    {
      id: "market",
      step: "04",
      title: "The Open Mandi",
      kannada: "ಮುಕ್ತ ಮಾರುಕಟ್ಟೆ",
      hindi: "खुली मंडी",
      headline: "Live Price Transparency",
      description:
        "Mandi rates are published openly twice daily. Consumers and bulk buyers see the exact price the farmer listed, compare across nearby taluks, and negotiate directly with zero commission leakage.",
      icon: <MarketStallIcon size={20} className="text-[var(--harvest-600)]" />,
      stat: "0% Commission Cut",
      tag: "Direct Price",
    },
    {
      id: "table",
      step: "05",
      title: "Your Family's Table",
      kannada: "ಗ್ರಾಹಕರ ಮನೆ ಊಟ",
      hindi: "आपकी थाली तक",
      headline: "Nourishment with a Name",
      description:
        "Food reaches your kitchen fresher, tastier, and nutrient-dense, while the farmer retains 100% of their hard-earned sale price. You know who grew what you eat, creating a trusted bond across rural and urban families.",
      icon: <CrateIcon size={20} className="text-[var(--forest-700)]" />,
      stat: "Direct Farmer Prosperity",
      tag: "Wholesome Living",
    },
  ];

  useEffect(() => {
    if (!triggerRef.current || useFallbackMode) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        id: "harvest-journey-trigger",
        trigger: triggerRef.current,
        start: "top top",
        end: "+=160%",
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);
          const chapterIdx = Math.min(Math.floor(p * 5), 4);
          setActiveChapterIndex(chapterIdx);
        },
      });
      scrollTriggerInstanceRef.current = st;
    }, triggerRef);

    return () => {
      ctx.revert();
      scrollTriggerInstanceRef.current = null;
    };
  }, [useFallbackMode]);

  const activeChapter = chapters[activeChapterIndex];

  const handleSkipToMarketplace = () => {
    const el = document.getElementById("live-produce");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (typeof window !== "undefined" && triggerRef.current) {
      const rect = triggerRef.current.parentElement?.getBoundingClientRect();
      const targetY = window.scrollY + (rect?.height || window.innerHeight * 2.2);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const handleJumpToChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    const targetProgress = idx / 4;
    setScrollProgress(targetProgress);

    const st = scrollTriggerInstanceRef.current || ScrollTrigger.getById("harvest-journey-trigger");
    if (st) {
      const scrollPos = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: scrollPos, behavior: "smooth" });
    }
  };

  return (
    <section ref={containerRef} id="harvest-journey" className="relative w-full bg-[#FAF8F3]">
      {useFallbackMode ? (
        <HarvestJourneyFallback />
      ) : (
        <CanvasErrorBoundary fallback={<HarvestJourneyFallback />}>
          <div
            ref={triggerRef}
            className="relative w-full h-screen min-h-[640px] flex flex-col justify-between overflow-hidden"
          >
            {/* Background 3D Scene (Unobstructed full height) */}
            <div className="absolute inset-0 z-0">
              <HarvestJourneyCanvas scrollProgress={scrollProgress} />
            </div>

            {/* Top Bar Overlay: Chapter Navigation Pills */}
            <div className="relative z-20 pt-18 sm:pt-20 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--earth-border)] shadow-sm">
                <Badge variant="forest" size="sm" icon={<SproutIcon size={12} />}>
                  The Harvest Journey
                </Badge>
                <span className="text-xs font-mono font-semibold text-[var(--earth-charcoal)]">
                  Chapter {activeChapterIndex + 1} of 5
                </span>
              </div>

              {/* Clickable Chapter Stepper Dots */}
              <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--earth-border)] shadow-sm">
                {chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleJumpToChapter(idx)}
                    className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:opacity-80 transition-all p-1"
                    title={`Jump to ${ch.title}`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === activeChapterIndex
                          ? "bg-[var(--harvest-600)] scale-125 ring-2 ring-[var(--harvest-200)]"
                          : idx < activeChapterIndex
                          ? "bg-[var(--forest-700)]"
                          : "bg-[var(--earth-border)]"
                      }`}
                    />
                    <span
                      className={`hidden lg:inline text-[11px] ${
                        idx === activeChapterIndex
                          ? "text-[var(--forest-900)] font-bold"
                          : "text-[var(--earth-muted)]"
                      }`}
                    >
                      {ch.step}. {ch.title.replace("The ", "")}
                    </span>
                    {idx < chapters.length - 1 && (
                      <span className="text-[var(--earth-border)] hidden lg:inline mx-1">
                        •
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Action Buttons: Skip to Market & Static View */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleSkipToMarketplace}
                  className="text-[11px] font-bold text-[var(--forest-900)] hover:text-white bg-white/95 hover:bg-[var(--forest-800)] backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--earth-border)] transition-all cursor-pointer shadow-xs"
                >
                  Skip 3D ↓
                </button>
                <button
                  type="button"
                  onClick={() => setUseFallbackMode(true)}
                  className="text-[11px] font-semibold text-[var(--earth-muted)] hover:text-[var(--forest-800)] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--earth-border)] hover:bg-white transition-colors cursor-pointer"
                >
                  2D View
                </button>
              </div>
            </div>

            {/* Middle / Bottom Narrative Layout (Clean Left-Side Alignment on Desktop) */}
            <div className="relative z-20 pb-8 sm:pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-end justify-start pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeChapter.id}
                  initial={{ opacity: 0, x: -16, y: 8 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 16, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="pointer-events-auto w-full max-w-lg bg-white/95 backdrop-blur-lg rounded-3xl border border-[var(--earth-border)] p-6 sm:p-7 shadow-[var(--shadow-warm-lg)]"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] text-[var(--forest-800)]">
                        {activeChapter.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[var(--harvest-700)] uppercase tracking-wider block">
                          Stage {activeChapter.step} of 05
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[var(--forest-900)] leading-tight">
                          {activeChapter.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[var(--forest-100)] text-[var(--forest-800)] border border-[var(--forest-200)]">
                      {activeChapter.stat}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[var(--earth-ink)] mt-2">
                    {activeChapter.headline}
                  </h4>

                  <p className="text-xs sm:text-sm text-[var(--earth-charcoal)] mt-2 leading-relaxed">
                    {activeChapter.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[var(--earth-line)] flex items-center justify-between text-xs text-[var(--earth-muted)]">
                    <span className="font-semibold text-[var(--forest-800)] text-[11px]">
                      {activeChapter.kannada} • {activeChapter.hindi}
                    </span>
                    <button
                      type="button"
                      onClick={handleSkipToMarketplace}
                      className="flex items-center gap-1 font-bold text-[var(--harvest-700)] hover:text-[var(--harvest-900)] cursor-pointer text-xs"
                    >
                      To Marketplace
                      <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </CanvasErrorBoundary>
      )}
    </section>
  );
}
