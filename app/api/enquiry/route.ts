import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { propertySlug, name, contact, checkin, checkout, guests, services, message } = body;

  if (!name || !contact) {
    return NextResponse.json(
      { error: "Name and a contact method are required." },
      { status: 400 }
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    // Supabase isn't configured yet — don't fail the page, just say so clearly.
    return NextResponse.json(
      {
        error:
          "Booking backend isn't connected yet (missing Supabase credentials). This enquiry was not saved.",
      },
      { status: 503 }
    );
  }

  const supabase = createServiceClient();

  let propertyId: string | null = null;
  if (propertySlug) {
    const { data: property } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", propertySlug)
      .single();
    propertyId = property?.id ?? null;
  }

  const { error } = await supabase.from("enquiries").insert({
    property_id: propertyId,
    name,
    contact,
    checkin: checkin || null,
    checkout: checkout || null,
    guests: guests ? Number(guests) : null,
    services_requested: services ? [services] : [],
    message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
