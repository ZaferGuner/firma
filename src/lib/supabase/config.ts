export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase env değişkenleri eksik. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY gerekli.");
  }
}

export function assertServiceRoleConfigured() {
  const { serviceRoleKey } = getSupabaseConfig();
  assertSupabaseConfigured();
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY eksik. Bu anahtar sadece server-side kullanılmalıdır.");
  }
}
