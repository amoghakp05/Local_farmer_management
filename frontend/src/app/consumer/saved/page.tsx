"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { SEEDED_LISTINGS, ApiListing } from "@/lib/data/listings-repository";
import { CropCard } from "@/components/crops/CropCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  Bookmark,
  Bell,
  Clock,
  Trash2,
  PlusCircle,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Share2,
} from "lucide-react";
import { SproutIcon, WheatIcon, OrganicLeafIcon } from "@/components/icons";

interface PriceAlert {
  id: string;
  cropName: string;
  targetPrice: number;
  currentPrice: number;
  unit: string;
  channel: "WhatsApp" | "SMS" | "Email";
  active: boolean;
}

export default function ConsumerSavedPage() {
  const { user, role } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"favorites" | "alerts" | "waitlist">("favorites");

  // Favorites state: initialized empty (0 rows)
  const [favorites, setFavorites] = useState<ApiListing[]>([]);

  // Price alerts state: initialized empty (0 rows)
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertCrop, setAlertCrop] = useState("Country Tomatoes");
  const [alertTargetPrice, setAlertTargetPrice] = useState("20");
  const [alertChannel, setAlertChannel] = useState<"WhatsApp" | "SMS" | "Email">("WhatsApp");

  // Waitlist state: initialized empty (0 rows)
  const [waitlist, setWaitlist] = useState<Array<{ id: string; cropName: string; dateAdded: string; notes: string }>>([]);

  const handleRemoveFavorite = (id: string, title: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Removed from Watchlist",
      description: `"${title}" was removed from your saved lots.`,
      type: "info",
    });
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(alertTargetPrice) || 20;
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      cropName: alertCrop,
      targetPrice: target,
      currentPrice: alertCrop.includes("Tomato") ? 26.0 : alertCrop.includes("Chilli") ? 265.0 : 45.0,
      unit: "kg",
      channel: alertChannel,
      active: true,
    };

    setAlerts([newAlert, ...alerts]);
    setIsAlertModalOpen(false);
    toast({
      title: "Price Alert Active!",
      description: `We will ping you via ${alertChannel} when ${alertCrop} drops below ₹${target}/kg.`,
      type: "success",
    });
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast({
      title: "Alert Removed",
      description: "Price alert deleted.",
      type: "info",
    });
  };

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-[var(--earth-line)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="harvest" size="sm">
              Consumer Hub
            </Badge>
            <span className="text-xs text-[var(--earth-muted)] font-medium">
              Signed in as {user?.name || "Ramesh Kumar"}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight">
            Saved Produce &amp; Price Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1">
            Monitor mandi price fluctuations, bookmark harvest lots, and get instant alerts when prices drop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsAlertModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            + Set New Price Alert
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[var(--earth-line)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("favorites")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "favorites"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Batches ({favorites.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "alerts"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Active Price Alerts ({alerts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("waitlist")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "waitlist"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Harvest Waitlists ({waitlist.length})</span>
        </button>
      </div>

      {/* TAB 1: SAVED BATCHES */}
      {activeTab === "favorites" && (
        <div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((lot) => (
                <div key={lot.id} className="relative group">
                  <CropCard listing={lot} />
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(lot.id, lot.title)}
                    className="absolute top-3 right-12 z-20 p-1.5 rounded-lg bg-white/90 border border-stone-200 text-stone-500 hover:text-rose-600 hover:bg-rose-50 shadow-xs cursor-pointer transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-[var(--earth-border)] space-y-3">
              <Bookmark className="w-10 h-10 text-[var(--earth-muted)] mx-auto opacity-50" />
              <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                No Saved Produce Batches Yet
              </h3>
              <p className="text-xs sm:text-sm text-[var(--earth-muted)] max-w-md mx-auto">
                Explore the marketplace and click &apos;Save&apos; on any fresh crop batch to monitor its price and availability here.
              </p>
              <Link href="/crops">
                <Button variant="primary" size="md" className="mt-2">
                  Browse Marketplace Batches
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRICE ALERTS */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base text-[var(--earth-ink)]">
                      {alert.cropName}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[var(--harvest-700)] border border-amber-200">
                      via {alert.channel}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 text-xs">
                    <span className="text-[var(--earth-muted)]">Current Spot:</span>
                    <span className="font-bold text-[var(--forest-900)]">
                      ₹{alert.currentPrice}/{alert.unit}
                    </span>
                    <span className="text-[var(--earth-muted)]">•</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      Alert Target: ≤ ₹{alert.targetPrice}/{alert.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAlert(alert.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      alert.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {alert.active ? "Active" : "Paused"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HARVEST WAITLISTS */}
      {activeTab === "waitlist" && (
        <div className="space-y-4">
          {waitlist.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-[var(--earth-ink)]">
                    {item.cropName}
                  </h4>
                  <Badge variant="forest" size="sm">
                    Subscribed
                  </Badge>
                </div>
                <p className="text-xs text-[var(--earth-muted)]">{item.notes}</p>
                <span className="text-[10px] text-[var(--earth-muted)] block">
                  Requested on {item.dateAdded}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  SMS &amp; WhatsApp Enabled
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: SET PRICE ALERT */}
      <Modal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title="Set Mandi Price Alert"
        description="We will monitor Karnataka APMC arrivals and notify you when spot prices hit your target."
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <Select
            label="Produce to Monitor"
            value={alertCrop}
            onChange={(e) => setAlertCrop(e.target.value)}
            options={[
              { value: "Country Tomatoes", label: "Country Tomatoes (Current: ₹26/kg)" },
              { value: "Byadgi Red Chillies", label: "Byadgi Chillies (Current: ₹265/kg)" },
              { value: "Green Capsicum", label: "Green Capsicum (Current: ₹42/kg)" },
              { value: "Red Onions", label: "Red Onions (Current: ₹32/kg)" },
              { value: "Native Ragi", label: "Native Ragi (Current: ₹38/kg)" },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Alert Target Price (₹/kg)"
              type="number"
              value={alertTargetPrice}
              onChange={(e) => setAlertTargetPrice(e.target.value)}
              placeholder="e.g. 20"
              required
            />

            <Select
              label="Notification Channel"
              value={alertChannel}
              onChange={(e) => setAlertChannel(e.target.value as any)}
              options={[
                { value: "WhatsApp", label: "WhatsApp Message" },
                { value: "SMS", label: "SMS Text" },
                { value: "Email", label: "Email Alert" },
              ]}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1 justify-center"
              onClick={() => setIsAlertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 justify-center"
              leftIcon={<Bell className="w-4 h-4" />}
            >
              Activate Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
