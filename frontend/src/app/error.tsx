"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to reporting service in production
    console.error("KhetBazaar Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 py-16 bg-[#FAF8F3]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[var(--earth-border)] p-6 sm:p-8 shadow-[var(--shadow-warm-sm)] text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-[var(--earth-muted)]">
            Agricultural System Error
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[var(--forest-900)]">
            Encountered a Bump in the Furrow
          </h1>
          <p className="text-xs sm:text-sm text-[var(--earth-muted)] leading-relaxed">
            We ran into an unexpected issue while loading agricultural listings or mandi rates. Your
            data has not been lost.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-stone-400">
              Error Reference: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto justify-center"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto justify-center"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-[var(--earth-line)] text-xs text-[var(--earth-muted)]">
          Need assistance?{" "}
          <Link href="/contact" className="font-semibold text-[var(--forest-800)] underline">
            Contact Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
