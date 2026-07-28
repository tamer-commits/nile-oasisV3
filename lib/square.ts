// Square Checkout integration (Payment Links API).
//
// Requires these env vars from your Square account:
//   SQUARE_ACCESS_TOKEN   (from Square Developer Dashboard — use a
//                          Production access token when you go live,
//                          Sandbox token for testing)
//   SQUARE_LOCATION_ID    (the location the payment should post to)
//   SQUARE_ENV            "sandbox" or "production" (defaults to sandbox)
//
// Docs: https://developer.squareup.com/docs/checkout-api

function apiBase() {
  return process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export function isSquareConfigured() {
  return Boolean(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);
}

export type CheckoutLinkResult =
  | { configured: false }
  | { configured: true; checkoutUrl: string; orderId: string };

// Creates a Square-hosted payment link for a booking total.
export async function createCheckoutLink(params: {
  bookingId: string;
  amount: number; // in the property's currency's smallest unit handling is done below
  currency: string;
  description: string;
  redirectUrl: string;
}): Promise<CheckoutLinkResult> {
  if (!isSquareConfigured()) {
    return { configured: false };
  }

  // Square expects amounts in the smallest currency unit (e.g. cents for USD).
  const amountInSmallestUnit = Math.round(params.amount * 100);

  const res = await fetch(`${apiBase()}/v2/online-checkout/payment-links`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Square-Version": "2025-01-23",
    },
    body: JSON.stringify({
      idempotency_key: params.bookingId,
      quick_pay: {
        name: params.description,
        price_money: {
          amount: amountInSmallestUnit,
          currency: params.currency,
        },
        location_id: process.env.SQUARE_LOCATION_ID,
      },
      checkout_options: {
        redirect_url: params.redirectUrl,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Square checkout link creation failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return {
    configured: true,
    checkoutUrl: data.payment_link.url,
    orderId: data.payment_link.order_id,
  };
}
