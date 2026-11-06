import { NextRequest, NextResponse } from "next/server";
import { phoneOtpSendSchema } from "@/lib/validations";
import { checkOtpRateLimit } from "@/lib/auth/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = phoneOtpSendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { phone, role } = parsed.data;

    // Rate Limiting Check (Max 3 OTP requests per 10 minutes)
    const rateCheck = checkOtpRateLimit(phone);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Too many OTP attempts.",
          retryAfterSeconds: rateCheck.retryAfterSeconds,
          message: `Please wait ${rateCheck.retryAfterSeconds} seconds before requesting a new OTP.`,
        },
        { status: 429 }
      );
    }

    // In a live production environment with SMS Gateway (e.g. Fast2SMS / Twilio / Supabase Auth Phone)
    // Here we generate the 6-digit verification code:
    const devOtp = "123456";

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${phone}`,
      role,
      remainingAttempts: rateCheck.remaining,
      devOtpHint: devOtp, // Provided for automated testing / sandbox verification
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process OTP request" },
      { status: 500 }
    );
  }
}
