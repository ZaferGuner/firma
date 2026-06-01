import { AdminShell } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireAdmin } from "@/lib/auth/admin";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";

type Props = {
  searchParams: Promise<{ folder?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({ searchParams }: Props) {
  const { folder } = await searchParams;
  const { supabase } = await requireAdmin();

  let assetsQuery = supabase.from("media_assets").select("*").order("created_at", { ascending: false });
  if (folder) {
    assetsQuery = assetsQuery.eq("folder_id", folder);
  }

  const [{ data: folders, error: folderError }, { data: assets, error: assetError }] = await Promise.all([
    supabase.from("media_folders").select("*").order("full_path", { ascending: true }),
    assetsQuery,
  ]);

  if (folderError || assetError) {
    throw new Error(folderError?.message || assetError?.message || "Medya okunamadı.");
  }

  return (
    <AdminShell title="Media" description="Supabase Storage medya kütüphanesi. Klasör oluşturun, görsel yükleyin, URL kopyalayın ve alt text düzenleyin.">
      <MediaLibrary
        folders={(folders || []) as MediaFolderRow[]}
        assets={(assets || []) as MediaAssetRow[]}
        currentFolderId={folder}
      />
    </AdminShell>
  );
}
