import { createBrowserClient } from "@supabase/ssr";

const guestToken = process.env.NEXT_PUBLIC_GUEST_TOKEN || "";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          "x-guest-token": guestToken,
        },
      },
    }
  );
}
