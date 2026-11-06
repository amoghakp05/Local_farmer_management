"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#FAF8F3] text-stone-900 font-sans min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Critical Agricultural App Error
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            The application experienced an unexpected critical error. Please reload the page to
            restore system connectivity.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-colors"
            >
              Reload Application
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 font-medium text-sm hover:bg-stone-200 transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
