import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cropId = searchParams.get("cropId");
    const marketId = searchParams.get("marketId");

    // Zero dummy data: Returns empty array when no recorded mandi arrivals or price records exist
    // Real price records are collected from daily mandi logs or verified trade submissions
    const records: Array<{
      cropId: string;
      marketId: string;
      recordedDate: string;
      modalPrice: number;
      minPrice: number;
      maxPrice: number;
      arrivalsQuintals: number;
    }> = [];

    return NextResponse.json({
      success: true,
      cropId: cropId || null,
      marketId: marketId || null,
      days: records.length,
      history: records,
      message: "No historical mandi price records recorded yet.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch price history" },
      { status: 500 }
    );
  }
}
