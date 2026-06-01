import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth/admin";
import type { MediaAssetRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <AdminShell title="New Project" description="Yeni proje oluşturun. Kapak ve galeri görsellerini yükleyebilir veya medya kütüphanesinden seçebilirsiniz.">
      <ProjectForm mediaAssets={(data || []) as MediaAssetRow[]} />
    </AdminShell>
  );
}
