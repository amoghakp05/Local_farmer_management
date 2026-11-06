"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, getRegisteredUsers } from "@/lib/auth/auth-context";
import { getAllListings, ApiListing } from "@/lib/data/listings-repository";
import { getAllFarmers, createFarmer } from "@/lib/data/farmers-repository";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlusCircle,
  Users,
  Package,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Trash2,
  TrendingUp,
  Radio,
  Send,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Edit3,
} from "lucide-react";
import { ShieldVerifiedIcon, OrganicLeafIcon, SproutIcon, WheatIcon } from "@/components/icons";

interface PendingVerificationFarmer {
  id: string;
  name: string;
  phone: string;
  district: string;
  village: string;
  landAcres: number;
  rtcDocNumber: string;
  organicCertType: string;
  appliedDate: string;
  status: "pending" | "verified" | "rejected";
}

interface CatalogCrop {
  id: string;
  name: string;
  nameKn: string;
  category: string;
  benchmarkMsp: number;
  unit: string;
  season: string;
}

interface BroadcastAlert {
  id: string;
  title: string;
  district: string;
  message: string;
  timestamp: string;
  type: "price" | "weather" | "general";
}

const INITIAL_CATALOG: CatalogCrop[] = [
  {
    id: "c-1",
    name: "Country Tomatoes (Naati)",
    nameKn: "ನಾಟಿ ಟೊಮೆಟೊ",
    category: "Vegetables",
    benchmarkMsp: 24.0,
    unit: "kg",
    season: "Year-round",
  },
  {
    id: "c-2",
    name: "Byadgi Red Chillies",
    nameKn: "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ",
    category: "Spices",
    benchmarkMsp: 245.0,
    unit: "kg",
    season: "Jan - Apr",
  },
  {
    id: "c-3",
    name: "Native Finger Millet (Ragi)",
    nameKn: "ಶುದ್ಧ ರಾಗಿ",
    category: "Grains",
    benchmarkMsp: 38.0,
    unit: "kg",
    season: "Oct - Dec",
  },
  {
    id: "c-4",
    name: "Kalaburagi Red Gram (Tur)",
    nameKn: "ತೊಗರಿ ಬೇಳೆ",
    category: "Pulses",
    benchmarkMsp: 72.0,
    unit: "kg",
    season: "Dec - Feb",
  },
  {
    id: "c-5",
    name: "Bangalore Rose Onions",
    nameKn: "ಗುಲಾಬಿ ಈರುಳ್ಳಿ",
    category: "Vegetables",
    benchmarkMsp: 32.0,
    unit: "kg",
    season: "Aug - Nov",
  },
  {
    id: "c-6",
    name: "Mysore Robusta Bananas",
    nameKn: "ರೋಬಸ್ಟಾ ಬಾಳೆಹಣ್ಣು",
    category: "Fruits",
    benchmarkMsp: 26.0,
    unit: "kg",
    season: "Year-round",
  },
];

const INITIAL_PENDING_APPLICATIONS: PendingVerificationFarmer[] = [
  {
    id: "kyc-101",
    name: "Basavaraj Patil",
    phone: "+91 98452 11092",
    district: "Haveri",
    village: "Byadgi Rural",
    landAcres: 4.5,
    rtcDocNumber: "KA-HVR-RTC-2026/8892",
    organicCertType: "Jaivik Bharat / PGS-India Green",
    appliedDate: "Today at 09:30 AM",
    status: "pending",
  },
  {
    id: "kyc-102",
    name: "Ningappa Gowda",
    phone: "+91 99014 55321",
    district: "Mandya",
    village: "Maddur Taluk",
    landAcres: 6.0,
    rtcDocNumber: "KA-MDY-RTC-2026/4102",
    organicCertType: "NPOP Organic India Certified",
    appliedDate: "Today at 08:15 AM",
    status: "pending",
  },
  {
    id: "kyc-103",
    name: "Anjanappa Reddy",
    phone: "+91 97412 88710",
    district: "Kolar",
    village: "Bangarapet Agro Zone",
    landAcres: 3.2,
    rtcDocNumber: "KA-KLR-RTC-2026/9014",
    organicCertType: "Natural Farming / Zero Budget SPNF",
    appliedDate: "Yesterday",
    status: "verified",
  },
];

const INITIAL_MODERATION_LISTINGS: ApiListing[] = [
  {
    id: "mod-1",
    farmerId: "f-101",
    farmerName: "Basavaraj Patil",
    farmVillage: "Byadgi",
    district: "Haveri",
    cropId: "crop-byadgi",
    cropName: "Byadgi Chillies",
    cropNameKn: "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ",
    marketId: "mandi-byadgi",
    marketName: "Byadgi APMC Mandi",
    title: "Premium Grade A+ Byadgi Wrinkled Red Chillies",
    description: "Cold-pressed natural red colour. Calibrated and sorted in ventilated crates.",
    pricePerUnit: 240,
    unit: "kg",
    totalQuantity: 500,
    availableQuantity: 450,
    harvestDate: "2026-11-05",
    qualityGrade: "Grade A+",
    isOrganic: true,
    status: "active",
    viewsCount: 42,
    farmerPhoneMasked: "+91 98452 •••••",
    farmerPhone: "+91 98452 11092",
  },
  {
    id: "mod-2",
    farmerId: "f-103",
    farmerName: "Anjanappa Reddy",
    farmVillage: "Bangarapet",
    district: "Kolar",
    cropId: "crop-tomato",
    cropName: "Country Tomatoes",
    cropNameKn: "ನಾಟಿ ಟೊಮೆಟೊ",
    marketId: "mandi-kolar",
    marketName: "Kolar APMC Mandi",
    title: "Fresh Hand-Picked Naati Tomatoes (Early Morning Lot)",
    description: "Firm skin, vibrant red, high juice yield. Weighed on calibrated APMC digital scales.",
    pricePerUnit: 26,
    unit: "kg",
    totalQuantity: 800,
    availableQuantity: 800,
    harvestDate: "2026-11-06",
    qualityGrade: "Grade A+",
    isOrganic: true,
    status: "active",
    viewsCount: 68,
    farmerPhoneMasked: "+91 97412 •••••",
    farmerPhone: "+91 97412 88710",
  },
];

export default function AdminPanelPage() {
  const { user, role, adminLogin, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"farmers" | "listings" | "catalog" | "broadcast">("farmers");

  // State: Farmers KYC, Moderation Listings, Catalog, Broadcasts
  const [pendingFarmers, setPendingFarmers] = useState<PendingVerificationFarmer[]>(INITIAL_PENDING_APPLICATIONS);
  const [moderationListings, setModerationListings] = useState<ApiListing[]>(INITIAL_MODERATION_LISTINGS);
  const [catalog, setCatalog] = useState<CatalogCrop[]>(INITIAL_CATALOG);
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>([
    {
      id: "bc-1",
      title: "Tomato MSP Floor Increased by ₹2/kg",
      district: "Kolar & Bengaluru Mandis",
      message: "APMC board has adjusted minimum support floor for Naati tomatoes to protect grower margins against fuel transport overhead.",
      timestamp: "Today at 07:00 AM",
      type: "price",
    },
  ]);

  // Admin Login Form State
  const [inputAdminId, setInputAdminId] = useState("Amogh");
  const [inputAdminPassword, setInputAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Crop Catalog Modal
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [newCropName, setNewCropName] = useState("");
  const [newCropNameKn, setNewCropNameKn] = useState("");
  const [newCropCategory, setNewCropCategory] = useState("Vegetables");
  const [newCropMsp, setNewCropMsp] = useState("30");
  const [newCropSeason, setNewCropSeason] = useState("Year-round");

  // Broadcast Alert Form
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDistrict, setAlertDistrict] = useState("All Karnataka Mandis");
  const [alertMessage, setAlertMessage] = useState("");

  // Sync registered farmers from localStorage on mount
  useEffect(() => {
    try {
      const reg = getRegisteredUsers().filter((u) => u.role === "farmer");
      if (reg.length > 0) {
        setPendingFarmers((prev) => {
          const existingIds = new Set(prev.map((f) => f.id));
          const newEntries: PendingVerificationFarmer[] = reg
            .filter((u) => !existingIds.has(u.id))
            .map((u) => ({
              id: u.id,
              name: u.name,
              phone: u.phone,
              district: u.district || "Kolar",
              village: u.village || "Agricultural Zone",
              landAcres: u.acres || 3,
              rtcDocNumber: `KA-${(u.district || "KLR").substring(0, 3).toUpperCase()}-RTC-2026/${Math.floor(1000 + Math.random() * 9000)}`,
              organicCertType: u.isOrganic ? "Jaivik Bharat / PGS-India" : "Standard APMC Grower",
              appliedDate: "Recently registered",
              status: "pending",
            }));
          return [...prev, ...newEntries];
        });
      }
    } catch {}
  }, []);

  // Handle Admin Credentials Login
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    const res = adminLogin(inputAdminId, inputAdminPassword);
    setIsSubmitting(false);

    if (!res.success) {
      setLoginError(res.error || "Access Denied: Invalid User ID or Password.");
    } else {
      setInputAdminPassword("");
      toast({
        title: "Admin Console Unlocked",
        description: "Welcome Amogh. State APMC management loaded.",
        type: "success",
      });
    }
  };

  const handleFillAdminCredentials = () => {
    setInputAdminId("Amogh");
    setInputAdminPassword("1328");
    setLoginError(null);
    const res = adminLogin("Amogh", "1328");
    if (res.success) {
      toast({
        title: "Admin Console Unlocked",
        description: "Welcome Amogh. State APMC management loaded.",
        type: "success",
      });
    }
  };

  // 1. STRICT ACCESS CONTROL: Admin page is open ONLY by Amogh with password 1328
  const isAuthorizedAdmin =
    (user?.userId?.toLowerCase() === "amogh" || inputAdminId.toLowerCase() === "amogh") &&
    (role === "admin" || user?.role === "admin");

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FAF8F3]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[var(--earth-border)] shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center mx-auto shadow-inner border border-purple-200">
            <Shield className="w-8 h-8 text-purple-800" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 px-2.5 py-0.5 rounded border border-purple-200">
              State APMC Administration
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--earth-ink)]">
              Admin Login Gate
            </h2>
            <p className="text-xs text-[var(--earth-muted)]">
              Authorized APMC governance desk. Enter your Administrator credentials to continue.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-left flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
                User ID
              </label>
              <Input
                type="text"
                value={inputAdminId}
                onChange={(e) => setInputAdminId(e.target.value)}
                placeholder="Enter User ID (Amogh)"
                className="w-full text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={inputAdminPassword}
                  onChange={(e) => setInputAdminPassword(e.target.value)}
                  placeholder="Enter Password (1328)"
                  className="w-full text-sm font-medium pr-9"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--earth-muted)] hover:text-[var(--earth-ink)] p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full justify-center bg-purple-950 hover:bg-purple-900 text-white shadow-md cursor-pointer mt-2 font-bold"
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              {isSubmitting ? "Verifying..." : "Unlock Admin Console"}
            </Button>

            <button
              type="button"
              onClick={handleFillAdminCredentials}
              className="w-full py-2 px-3 text-xs font-semibold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              One-Click: Fill Admin Credentials (Amogh / 1328)
            </button>
          </form>

          <div className="pt-2 border-t border-[var(--earth-line)]">
            <Link href="/crops">
              <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-[var(--earth-muted)]">
                ← Return to Public Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Actions
  const handleVerifyFarmer = (id: string, name: string) => {
    setPendingFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "verified" } : f))
    );
    toast({
      title: "Farmer Verified & Approved!",
      description: `${name} has been issued a verified grower badge and APMC direct sale license.`,
      type: "success",
    });
  };

  const handleRejectFarmer = (id: string, name: string) => {
    setPendingFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "rejected" } : f))
    );
    toast({
      title: "Application Flagged",
      description: `Verification request for ${name} was marked for land record re-submission.`,
      type: "info",
    });
  };

  const handleApproveListing = (id: string, title: string) => {
    toast({
      title: "Listing Approved Live",
      description: `Batch "${title}" approved for statewide APMC broadcast.`,
      type: "success",
    });
  };

  const handleFlagListing = (id: string, title: string) => {
    setModerationListings((prev) => prev.filter((l) => l.id !== id));
    toast({
      title: "Listing Quality Hold",
      description: `Batch "${title}" placed on hold for mandi grade inspection.`,
      type: "warning",
    });
  };

  const handleUpdateMsp = (cropId: string, delta: number) => {
    setCatalog((prev) =>
      prev.map((c) =>
        c.id === cropId
          ? { ...c, benchmarkMsp: Math.max(1, Math.round((c.benchmarkMsp + delta) * 10) / 10) }
          : c
      )
    );
    toast({
      title: "MSP Benchmark Updated",
      description: "State APMC pricing adjusted in real-time.",
      type: "success",
    });
  };

  const handleAddCatalogCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;

    const newCrop: CatalogCrop = {
      id: `crop-${Date.now()}`,
      name: newCropName.trim(),
      nameKn: newCropNameKn.trim() || newCropName.trim(),
      category: newCropCategory,
      benchmarkMsp: parseFloat(newCropMsp) || 25,
      unit: "kg",
      season: newCropSeason,
    };

    setCatalog([newCrop, ...catalog]);
    setIsCatalogModalOpen(false);
    setNewCropName("");
    setNewCropNameKn("");

    toast({
      title: "New Crop Added to Statewide Catalog!",
      description: `"${newCrop.name}" (${newCrop.nameKn}) is now configured for Karnataka farmers.`,
      type: "success",
    });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) return;

    const newAlert: BroadcastAlert = {
      id: `bc-${Date.now()}`,
      title: alertTitle.trim(),
      district: alertDistrict,
      message: alertMessage.trim(),
      timestamp: "Just now",
      type: "price",
    };

    setBroadcasts([newAlert, ...broadcasts]);
    setAlertTitle("");
    setAlertMessage("");

    toast({
      title: "Statewide Mandi Broadcast Sent!",
      description: `Alert transmitted across ${alertDistrict}.`,
      type: "success",
    });
  };

  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#FAF8F3]">
      {/* Top Banner */}
      <div className="pb-6 mb-8 border-b border-[var(--earth-line)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              State APMC Administration Portal
            </span>
            <span className="text-xs text-[var(--earth-muted)] font-medium">
              Karnataka Agricultural Marketing Board
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[var(--forest-900)] tracking-tight">
            Moderation &amp; Governance Panel
          </h1>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] mt-1">
            Verify farmer KYC documents, moderate active harvest listings, configure crop MSP benchmarks, and broadcast advisories.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Administrator: Amogh</span>
          </div>
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsCatalogModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            + Add Crop to Catalog
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="text-xs hover:border-rose-400 hover:text-rose-700"
          >
            Lock / Exit
          </Button>
        </div>
      </div>

      {/* Admin KPI Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
            Grower KYC Applications
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)]">
              {pendingFarmers.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              {pendingFarmers.filter((f) => f.status === "verified").length} Verified
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
            Active Harvest Lots
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)]">
              {moderationListings.length}
            </span>
            <span className="text-xs font-semibold text-[var(--harvest-700)]">
              100% Quality Graded
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
            State Catalog MSP Crops
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)]">
              {catalog.length}
            </span>
            <span className="text-xs font-semibold text-purple-700">
              Karnataka APMC
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--earth-muted)] block">
            Commission Broker Leakage
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-2xl sm:text-3xl font-black text-emerald-700">
              0%
            </span>
            <span className="text-xs font-semibold text-emerald-800">
              Direct Soil-to-Table
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[var(--earth-line)] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("farmers")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "farmers"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Farmer KYC Verification ({pendingFarmers.filter((f) => f.status === "pending").length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "listings"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Listing Moderation ({moderationListings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "catalog"
              ? "bg-[var(--forest-800)] text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Crop Catalog &amp; MSP Controls ({catalog.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("broadcast")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "broadcast"
              ? "bg-purple-950 text-white shadow-2xs"
              : "text-[var(--earth-muted)] hover:text-purple-900 hover:bg-purple-50"
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Statewide Mandi Broadcasts ({broadcasts.length})</span>
        </button>
      </div>

      {/* SECTION 1: FARMER KYC VERIFICATION QUEUE */}
      {activeTab === "farmers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] px-1">
            <span>Review land RTC records &amp; organic certification numbers before approving verified badges</span>
            <span>{pendingFarmers.length} applications recorded</span>
          </div>

          <div className="space-y-3">
            {pendingFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className="p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-[var(--earth-ink)]">
                      {farmer.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        farmer.status === "verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : farmer.status === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {farmer.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--earth-muted)] flex-wrap">
                    <span>Contact: {farmer.phone}</span>
                    <span>•</span>
                    <span>Location: {farmer.village}, {farmer.district}</span>
                    <span>•</span>
                    <span>Holding: {farmer.landAcres} Acres</span>
                    <span>•</span>
                    <span className="font-mono text-[var(--forest-900)] font-semibold">
                      {farmer.rtcDocNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Certificate: {farmer.organicCertType}</span>
                  </div>
                </div>

                {/* Verification Actions */}
                {farmer.status === "pending" ? (
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRejectFarmer(farmer.id, farmer.name)}
                      className="text-rose-700 hover:bg-rose-50"
                    >
                      Flag Re-submit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerifyFarmer(farmer.id, farmer.name)}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Verify Grower
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Approved Verified APMC Grower
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: LISTINGS MODERATION */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] px-1">
            <span>Moderate produce batches reported or awaiting APMC compliance checks</span>
            <span>{moderationListings.length} harvest lots</span>
          </div>

          <div className="space-y-3">
            {moderationListings.map((lot) => (
              <div
                key={lot.id}
                className="p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base text-[var(--earth-ink)]">
                      {lot.title}
                    </h4>
                    <Badge variant="harvest" size="sm">
                      {lot.qualityGrade}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--earth-muted)] flex-wrap">
                    <span>Grower: {lot.farmerName} ({lot.farmerPhone})</span>
                    <span>•</span>
                    <span>Mandi: {lot.marketName}</span>
                    <span>•</span>
                    <span className="font-bold text-[var(--forest-900)]">
                      ₹{lot.pricePerUnit}/{lot.unit}
                    </span>
                    <span>•</span>
                    <span>Stock: {lot.availableQuantity} {lot.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleFlagListing(lot.id, lot.title)}
                    className="text-rose-700 hover:bg-rose-50"
                  >
                    Quality Hold
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveListing(lot.id, lot.title)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Approve Lot
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: CROP CATALOG MANAGEMENT WITH LIVE MSP CONTROLS */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] px-1">
            <span>Standardized statewide crop definitions and Minimum Support Price (MSP) benchmarks</span>
            <span>{catalog.length} items configured</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((crop) => (
              <div
                key={crop.id}
                className="p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[var(--earth-ink)]">
                        {crop.name}
                      </h4>
                      <span className="text-xs font-semibold text-[var(--harvest-700)] block mt-0.5">
                        {crop.nameKn}
                      </span>
                    </div>
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] font-bold text-[var(--earth-charcoal)]">
                      {crop.category}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--earth-muted)] mt-2">
                    Harvest Season: <strong>{crop.season}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--earth-line)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--earth-muted)] block uppercase font-bold">
                      Govt MSP Benchmark
                    </span>
                    <span className="font-serif text-lg font-black text-[var(--forest-900)]">
                      ₹{crop.benchmarkMsp}/{crop.unit}
                    </span>
                  </div>

                  {/* MSP Adjustment Quick Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateMsp(crop.id, -1)}
                      className="w-7 h-7 rounded-lg bg-[var(--surface-warm)] hover:bg-stone-200 border border-[var(--earth-border)] text-xs font-bold flex items-center justify-center cursor-pointer"
                      title="Decrease MSP by ₹1"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateMsp(crop.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[var(--forest-50)] hover:bg-[var(--forest-100)] border border-[var(--forest-200)] text-[var(--forest-800)] text-xs font-bold flex items-center justify-center cursor-pointer"
                      title="Increase MSP by ₹1"
                    >
                      +1
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: STATEWIDE MANDI BROADCAST ADVISORY DESK */}
      {activeTab === "broadcast" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[var(--earth-border)] shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[var(--forest-900)] mb-1 flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-700" />
              Compose Statewide Mandi Advisory
            </h3>
            <p className="text-xs text-[var(--earth-muted)] mb-5">
              Broadcast critical MSP adjustments, weather alerts, or mandi schedule notices directly to registered growers.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Advisory Title"
                  placeholder="e.g. Tomato Price Floor Revision"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  required
                />
                <Select
                  label="Target Mandi Zone"
                  value={alertDistrict}
                  onChange={(e) => setAlertDistrict(e.target.value)}
                  options={[
                    { value: "All Karnataka Mandis", label: "All Karnataka Mandis" },
                    { value: "Kolar & Bengaluru Mandis", label: "Kolar & Bengaluru Mandis" },
                    { value: "Haveri & Byadgi APMC", label: "Haveri & Byadgi APMC" },
                    { value: "Dharwad & Hubballi Mandis", label: "Dharwad & Hubballi Mandis" },
                    { value: "Mandya & Mysuru Zone", label: "Mandya & Mysuru Zone" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  Advisory Message
                </label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Enter details of the official advisory to broadcast to Karnataka farmers..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--earth-border)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--forest-700)] bg-white"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="bg-purple-950 hover:bg-purple-900 text-white font-bold cursor-pointer"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Statewide Broadcast
                </Button>
              </div>
            </form>
          </div>

          {/* Broadcast History */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-[var(--earth-ink)]">
              Recent Mandi Broadcasts
            </h4>
            {broadcasts.map((bc) => (
              <div
                key={bc.id}
                className="p-4 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-purple-100 text-purple-900">
                      <Radio className="w-3.5 h-3.5" />
                    </span>
                    <h5 className="font-bold text-sm text-[var(--earth-ink)]">{bc.title}</h5>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--earth-muted)]">{bc.timestamp}</span>
                </div>
                <p className="text-xs text-[var(--earth-charcoal)] pl-7">{bc.message}</p>
                <div className="pl-7 pt-1 text-[11px] text-purple-900 font-semibold">
                  Zone: {bc.district}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW CROP TO CATALOG */}
      <Modal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        title="Add Crop to Statewide Catalog"
        description="Configure standardized crop names, regional Kannada translation, and APMC benchmark MSP."
      >
        <form onSubmit={handleAddCatalogCrop} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Crop Name (English)"
              placeholder="e.g. Mysore Betel Leaf"
              value={newCropName}
              onChange={(e) => setNewCropName(e.target.value)}
              required
            />
            <Input
              label="Regional Name (ಕನ್ನಡ)"
              placeholder="e.g. ಮೈಸೂರು ವೀಳ್ಯದೆಲೆ"
              value={newCropNameKn}
              onChange={(e) => setNewCropNameKn(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Category"
              value={newCropCategory}
              onChange={(e) => setNewCropCategory(e.target.value)}
              options={[
                { value: "Vegetables", label: "Vegetables" },
                { value: "Spices", label: "Spices" },
                { value: "Grains", label: "Grains" },
                { value: "Pulses", label: "Pulses" },
                { value: "Fruits", label: "Fruits" },
              ]}
            />
            <Input
              label="Benchmark MSP (₹/kg)"
              type="number"
              value={newCropMsp}
              onChange={(e) => setNewCropMsp(e.target.value)}
              required
            />
            <Input
              label="Primary Season"
              placeholder="e.g. Aug - Nov"
              value={newCropSeason}
              onChange={(e) => setNewCropSeason(e.target.value)}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex-1 justify-center"
              onClick={() => setIsCatalogModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 justify-center"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Add to Catalog
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
