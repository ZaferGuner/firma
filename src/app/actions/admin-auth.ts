"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LoginState = {
  error?: string;
};

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase env değişkenleri eksik. .env.local dosyasını doldurun." };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Lütfen e-posta ve şifre alanlarını doldurun." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: error?.message || "Giriş işlemi başarısız." };
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError || !adminUser) {
    await supabase.auth.signOut();
    return { error: "Bu kullanıcı admin paneline erişemez." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}
