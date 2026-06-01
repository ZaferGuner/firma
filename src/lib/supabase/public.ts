import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";
import type { Database } from "./types";

export function createPublicSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    throw new Error("Supabase public client için env değişkenleri eksik.");
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
