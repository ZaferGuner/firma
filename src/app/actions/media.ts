"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import {
  assertValidImageFile,
  buildStoragePath,
  sanitizeFileName,
  SITE_MEDIA_BUCKET,
  slugifyTurkish,
} from "@/lib/storage/media";

export type ActionState = {
  ok?: boolean;
  message?: string;
  error?: string;
};

function normalizeFolderPath(path: string) {
  return path.replace(/^\/+|\/+$/g, "") || "general";
}

export async function createFolderAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { supabase } = await assertAdmin();
    const name = String(formData.get("name") || "").trim();
    const parentId = String(formData.get("parent_id") || "").trim() || null;

    if (!name) {
      return { error: "Klasör adı zorunlu." };
    }

    let parentPath = "";
    if (parentId) {
      const { data: parent, error: parentError } = await supabase
        .from("media_folders")
        .select("full_path")
        .eq("id", parentId)
        .single();

      if (parentError || !parent) {
        return { error: "Üst klasör bulunamadı." };
      }

      parentPath = parent.full_path;
    }

    const slug = slugifyTurkish(name);
    const fullPath = normalizeFolderPath(parentPath ? `${parentPath}/${slug}` : slug);

    const { error } = await supabase.from("media_folders").insert({
      name,
      slug,
      parent_id: parentId,
      full_path: fullPath,
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/media");
    return { ok: true, message: "Klasör oluşturuldu." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Klasör oluşturulamadı." };
  }
}

export async function uploadMediaAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { user, supabase } = await assertAdmin();
    const folderId = String(formData.get("folder_id") || "").trim() || null;
    const altText = String(formData.get("alt_text") || "").trim() || null;
    const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      return { error: "Yüklenecek görsel seçilmedi." };
    }

    let folderPath = "general";
    if (folderId) {
      const { data: folder, error: folderError } = await supabase
        .from("media_folders")
        .select("full_path")
        .eq("id", folderId)
        .single();

      if (folderError || !folder) {
        return { error: "Klasör bulunamadı." };
      }

      folderPath = folder.full_path;
    }

    for (const file of files) {
      assertValidImageFile(file);
      const path = buildStoragePath(folderPath, file.name);
      const safeName = sanitizeFileName(file.name);

      const { error: uploadError } = await supabase.storage
        .from(SITE_MEDIA_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicData } = supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path);

      const { error: insertError } = await supabase.from("media_assets").insert({
        folder_id: folderId,
        bucket: SITE_MEDIA_BUCKET,
        path,
        public_url: publicData.publicUrl,
        file_name: safeName,
        file_size: file.size,
        mime_type: file.type,
        alt_text: altText,
        title: safeName,
        created_by: user.id,
      });

      if (insertError) {
        await supabase.storage.from(SITE_MEDIA_BUCKET).remove([path]);
        throw new Error(insertError.message);
      }
    }

    revalidatePath("/admin/media");
    return { ok: true, message: "Görsel yüklendi." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Görsel yüklenemedi." };
  }
}

export async function updateMediaMetaAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { supabase } = await assertAdmin();
    const id = String(formData.get("id") || "");
    const altText = String(formData.get("alt_text") || "").trim() || null;
    const title = String(formData.get("title") || "").trim() || null;

    const { error } = await supabase
      .from("media_assets")
      .update({ alt_text: altText, title })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/media");
    return { ok: true, message: "Görsel bilgisi güncellendi." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Görsel güncellenemedi." };
  }
}

export async function deleteMediaAction(formData: FormData) {
  const { supabase } = await assertAdmin();
  const id = String(formData.get("id") || "");

  const { data: asset, error: assetError } = await supabase
    .from("media_assets")
    .select("id,path,public_url")
    .eq("id", id)
    .single();

  if (assetError || !asset) {
    throw new Error("Görsel bulunamadı.");
  }

  const { count } = await supabase
    .from("project_images")
    .select("id", { count: "exact", head: true })
    .or(`media_id.eq.${asset.id},image_url.eq.${asset.public_url}`);

  const { count: coverCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .or(`cover_media_id.eq.${asset.id},cover_image_url.eq.${asset.public_url}`);

  if ((count || 0) + (coverCount || 0) > 0) {
    throw new Error("Bu görsel bir projede kullanılıyor. Önce projeden kaldırın.");
  }

  const { error: storageError } = await supabase.storage.from(SITE_MEDIA_BUCKET).remove([asset.path]);
  if (storageError) throw new Error(storageError.message);

  const { error: deleteError } = await supabase.from("media_assets").delete().eq("id", id);
  if (deleteError) throw new Error(deleteError.message);

  revalidatePath("/admin/media");
}
