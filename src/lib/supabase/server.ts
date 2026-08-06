import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Server-side Supabase client for API routes and the partner dashboard's
// server components. Partner routes additionally require an authenticated
// institutional session (see app/partner/layout.tsx).
//
// Async because Next.js 15 made `cookies()` itself return a Promise —
// callers must `await createClient()`.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// Service-role client for trusted server code only. Never import this from
// a client component.
//
// Guest users (the vast majority of traffic) never hold a Supabase Auth
// session — Stage 1 of onboarding is explicitly zero-login — so the
// cookie-based `createClient()` above has no JWT to satisfy the
// device_id-based RLS policies in supabase/migrations/0001_init.sql. Routes
// that write on a guest's behalf (api/responses, api/sessions) therefore use
// this client instead and treat the route handler itself as the trust
// boundary: it only ever writes the device_id the caller's own request body
// supplied, which is consistent with the platform's no-PII design (a forged
// device_id can at worst pollute one anonymous device's own stats).
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
