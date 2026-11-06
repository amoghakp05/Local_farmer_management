"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { WheatIcon, SproutIcon, ScaleIcon } from "@/components/icons";
import { Tabs, TabsList, TabTrigger, TabContent } from "@/components/ui/Tabs";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SeasonCrop {
  name: string;
  regional: string;
  harvestMonths: string;
  priceOutlook: "Rising" | "Steady" | "Best Value";
  outlookType: "up" | "steady" | "down";
  benchmarkRange: string;
  notes: string;
}

const SEASON_DATA: Record<string, SeasonCrop[]> = {
  kharif: [
    {
      name: "Finger Millet (Ragi)",
      regional: "ರಾಗಿ (ನಾಟಿ ತಳಿ)",
      harvestMonths: "Oct – Dec",
      priceOutlook: "Best Value",
      outlookType: "down",
      benchmarkRange: "₹34 – ₹40 / kg",
      notes: "Post-monsoon fresh harvest arriving across Mandya and Tumkur.",
    },
    {
      name: "Sona Masoori Paddy",
      regional: "ಸೋನಾ ಮಸೂರಿ ಭತ್ತ",
      harvestMonths: "Nov – Jan",
      priceOutlook: "Steady",
      outlookType: "steady",
      benchmarkRange: "₹2,300 – ₹2,600 / quintal",
      notes: "Tungabhadra basin mill arrivals active with high moisture inspection.",
    },
    {
      name: "Pigeon Pea (Tur Dal)",
      regional: "ತೊಗರಿ ಬೇಳೆ",
      harvestMonths: "Dec – Feb",
      priceOutlook: "Rising",
      outlookType: "up",
      benchmarkRange: "₹85 – ₹110 / kg",
      notes: "Kalaburagi GI tagged red gram. High consumer demand in winter.",
    },
  ],
  rabi: [
    {
      name: "Country Red Onions",
      regional: "ಕೆಂಪು ಈರುಳ್ಳಿ",
      harvestMonths: "Jan – Mar",
      priceOutlook: "Steady",
      outlookType: "steady",
      benchmarkRange: "₹30 – ₹36 / kg",
      notes: "Chitradurga and Bagalkot lots entering APMC yards in high volume.",
    },
    {
      name: "Bengal Gram (Chana)",
      regional: "ಕಡಲೆ ಕಾಳು",
      harvestMonths: "Feb – Apr",
      priceOutlook: "Rising",
      outlookType: "up",
      benchmarkRange: "₹5,200 – ₹5,800 / quintal",
      notes: "Excellent winter crop yield across North Karnataka black soils.",
    },
    {
      name: "Mustard & Oilseeds",
      regional: "ಸಾಸಿವೆ ಕಾಳು",
      harvestMonths: "Feb – Mar",
      priceOutlook: "Best Value",
      outlookType: "down",
      benchmarkRange: "₹55 – ₹68 / kg",
      notes: "Direct extraction grade available directly from farm clusters.",
    },
  ],
  summer: [
    {
      name: "Country Tomatoes",
      regional: "ನಾಟಿ ಟೊಮೆಟೊ",
      harvestMonths: "Apr – Jun",
      priceOutlook: "Best Value",
      outlookType: "down",
      benchmarkRange: "₹24 – ₹32 / kg",
      notes: "Drip-irrigated shade net produce from Kolar and Chikkaballapur.",
    },
    {
      name: "Bangalore Blue Grapes",
      regional: "ಬೆಂಗಳೂರು ಬ್ಲೂ ದ್ರಾಕ್ಷಿ",
      harvestMonths: "Mar – May",
      priceOutlook: "Rising",
      outlookType: "up",
      benchmarkRange: "₹70 – ₹90 / kg",
      notes: "GI protected sweet table grapes with zero cold store wax coating.",
    },
    {
      name: "Green Chillies & Mint",
      regional: "ಮೆಣಸಿನಕಾಯಿ & ಪುದೀನಾ",
      harvestMonths: "All Summer",
      priceOutlook: "Steady",
      outlookType: "steady",
      benchmarkRange: "₹40 – ₹50 / kg",
      notes: "Daily plucking batches sold within 6 hours of harvest.",
    },
  ],
};

export function SeasonalCropCalendar() {
  const [activeSeason, setActiveSeason] = useState("kharif");

  const crops = SEASON_DATA[activeSeason] || SEASON_DATA.kharif;

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <Badge variant="forest" size="md" icon={<Calendar className="w-3.5 h-3.5" />}>
            Agro-Climatic Intelligence
          </Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] mt-2">
            Seasonal Harvest Calendar
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--earth-muted)] max-w-xl">
            Know what is naturally ripe right now across Karnataka agro-zones. Buy in-season for maximum nutritional density and best farm-gate pricing.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-6 sm:p-8 shadow-[var(--shadow-warm-sm)]">
        <Tabs value={activeSeason} onValueChange={setActiveSeason}>
          <TabsList className="mb-6">
            <TabTrigger value="kharif">
              Kharif (Monsoon / Autumn)
            </TabTrigger>
            <TabTrigger value="rabi">
              Rabi (Winter / Spring)
            </TabTrigger>
            <TabTrigger value="summer">
              Zaid (Summer Harvest)
            </TabTrigger>
          </TabsList>

          <TabContent value={activeSeason}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {crops.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[var(--surface-warm)]/60 border border-[var(--earth-border-subtle)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-[var(--forest-800)]">
                        {item.harvestMonths}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                          item.outlookType === "up"
                            ? "bg-amber-100 text-amber-800"
                            : item.outlookType === "down"
                            ? "bg-green-100 text-green-800"
                            : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {item.outlookType === "up" && <TrendingUp className="w-3 h-3" />}
                        {item.outlookType === "down" && <TrendingDown className="w-3 h-3" />}
                        {item.outlookType === "steady" && <Minus className="w-3 h-3" />}
                        {item.priceOutlook}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[var(--earth-ink)]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[var(--harvest-700)] font-medium">
                      {item.regional}
                    </p>

                    <div className="mt-3 p-2.5 rounded-lg bg-white border border-[var(--earth-border-subtle)]">
                      <span className="text-[10px] text-[var(--earth-muted)] block uppercase tracking-wider">
                        Benchmark Band
                      </span>
                      <span className="font-serif text-base font-bold text-[var(--forest-900)]">
                        {item.benchmarkRange}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--earth-muted)] mt-3 leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabContent>
        </Tabs>
      </div>
    </section>
  );
}
