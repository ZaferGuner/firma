"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";

export type SettingsState = {
  ok?: boolean;
  message?: string;
  error?: string;
};

const SETTING_KEYS = [
  "phone",
  "whatsapp",
  "email",
  "address",
  "instagram",
  "hero_title",
  "hero_description",
  "footer_description",
  "seo_default_title",
  "seo_default_description",
];

export async function updateSettingsAction(_prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  try {
    const { supabase } = await assertAdmin();
    const rows = SETTING_KEYS.map((key) => ({
      key,
      value: JSON.stringify(String(formData.get(key) || "")),
    })).map((row) => ({
      key: row.key,
      value: JSON.parse(row.value),
    }));

    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) return { error: error.message };

    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");

    return { ok: true, message: "Ayarlar kaydedildi." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Ayarlar kaydedilemedi." };
  }
}
