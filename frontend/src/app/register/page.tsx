"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { SproutIcon, OrganicLeafIcon } from "@/components/icons";
import {
  User,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const KARNATAKA_DISTRICTS = [
  { value: "kolar", label: "Kolar (ಕೋಲಾರ)" },
  { value: "haveri", label: "Haveri (ಹಾವೇರಿ)" },
  { value: "dharwad", label: "Dharwad (ಧಾರವಾಡ)" },
  { value: "mandya", label: "Mandya (ಮಂಡ್ಯ)" },
  { value: "belagavi", label: "Belagavi (ಬೆಳಗಾವಿ)" },
  { value: "mysuru", label: "Mysuru (ಮೈಸೂರು)" },
  { value: "shimoga", label: "Shimoga (ಶಿವಮೊಗ್ಗ)" },
  { value: "tumakuru", label: "Tumakuru (ತುಮಕೂರು)" },
];

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "consumer" ? "consumer" : "farmer";

  const { registerUser } = useAuth();

  const [role, setRole] = useState<"farmer" | "consumer">(initialRole);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Farmer specific fields
  const [district, setDistrict] = useState("kolar");
  const [village, setVillage] = useState("");
  const [acres, setAcres] = useState("3");
  const [isOrganic, setIsOrganic] = useState(true);
  const [primaryCrops, setPrimaryCrops] = useState("Country Tomatoes, Byadgi Chilli");

  // Error & loading states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const cropsArray = primaryCrops
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const result = registerUser({
      userId,
      password,
      name: fullName,
      phone,
      email: email.trim() || undefined,
      role,
      district: district.charAt(0).toUpperCase() + district.slice(1),
      village: village.trim() || (district.charAt(0).toUpperCase() + district.slice(1)),
      acres: parseFloat(acres) || 2,
      isOrganic,
      primaryCrops: cropsArray,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Registration failed. Please check your details.");
      return;
    }

    // Redirect to respective destination
    if (role === "farmer") {
      router.push("/dashboard/farmer");
    } else {
      router.push("/consumer");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 sm:py-14 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-[var(--earth-border)] shadow-[var(--shadow-warm-lg)] p-6 sm:p-10">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-warm)] border border-[var(--earth-border)] text-xs font-semibold text-[var(--forest-900)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--harvest-600)]" />
            <span>KhetBazaar Membership</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-[var(--forest-900)] tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] max-w-md mx-auto">
            Direct farmer-to-consumer trading with zero middleman deductions. Register today with your User ID and Password.
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[var(--surface-warm)] rounded-2xl border border-[var(--earth-line)] mb-6">
          <button
            type="button"
            onClick={() => setRole("farmer")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              role === "farmer"
                ? "bg-[var(--forest-800)] text-white shadow-md scale-[1.01]"
                : "text-[var(--earth-charcoal)] hover:text-[var(--forest-900)] hover:bg-white/60"
            }`}
          >
            <SproutIcon size={18} className={role === "farmer" ? "text-amber-200" : "text-[var(--forest-700)]"} />
            <span>Farmer (Grower)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("consumer")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              role === "consumer"
                ? "bg-[var(--forest-800)] text-white shadow-md scale-[1.01]"
                : "text-[var(--earth-charcoal)] hover:text-[var(--forest-900)] hover:bg-white/60"
            }`}
          >
            <User className={`w-4 h-4 ${role === "consumer" ? "text-amber-200" : "text-[var(--harvest-600)]"}`} />
            <span>Consumer (Buyer)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Account Credentials */}
          <div className="p-4 rounded-2xl bg-[var(--canvas)] border border-[var(--earth-line)] space-y-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--forest-900)] block">
              Login Credentials
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  User ID <span className="text-rose-600">*</span>
                </label>
                <Input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.replace(/\s+/g, "_"))}
                  placeholder="e.g. ramesh_kolar"
                  className="w-full text-sm font-medium"
                  required
                />
                <span className="text-[10px] text-[var(--earth-muted)] mt-1 block">
                  Your unique login handle
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    className="w-full text-sm font-medium pr-9"
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
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === "farmer" ? "e.g. Ramesh Gowda" : "e.g. Priya Sharma"}
                className="w-full text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1">
                Mobile Number (10 Digits) <span className="text-rose-600">*</span>
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full text-sm"
                required
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === "farmer" ? (
            <div className="p-4 rounded-2xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--forest-900)]">
                  Farmland &amp; Agriculture Details
                </span>
                <Badge variant="forest" size="sm">
                  Verified Grower
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--earth-charcoal)] mb-1">
                    District (ಜಿಲ್ಲೆ)
                  </label>
                  <Select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    options={KARNATAKA_DISTRICTS}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--earth-charcoal)] mb-1">
                    Village / Taluk (ಗ್ರಾಮ)
                  </label>
                  <Input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Srinivaspur Taluk"
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--earth-charcoal)] mb-1">
                    Cultivated Land (Acres)
                  </label>
                  <Input
                    type="number"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full text-sm"
                    min="0.5"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--earth-charcoal)] mb-1">
                    Primary Crops Cultivated
                  </label>
                  <Input
                    type="text"
                    value={primaryCrops}
                    onChange={(e) => setPrimaryCrops(e.target.value)}
                    placeholder="e.g. Tomatoes, Chilli, Tur Dal"
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <OrganicLeafIcon size={16} className="text-emerald-700" />
                  <span className="text-xs font-semibold text-[var(--earth-charcoal)]">
                    Organic / Chemical-Free Cultivation
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="w-4 h-4 text-[var(--forest-700)] accent-[var(--forest-700)] cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] space-y-3 animate-in fade-in">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--harvest-800)] block">
                Buyer Preferences
              </span>
              <div>
                <label className="block text-xs font-semibold text-[var(--earth-charcoal)] mb-1">
                  Preferred Mandi / District for Direct Sourcing
                </label>
                <Select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  options={KARNATAKA_DISTRICTS}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            className="w-full justify-center text-sm sm:text-base font-bold shadow-md cursor-pointer mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting
              ? "Registering..."
              : role === "farmer"
              ? "Register as Farmer & Open Dashboard"
              : "Register as Consumer & Open Hub"}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-5 border-t border-[var(--earth-line)] text-center text-xs text-[var(--earth-muted)] space-y-2">
          <div>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--forest-800)] hover:underline inline-flex items-center gap-0.5"
            >
              Sign In with User ID
            </Link>
          </div>
          <div>
            Are you the State Administrator?{" "}
            <Link
              href="/admin"
              className="font-semibold text-purple-900 hover:underline"
            >
              Admin Gate (Amogh)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
      <Suspense fallback={<div className="p-8 text-center text-sm font-semibold">Loading registration...</div>}>
        <RegisterFormContent />
      </Suspense>
    </main>
  );
}
