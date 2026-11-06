import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { indianPhoneRegex } from "@/lib/validations";

const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  contactInfo: z
    .string()
    .trim()
    .min(5, "Please provide a valid phone number or email address")
    .max(100, "Contact information is too long"),
  role: z.enum(["farmer", "consumer", "trader", "fpo_officer", "other"]).default("consumer"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject cannot exceed 120 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  honeypot: z.string().optional(), // Bot honeypot: must be empty
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Limit to 5 contact submissions per 5 minutes per IP
    const rateCheck = checkRateLimit(`contact_${ip}`, { limit: 5, windowMs: 5 * 60 * 1000 });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a few minutes before sending another inquiry.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "300",
            "X-RateLimit-Limit": rateCheck.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();

    // Honeypot check: If bot filled out invisible honeypot field, silently return success without storing
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting KhetBazaar Support. We will get back to you shortly.",
      });
    }

    const parseResult = contactFormSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid contact submission",
          details: parseResult.error.issues.map((i) => ({ field: i.path[0], message: i.message })),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Simulate ticket creation / notifications
    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Your inquiry has been routed to our APMC agricultural support desk. Ticket #${ticketId}. We typically respond within 4 daylight hours.`,
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal server error processing contact submission." },
      { status: 500 }
    );
  }
}
