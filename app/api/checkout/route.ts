import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createCheckoutLink, isSquareConfigured } from "@/lib/square";

export async function POST(request: Request) {
  const body = await request.json();
  const { propertySlug, checkin, checkout, guests, guestName, guestContact } = body;

  if (!propertySlug || !checkin || !checkout || !guestName || !guestContact) {
    return NextResponse.json({ error: "Missing required booking fields." }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Booking backend isn't connected yet (missing Supabase credentials)." },
      { status: 503 }
    );
  }

  if (!isSquareConfigured()) {
    return NextResponse.json(
      { error: "Payment isn't connected yet (missing Square credentials)." },
      { status: 503 }
    );
  }

  const supabase = createServiceClient();
  const { data: property } = await supabase
    .from("properties")
    .select("id, name, nightly_rate, currency")
    .eq("slug", propertySlug)
    .single();

  if (!property || !property.nightly_rate) {
    return NextResponse.json(
      { error: "This property doesn't have a confirmed nightly rate yet." },
      { status: 409 }
    );
  }

  const nights =
    (new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 60 * 60 * 24);
  const totalAmount = property.nightly_rate * nights;

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      property_id: property.id,
      guest_name: guestName,
      guest_contact: guestContact,
      checkin,
      checkout,
      guests: guests ? Number(guests) : 1,
      nightly_rate: property.nightly_rate,
      total_amount: totalAmount,
      currency: property.currency,
      status: "pending",
    })
    .select()
    .single();

  if (bookingError || !booking) {
    return NextResponse.json(
      { error: bookingError?.message ?? "Could not create booking." },
      { status: 500 }
    );
  }

  const result = await createCheckoutLink({
    bookingId: booking.id,
    amount: totalAmount,
    currency: property.currency,
    description: `${property.name} — ${checkin} to ${checkout}`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/booking-confirmed`,
  });

  if (!result.configured) {
    return NextResponse.json({ error: "Square is not configured." }, { status: 503 });
  }

  await supabase
    .from("bookings")
    .update({ square_payment_id: result.orderId })
    .eq("id", booking.id);

  return NextResponse.json({ checkoutUrl: result.checkoutUrl });
}
