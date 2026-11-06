"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: "h-4 w-full rounded-md",
    rectangular: "w-full rounded-xl",
    circular: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-[var(--surface-muted)] animate-pulse",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
