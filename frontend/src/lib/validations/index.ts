import { z } from "zod";

/**
 * Standard Indian phone number regex:
 * Accepts formats: +919845214820, 9845214820, 09845214820, 98452-14820
 */
export const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

export const phoneOtpSendSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, "Please enter a valid 10-digit Indian mobile number"),
  role: z.enum(["farmer", "consumer", "admin"]).default("consumer"),
});

export const phoneOtpVerifySchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, "Invalid phone number format"),
  token: z
    .string()
    .trim()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
  role: z.enum(["farmer", "consumer", "admin"]).default("consumer"),
});

export const emailLoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["farmer", "consumer", "admin"]).default("consumer"),
});

export const listingCreateSchema = z.object({
  cropId: z.string().uuid("Invalid crop identifier"),
  marketId: z.string().uuid("Invalid mandi identifier").optional().nullable(),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),
  description: z.string().trim().max(1000, "Description is too long").optional(),
  pricePerUnit: z.number().positive("Price must be greater than zero"),
  unit: z.enum(["kg", "quintal", "bag", "crate", "dozen"]).default("kg"),
  totalQuantity: z.number().positive("Total quantity must be greater than zero"),
  availableQuantity: z.number().nonnegative("Available quantity cannot be negative"),
  minimumOrderQuantity: z.number().positive().default(1),
  harvestDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Harvest date must be YYYY-MM-DD"),
  qualityGrade: z.enum(["Grade A+", "Grade A", "Grade B", "Standard"]).default("Grade A"),
  isOrganic: z.boolean().default(false),
});

export const inquiryCreateSchema = z.object({
  listingId: z.string().uuid("Invalid listing identifier"),
  consumerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name too long"),
  consumerPhone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, "Please enter a valid 10-digit mobile number"),
  quantityRequested: z.number().positive("Quantity must be greater than zero").optional(),
  message: z.string().trim().max(500, "Message cannot exceed 500 characters").optional(),
});

export const reviewCreateSchema = z.object({
  farmerId: z.string().uuid("Invalid farmer identifier"),
  listingId: z.string().uuid("Invalid listing identifier").optional().nullable(),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
    .max(600, "Comment cannot exceed 600 characters")
    .optional(),
});

export const alertCreateSchema = z.object({
  cropId: z.string().uuid("Invalid crop identifier"),
  marketId: z.string().uuid("Invalid mandi identifier").optional().nullable(),
  targetPrice: z.number().positive("Target price must be positive").optional(),
  alertType: z.enum(["price_drop", "new_arrival", "mandi_rate"]).default("price_drop"),
});

export type PhoneOtpSendInput = z.infer<typeof phoneOtpSendSchema>;
export type PhoneOtpVerifyInput = z.infer<typeof phoneOtpVerifySchema>;
export type EmailLoginInput = z.infer<typeof emailLoginSchema>;
export type ListingCreateInput = z.infer<typeof listingCreateSchema>;
export type InquiryCreateInput = z.infer<typeof inquiryCreateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type AlertCreateInput = z.infer<typeof alertCreateSchema>;
