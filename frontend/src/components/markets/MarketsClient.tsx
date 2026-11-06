"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as maplibregl from "maplibre-gl";
import { MARKETS_DATA } from "@/app/api/markets/route";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MapPin,
  Clock,
  Phone,
  Search,
  Building2,
  Navigation,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export function MarketsClient() {
  const [selectedMarketId, setSelectedMarketId] = useState<string>(MARKETS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "apmc" | "rythu_bazaar">("all");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  const filteredMarkets = MARKETS_DATA.filter((m) => {
    if (filterType !== "all" && m.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        m.name.toLowerCase().includes(q) ||
        m.nameKn.includes(q) ||
        m.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-layer",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [76.5, 14.5], // Center of Karnataka
        zoom: 6.8,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add markers for filtered markets
    filteredMarkets.forEach((market) => {
      const el = document.createElement("div");
      el.className = "mandi-map-marker cursor-pointer transition-transform hover:scale-125";
      el.innerHTML = `
        <div style="
          background: ${market.id === selectedMarketId ? "#C85A17" : "#1B4332"};
          color: white;
          padding: 6px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span>🏛️</span>
          <span>${market.name.split(" ")[0]}</span>
        </div>
      `;

      el.addEventListener("click", () => {
        setSelectedMarketId(market.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([market.longitude, market.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div style="padding: 4px; font-family: sans-serif;">
              <h4 style="font-weight: bold; margin: 0; color: #1B4332;">${market.name}</h4>
              <p style="font-size: 11px; color: #666; margin: 2px 0;">${market.nameKn}</p>
              <div style="font-size: 11px; margin-top: 4px;">🕒 ${market.operatingHours}</div>
              <div style="font-size: 11px;">📞 ${market.contactPhone}</div>
            </div>
          `)
        )
        .addTo(map);

      markersRef.current[market.id] = marker;
    });

    return () => {};
  }, [filteredMarkets, selectedMarketId]);

  // Pan to selected market
  const handleSelectMarket = (market: (typeof MARKETS_DATA)[0]) => {
    setSelectedMarketId(market.id);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [market.longitude, market.latitude],
        zoom: 12,
        speed: 1.2,
      });
      // open popup
      const marker = markersRef.current[market.id];
      if (marker) {
        marker.togglePopup();
      }
    }
  };

  return (
    <div className="w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-[var(--earth-line)]">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="forest" size="sm">
            Karnataka State Mandi Network
          </Badge>
          <Badge variant="neutral" size="sm">
            {MARKETS_DATA.length} Verified Yards
          </Badge>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight">
          Nearby Mandis &amp; APMC Yards
        </h1>
        <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1 max-w-2xl">
          Locate state-regulated APMC market yards and direct Rythu Bazaars across Karnataka districts with real-time operating hours and contact numbers.
        </p>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
          <Input
            placeholder="Search market name or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:col-span-2"
          />

          <div className="inline-flex p-1 bg-white border border-[var(--earth-border-subtle)] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                filterType === "all"
                  ? "bg-[var(--forest-800)] text-white shadow-2xs font-bold"
                  : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
              }`}
            >
              All ({MARKETS_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("apmc")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                filterType === "apmc"
                  ? "bg-[var(--forest-800)] text-white shadow-2xs font-bold"
                  : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
              }`}
            >
              APMC Yards
            </button>
            <button
              type="button"
              onClick={() => setFilterType("rythu_bazaar")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                filterType === "rythu_bazaar"
                  ? "bg-[var(--forest-800)] text-white shadow-2xs font-bold"
                  : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
              }`}
            >
              Rythu Bazaars
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Markets List on Left, Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Market Cards List */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 max-h-[650px] overflow-y-auto pr-1">
          {filteredMarkets.map((market) => {
            const isSelected = market.id === selectedMarketId;

            return (
              <div
                key={market.id}
                onClick={() => handleSelectMarket(market)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-[var(--harvest-600)] ring-2 ring-[var(--harvest-600)]/20 shadow-md"
                    : "bg-white border-[var(--earth-border)] hover:border-[var(--forest-700)] shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[var(--earth-ink)]">
                      {market.name}
                    </h3>
                    <span className="text-xs font-semibold text-[var(--harvest-700)] block">
                      {market.nameKn}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      market.type === "apmc"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {market.type === "apmc" ? "APMC Yard" : "Rythu Bazaar"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--earth-muted)] mt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--harvest-600)] shrink-0" />
                    <span>District: {market.district}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--forest-700)] shrink-0" />
                    <span>Hours: {market.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span className="font-mono">{market.contactPhone}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[var(--earth-line)] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[var(--forest-800)] flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[var(--forest-700)]" />
                    <span>Click to View on Map</span>
                  </span>
                  <Link
                    href={`/crops?district=${market.district.toLowerCase()}`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="text-[11px] font-bold text-[var(--harvest-700)] hover:underline flex items-center gap-0.5"
                  >
                    <span>View District Lots</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Container on Right */}
        <div className="lg:col-span-7 h-[450px] lg:h-[650px] rounded-3xl overflow-hidden border border-[var(--earth-border)] shadow-md sticky top-24">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
