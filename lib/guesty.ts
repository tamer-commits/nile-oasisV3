// Guesty Open API integration.
//
// Requires these env vars once your Guesty account + API access are set up:
//   GUESTY_CLIENT_ID
//   GUESTY_CLIENT_SECRET
//
// Guesty uses OAuth2 client-credentials. Docs: https://open-api-docs.guesty.com
// Rates are expected to be managed in Guesty (fed by PriceLab), so this file
// is the single place that talks to Guesty — swap the TODOs below once you
// have credentials and the correct listing id in Supabase (`guesty_listing_id`).

const GUESTY_TOKEN_URL = "https://open-api.guesty.com/oauth2/token";
const GUESTY_API_BASE = "https://open-api.guesty.com/v1";

let cachedToken: { token: string; expiresAt: number } | null = null;

function isConfigured() {
  return Boolean(process.env.GUESTY_CLIENT_ID && process.env.GUESTY_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch(GUESTY_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "open-api",
      client_id: process.env.GUESTY_CLIENT_ID!,
      client_secret: process.env.GUESTY_CLIENT_SECRET!,
    }),
  });

  if (!res.ok) {
    throw new Error(`Guesty auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    // refresh a minute early
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

export type AvailabilityResult =
  | { configured: false }
  | { configured: true; available: boolean; nightlyRate?: number };

// Checks live availability + rate for a listing over a date range.
export async function checkAvailability(
  guestyListingId: string | null | undefined,
  checkin: string,
  checkout: string
): Promise<AvailabilityResult> {
  if (!isConfigured() || !guestyListingId) {
    return { configured: false };
  }

  const token = await getAccessToken();
  const res = await fetch(
    `${GUESTY_API_BASE}/availability-pricing/api/calendar/listings/${guestyListingId}?startDate=${checkin}&endDate=${checkout}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    throw new Error(`Guesty availability check failed: ${res.status}`);
  }

  const data = await res.json();
  const days: Array<{ status: string; price?: number }> = data.data?.days ?? [];
  const available = days.length > 0 && days.every((d) => d.status === "available");
  const nightlyRate = days[0]?.price;

  return { configured: true, available, nightlyRate };
}

// Creates a reservation in Guesty once a booking is paid.
export async function createReservation(params: {
  guestyListingId: string;
  checkin: string;
  checkout: string;
  guestName: string;
  guestContact: string;
  guests: number;
}): Promise<{ configured: boolean; reservationId?: string }> {
  if (!isConfigured()) {
    return { configured: false };
  }

  const token = await getAccessToken();
  const res = await fetch(`${GUESTY_API_BASE}/reservations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listingId: params.guestyListingId,
      checkInDateLocalized: params.checkin,
      checkOutDateLocalized: params.checkout,
      guestsCount: params.guests,
      guest: { fullName: params.guestName, phone: params.guestContact },
    }),
  });

  if (!res.ok) {
    throw new Error(`Guesty reservation creation failed: ${res.status}`);
  }

  const data = await res.json();
  return { configured: true, reservationId: data._id };
}
