"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { createFarmer } from "@/lib/data/farmers-repository";

export type UserRole = "farmer" | "consumer" | "admin" | null;

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  district?: string;
  village?: string;
  acres?: number;
  isOrganic?: boolean;
  primaryCrops?: string[];
  avatarInitials: string;
  password?: string;
}

export interface RegisterUserInput {
  userId: string;
  password: string;
  name: string;
  phone: string;
  email?: string;
  role: "farmer" | "consumer";
  district?: string;
  village?: string;
  acres?: number;
  isOrganic?: boolean;
  primaryCrops?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  registerUser: (input: RegisterUserInput) => { success: boolean; error?: string; user?: UserProfile };
  loginWithCredentials: (userId: string, password: string) => { success: boolean; error?: string; user?: UserProfile; role?: UserRole };
  adminLogin: (userId: string, password: string) => { success: boolean; error?: string };
  loginUser: (userProfile: UserProfile) => void;
  signUpUser: (input: { name: string; phone: string; email?: string; role?: UserRole; district?: string; village?: string }) => UserProfile;
  logout: () => void;
  switchRole: (role: NonNullable<UserRole>) => void;
  loginAs: (role: NonNullable<UserRole>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "khetbazaar_auth_user";
const REGISTERED_USERS_KEY = "khetbazaar_registered_users";

export function getRegisteredUsers(): UserProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: UserProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function clearRegisteredUsers(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(REGISTERED_USERS_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setIsInitialized(true);
  }, []);

  const loginUser = (userProfile: UserProfile) => {
    setUser(userProfile);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
    } catch {}
    toast({
      title: "Signed In",
      description: `Welcome back, ${userProfile.name}! (${userProfile.role?.toUpperCase()})`,
      type: "success",
    });
  };

  /**
   * Register a new Farmer or Consumer with User ID & Password
   */
  const registerUser = (input: RegisterUserInput): { success: boolean; error?: string; user?: UserProfile } => {
    const cleanUserId = input.userId.trim();
    const cleanPassword = input.password.trim();
    const cleanName = input.name.trim();
    const cleanPhone = input.phone.trim();

    if (!cleanUserId || cleanUserId.length < 3) {
      return { success: false, error: "User ID must be at least 3 characters long." };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }
    if (!cleanName) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
      return { success: false, error: "Please enter a valid 10-digit mobile number." };
    }

    // Reserved administrator ID
    if (cleanUserId.toLowerCase() === "amogh") {
      return {
        success: false,
        error: "User ID 'Amogh' is reserved for Administrator. Please choose a different User ID.",
      };
    }

    const registered = getRegisteredUsers();
    const exists = registered.some((u) => u.userId.toLowerCase() === cleanUserId.toLowerCase());
    if (exists) {
      return { success: false, error: `User ID "${cleanUserId}" is already registered. Please choose another or sign in.` };
    }

    const initials = cleanName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "KB";

    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: cleanUserId,
      name: cleanName,
      phone: cleanPhone,
      email: input.email?.trim() || `${cleanPhone.replace(/\D/g, "")}@khetbazaar.org`,
      role: input.role,
      district: input.district?.trim() || "Kolar",
      village: input.village?.trim() || (input.district?.trim() || "Kolar"),
      acres: input.acres || 2,
      isOrganic: Boolean(input.isOrganic),
      primaryCrops: input.primaryCrops || [],
      avatarInitials: initials,
      password: cleanPassword,
    };

    // If farmer, also register in the farmers repository so they appear in Karnataka Farmers Directory
    if (input.role === "farmer") {
      createFarmer({
        name: cleanName,
        phone: cleanPhone,
        village: newUser.village || "Agricultural Zone",
        taluk: newUser.village,
        district: newUser.district || "Kolar",
        acres: newUser.acres,
        isOrganic: newUser.isOrganic,
        primaryCrops: newUser.primaryCrops,
      });
    }

    const updated = [...registered, newUser];
    saveRegisteredUsers(updated);

    // Save active session (without exposing plain password if needed, or keeping it for state)
    const sessionUser = { ...newUser };
    setUser(sessionUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch {}

    toast({
      title: input.role === "farmer" ? "Farmer Registered Successfully!" : "Consumer Registered Successfully!",
      description: `Welcome to KhetBazaar, ${cleanName}! Your User ID is: ${cleanUserId}`,
      type: "success",
    });

    return { success: true, user: sessionUser };
  };

  /**
   * Universal Login with User ID & Password
   */
  const loginWithCredentials = (
    userId: string,
    password: string
  ): { success: boolean; error?: string; user?: UserProfile; role?: UserRole } => {
    const cleanId = userId.trim();
    const cleanPw = password.trim();

    if (!cleanId || !cleanPw) {
      return { success: false, error: "Please enter both User ID and Password." };
    }

    // 1. Check Administrator Credentials: Amogh / 1328
    if (cleanId.toLowerCase() === "amogh") {
      if (cleanPw === "1328") {
        const adminUser: UserProfile = {
          id: "usr-admin-amogh",
          userId: "Amogh",
          name: "Amogh",
          phone: "+91 98800 01328",
          role: "admin",
          district: "Bengaluru (HQ)",
          avatarInitials: "AM",
        };
        setUser(adminUser);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
        } catch {}
        toast({
          title: "Admin Access Granted",
          description: "Welcome Amogh. Full APMC administrative control unlocked.",
          type: "success",
        });
        return { success: true, user: adminUser, role: "admin" };
      } else {
        return { success: false, error: "Incorrect password for Administrator Amogh." };
      }
    }

    // 2. Check Registered Users
    const registered = getRegisteredUsers();
    const matched = registered.find(
      (u) => u.userId.toLowerCase() === cleanId.toLowerCase() && u.password === cleanPw
    );

    if (matched) {
      setUser(matched);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
      } catch {}
      toast({
        title: "Signed In",
        description: `Welcome back, ${matched.name} (${matched.role?.toUpperCase()})!`,
        type: "success",
      });
      return { success: true, user: matched, role: matched.role };
    }

    return {
      success: false,
      error: "Invalid User ID or Password. Please check your credentials or create a new account.",
    };
  };

  /**
   * Dedicated Admin Login (Strict gate: Amogh / 1328)
   */
  const adminLogin = (userId: string, password: string): { success: boolean; error?: string } => {
    const res = loginWithCredentials(userId, password);
    if (res.success && res.role === "admin") {
      return { success: true };
    }
    return {
      success: false,
      error: res.error || "Access Denied: Only Administrator 'Amogh' with correct password can enter.",
    };
  };

  const signUpUser = (input: {
    name: string;
    phone: string;
    email?: string;
    role?: UserRole;
    district?: string;
    village?: string;
  }): UserProfile => {
    const cleanPhone = input.phone.trim();
    const defaultUserId = `user_${cleanPhone.replace(/\D/g, "").slice(-4) || Date.now().toString().slice(-4)}`;
    const regResult = registerUser({
      userId: defaultUserId,
      password: "password123",
      name: input.name,
      phone: cleanPhone,
      email: input.email,
      role: (input.role as "farmer" | "consumer") || "farmer",
      district: input.district,
      village: input.village,
    });
    return regResult.user || {
      id: `usr-${Date.now()}`,
      userId: defaultUserId,
      name: input.name,
      phone: cleanPhone,
      role: input.role || "farmer",
      avatarInitials: "KB",
    };
  };

  const switchRole = (targetRole: NonNullable<UserRole>) => {
    if (targetRole === "admin") {
      // Admin role requires explicit Amogh / 1328 authentication
      if (user?.userId === "Amogh" && user?.role === "admin") {
        return;
      }
      toast({
        title: "Admin Authentication Required",
        description: "Please sign in with User ID 'Amogh' and your admin password.",
        type: "warning",
      });
      return;
    }

    if (!user) {
      const guestUser: UserProfile = {
        id: `guest-${Date.now()}`,
        userId: `guest_${targetRole}`,
        name: `Guest ${targetRole.toUpperCase()}`,
        phone: "+91 90000 00000",
        role: targetRole,
        avatarInitials: targetRole[0].toUpperCase(),
      };
      setUser(guestUser);
      return;
    }

    const updatedUser: UserProfile = { ...user, role: targetRole };
    setUser(updatedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {}
    toast({
      title: `Active View: ${targetRole.toUpperCase()}`,
      description: `Viewing portal as ${targetRole}.`,
      type: "info",
    });
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    toast({
      title: "Signed Out",
      description: "You have securely signed out of KhetBazaar.",
      type: "info",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        registerUser,
        loginWithCredentials,
        adminLogin,
        loginUser,
        signUpUser,
        logout,
        switchRole,
        loginAs: switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
