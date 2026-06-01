import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { requireAdmin } from "@/lib/auth/admin";
import type { MediaAssetRow } from "@/lib/supabase/types";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: project, error: projectError }, { data: features }, { data: images }, { data: mediaAssets, error: mediaError }] =
    await Promise.all([
      supabase.from("projects").select("*").eq("id", id).maybeSingle(),
      supabase.from("project_features").select("*").eq("project_id", id).order("sort_order", { ascending: true }),
      supabase.from("project_images").select("*").eq("project_id", id).order("sort_order", { ascending: true }),
      supabase.from("media_assets").select("*").order("created_at", { ascending: false }),
    ]);

  if (projectError || mediaError) {
    throw new Error(projectError?.message || mediaError?.message || "Proje okunamadı.");
  }

  if (!project) {
    notFound();
  }

  return (
    <AdminShell title={`Edit: ${project.title}`} description="Proje detaylarını, galeri görsellerini, özellikleri ve SEO alanlarını düzenleyin.">
      <ProjectForm
        project={{
          ...project,
          project_features: features || [],
          project_images: images || [],
        }}
        mediaAssets={(mediaAssets || []) as MediaAssetRow[]}
      />
    </AdminShell>
  );
}
