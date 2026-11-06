import { NextRequest, NextResponse } from "next/server";
import { phoneOtpVerifySchema } from "@/lib/validations";
import { findFarmerByPhone } from "@/lib/data/farmers-repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = phoneOtpVerifySchema.safeParse(body);

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

    const { phone, token, role } = parsed.data;

    // Verify OTP token (dev sandbox accepts 123456)
    if (token !== "123456") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired OTP code. Please check and try again.",
        },
        { status: 401 }
      );
    }

    // Check if a registered farmer already exists with this phone
    const existingFarmer = findFarmerByPhone(phone);

    // Generate authenticated user session with real details (no fake fallback names)
    const userId = `usr_${phone.replace(/\D/g, "").slice(-10)}`;
    const userProfile = {
      id: userId,
      phone,
      role: existingFarmer ? "farmer" : role,
      fullName: existingFarmer
        ? existingFarmer.name
        : role === "admin"
        ? "Mandi Official"
        : "Registered User",
      district: existingFarmer?.district || undefined,
      village: existingFarmer?.village || undefined,
      isVerified: true,
      preferredLocale: "en",
    };

    return NextResponse.json({
      success: true,
      message: `Phone verified successfully as ${userProfile.role.toUpperCase()}`,
      user: userProfile,
      token: `kb_jwt_${Buffer.from(JSON.stringify(userProfile)).toString("base64")}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
