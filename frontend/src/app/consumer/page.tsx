"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { getAllListings, ApiListing } from "@/lib/data/listings-repository";
import { getAllFarmers } from "@/lib/data/farmers-repository";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { SproutIcon, OrganicLeafIcon, MarketStallIcon } from "@/components/icons";
import {
  Bookmark,
  Bell,
  Clock,
  Trash2,
  PlusCircle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  User,
  ShoppingBag,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface PriceAlert {
  id: string;
  cropName: string;
  targetPrice: number;
  currentPrice: number;
  unit: string;
  channel: "WhatsApp" | "SMS" | "Email";
  active: boolean;
}

export default function ConsumerHubPage() {
  const { user, role, loginWithCredentials, registerUser, logout, switchRole } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"watchlist" | "alerts" | "inquiries" | "fresh">("watchlist");

  // Auth form states for unauthenticated users
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [authUserId, setAuthUserId] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Consumer Data
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [favorites, setFavorites] = useState<ApiListing[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertCrop, setAlertCrop] = useState("Country Tomatoes");
  const [alertTargetPrice, setAlertTargetPrice] = useState("20");
  const [alertChannel, setAlertChannel] = useState<"WhatsApp" | "SMS" | "Email">("WhatsApp");

  useEffect(() => {
    const all = getAllListings();
    setListings(all);
    // Pre-populate favorites if available
    setFavorites(all.slice(0, 4));
  }, []);

  // Handle Quick Consumer Login
  const handleConsumerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = loginWithCredentials(authUserId, authPassword);
    if (!res.success) {
      setAuthError(res.error || "Invalid User ID or Password.");
    }
  };

  // Handle Quick Consumer Register
  const handleConsumerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = registerUser({
      userId: authUserId,
      password: authPassword,
      name: authName,
      phone: authPhone,
      role: "consumer",
    });
    if (!res.success) {
      setAuthError(res.error || "Registration failed.");
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(alertTargetPrice) || 20;
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      cropName: alertCrop,
      targetPrice: target,
      currentPrice: alertCrop.includes("Tomato") ? 28.0 : alertCrop.includes("Chilli") ? 260.0 : 45.0,
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

  const handleRemoveFavorite = (id: string, title: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Removed from Watchlist",
      description: `"${title}" was removed from your saved lots.`,
      type: "info",
    });
  };

  // If user is not authenticated as consumer (or guest consumer)
  const isConsumer = user && (user.role === "consumer" || role === "consumer");

  if (!isConsumer) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[var(--earth-border)] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[var(--harvest-100)] text-[var(--harvest-700)] flex items-center justify-center mx-auto shadow-xs">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-3xl font-black text-[var(--forest-900)] tracking-tight">
              Consumer Portal
            </h1>
            <p className="text-xs text-[var(--earth-muted)]">
              Direct farm-to-kitchen produce, real-time APMC price alerts, and transparent grower traceability.
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--surface-warm)] rounded-xl border border-[var(--earth-line)] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setAuthError(null);
              }}
              className={`py-2 rounded-lg cursor-pointer transition-colors ${
                authMode === "signin"
                  ? "bg-white text-[var(--forest-900)] shadow-xs"
                  : "text-[var(--earth-muted)]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError(null);
              }}
              className={`py-2 rounded-lg cursor-pointer transition-colors ${
                authMode === "register"
                  ? "bg-white text-[var(--forest-900)] shadow-xs"
                  : "text-[var(--earth-muted)]"
              }`}
            >
              Register as Buyer
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {authError}
            </div>
          )}

          {authMode === "signin" ? (
            <form onSubmit={handleConsumerSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  User ID
                </label>
                <Input
                  type="text"
                  value={authUserId}
                  onChange={(e) => setAuthUserId(e.target.value)}
                  placeholder="Enter your User ID"
                  className="w-full text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="md"
                className="w-full justify-center text-sm font-bold shadow-md cursor-pointer mt-2"
              >
                Sign In to Consumer Hub
              </Button>
            </form>
          ) : (
            <form onSubmit={handleConsumerRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  User ID <span className="text-rose-600">*</span>
                </label>
                <Input
                  type="text"
                  value={authUserId}
                  onChange={(e) => setAuthUserId(e.target.value.replace(/\s+/g, "_"))}
                  placeholder="e.g. buyer_amogh"
                  className="w-full text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  Password <span className="text-rose-600">*</span>
                </label>
                <Input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <Input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <Input
                  type="tel"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="md"
                className="w-full justify-center text-sm font-bold shadow-md cursor-pointer mt-2"
              >
                Create Consumer Account
              </Button>
            </form>
          )}

          <div className="pt-3 border-t border-[var(--earth-line)] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => switchRole("consumer")}
              className="text-[var(--forest-800)] font-semibold hover:underline cursor-pointer"
            >
              Continue as Guest Buyer
            </button>
            <Link href="/crops" className="text-[var(--earth-muted)] hover:underline">
              Browse Marketplace →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Consumer Header */}
      <div className="pb-8 mb-8 border-b border-[var(--earth-line)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="forest" size="sm" icon={<User className="w-3.5 h-3.5" />}>
              Consumer Buyer Hub
            </Badge>
            <span className="text-xs text-[var(--earth-muted)] font-medium">
              Logged in as: <strong className="text-[var(--forest-900)]">{user?.name}</strong> (@{user?.userId})
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight">
            Direct Farm Sourcing
          </h1>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1 max-w-2xl">
            Track wholesale harvest lots, monitor price drop alerts, and contact Karnataka growers directly with 0% middleman fees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsAlertModalOpen(true)}
            leftIcon={<Bell className="w-4 h-4" />}
          >
            + Set Price Alert
          </Button>
          <Link href="/crops">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Search className="w-4 h-4" />}
            >
              Browse Fresh Produce
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-4 sm:p-5 shadow-[var(--shadow-warm-sm)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--earth-muted)] mb-1">
            <span>Saved Produce Lots</span>
            <Bookmark className="w-4 h-4 text-[var(--forest-700)]" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)]">
            {favorites.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            Live Mandi Updates
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-4 sm:p-5 shadow-[var(--shadow-warm-sm)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--earth-muted)] mb-1">
            <span>Active Price Alerts</span>
            <Bell className="w-4 h-4 text-[var(--harvest-600)]" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--harvest-700)]">
            {alerts.length}
          </span>
          <span className="text-[11px] text-[var(--earth-muted)] block mt-1">
            WhatsApp / SMS Triggers
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-4 sm:p-5 shadow-[var(--shadow-warm-sm)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--earth-muted)] mb-1">
            <span>Direct Farmer Sourcing</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-emerald-800">
            100%
          </span>
          <span className="text-[11px] text-[var(--earth-muted)] block mt-1">
            Verified Karnataka Growers
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--earth-border)] p-4 sm:p-5 shadow-[var(--shadow-warm-sm)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--earth-muted)] mb-1">
            <span>Middleman Commission</span>
            <TrendingDown className="w-4 h-4 text-blue-700" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-black text-blue-900">
            ₹0.00
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
            Zero Broker Deductions
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--earth-line)] mb-6 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("watchlist")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "watchlist"
              ? "bg-[var(--forest-800)] text-white shadow-xs"
              : "text-[var(--earth-charcoal)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Lots ({favorites.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("alerts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "alerts"
              ? "bg-[var(--forest-800)] text-white shadow-xs"
              : "text-[var(--earth-charcoal)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Price Alerts ({alerts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fresh")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "fresh"
              ? "bg-[var(--forest-800)] text-white shadow-xs"
              : "text-[var(--earth-charcoal)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <MarketStallIcon size={16} />
          <span>All Market Produce ({listings.length})</span>
        </button>
      </div>

      {/* TAB 1: WATCHLIST */}
      {activeTab === "watchlist" && (
        <div>
          {favorites.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[var(--earth-border)] max-w-lg mx-auto">
              <Bookmark className="w-10 h-10 text-[var(--earth-muted)] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                Your Saved Lots Watchlist is Empty
              </h3>
              <p className="text-xs text-[var(--earth-muted)] mt-1.5 max-w-sm mx-auto">
                Explore live produce from Kolar, Haveri, and Dharwad farmers and bookmark them to monitor real-time Mandi price changes.
              </p>
              <Link href="/crops" className="inline-block mt-4">
                <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Produce Marketplace
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((l) => (
                <div
                  key={l.id}
                  className="bg-white rounded-2xl border border-[var(--earth-border)] p-5 shadow-[var(--shadow-warm-sm)] hover:border-[var(--forest-700)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-serif text-lg font-bold text-[var(--forest-900)]">
                        {l.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(l.id, l.title)}
                        className="text-[var(--earth-muted)] hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--earth-muted)] mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[var(--harvest-600)]" />
                      <span>{l.farmVillage}, {l.district}</span>
                    </div>

                    <div className="flex items-baseline gap-1 my-2">
                      <span className="font-serif text-2xl font-black text-[var(--harvest-700)]">
                        ₹{l.pricePerUnit}
                      </span>
                      <span className="text-xs text-[var(--earth-muted)] font-semibold">
                        /{l.unit}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold ml-2">
                        • {l.availableQuantity} {l.unit} in stock
                      </span>
                    </div>

                    <p className="text-xs text-[var(--earth-charcoal)] line-clamp-2 mt-2 leading-relaxed">
                      {l.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--earth-line)] flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[var(--earth-charcoal)]">
                      Grower: <strong>{l.farmerName}</strong>
                    </span>
                    <a
                      href={`tel:${l.farmerPhone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[var(--forest-800)] hover:text-[var(--forest-900)] bg-[var(--surface-warm)] px-3 py-1.5 rounded-lg border border-[var(--earth-border-subtle)]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Farmer
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALERTS */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[var(--forest-900)]">
                Mandi Price Drop Notifications
              </h2>
              <p className="text-xs text-[var(--earth-muted)] mt-0.5">
                Get alerted instantly when wholesale rates drop to your desired purchase target.
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsAlertModalOpen(true)}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              + Create Price Alert
            </Button>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[var(--earth-border)] max-w-lg mx-auto">
              <Bell className="w-10 h-10 text-[var(--earth-muted)] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                No Price Alerts Configured
              </h3>
              <p className="text-xs text-[var(--earth-muted)] mt-1.5 max-w-sm mx-auto">
                Set an alert for Tomatoes, Byadgi Chilli, or Onions to receive immediate WhatsApp or SMS pings when farmers list below your threshold.
              </p>
              <Button
                variant="accent"
                size="sm"
                className="mt-4"
                onClick={() => setIsAlertModalOpen(true)}
              >
                Set First Price Alert
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl border border-[var(--earth-border)] p-5 shadow-[var(--shadow-warm-sm)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-lg font-bold text-[var(--earth-ink)]">
                      {a.cropName}
                    </span>
                    <Badge variant="forest" size="sm">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-[var(--earth-muted)]">Target Price:</span>
                    <span className="font-serif text-xl font-bold text-[var(--forest-900)]">
                      ₹{a.targetPrice}/{a.unit}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--earth-muted)] mt-1">
                    Current Mandi Benchmark: ₹{a.currentPrice}/{a.unit}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[var(--earth-line)] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--harvest-700)]">
                      Channel: {a.channel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAlerts((prev) => prev.filter((item) => item.id !== a.id))}
                      className="text-[var(--earth-muted)] hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL MARKET PRODUCE */}
      {activeTab === "fresh" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[var(--forest-900)]">
              All Active Harvest Batches
            </h2>
            <Link href="/crops">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Filter in Full Marketplace
              </Button>
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[var(--earth-border)] max-w-lg mx-auto">
              <SproutIcon size={40} className="text-[var(--forest-700)] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[var(--earth-ink)]">
                No Harvest Lots Listed Yet
              </h3>
              <p className="text-xs text-[var(--earth-muted)] mt-1.5 max-w-sm mx-auto">
                Real Karnataka farmers are currently registering and preparing their harvest batches. Check back shortly!
              </p>
              <Link href="/register?role=farmer" className="inline-block mt-4">
                <Button variant="accent" size="sm">
                  Are you a Farmer? Add First Lot
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="bg-white rounded-2xl border border-[var(--earth-border)] p-5 shadow-[var(--shadow-warm-sm)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-lg font-bold text-[var(--forest-900)]">
                        {l.title}
                      </span>
                      {l.isOrganic && (
                        <Badge variant="forest" size="sm" icon={<OrganicLeafIcon size={11} />}>
                          Organic
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 my-1">
                      <span className="font-serif text-2xl font-black text-[var(--harvest-700)]">
                        ₹{l.pricePerUnit}
                      </span>
                      <span className="text-xs text-[var(--earth-muted)] font-semibold">
                        /{l.unit}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--earth-muted)] mt-1">
                      Available: {l.availableQuantity} {l.unit} • Grade: {l.qualityGrade}
                    </div>

                    <p className="text-xs text-[var(--earth-charcoal)] mt-2 line-clamp-2">
                      {l.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--earth-line)] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--earth-charcoal)]">
                      {l.farmerName} ({l.district})
                    </span>
                    <a
                      href={`tel:${l.farmerPhone.replace(/\s+/g, "")}`}
                      className="text-xs font-bold text-[var(--forest-800)] hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Contact
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE ALERT MODAL */}
      <Modal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        title="Configure Mandi Price Drop Alert"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
              Select Agricultural Commodity
            </label>
            <Select
              value={alertCrop}
              onChange={(e) => setAlertCrop(e.target.value)}
              options={[
                { value: "Country Tomatoes", label: "Country Tomatoes (ನಾಟಿ ಟೊಮೆಟೊ)" },
                { value: "Byadgi Chilli", label: "Byadgi Chilli (ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ)" },
                { value: "Dharwad Hybrid Onion", label: "Hybrid Onion (ಈರುಳ್ಳಿ)" },
                { value: "Kalaburagi Red Gram (Tur)", label: "Red Gram / Tur (ತೊಗರಿ ಬೇಳೆ)" },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
              Target Alert Price (₹ per kg)
            </label>
            <Input
              type="number"
              value={alertTargetPrice}
              onChange={(e) => setAlertTargetPrice(e.target.value)}
              className="w-full text-sm font-semibold"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
              Preferred Notification Channel
            </label>
            <Select
              value={alertChannel}
              onChange={(e) => setAlertChannel(e.target.value as any)}
              options={[
                { value: "WhatsApp", label: "WhatsApp Direct Alert" },
                { value: "SMS", label: "SMS Carrier Broadcast" },
                { value: "Email", label: "Email Dispatch" },
              ]}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAlertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm">
              Activate Price Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
