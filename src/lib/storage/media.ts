import { slugifyTurkish, sanitizeFileName } from "@/lib/slug";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";

export const SITE_MEDIA_BUCKET = "site-media";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export { slugifyTurkish, sanitizeFileName };

export function assertValidImageFile(file: File) {
  if (!file || file.size === 0) {
    throw new Error("Yüklenecek görsel bulunamadı.");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Sadece JPEG, PNG, WEBP veya AVIF görseller yüklenebilir.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Görsel boyutu en fazla 10MB olabilir.");
  }
}

export function buildStoragePath(folderPath: string, fileName: string) {
  const cleanFolder = folderPath.replace(/^\/+|\/+$/g, "") || "general";
  return `${cleanFolder}/${Date.now()}-${sanitizeFileName(fileName)}`;
}

export async function getMediaFolders() {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("media_folders")
    .select("*")
    .order("full_path", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as MediaFolderRow[];
}

export async function getMediaAssets(folderId?: string | null) {
  const supabase = createPublicSupabaseClient();
  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (folderId) {
    query = query.eq("folder_id", folderId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as MediaAssetRow[];
}

export async function getMediaAssetById(id: string) {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as MediaAssetRow | null;
}
