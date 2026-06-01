import { createClient } from "@supabase/supabase-js";
import { assertServiceRoleConfigured, getSupabaseConfig } from "./config";
import type { Database } from "./types";

export function createServiceRoleClient() {
  assertServiceRoleConfigured();
  const { url, serviceRoleKey } = getSupabaseConfig();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
