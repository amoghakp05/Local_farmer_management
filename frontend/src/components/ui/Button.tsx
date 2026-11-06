"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[var(--forest-700)] text-[#FAF8F3] hover:bg-[var(--forest-800)] active:bg-[var(--forest-900)] shadow-sm focus-visible:ring-[var(--forest-700)] focus-visible:ring-offset-[#FAF8F3]",
      accent:
        "bg-[var(--harvest-600)] text-white hover:bg-[var(--harvest-700)] active:bg-[var(--harvest-800)] shadow-sm focus-visible:ring-[var(--harvest-600)] focus-visible:ring-offset-[#FAF8F3]",
      secondary:
        "bg-white text-[var(--earth-ink)] border border-[var(--earth-border)] hover:bg-[var(--surface-warm)] hover:border-[var(--earth-muted)] active:bg-[var(--surface-muted)] focus-visible:ring-[var(--forest-700)] focus-visible:ring-offset-[#FAF8F3] shadow-[0_1px_2px_rgba(27,67,50,0.04)]",
      ghost:
        "bg-transparent text-[var(--earth-ink)] hover:bg-[var(--forest-50)] hover:text-[var(--forest-800)] active:bg-[var(--forest-100)] focus-visible:ring-[var(--forest-700)]",
      danger:
        "bg-[#A82828] text-white hover:bg-[#8F1E1E] active:bg-[#731515] focus-visible:ring-[#A82828]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
      md: "h-10 px-4 text-sm gap-2 rounded-xl",
      lg: "h-12 px-6 text-base gap-2.5 rounded-xl font-semibold",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
