"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warm" | "outlined" | "interactive";
  enableSpotlight?: boolean;
}

export function Card({
  className,
  variant = "default",
  enableSpotlight = false,
  children,
  onMouseMove,
  ...props
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (enableSpotlight && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = () => {
    if (enableSpotlight) {
      setMousePos(null);
    }
  };

  const variantStyles = {
    default:
      "bg-white border border-[var(--earth-border-subtle)] shadow-[0_2px_8px_rgba(27,67,50,0.04)]",
    warm: "bg-[var(--surface-warm)] border border-[var(--earth-border)] shadow-[0_2px_6px_rgba(27,67,50,0.03)]",
    outlined:
      "bg-white border-2 border-[var(--earth-border)] shadow-none",
    interactive:
      "bg-white border border-[var(--earth-border)] hover:border-[var(--forest-600)] shadow-[0_2px_8px_rgba(27,67,50,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(27,67,50,0.09)] transition-all duration-200 cursor-pointer active:scale-[0.99]",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl overflow-hidden p-6 transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {enableSpotlight && mousePos && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200, 90, 23, 0.08), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 pb-4 border-b border-[var(--earth-line)]", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--earth-ink)]",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-[var(--earth-muted)] leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4 mt-4 border-t border-[var(--earth-line)]",
        className
      )}
      {...props}
    />
  );
}
