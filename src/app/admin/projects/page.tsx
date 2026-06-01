import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { requireAdmin } from "@/lib/auth/admin";
import type { ProjectRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const projects = (data || []) as ProjectRow[];

  return (
    <AdminShell
      title="Projects"
      description="Projeleri ekleyin, düzenleyin, yayın durumunu yönetin ve görselleri Supabase Storage üzerinden atayın."
      action={
        <Link href="/admin/projects/new" className="bg-[#2563EB] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
          Yeni Proje
        </Link>
      }
    >
      <div className="overflow-x-auto border border-[#DDD8CE] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#EEEAE2] text-[10px] uppercase tracking-[0.16em] text-[#66635E]">
            <tr>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Sıra</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-[#EEEAE2]">
                <td className="px-4 py-4 font-semibold">{project.title}</td>
                <td className="px-4 py-4 text-[#66635E]">{project.slug}</td>
                <td className="px-4 py-4">{project.status}</td>
                <td className="px-4 py-4">{project.sort_order}</td>
                <td className="px-4 py-4">{project.is_featured ? "Evet" : "Hayır"}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2563EB]">
                      Düzenle
                    </Link>
                    {project.status === "published" && (
                      <Link href={`/projects/${project.slug}`} className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2563EB]">
                        Detay
                      </Link>
                    )}
                    <DeleteProjectButton id={project.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-[#66635E]">
            Henüz proje yok.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
