"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  sizeVariant?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      sizeVariant = "md",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-lg",
      md: "h-11 px-3.5 text-sm rounded-xl",
      lg: "h-13 px-4 text-base rounded-xl",
    };

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--earth-charcoal)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--earth-muted)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full bg-white text-[var(--earth-ink)] placeholder-[var(--earth-muted)]/70",
              "border transition-all duration-150 ease-out",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#FAF8F3]",
              error
                ? "border-[#A82828] focus:border-[#A82828] focus:ring-[#A82828]/30"
                : "border-[var(--earth-border)] hover:border-[var(--earth-muted)] focus:border-[var(--forest-700)] focus:ring-[var(--forest-700)]/20",
              disabled && "opacity-50 cursor-not-allowed bg-[var(--surface-warm)]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              sizeStyles[sizeVariant],
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[var(--earth-muted)]">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-[#A82828] flex items-center gap-1 mt-0.5"
          >
            <span aria-hidden="true">●</span>
            {error}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-[var(--earth-muted)] mt-0.5"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
