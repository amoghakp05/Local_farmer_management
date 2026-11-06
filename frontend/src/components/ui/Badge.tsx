"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "forest" | "harvest" | "neutral" | "outline" | "danger";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = "forest",
  size = "md",
  icon,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    forest:
      "bg-[var(--forest-100)] text-[var(--forest-800)] border border-[var(--forest-200)]",
    harvest:
      "bg-[var(--harvest-100)] text-[var(--harvest-800)] border border-[var(--harvest-200)]",
    neutral:
      "bg-[var(--surface-muted)] text-[var(--earth-charcoal)] border border-[var(--earth-border)]",
    outline:
      "bg-white text-[var(--earth-charcoal)] border border-[var(--earth-border)]",
    danger:
      "bg-[#FDF2F2] text-[#A82828] border border-[#F8D7DA]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1 rounded-md font-medium",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center tracking-wide select-none transition-colors duration-150",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
