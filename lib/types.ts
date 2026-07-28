export type CancellationTier = {
  days_before: number;
  refund_percent: number;
};

export type PropertyImage = {
  id: string;
  url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_placeholder: boolean;
};

export type Property = {
  id: string;
  slug: string;
  name: string;
  neighborhood: string | null;
  status: "draft" | "live";
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  nightly_rate: number | null;
  currency: string;
  min_stay_nights: number;
  check_in_time: string;
  check_out_time: string;
  description: string | null;
  amenities: string[];
  house_rules: string[];
  cancellation_policy: CancellationTier[];
  guesty_listing_id: string | null;
  images?: PropertyImage[];
};

// Used as a fallback so the site still renders before Supabase is
// configured, or if a fetch fails. Mirrors the seed row in schema.sql.
export const FALLBACK_PROPERTY: Property = {
  id: "fallback",
  slug: "corniche-suite",
  name: "The Corniche Suite",
  neighborhood: "Cairo, Egypt",
  status: "live",
  bedrooms: 3,
  bathrooms: 2,
  max_guests: 6,
  nightly_rate: null,
  currency: "USD",
  min_stay_nights: 3,
  check_in_time: "14:00",
  check_out_time: "10:00",
  description:
    "Three bedrooms, two bathrooms, and a river-facing terrace — finished to a standard guests notice immediately. Considered furnishings, proper linens, and a kitchen fit for more than coffee.",
  amenities: [
    "3 bedrooms, 2 bathrooms",
    "River-facing balcony",
    "Full kitchen",
    "High-speed Wi-Fi + backup",
    "Smart lock entry",
    "Daily housekeeping available",
    "Dedicated WhatsApp concierge",
    "Airport transfer on request",
  ],
  house_rules: [
    "Check-in: 2:00 PM – 10:00 PM (self check-in via lockbox/keypad; message ahead for late arrivals)",
    "Check-out: by 10:00 AM",
    "Maximum occupancy: 6 guests",
    "No smoking inside the apartment",
    "No parties or events",
    "Pets not allowed",
    "Quiet hours: 10:00 PM – 8:00 AM",
    "Please treat the apartment as you would your own home — additional cleaning fees apply for excessive mess",
    "Report any damages or issues immediately via the contact number provided",
    "Valid photo ID required at check-in for all registered guests",
    "No unregistered guests or visitors without prior approval",
  ],
  cancellation_policy: [
    { days_before: 60, refund_percent: 100 },
    { days_before: 40, refund_percent: 75 },
    { days_before: 30, refund_percent: 50 },
    { days_before: 14, refund_percent: 25 },
    { days_before: 0, refund_percent: 0 },
  ],
  guesty_listing_id: null,
  images: [
    { id: "1", url: null, alt_text: "Apartment photo placeholder", sort_order: 1, is_placeholder: true },
    { id: "2", url: null, alt_text: "Apartment photo placeholder", sort_order: 2, is_placeholder: true },
    { id: "3", url: null, alt_text: "Apartment photo placeholder", sort_order: 3, is_placeholder: true },
  ],
};
