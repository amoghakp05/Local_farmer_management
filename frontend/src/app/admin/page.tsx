"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { SEEDED_LISTINGS, ApiListing } from "@/lib/data/listings-repository";
import { getAllFarmers, DetailedFarmerProfile } from "@/lib/data/farmers-repository";
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
  Star,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Trash2,
} from "lucide-react";
import { ShieldVerifiedIcon, OrganicLeafIcon, SproutIcon } from "@/components/icons";

interface PendingVerificationFarmer {
  id: string;
  name: string;
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

const INITIAL_CATALOG: CatalogCrop[] = [
  {
    id: "c-1",
    name: "Country Tomatoes",
    nameKn: "ನಾಟಿ ಟೊಮೆಟೊ",
    category: "Vegetables",
    benchmarkMsp: 22.0,
    unit: "kg",
    season: "Year-round",
  },
  {
    id: "c-2",
    name: "Byadgi Red Chillies",
    nameKn: "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ",
    category: "Spices",
    benchmarkMsp: 240.0,
    unit: "kg",
    season: "Jan - Apr",
  },
  {
    id: "c-3",
    name: "Native Finger Millet (Ragi)",
    nameKn: "ಶುದ್ಧ ರಾಗಿ",
    category: "Grains",
    benchmarkMsp: 35.0,
    unit: "kg",
    season: "Oct - Dec",
  },
  {
    id: "c-4",
    name: "Kalaburagi Red Gram (Tur)",
    nameKn: "ತೊಗರಿ ಬೇಳೆ",
    category: "Pulses",
    benchmarkMsp: 70.0,
    unit: "kg",
    season: "Dec - Feb",
  },
];

export default function AdminPanelPage() {
  const { user, role, adminLogin, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"farmers" | "listings" | "catalog" | "reviews">("farmers");

  // State: Initialized empty (0 pending farmers, 0 seeded moderation listings)
  const [pendingFarmers, setPendingFarmers] = useState<PendingVerificationFarmer[]>([]);
  const [moderationListings, setModerationListings] = useState<ApiListing[]>([]);
  const [catalog, setCatalog] = useState<CatalogCrop[]>(INITIAL_CATALOG);

  // Admin Login Form State
  const [inputAdminId, setInputAdminId] = useState("Amogh");
  const [inputAdminPassword, setInputAdminPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Crop Catalog Modal
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [newCropName, setNewCropName] = useState("");
  const [newCropNameKn, setNewCropNameKn] = useState("");
  const [newCropCategory, setNewCropCategory] = useState("Vegetables");
  const [newCropMsp, setNewCropMsp] = useState("30");
  const [newCropSeason, setNewCropSeason] = useState("Year-round");

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
    }
  };

  // 1. STRICT ACCESS CONTROL: Admin page is open ONLY by Amogh with password 1328
  const isAuthorizedAdmin = user?.userId === "Amogh" && role === "admin";

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[var(--earth-border)] shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 px-2.5 py-0.5 rounded border border-purple-200">
              State APMC Administration
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--earth-ink)]">
              Admin Login Gate
            </h2>
            <p className="text-xs text-[var(--earth-muted)]">
              Authorized personnel only. Please verify your Administrator identity to continue.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-left flex items-start gap-2 animate-in fade-in">
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
                placeholder="Enter User ID (e.g. Amogh)"
                className="w-full text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
                Password
              </label>
              <Input
                type="password"
                value={inputAdminPassword}
                onChange={(e) => setInputAdminPassword(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full text-sm font-medium"
                autoFocus
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full justify-center bg-purple-950 hover:bg-purple-900 text-white shadow-md cursor-pointer mt-2"
              leftIcon={<Shield className="w-4 h-4" />}
            >
              {isSubmitting ? "Verifying..." : "Unlock Admin Console"}
            </Button>
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
      description: `${name} has been issued a verified grower badge and APMC direct sale card.`,
      type: "success",
    });
  };

  const handleRejectFarmer = (id: string, name: string) => {
    setPendingFarmers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "rejected" } : f))
    );
    toast({
      title: "Application Rejected",
      description: `Verification request for ${name} was rejected. Feedback sent.`,
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
      title: "Listing Flagged & Removed",
      description: `Batch "${title}" temporarily held for quality officer inspection.`,
      type: "warning",
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
      description: `"${newCrop.name}" (${newCrop.nameKn}) is now selectable by all Karnataka farmers.`,
      type: "success",
    });
  };

  return (
    <div className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
            Verify farmer KYC documents, moderate active harvest listings, and configure official crop catalog MSP benchmarks.
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
            onClick={logout}
            className="text-xs hover:border-rose-400 hover:text-rose-700"
          >
            Lock / Exit
          </Button>
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
          <span>Listing Moderation</span>
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
          <span>Crop Catalog &amp; MSP ({catalog.length})</span>
        </button>
      </div>

      {/* SECTION 1: FARMER KYC VERIFICATION QUEUE */}
      {activeTab === "farmers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] px-1">
            <span>Review land RTC records &amp; organic certification numbers before approving verified badges</span>
            <span>{pendingFarmers.length} applications</span>
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
                      Reject
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
                    Processed
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
            <span>{moderationListings.length} lots</span>
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
                    <span>Grower: {lot.farmerName}</span>
                    <span>•</span>
                    <span>District: {lot.district}</span>
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
                    Flag / Remove
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

      {/* SECTION 3: CROP CATALOG MANAGEMENT */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--earth-muted)] px-1">
            <span>Standardized statewide crop definitions and Minimum Support Price (MSP) benchmarks</span>
            <span>{catalog.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {catalog.map((crop) => (
              <div
                key={crop.id}
                className="p-5 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-serif font-bold text-base text-[var(--earth-ink)]">
                    {crop.name}
                  </h4>
                  <span className="text-xs font-semibold text-[var(--harvest-700)] block">
                    {crop.nameKn}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-[var(--earth-muted)] mt-1.5">
                    <span className="bg-stone-100 px-2 py-0.5 rounded font-medium">
                      {crop.category}
                    </span>
                    <span>Season: {crop.season}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[var(--earth-muted)] block uppercase font-medium">
                    Govt MSP Benchmark
                  </span>
                  <span className="font-serif text-lg font-black text-[var(--forest-900)]">
                    ₹{crop.benchmarkMsp}/{crop.unit}
                  </span>
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
