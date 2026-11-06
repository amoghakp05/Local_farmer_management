"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  sizeVariant?: "sm" | "md" | "lg";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      sizeVariant = "md",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const sizeStyles = {
      sm: "h-9 pl-3 pr-8 text-xs rounded-lg",
      md: "h-11 pl-3.5 pr-10 text-sm rounded-xl",
      lg: "h-13 pl-4 pr-11 text-base rounded-xl",
    };

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--earth-charcoal)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full appearance-none bg-white text-[var(--earth-ink)]",
              "border transition-all duration-150 ease-out cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#FAF8F3]",
              error
                ? "border-[#A82828] focus:border-[#A82828] focus:ring-[#A82828]/30"
                : "border-[var(--earth-border)] hover:border-[var(--earth-muted)] focus:border-[var(--forest-700)] focus:ring-[var(--forest-700)]/20",
              disabled && "opacity-50 cursor-not-allowed bg-[var(--surface-warm)]",
              sizeStyles[sizeVariant],
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="py-1 text-[var(--earth-ink)]"
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3.5 pointer-events-none text-[var(--earth-muted)] flex items-center">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </div>
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
          <p id={helperId} className="text-xs text-[var(--earth-muted)] mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
