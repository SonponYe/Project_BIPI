import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client — used for syncing Guest/Verified profile
// data once the device has connectivity. All reads/writes here go through
// RLS policies scoped to the caller's own device_id.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
