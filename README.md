# Jungle Hill Resort, Coorg

Website for Jungle Hill Resort, a nature resort in Coorg, Karnataka, India.

**Status:** design tokens, layout and the home page are built. Inner pages are still placeholders.

Photos: add files under `public/images`, run `npm run images`, then reference them from `src/data/*` with `photo()` / `photos()` (missing files are skipped, not errors).

## Tech stack

- Next.js (App Router, Turbopack), React, TypeScript (strict)
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`)
- motion, GSAP + ScrollTrigger, Lenis
- clsx, tailwind-merge, class-variance-authority, lucide-react
- react-hook-form, zod, @hookform/resolvers
- ESLint, Prettier (with prettier-plugin-tailwindcss)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

| Script              | Purpose                                                                          |
| ------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                                                           |
| `npm run build`     | Production build                                                                 |
| `npm run start`     | Serve the production build                                                       |
| `npm run lint`      | ESLint                                                                           |
| `npm run format`    | Prettier                                                                         |
| `npm run typecheck` | TypeScript check                                                                 |
| `npm run images`    | Rebuild the image manifest (sizes + blur) after adding photos in `public/images` |

## Setup after cloning

The site works without any services (it falls back to its built-in content), but enquiries, the admin
panel and photo/price editing need Supabase. Never commit real keys: `.env.local` is git-ignored, and
`.env.example` documents every variable.

1. **Get the keys.** Ask the project owner for the Supabase URL, publishable key and secret key (and the
   Upstash token if Redis is used). Share them through a password manager or similar, never in a PR,
   issue or chat. Put them in `.env.local`.
2. **Database (new Supabase project only).** In the Supabase SQL editor run, in order,
   `supabase/migrations/0001_enquiries.sql` and `supabase/migrations/0002_media_and_content.sql`. They
   create the `enquiries`, `media` and `site_content` tables and the public `media` storage bucket, with
   row level security on. The live project already has them applied, so skip this step when sharing it.
3. **Assets (new Supabase project only).** `node scripts/import-assets-to-supabase.cjs` uploads everything
   in `public/images` and `public/videos` to the bucket and registers it in the media library. It is safe
   to re-run.
4. **Admin user.** In Supabase, Authentication, Users, add a user (email and password, auto confirm), then
   list the same email in `ADMIN_EMAILS`. Sign in at `/admin/login`.
5. **Check it works.** `npm run dev`, send a test enquiry from `/contact`, and see it appear in
   `/admin/enquiries` (delete it afterwards).
6. **Keep-alive (free tiers).** Generate a `KEEPALIVE_SECRET`, set it in the host's environment, and add
   two GitHub repository secrets: `KEEPALIVE_SECRET` (same value) and `SITE_URL` (the live domain, no
   trailing slash). `.github/workflows/keepalive.yml` then pings `/api/keepalive` every 3 days so the
   free Supabase and Upstash projects do not pause.
7. **Deploy.** Add every variable from `.env.example` to the host's environment settings. Check the host's
   terms: Vercel's free Hobby plan is for non-commercial use only.

How it fits together: `/admin` is protected by a proxy plus server-side checks; public pages are static and
refresh hourly, and saving in the admin clears the Redis cache and refreshes them straight away. Changes
made directly in the Supabase dashboard are not seen until the cache expires (up to an hour).

## Structure

```
src/
  app/          Routes, layout, metadata, sitemap, robots, API routes
  components/
    layout/     Header, Footer, MobileMenu, Container
    sections/   Home page sections
    ui/         Primitives (Button, Input, Modal, ...)
    forms/      Contact, Enquiry, Booking forms
    animations/ SmoothScroll (Lenis), Reveal, Parallax, Marquee, PageTransition
    shared/     Logo, SectionHeader, WhatsAppButton, JsonLd, PagePlaceholder
  lib/          cn helper, constants, motion variants, GSAP setup, zod schemas, metadata builder
  hooks/        useMediaQuery, useScrollPosition, useReducedMotion
  data/         Typed content (rooms, experiences, dining, gallery, testimonials, faqs, navigation)
  types/        Shared types
  config/       site.config.ts (name, contact, socials)
public/         images, videos, icons, fonts
```

## Conventions

- Server Components by default; `"use client"` only for animation, forms and menus.
- Animation helpers respect `prefers-reduced-motion`.
- Every page uses `buildMetadata`; titles follow `%s | Jungle Hill Resort, Coorg`.
- Content lives in `src/data` and `src/config`, not inside components.
