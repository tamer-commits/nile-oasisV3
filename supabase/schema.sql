-- Nile Oasis — Supabase schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "uuid-ossp";

-- ============================================================
-- PROPERTIES
-- One row per apartment. Built to scale to ~20 listings.
-- ============================================================
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,                 -- url-safe id, e.g. 'corniche-suite'
  name text not null,                        -- e.g. 'The Corniche Suite'
  neighborhood text,                         -- e.g. 'Maadi, Cairo'
  status text not null default 'draft' check (status in ('draft', 'live')),

  bedrooms int not null default 1,
  bathrooms int not null default 1,
  max_guests int not null default 2,

  -- Pricing is intended to sync from Guesty (fed by PriceLab). nightly_rate
  -- is a cache/fallback only — treat guesty_listing_id as the source of truth.
  nightly_rate numeric(10,2),                -- nullable until synced/set
  currency text not null default 'USD',
  min_stay_nights int not null default 3,

  check_in_time time not null default '14:00',
  check_out_time time not null default '10:00',

  description text,
  amenities jsonb not null default '[]',      -- string array
  house_rules jsonb not null default '[]',    -- string array

  -- Cancellation policy as an ordered list of tiers, e.g.:
  -- [{"days_before": 60, "refund_percent": 100}, {"days_before": 40, "refund_percent": 75}, ...]
  cancellation_policy jsonb not null default '[]',

  guesty_listing_id text,                     -- Guesty's internal listing id, once synced

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- PROPERTY IMAGES
-- Placeholder-friendly: rows can exist with a null/placeholder url
-- until real photos are uploaded.
-- ============================================================
create table if not exists property_images (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  url text,                                   -- null = show placeholder tile
  alt_text text,
  sort_order int not null default 0,
  is_placeholder boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ENQUIRIES
-- Submitted from the public "Send enquiry" form on the site.
-- ============================================================
create table if not exists enquiries (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  name text not null,
  contact text not null,                      -- whatsapp number or email
  checkin date,
  checkout date,
  guests int,
  services_requested jsonb default '[]',
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'declined', 'expired')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS
-- Created once an enquiry converts to a paid, confirmed stay.
-- ============================================================
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id),
  enquiry_id uuid references enquiries(id),
  guest_name text not null,
  guest_contact text not null,
  checkin date not null,
  checkout date not null,
  guests int not null,
  nightly_rate numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  currency text not null default 'USD',

  square_payment_id text,                     -- Square payment/order reference
  guesty_reservation_id text,                  -- Guesty reservation reference

  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- Public (anon) role: can read live properties + their images, and
-- can insert enquiries. Everything else requires the service role key
-- (used only from server-side API routes, never the browser).
-- ============================================================
alter table properties enable row level security;
alter table property_images enable row level security;
alter table enquiries enable row level security;
alter table bookings enable row level security;

create policy "public can read live properties"
  on properties for select
  using (status = 'live');

create policy "public can read images of live properties"
  on property_images for select
  using (
    exists (
      select 1 from properties
      where properties.id = property_images.property_id
      and properties.status = 'live'
    )
  );

create policy "public can submit enquiries"
  on enquiries for insert
  with check (true);

-- No public select/update/delete policies on enquiries or bookings —
-- those are only accessible via the service role key from admin API routes.

-- ============================================================
-- Seed: the first property (Corniche Suite), matching what's already
-- on the site. Update nightly_rate once Guesty/PriceLab sync is live.
-- ============================================================
insert into properties (
  slug, name, neighborhood, status,
  bedrooms, bathrooms, max_guests,
  nightly_rate, min_stay_nights, check_in_time, check_out_time,
  description, amenities, house_rules, cancellation_policy
) values (
  'corniche-suite',
  'The Corniche Suite',
  'Cairo, Egypt',
  'live',
  3, 2, 6,
  null, 3, '14:00', '10:00',
  'Three bedrooms, two bathrooms, and a river-facing terrace — finished to a standard guests notice immediately. Considered furnishings, proper linens, and a kitchen fit for more than coffee.',
  '["3 bedrooms, 2 bathrooms", "River-facing balcony", "Full kitchen", "High-speed Wi-Fi + backup", "Smart lock entry", "Daily housekeeping available", "Dedicated WhatsApp concierge", "Airport transfer on request"]',
  '["Check-in: 2:00 PM – 10:00 PM (self check-in via lockbox/keypad; message ahead for late arrivals)", "Check-out: by 10:00 AM", "Maximum occupancy: 6 guests", "No smoking inside the apartment", "No parties or events", "Pets not allowed", "Quiet hours: 10:00 PM – 8:00 AM", "Please treat the apartment as you would your own home — additional cleaning fees apply for excessive mess", "Report any damages or issues immediately via the contact number provided", "Valid photo ID required at check-in for all registered guests", "No unregistered guests or visitors without prior approval"]',
  '[{"days_before": 60, "refund_percent": 100}, {"days_before": 40, "refund_percent": 75}, {"days_before": 30, "refund_percent": 50}, {"days_before": 14, "refund_percent": 25}, {"days_before": 0, "refund_percent": 0}]'
)
on conflict (slug) do nothing;

-- Placeholder image tiles for the seeded property (3 tiles, no real photos yet)
insert into property_images (property_id, url, alt_text, sort_order, is_placeholder)
select id, null, 'Apartment photo placeholder', gs, true
from properties, generate_series(1, 3) as gs
where slug = 'corniche-suite'
on conflict do nothing;
