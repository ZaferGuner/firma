import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminSession = Awaited<ReturnType<typeof getAdminSession>>;

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id,user_id,email,role,created_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminUser) {
    return null;
  }

  return { user, adminUser, supabase };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function assertAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Bu işlem için admin yetkisi gerekli.");
  }

  return session;
}
