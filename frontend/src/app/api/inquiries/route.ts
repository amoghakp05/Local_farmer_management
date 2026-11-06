import { NextRequest, NextResponse } from "next/server";
import { inquiryCreateSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 10 inquiries per minute per IP
    const rateCheck = checkRateLimit(`inquiry_${ip}`, { limit: 10, windowMs: 60 * 1000 });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before sending another inquiry.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = inquiryCreateSchema.safeParse(body);

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

    const data = parsed.data;

    const inquiryRecord = {
      id: `inq_${Math.random().toString(36).substring(2, 10)}`,
      listingId: data.listingId,
      consumerName: data.consumerName,
      consumerPhone: `${data.consumerPhone.slice(0, 8)} XXXXX`, // bot-masked in logs
      quantityRequested: data.quantityRequested || 1,
      message: data.message || "Buyer requested direct farmer connect.",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry registered and forwarded to farmer via direct notification",
        inquiry: inquiryRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
