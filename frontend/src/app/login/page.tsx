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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = loginWithCredentials(userId, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Invalid User ID or Password.");
      return;
    }

    // Role-based routing
    if (result.role === "admin") {
      router.push("/admin");
    } else if (result.role === "farmer") {
      router.push("/dashboard/farmer");
    } else {
      router.push("/consumer");
    }
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
            Enter your User ID and Password to access your portal.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--earth-charcoal)] mb-1 uppercase tracking-wider">
              User ID
            </label>
            <div className="relative">
              <Input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. Amogh or your_username"
                className="w-full text-sm font-medium"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[var(--earth-charcoal)] uppercase tracking-wider">
                Password
              </label>
            </div>
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
            {isSubmitting ? "Signing In..." : "Sign In with User ID"}
          </Button>
        </form>

        {/* Registration Prompt */}
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

          <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--earth-line)] text-left space-y-1 text-[11px]">
            <span className="font-bold text-[var(--forest-900)] block">
              Quick Reference:
            </span>
            <span className="block text-[var(--earth-charcoal)]">
              • <strong>Admin Login:</strong> User ID: <code className="bg-white px-1 py-0.5 rounded font-mono">Amogh</code>
            </span>
            <span className="block text-[var(--earth-charcoal)]">
              • <strong>Farmers &amp; Consumers:</strong> Register with any chosen User ID and Password.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
