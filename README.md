# MyPortfolio — Dynamic UX/UI Designer Portfolio

A production-ready personal portfolio with an Apple-inspired premium design, soft Framer Motion animations, and a Calendly-like booking flow. All content — projects, case studies, services, experience, bookings, theme, SEO — is managed through a custom admin dashboard. No code edits required to update the site.

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 18** + **TypeScript**
- **Tailwind CSS** + shadcn-style primitives + **Framer Motion**
- **Prisma** + **SQLite** (swappable to Postgres / MySQL by changing `provider` in `schema.prisma`)
- **Auth.js v5** (credentials, single admin)
- **next-intl** for i18n
- **UploadThing** for image uploads
- **Resend** for booking confirmation emails

## Quick start

```bash
npm install
cp .env.example .env
# fill in AUTH_SECRET (openssl rand -base64 32) and DATABASE_URL="file:./dev.db"
npx prisma db push
npm run db:seed
npm run dev
```

Open <http://localhost:3000>. Admin sign-in is at <http://localhost:3000/login> with the seeded `ADMIN_EMAIL` / `ADMIN_PASSWORD` (defaults in `.env.example` — change before publishing).

## Environment variables

| Var | What it is |
|---|---|
| `DATABASE_URL` | `file:./dev.db` for local SQLite, or a Postgres URL for prod |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `http://localhost:3000` locally, your domain in prod |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded into the User table on first `db:seed` |
| `UPLOADTHING_TOKEN` / `UPLOADTHING_SECRET` | From <https://uploadthing.com> (image uploads in admin) |
| `RESEND_API_KEY` | From <https://resend.com> (optional — emails skip silently if missing) |
| `RESEND_FROM` | Verified sender like `"Portfolio <noreply@yourdomain.com>"` |
| `ADMIN_NOTIFY_EMAIL` | Where new-booking notifications go |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site |

## Architecture

The locale layer splits into two route groups so the public chrome (Navbar/Footer/particles) never renders on `/admin` or `/login`:

```
src/app/[locale]/
├── layout.tsx                  # providers only (next-intl, theme CSS, Toaster)
├── (site)/                     # public route group
│   ├── layout.tsx              # Navbar + Footer + FallingParticles + ScrollToTop
│   ├── page.tsx                # home
│   ├── about/  contact/  projects/  services/  case-studies/
├── admin/                      # dashboard — own AdminShell, no public chrome
└── login/                      # bare layout — no public chrome
```

The admin shell is server-rendered with three small client islands:

| Component | Role |
|---|---|
| `AdminShell` (server) | Sidebar markup + topbar |
| `AdminNavLink` (client) | Active-state per link via `usePathname()` |
| `AdminMobileNav` (client) | Mobile drawer + Escape-to-close |
| `SignOutButton` (client) | Triggers NextAuth `signOut()` |
| `Breadcrumb` (client) | Pathname-driven breadcrumb in the topbar |

All admin nav structure lives in [`src/components/admin/admin-nav.ts`](src/components/admin/admin-nav.ts) — a single source of truth.

### Project structure

```
prisma/
├── schema.prisma               # singletons + collections + booking models
└── seed.ts
messages/{en}.json              # UI strings
src/
├── middleware.ts               # locale + admin auth gate
├── i18n/{routing,request}.ts   # next-intl
├── lib/
│  ├── db.ts                    # Prisma singleton
│  ├── auth.ts                  # Auth.js config
│  ├── booking.ts               # slot computation (parallelized + cached)
│  ├── content.ts               # cached content fetchers
│  ├── admin.ts                 # cached admin metrics (counts, recent bookings)
│  ├── resend.ts                # booking emails
│  ├── uploadthing.ts           # server router
│  ├── uploadthing-client.ts    # client helpers
│  ├── seo.ts                   # generateMetadata + getSiteSettings
│  ├── i18n-helpers.ts          # pickField(record, locale, key)
│  └── utils.ts
├── actions/admin.ts            # all admin server actions
├── components/
│  ├── ui/                      # shared primitives
│  ├── public/                  # site components (Hero, FeaturedProjects, BookingFlow, ...)
│  └── admin/                   # dashboard chrome + form helpers
└── app/[locale]/                # see Architecture section
```

## Performance

The app ships a deliberately small client bundle and aggressive server-side caching:

- `experimental.optimizePackageImports` in [`next.config.ts`](next.config.ts) tree-shakes `framer-motion`, `hugeicons-react`, `lucide-react`, and `date-fns` — these were the largest deps and shrink dramatically when only the imports actually used are bundled.
- Images: AVIF/WebP formats with a 30-day cache TTL, all sized via `next/image`.
- Data fetching: every singleton + collection getter in [`src/lib/content.ts`](src/lib/content.ts) is wrapped in `react.cache` + `unstable_cache` so a single render reuses one query and repeat renders inside the TTL skip the DB entirely.
- Booking: [`getAvailableSlots`](src/lib/booking.ts) parallelizes 4 reads via `Promise.all` (was sequential).
- Project pages: `generateStaticParams` on `/projects/[slug]` pre-renders every published slug at build time.
- Admin: [`getAdminCounts`](src/lib/admin.ts) batches 7 `prisma.count` calls into one cached helper (30 s TTL).
- Dev: `npm run dev` uses Turbopack for ~5× faster compilation; classic webpack is still available via `npm run dev:webpack`.

## Content model

Every editable surface lives in Prisma:

- **Singletons** (one row, edited in place): `HeroContent`, `AboutContent`, `ContactCta`, `FooterContent`, `SiteSettings`.
- **Collections**: `Tool`, `Project` (+ images, tools), `CaseStudy` (+ sections), `Service`, `Experience`, `Testimonial`, `SocialLink`.
- **Booking**: `MeetingType`, `AvailabilityRule` (recurring weekly), `BlockedDate` (one-off), `Booking`.

### Case study sections

Each `CaseStudy` has an ordered list of `CaseStudySection` rows. Each section has a typed kind (Overview, Problem, Research, Wireframes, Final UI, Results, etc., plus `CUSTOM`) and a free-form `blocks` JSON array of typed blocks: `metrics`, `gallery`, `image`, `beforeAfter`, `bullets`, `quote`, `cards`. Sections can be reordered and edited inline.

## Admin

Sign in at `/login`, then `/admin` covers:

| Area | Path |
|---|---|
| Hero / About / Contact CTA / Footer | `/admin/hero`, `/admin/about`, `/admin/contact-cta`, `/admin/footer` |
| Tools / Social Links | `/admin/tools`, `/admin/social-links` |
| Projects | `/admin/projects` (list, new, edit) |
| Case Studies | `/admin/case-studies` (list, new, edit + section editor) |
| Services | `/admin/services` |
| Experience / Testimonials | `/admin/experience`, `/admin/testimonials` |
| Bookings | `/admin/bookings` — change status, delete |
| Meeting Types | `/admin/meeting-types` |
| Availability | `/admin/availability` — weekly rules + blocked dates |
| SEO | `/admin/seo` |
| Settings | `/admin/settings` — site name, theme colors |

Image uploads use UploadThing dropzones. Plain URL fields are accepted as a fallback.

## Booking flow

1. Visitor picks a meeting type
2. Picks a date (calendar disables non-working weekdays and blocked dates)
3. Picks an available time slot (server computes from availability rules minus existing bookings)
4. Submits name, email, phone, company, message
5. Server re-verifies slot, creates booking, sends Resend emails (visitor confirmation + admin notification)
6. Admin sees it in `/admin/bookings` and can mark CONFIRMED / CANCELLED / COMPLETED.

If `RESEND_API_KEY` is empty, emails are skipped silently — the booking still records.

## Deploy to Vercel

1. Import the repo at <https://vercel.com/new>.
2. Add every variable from `.env.example` to the Vercel project (use a real `DATABASE_URL` — Vercel doesn't support SQLite in production; point at Neon / Supabase / Turso).
3. Vercel auto-detects Next.js. Build command: `next build` (Prisma generate runs in `postinstall`).
4. After the first deploy, point your local `DATABASE_URL` at the prod DB and run `npx prisma db push && npm run db:seed` once.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run dev:webpack` | Dev server (classic webpack — fallback) |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run start` | Start production server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | Next lint |
| `npm run db:push` | Push schema to DB (no migration history) |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:seed` | Seed admin + placeholder content |
| `npm run db:studio` | Open Prisma Studio |
