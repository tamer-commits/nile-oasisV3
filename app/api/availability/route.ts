import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkAvailability } from "@/lib/guesty";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("property");
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");

  if (!slug || !checkin || !checkout) {
    return NextResponse.json(
      { error: "property, checkin, and checkout are required." },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ configured: false });
  }

  const supabase = createServiceClient();
  const { data: property } = await supabase
    .from("properties")
    .select("guesty_listing_id, min_stay_nights")
    .eq("slug", slug)
    .single();

  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  const nights =
    (new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 60 * 60 * 24);
  if (nights < property.min_stay_nights) {
    return NextResponse.json({
      configured: true,
      available: false,
      reason: `Minimum stay is ${property.min_stay_nights} nights.`,
    });
  }

  const result = await checkAvailability(property.guesty_listing_id, checkin, checkout);
  return NextResponse.json(result);
}
