"use client";

import { useActionState, useMemo, useState } from "react";
import {
  createProjectAction,
  updateProjectAction,
  type ProjectFormState,
} from "@/app/actions/projects";
import { slugifyTurkish } from "@/lib/slug";
import type { MediaAssetRow } from "@/lib/supabase/types";

type ProjectFormProps = {
  project?: any;
  mediaAssets: MediaAssetRow[];
};

export function ProjectForm({ project, mediaAssets }: ProjectFormProps) {
  const action = project?.id ? updateProjectAction.bind(null, project.id) : createProjectAction;
  const [state, formAction, isPending] = useActionState<ProjectFormState, FormData>(action, {});
  const [slug, setSlug] = useState(project?.slug || "");

  const featuresText = useMemo(() => {
    const features = project?.project_features || project?.features || [];
    return features.map((feature: any) => (typeof feature === "string" ? feature : feature.title)).join("\n");
  }, [project]);

  const galleryText = useMemo(() => {
    const images = project?.project_images || project?.gallery || [];
    return images.map((image: any) => (typeof image === "string" ? image : image.image_url)).join("\n");
  }, [project]);

  return (
    <form action={formAction} className="grid gap-6" encType="multipart/form-data">
      {state.error && <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.message && <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{state.message}</div>}

      <section className="grid gap-4 border border-[#DDD8CE] bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Temel Bilgiler</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Başlık
            <input
              name="title"
              required
              defaultValue={project?.title || ""}
              onChange={(event) => {
                if (!project?.id) setSlug(slugifyTurkish(event.target.value));
              }}
              className="border border-[#CCC7BD] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Slug
            <input
              name="slug"
              required
              value={slug}
              onChange={(event) => setSlug(slugifyTurkish(event.target.value))}
              className="border border-[#CCC7BD] px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            Subtitle
            <input name="subtitle" defaultValue={project?.subtitle || ""} className="border border-[#CCC7BD] px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            Description
            <textarea name="description" defaultValue={project?.description || ""} rows={5} className="border border-[#CCC7BD] px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Location
            <input name="location" defaultValue={project?.location || ""} className="border border-[#CCC7BD] px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Project Type
            <input name="project_type" defaultValue={project?.project_type || project?.category || ""} className="border border-[#CCC7BD] px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Year
            <input name="year" defaultValue={project?.year || ""} className="border border-[#CCC7BD] px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Status
            <select name="status" defaultValue={project?.status || "draft"} className="border border-[#CCC7BD] px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Sort Order
            <input name="sort_order" type="number" defaultValue={project?.sort_order || 0} className="border border-[#CCC7BD] px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="is_featured" type="checkbox" defaultChecked={Boolean(project?.is_featured || project?.featured)} />
            Featured
          </label>
        </div>
      </section>

      <section className="grid gap-4 border border-[#DDD8CE] bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Cover Image</h2>
        <label className="grid gap-1 text-sm">
          Yeni görsel yükle
          <input name="cover_upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="border border-[#CCC7BD] px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          Medya kütüphanesinden seç
          <select name="cover_media_id" defaultValue={project?.cover_media_id || ""} className="border border-[#CCC7BD] px-3 py-2">
            <option value="">Seçme</option>
            {mediaAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.file_name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Cover URL
          <input name="cover_image_url" defaultValue={project?.cover_image_url || project?.coverImage || ""} className="border border-[#CCC7BD] px-3 py-2" />
        </label>
      </section>

      <section className="grid gap-4 border border-[#DDD8CE] bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Gallery</h2>
        <label className="grid gap-1 text-sm">
          Çoklu görsel yükle
          <input name="gallery_uploads" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="border border-[#CCC7BD] px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          Medya kütüphanesinden seç
          <select name="gallery_media_ids" multiple className="min-h-40 border border-[#CCC7BD] px-3 py-2">
            {mediaAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.file_name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Gallery URL listesi
          <textarea name="gallery_urls" defaultValue={galleryText} rows={6} className="border border-[#CCC7BD] px-3 py-2" />
        </label>
      </section>

      <section className="grid gap-4 border border-[#DDD8CE] bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Features</h2>
        <textarea name="features" defaultValue={featuresText} rows={7} className="border border-[#CCC7BD] px-3 py-2" />
      </section>

      <section className="grid gap-4 border border-[#DDD8CE] bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">SEO</h2>
        <input name="meta_title" defaultValue={project?.meta_title || ""} placeholder="Meta title" className="border border-[#CCC7BD] px-3 py-2" />
        <textarea name="meta_description" defaultValue={project?.meta_description || ""} rows={3} placeholder="Meta description" className="border border-[#CCC7BD] px-3 py-2" />
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="bg-[#2563EB] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60">
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
