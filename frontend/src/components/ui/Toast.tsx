"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, type = "success" }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 bg-white",
                t.type === "success" &&
                  "border-[var(--forest-600)] text-[var(--forest-900)]",
                t.type === "warning" &&
                  "border-[var(--harvest-600)] text-[var(--harvest-900)]",
                t.type === "error" && "border-[#A82828] text-[#851E1E]",
                t.type === "info" && "border-[var(--earth-border)] text-[var(--earth-ink)]"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-[var(--forest-700)]" />
                )}
                {t.type === "warning" && (
                  <AlertTriangle className="w-5 h-5 text-[var(--harvest-600)]" />
                )}
                {t.type === "error" && (
                  <XCircle className="w-5 h-5 text-[#A82828]" />
                )}
                {t.type === "info" && (
                  <Info className="w-5 h-5 text-[var(--earth-muted)]" />
                )}
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-sm font-semibold">{t.title}</h4>
                {t.description && (
                  <p className="text-xs text-[var(--earth-muted)] mt-0.5 leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss toast"
                className="p-1 rounded-md text-[var(--earth-muted)] hover:text-[var(--earth-ink)] hover:bg-[var(--surface-warm)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
