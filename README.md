IUT CSE'24 Community Platform

Stack: Next.js (App Router) + Supabase + Bootstrap 5 + Font Awesome.

## Getting Started

First, configure environment and run the development server:

1. Create `.env.local` with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Install deps and start dev server:
   ```bash
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Auth
- Magic link sign-in at `/login`
- Callback handled at `/auth/callback` (configure in Supabase Auth settings)
- Onboarding at `/auth/register/onboarding`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

Supabase Schema
- Apply `supabase/schema.sql` in SQL Editor to create tables and RLS policies.

Deploy on Vercel
- Add env vars in Vercel project settings.
- Set redirect URL `https://<your-domain>/auth/callback` in Supabase.
