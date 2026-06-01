"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertAdmin } from "@/lib/auth/admin";
import {
  assertValidImageFile,
  buildStoragePath,
  sanitizeFileName,
  SITE_MEDIA_BUCKET,
  slugifyTurkish,
} from "@/lib/storage/media";

export type ProjectFormState = {
  ok?: boolean;
  message?: string;
  error?: string;
};

const projectSchema = z.object({
  title: z.string().min(1, "Başlık zorunlu."),
  slug: z.string().min(1, "Slug zorunlu."),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  project_type: z.string().optional(),
  year: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean(),
  sort_order: z.coerce.number().int().default(0),
  cover_image_url: z.string().optional(),
  cover_media_id: z.string().optional().nullable(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

function textLines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function ensureProjectFolder(supabase: Awaited<ReturnType<typeof assertAdmin>>["supabase"], slug: string) {
  const fullPath = `projects/${slug}`;
  const { data: existing } = await supabase
    .from("media_folders")
    .select("id,full_path")
    .eq("full_path", fullPath)
    .maybeSingle();

  if (existing) return existing;

  const { data: parent } = await supabase
    .from("media_folders")
    .select("id")
    .eq("full_path", "projects")
    .maybeSingle();

  const { data, error } = await supabase
    .from("media_folders")
    .insert({
      name: slug,
      slug,
      parent_id: parent?.id || null,
      full_path: fullPath,
    })
    .select("id,full_path")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function uploadProjectFile(
  supabase: Awaited<ReturnType<typeof assertAdmin>>["supabase"],
  userId: string,
  folderId: string | null,
  folderPath: string,
  file: File,
  altText: string | null,
) {
  assertValidImageFile(file);
  const path = buildStoragePath(folderPath, file.name);
  const safeName = sanitizeFileName(file.name);

  const { error: uploadError } = await supabase.storage
    .from(SITE_MEDIA_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicData } = supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path);

  const { data: asset, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      folder_id: folderId,
      bucket: SITE_MEDIA_BUCKET,
      path,
      public_url: publicData.publicUrl,
      file_name: safeName,
      file_size: file.size,
      mime_type: file.type,
      alt_text: altText,
      title: safeName,
      created_by: userId,
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(SITE_MEDIA_BUCKET).remove([path]);
    throw new Error(insertError.message);
  }

  return asset;
}

async function saveProject(id: string | null, formData: FormData): Promise<ProjectFormState> {
  try {
    const { user, supabase } = await assertAdmin();
    const rawSlug = String(formData.get("slug") || formData.get("title") || "");
    const parsed = projectSchema.safeParse({
      title: formData.get("title"),
      slug: slugifyTurkish(rawSlug),
      subtitle: String(formData.get("subtitle") || ""),
      description: String(formData.get("description") || ""),
      location: String(formData.get("location") || ""),
      project_type: String(formData.get("project_type") || ""),
      year: String(formData.get("year") || ""),
      status: formData.get("status") || "draft",
      is_featured: formData.get("is_featured") === "on",
      sort_order: formData.get("sort_order") || "0",
      cover_image_url: String(formData.get("cover_image_url") || ""),
      cover_media_id: String(formData.get("cover_media_id") || "") || null,
      meta_title: String(formData.get("meta_title") || ""),
      meta_description: String(formData.get("meta_description") || ""),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Form geçersiz." };
    }

    const folder = await ensureProjectFolder(supabase, parsed.data.slug);
    let coverImageUrl = parsed.data.cover_image_url || null;
    let coverMediaId = parsed.data.cover_media_id || null;

    if (coverMediaId) {
      const { data: asset, error } = await supabase
        .from("media_assets")
        .select("id,public_url")
        .eq("id", coverMediaId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (asset) coverImageUrl = asset.public_url;
    }

    const coverUpload = formData.get("cover_upload");
    if (coverUpload instanceof File && coverUpload.size > 0) {
      const asset = await uploadProjectFile(
        supabase,
        user.id,
        folder.id,
        folder.full_path,
        coverUpload,
        parsed.data.title,
      );
      coverImageUrl = asset.public_url;
      coverMediaId = asset.id;
    }

    const payload = {
      slug: parsed.data.slug,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      status: parsed.data.status,
      project_type: parsed.data.project_type || null,
      year: parsed.data.year || null,
      cover_image_url: coverImageUrl,
      cover_media_id: coverMediaId,
      is_featured: parsed.data.is_featured,
      sort_order: parsed.data.sort_order,
      meta_title: parsed.data.meta_title || null,
      meta_description: parsed.data.meta_description || null,
    };

    const query = id
      ? supabase.from("projects").update(payload).eq("id", id).select("id,slug").single()
      : supabase.from("projects").insert(payload).select("id,slug").single();

    const { data: project, error: projectError } = await query;
    if (projectError || !project) {
      return { error: projectError?.message || "Proje kaydedilemedi." };
    }

    await supabase.from("project_features").delete().eq("project_id", project.id);
    const features = textLines(formData.get("features"));
    if (features.length > 0) {
      const { error } = await supabase.from("project_features").insert(
        features.map((title, index) => ({
          project_id: project.id,
          title,
          sort_order: index,
        })),
      );
      if (error) throw new Error(error.message);
    }

    await supabase.from("project_images").delete().eq("project_id", project.id);
    const galleryUrls: Array<{
      project_id: string;
      media_id?: string;
      image_url: string;
      alt_text: string;
      sort_order: number;
    }> = textLines(formData.get("gallery_urls")).map((url, index) => ({
      project_id: project.id,
      image_url: url,
      alt_text: parsed.data.title,
      sort_order: index,
    }));

    const galleryMediaIds = formData
      .getAll("gallery_media_ids")
      .map((entry) => String(entry))
      .filter(Boolean);

    if (galleryMediaIds.length > 0) {
      const { data: assets, error } = await supabase
        .from("media_assets")
        .select("id,public_url,alt_text")
        .in("id", galleryMediaIds);

      if (error) throw new Error(error.message);

      for (const asset of assets || []) {
        galleryUrls.push({
          project_id: project.id,
          image_url: asset.public_url,
          alt_text: asset.alt_text || parsed.data.title,
          sort_order: galleryUrls.length,
        });
      }
    }

    const galleryUploads = formData
      .getAll("gallery_uploads")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    for (const file of galleryUploads) {
      const asset = await uploadProjectFile(
        supabase,
        user.id,
        folder.id,
        folder.full_path,
        file,
        parsed.data.title,
      );
      galleryUrls.push({
        project_id: project.id,
        media_id: asset.id,
        image_url: asset.public_url,
        alt_text: parsed.data.title,
        sort_order: galleryUrls.length,
      });
    }

    if (galleryUrls.length > 0) {
      const { error } = await supabase.from("project_images").insert(galleryUrls);
      if (error) throw new Error(error.message);
    }

    revalidatePath("/");
    revalidatePath("/projeler");
    revalidatePath(`/projeler/${project.slug}`);
    revalidatePath("/admin/projects");

    return { ok: true, message: "Proje kaydedildi." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Proje kaydedilemedi." };
  }
}

export async function createProjectAction(_prevState: ProjectFormState, formData: FormData) {
  const result = await saveProject(null, formData);
  if (result.ok) redirect("/admin/projects");
  return result;
}

export async function updateProjectAction(id: string, _prevState: ProjectFormState, formData: FormData) {
  return saveProject(id, formData);
}

export async function deleteProjectAction(formData: FormData) {
  const { supabase } = await assertAdmin();
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/projeler");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
