"use client";

import { createBrowserClient } from "@supabase/ssr";

const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";

export function createAdminClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          "x-admin-token": adminToken,
        },
      },
    }
  );
}
