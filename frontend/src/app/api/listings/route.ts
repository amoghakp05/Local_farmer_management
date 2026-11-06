import { NextRequest, NextResponse } from "next/server";
import { listingCreateSchema } from "@/lib/validations";
import { getListings, createListing } from "@/lib/data/listings-repository";
import { getAllFarmers, getFarmerById, findFarmerByPhone } from "@/lib/data/farmers-repository";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get("crop") || undefined;
    const district = searchParams.get("district") || undefined;
    const organicParam = searchParams.get("isOrganic");
    const isOrganic = organicParam !== null ? organicParam === "true" : undefined;
    const qualityGrade = searchParams.get("grade") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

    const items = getListings({
      crop,
      district,
      isOrganic,
      qualityGrade,
      minPrice,
      maxPrice,
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      listings: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit listing creation: 10 per 5 minutes per IP
    const rateCheck = checkRateLimit(`listing_create_${ip}`, { limit: 10, windowMs: 5 * 60 * 1000 });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded for creating harvest lots. Please wait a few minutes.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = listingCreateSchema.safeParse(body);

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

    // Resolve farmer identity: Must belong to a registered farmer
    const allFarmers = getAllFarmers();
    const requestedFarmerId = body.farmerId;
    const requestedPhone = body.farmerPhone;

    let farmer = requestedFarmerId
      ? getFarmerById(requestedFarmerId)
      : requestedPhone
      ? findFarmerByPhone(requestedPhone)
      : allFarmers[0];

    if (!farmer) {
      return NextResponse.json(
        {
          success: false,
          error: "No registered farmer found. Please register or add a farmer first before listing produce.",
        },
        { status: 400 }
      );
    }

    // Insert new listing linked to authentic farmer
    const created = createListing({
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmVillage: farmer.village,
      district: farmer.district,
      cropId: data.cropId,
      cropName: data.title,
      cropNameKn: farmer.nameKn || data.title,
      marketId: data.marketId || "m1000000-0000-0000-0000-000000000001",
      marketName: `${farmer.district} APMC Market Yard`,
      title: data.title,
      description: data.description || "Direct from verified farm.",
      pricePerUnit: data.pricePerUnit,
      unit: data.unit,
      totalQuantity: data.totalQuantity,
      availableQuantity: data.availableQuantity,
      harvestDate: data.harvestDate,
      qualityGrade: data.qualityGrade,
      isOrganic: data.isOrganic,
      status: "active",
      farmerPhone: farmer.phone,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Produce listed successfully",
        listing: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create listing" },
      { status: 500 }
    );
  }
}
