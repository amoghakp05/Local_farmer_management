import { NextRequest, NextResponse } from "next/server";
import { emailLoginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = emailLoginSchema.safeParse(body);

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

    const { email, password, role } = parsed.data;

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Role-tailored user profile
    const userId = `usr_${email.split("@")[0]}`;
    const userProfile = {
      id: userId,
      email,
      role,
      fullName:
        role === "admin"
          ? "System Administrator"
          : role === "farmer"
          ? "Registered Farmer"
          : "Registered Consumer",
      isVerified: true,
      preferredLocale: "en",
    };

    return NextResponse.json({
      success: true,
      message: `Signed in successfully as ${role.toUpperCase()}`,
      user: userProfile,
      token: `kb_jwt_${Buffer.from(JSON.stringify(userProfile)).toString("base64")}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to authenticate" },
      { status: 500 }
    );
  }
}
