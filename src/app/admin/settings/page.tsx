import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth/admin";
import type { SiteSettingsMap } from "@/lib/db/settings";
import type { SiteSettingRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error) throw new Error(error.message);

  const settings = ((data || []) as SiteSettingRow[]).reduce<SiteSettingsMap>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return (
    <AdminShell title="Settings" description="Telefon, WhatsApp, e-posta, adres, hero, footer ve varsayılan SEO alanlarını yönetin.">
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
