import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Json, SiteSettingRow } from "@/lib/supabase/types";

export type SiteSettingsMap = Record<string, Json>;

const PUBLIC_SETTING_KEYS = [
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

export async function getSiteSettingsMap() {
  if (!isSupabaseConfigured()) return {};

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", PUBLIC_SETTING_KEYS)
      .order("key", { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).reduce<SiteSettingsMap>((acc, row) => {
      const setting = row as SiteSettingRow;
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Supabase settings fallback:", error);
    return {};
  }
}

export function getStringSetting(settings: SiteSettingsMap, key: string, fallback = "") {
  const value = settings[key];
  return typeof value === "string" ? value : fallback;
}
