"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  User,
  Bookmark,
  LayoutDashboard,
  Shield,
  ChevronDown,
  LogOut,
  LogIn,
  UserPlus,
  ShoppingBag,
} from "lucide-react";
import { SproutIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, role, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const navLinks = [
    { href: "/crops", label: t("nav.crops") },
    { href: "/markets", label: t("nav.markets") },
    { href: "/farmers", label: t("nav.farmers") },
    { href: "/consumer", label: "Consumer Hub" },
    { href: "/dashboard/farmer", label: "Farmer Portal" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[var(--earth-line)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)] rounded-lg"
          aria-label="KhetBazaar Homepage"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--forest-700)] text-[#FAF8F3] flex items-center justify-center shadow-xs group-hover:bg-[var(--forest-800)] group-hover:scale-105 transition-all duration-200">
            <SproutIcon size={22} className="text-[#FAF8F3]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[var(--forest-900)] leading-none">
              KhetBazaar
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[var(--harvest-700)] font-semibold mt-0.5">
              Direct Soil to Market
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)]",
                  isActive
                    ? "text-[var(--forest-900)] bg-[var(--forest-50)]"
                    : "text-[var(--earth-charcoal)] hover:text-[var(--forest-800)] hover:bg-[var(--surface-warm)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Add Farmer, Consumer, Account, Language */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Add / Register Farmer Button */}
          <Link href="/register?role=farmer">
            <Button
              size="sm"
              variant="accent"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="text-xs font-bold shadow-xs cursor-pointer"
            >
              + Add Farmer
            </Button>
          </Link>

          {/* Consumer Hub Button */}
          <Link href="/consumer">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<ShoppingBag className="w-4 h-4" />}
              className="text-xs font-semibold cursor-pointer"
            >
              Consumer
            </Button>
          </Link>

          {/* User Account / Sign In State */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-[var(--earth-border-subtle)] bg-white hover:bg-[var(--surface-warm)] transition-colors flex items-center gap-2 text-xs font-bold text-[var(--earth-ink)] cursor-pointer shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--forest-800)] text-amber-200 text-[10px] font-black flex items-center justify-center">
                  {user.avatarInitials || "KB"}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--surface-warm)] text-[var(--earth-muted)] font-mono">
                  {user.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--earth-muted)]" />
              </button>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[var(--earth-border)] shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsAccountMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-[var(--earth-line)]">
                    <span className="block font-bold text-[var(--earth-ink)] text-sm">
                      {user.name}
                    </span>
                    <span className="block text-[11px] text-[var(--earth-muted)] font-mono">
                      ID: @{user.userId}
                    </span>
                  </div>

                  <div className="py-1">
                    {user.role === "farmer" && (
                      <Link
                        href="/dashboard/farmer"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-[var(--surface-warm)] text-[var(--forest-900)] font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[var(--forest-700)]" />
                        Farmer Dashboard
                      </Link>
                    )}
                    {user.role === "consumer" && (
                      <Link
                        href="/consumer"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-[var(--surface-warm)] text-[var(--forest-900)] font-semibold"
                      >
                        <ShoppingBag className="w-4 h-4 text-[var(--harvest-600)]" />
                        Consumer Hub
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-[var(--surface-warm)] text-purple-950 font-semibold"
                      >
                        <Shield className="w-4 h-4 text-purple-700" />
                        APMC Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[var(--earth-line)]">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-rose-700 hover:bg-rose-50 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href="/login">
                <Button size="sm" variant="ghost" className="text-xs font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary" className="text-xs font-bold">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <LanguageToggle />
        </div>

        {/* Mobile Menu & Language Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-[var(--earth-ink)] hover:bg-[var(--surface-warm)] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest-700)] cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-[var(--earth-line)] bg-white px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {user ? (
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--earth-line)]">
              <div>
                <span className="block font-bold text-sm text-[var(--earth-ink)]">
                  {user.name} (@{user.userId})
                </span>
                <span className="text-[10px] uppercase font-bold text-[var(--forest-700)] bg-[var(--forest-50)] px-2 py-0.5 rounded">
                  {user.role}
                </span>
              </div>
              <Button size="sm" variant="secondary" onClick={logout} className="text-xs">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-3 mb-3 border-b border-[var(--earth-line)]">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button size="sm" variant="secondary" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button size="sm" variant="accent" className="w-full justify-center">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 text-base font-semibold rounded-xl transition-colors",
                    isActive
                      ? "bg-[var(--forest-50)] text-[var(--forest-900)]"
                      : "text-[var(--earth-ink)] hover:bg-[var(--surface-warm)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 mt-3 border-t border-[var(--earth-line)] flex flex-col gap-2">
            <Link href="/register?role=farmer" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="md" variant="accent" className="w-full justify-center" leftIcon={<PlusCircle className="w-4 h-4" />}>
                + Add / Register Farmer
              </Button>
            </Link>
            <Link href="/consumer" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="md" variant="secondary" className="w-full justify-center" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                Consumer Hub
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="md" variant="ghost" className="w-full justify-center text-xs text-purple-900" leftIcon={<Shield className="w-4 h-4" />}>
                Admin Portal (Amogh)
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
