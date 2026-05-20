# MyPortfolio — Dynamic UX/UI Designer Portfolio

A production-ready, fully dynamic personal portfolio with an Apple-inspired premium design, soft Framer Motion animations, bilingual English/Arabic (RTL) support, and a Calendly-like booking flow. All content — projects, case studies, services, experience, bookings, theme, SEO — is managed through a custom admin dashboard. No code edits required to update the site.

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + shadcn-style primitives + **Framer Motion**
- **Prisma** + **Neon Postgres**
- **Auth.js v5** (credentials, single admin)
- **next-intl** (EN / AR, RTL)
- **UploadThing** for image uploads
- **Resend** for booking confirmation emails

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Neon Postgres database

1. Sign up at <https://neon.tech> (free tier is plenty)
2. Create a new project
3. Copy the **pooled** connection string into `DATABASE_URL` and the **direct** one into `DIRECT_URL`

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then fill in:

| Var | What it is |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Neon Postgres URLs |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_URL` | `http://localhost:3000` locally, your domain in prod |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used to seed the single admin |
| `UPLOADTHING_TOKEN` / `UPLOADTHING_SECRET` | From <https://uploadthing.com> |
| `RESEND_API_KEY` | From <https://resend.com> (optional — emails just skip if missing) |
| `RESEND_FROM` | Verified sender like `"Portfolio <noreply@yourdomain.com>"` |
| `ADMIN_NOTIFY_EMAIL` | Where new-booking notifications go |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site |

### 4. Run migrations & seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

The seed creates the admin user (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`) plus rich EN/AR placeholder content for every section.

### 5. Run it

```bash
npm run dev
```

Open <http://localhost:3000>. The site redirects to `/en`. Sign into the admin at <http://localhost:3000/en/login>.

## Project structure

```
A:\MyPortfolio\
├─ prisma/
│  ├─ schema.prisma             # all entities (singletons + collections + booking)
│  └─ seed.ts
├─ messages/{en,ar}.json        # UI strings
├─ src/
│  ├─ middleware.ts             # locale + auth gate
│  ├─ i18n/{routing,request}.ts # next-intl
│  ├─ lib/
│  │  ├─ db.ts                  # Prisma singleton
│  │  ├─ auth.ts                # Auth.js config
│  │  ├─ booking.ts             # slot computation
│  │  ├─ resend.ts              # booking emails
│  │  ├─ uploadthing.ts         # server router
│  │  ├─ uploadthing-client.ts  # client helpers
│  │  ├─ seo.ts                 # generateMetadata helper
│  │  ├─ i18n-helpers.ts        # pickField(record, locale, key)
│  │  └─ utils.ts
│  ├─ actions/admin.ts          # all admin server actions
│  ├─ components/
│  │  ├─ ui/                    # shared primitives
│  │  ├─ public/                # site components (Hero, FeaturedProjects, BookingFlow, ...)
│  │  └─ admin/                 # dashboard components
│  └─ app/
│     ├─ [locale]/              # public pages + admin under /admin
│     ├─ api/
│     │  ├─ auth/[...nextauth]
│     │  ├─ uploadthing
│     │  ├─ bookings            # POST creates booking, sends emails
│     │  └─ availability        # GET slots for a date
│     ├─ sitemap.ts             # dynamic, both locales + all published items
│     └─ robots.ts
└─ public/
```

## Content model

Every editable surface lives in Prisma:

- **Singletons** (one row, edited in place): `HeroContent`, `AboutContent`, `ContactCta`, `FooterContent`, `SiteSettings`.
- **Collections** with bilingual fields: `Skill`, `Tool`, `Project` (+ images, tools), `CaseStudy` (+ sections), `Service`, `Experience`, `Testimonial`, `SocialLink`.
- **Booking**: `MeetingType`, `AvailabilityRule` (recurring weekly), `BlockedDate` (one-off), `Booking`.

Bilingual content uses suffixed columns (`titleEn`, `titleAr`, …). The helper `pickField(record, locale, "title")` chooses the right field at render time. RTL is handled by `dir="rtl"` on the locale layout plus Tailwind logical properties (`ps-`, `pe-`, `text-start`).

### Case study sections

Each `CaseStudy` has a list of `CaseStudySection` rows. Each section has a typed kind (Overview, Problem, Research, Wireframes, Final UI, Results, etc., plus `CUSTOM`) and a free-form `blocks` JSON array of typed blocks: `metrics`, `gallery`, `image`, `beforeAfter`, `bullets`, `quote`, `cards`. Sections can be reordered and edited inline in the admin.

## Admin

Sign in at `/en/login` with the seeded credentials. The dashboard at `/en/admin` covers everything in the spec:

| Area | Path |
|---|---|
| Hero / About / Contact CTA / Footer | `/admin/hero`, `/admin/about`, `/admin/contact-cta`, `/admin/footer` |
| Skills / Tools / Social Links | `/admin/skills`, `/admin/tools`, `/admin/social-links` |
| Projects | `/admin/projects` (list, new, edit) |
| Case Studies | `/admin/case-studies` (list, new, edit + section editor) |
| Services | `/admin/services` |
| Experience / Testimonials | `/admin/experience`, `/admin/testimonials` |
| Bookings | `/admin/bookings` — change status, delete |
| Meeting Types | `/admin/meeting-types` |
| Availability | `/admin/availability` — weekly rules + blocked dates |
| SEO | `/admin/seo` |
| Settings | `/admin/settings` — site name, theme colors, default locale |

Image uploads use UploadThing dropzones. Plain URL fields are accepted as a fallback. Every form is bilingual (EN/AR tabs).

## Booking flow

1. Visitor picks a meeting type
2. Picks a date (calendar disables non-working weekdays and blocked dates)
3. Picks an available time slot (server computes from availability rules minus existing bookings)
4. Submits name, email, phone, company, message
5. Server re-verifies slot, creates booking, sends Resend emails (visitor confirmation + admin notification)
6. Admin sees it in `/admin/bookings` and can mark CONFIRMED / CANCELLED / COMPLETED.

If `RESEND_API_KEY` is empty, emails are skipped silently — the booking still records.

## Deploy to Vercel

1. Push the repo to GitHub (already linked to `AbdulRahmanWardeh/MyPortfolio`).
2. Import the repo at <https://vercel.com/new>.
3. Add the same env vars from `.env` in the Vercel project settings.
4. Vercel auto-detects Next.js. Build command: `next build` (Prisma generate runs in `postinstall`).
5. On first deploy, run migrations against your Neon DB locally with `DATABASE_URL` pointing at Neon, or use Vercel CLI.
6. Seed once: `npx prisma db seed` (with `DATABASE_URL` set to Neon).

## Useful scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run start` | Start production server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | Next lint |
| `npm run db:push` | Push schema to DB (no migration history) |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:seed` | Seed admin + placeholder content |
| `npm run db:studio` | Open Prisma Studio |

## Notes

- All public pages are server-rendered on demand (`force-dynamic`) so admin edits show up instantly without a rebuild. For higher traffic, swap to ISR by removing `dynamic = "force-dynamic"` from `src/app/[locale]/layout.tsx` and relying on `revalidatePath`, which is already called from every admin server action.
- The theme (primary + accent colors) is driven by `SiteSettings` — edit in `/admin/settings`. Hex values are converted to HSL CSS variables at render time.
- To change the admin password later, sign in, open Prisma Studio (`npm run db:studio`), find the `User` row, and replace `hashedPassword` with a fresh bcrypt hash — or re-run `npm run db:seed` after updating `ADMIN_PASSWORD`.
