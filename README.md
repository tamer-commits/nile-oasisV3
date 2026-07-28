# Nile Oasis

Booking website for Nile Oasis — fully serviced apartments in Cairo, Egypt.

Built with Next.js (App Router), TypeScript, and Tailwind CSS v4, backed by
Supabase (database + admin auth), Guesty (availability/rate sync), and
Square (payment processing).

## Status

Frontend, database schema, admin CMS, and booking API routes are built.
Still to add:

- Real photos and video of the apartment (currently using free Mixkit stock
  footage and placeholder tiles)
- Contact details (WhatsApp number, email, Instagram — currently blank)
- Supabase project credentials (see `.env.example`)
- Guesty API credentials, once your Guesty account has API access
- Square credentials for your connected account
- Nightly rate (syncs from Guesty/PriceLab once connected — currently blank)

## Architecture

- `app/page.tsx` — public homepage, server-rendered, pulls the live property
  from Supabase (falls back to placeholder content if Supabase isn't
  configured yet, so the site never breaks).
- `app/admin/*` — password-protected CMS (Supabase Auth) for managing
  properties and viewing enquiries. Scales to many properties, not just one.
- `app/api/enquiry` — public route the booking form submits to.
- `app/api/availability` — checks live availability/rate via Guesty.
- `app/api/checkout` — creates a Square payment link for a booking.
- `lib/guesty.ts` / `lib/square.ts` — the only two files that talk to those
  APIs; both no-op safely until credentials are set.
- `supabase/schema.sql` — run this once in the Supabase SQL editor to set
  up the database (properties, images, enquiries, bookings + row-level
  security).

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

## Deployment

This project is deployed via Vercel, connected to this GitHub repository.
Every push to the `main` branch automatically redeploys the live site.
Environment variables must be set in Vercel's dashboard separately —
`.env.local` is not deployed.

## Creating your first admin login

Supabase Auth doesn't have a public sign-up page wired up on purpose (this
is a private admin panel). To create your login: in the Supabase dashboard,
go to Authentication → Users → Add user, and set your email/password there.
Then sign in at `/admin/login`.
