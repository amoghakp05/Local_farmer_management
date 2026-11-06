"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-[var(--earth-border)] rounded-2xl bg-[var(--surface-warm)]/40 max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--earth-border-subtle)] flex items-center justify-center text-[var(--forest-700)] shadow-sm mb-4">
        {icon || (
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--harvest-600)]"
            aria-hidden="true"
          >
            <path d="M3 7l9-4 9 4v11l-9 4-9-4V7z" />
            <path d="M3 7l9 4 9-4" />
            <path d="M12 11v11" />
            <path d="m8 13 4 2 4-2" />
          </svg>
        )}
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--earth-ink)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--earth-muted)] mt-2 max-w-sm leading-relaxed">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
