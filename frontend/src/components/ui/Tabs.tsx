"use client";

import React, { createContext, useContext } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
  tabGroupId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const tabGroupId = React.useId();

  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange, tabGroupId }}>
      <div className={cn("w-full flex flex-col gap-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "inline-flex items-center p-1.5 bg-[var(--surface-warm)] border border-[var(--earth-border-subtle)] rounded-xl gap-1 w-full sm:w-auto overflow-x-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabTrigger({
  value,
  children,
  className,
  disabled = false,
}: TabTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabTrigger must be used within Tabs");

  const isSelected = context.activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "relative flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-150 select-none cursor-pointer whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)] focus-visible:ring-offset-1",
        isSelected
          ? "text-[var(--forest-900)]"
          : "text-[var(--earth-muted)] hover:text-[var(--earth-ink)]",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {isSelected && (
        <motion.div
          layoutId={`active-tab-${context.tabGroupId}`}
          className="absolute inset-0 bg-white rounded-lg shadow-sm border border-[var(--earth-border-subtle)]"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 32,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabContent({ value, children, className }: TabContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("w-full focus:outline-none", className)}
    >
      {children}
    </motion.div>
  );
}
