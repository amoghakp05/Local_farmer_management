"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SproutIcon } from "@/components/icons";
import {
  Lock,
  User,
  ArrowRight,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, adminLogin, switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState<"standard" | "admin">("standard");

  // Standard Login Fields
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Admin Login Fields
  const [adminId, setAdminId] = useState("Amogh");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = loginWithCredentials(userId, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Invalid User ID or Password.");
      return;
    }

    if (result.role === "admin") {
      window.location.href = "/admin";
    } else if (result.role === "farmer") {
      window.location.href = "/dashboard/farmer";
    } else {
      window.location.href = "/consumer";
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = adminLogin(adminId, adminPassword);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Access Denied: Invalid Admin Credentials.");
      return;
    }

    window.location.href = "/admin";
  };

  const handleQuickFillAdmin = () => {
    setAdminId("Amogh");
    setAdminPassword("1328");
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F3] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[var(--earth-border)] shadow-[var(--shadow-warm-lg)] p-6 sm:p-10">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--forest-700)] text-[#FAF8F3] flex items-center justify-center mx-auto shadow-xs">
            <SproutIcon size={26} className="text-[#FAF8F3]" />
          </div>
          <h1 className="font-serif text-3xl font-black text-[var(--forest-900)] tracking-tight">
            Sign In to KhetBazaar
          </h1>
          <p className="text-xs text-[var(--earth-muted)]">
            Direct farmer-to-consumer and APMC mandi governance portal.
          </p>
        </div>

        {/* Tab Switcher: Standard User vs APMC Administrator */}
        <div className="flex rounded-xl bg-[var(--surface-warm)] p-1 border border-[var(--earth-border-subtle)] mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab("standard");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "standard"
                ? "bg-white text-[var(--forest-900)] shadow-xs"
                : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Farmer / Consumer
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "admin"
                ? "bg-purple-950 text-white shadow-xs"
                : "text-[var(--earth-muted)] hover:text-purple-900"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            APMC Admin
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: STANDARD USER SIGN IN */}
        {activeTab === "standard" && (
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
                User ID
              </label>
              <Input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. your_username"
                className="w-full text-sm font-medium"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
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

            <Button
              type="submit"
              variant="accent"
              size="md"
              disabled={isSubmitting}
              className="w-full justify-center text-sm font-bold shadow-md cursor-pointer mt-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSubmitting ? "Signing In..." : "Sign In to Portal"}
            </Button>
          </form>
        )}

        {/* TAB 2: APMC ADMINISTRATOR SIGN IN */}
        {activeTab === "admin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs font-medium space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <Shield className="w-4 h-4 text-purple-700" />
                State APMC Administrative Gate
              </div>
              <p className="text-[11px] text-purple-800">
                Authorized APMC officer access only. User ID: <code>Amogh</code> | Password: <code>1328</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
                Admin User ID
              </label>
              <Input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Amogh"
                className="w-full text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <Input
                  type={showAdminPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password (1328)"
                  className="w-full text-sm font-medium pr-9"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--earth-muted)] hover:text-[var(--earth-ink)] p-1 cursor-pointer"
                  aria-label={showAdminPassword ? "Hide password" : "Show password"}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full justify-center bg-purple-950 hover:bg-purple-900 text-white text-sm font-bold shadow-md cursor-pointer mt-2"
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              {isSubmitting ? "Unlocking Console..." : "Unlock APMC Admin Console"}
            </Button>

            {/* Quick Fill Credentials Helper Button */}
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="w-full py-2 px-3 text-xs font-semibold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              One-Click: Fill Admin Credentials (Amogh / 1328)
            </button>
          </form>
        )}

        {/* Quick Guest Access & Registration */}
        <div className="mt-6 pt-5 border-t border-[var(--earth-line)] space-y-3 text-center text-xs text-[var(--earth-muted)]">
          <div>
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-[var(--forest-800)] hover:underline inline-flex items-center gap-0.5"
            >
              Register as Farmer or Consumer →
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                switchRole("farmer");
                window.location.href = "/dashboard/farmer";
              }}
              className="text-[11px] font-semibold text-[var(--harvest-700)] hover:underline cursor-pointer"
            >
              Explore as Guest Farmer
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                switchRole("consumer");
                window.location.href = "/consumer";
              }}
              className="text-[11px] font-semibold text-[var(--forest-700)] hover:underline cursor-pointer"
            >
              Explore as Guest Consumer
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
