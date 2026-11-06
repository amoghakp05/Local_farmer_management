/**
 * Feature: Auth
 */

export interface AuthSessionUser {
  id: string;
  phone: string;
  role: "farmer" | "consumer" | "trader";
  name?: string;
  preferredLocale: "en" | "kn" | "hi";
}
