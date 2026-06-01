import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [projects, media, inquiries] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("media_assets").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).neq("status", "archived"),
  ]);

  const cards = [
    { label: "Projects", value: projects.count || 0, href: "/admin/projects" },
    { label: "Media", value: media.count || 0, href: "/admin/media" },
    { label: "Open Inquiries", value: inquiries.count || 0, href: "/admin/inquiries" },
  ];

  return (
    <AdminShell title="Dashboard" description="Projeler, medya kütüphanesi, talepler ve site ayarları için gerçek Supabase CMS paneli.">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="border border-[#DDD8CE] bg-white p-5 hover:border-[#2563EB]">
            <span className="text-sm text-[#66635E]">{card.label}</span>
            <strong className="mt-3 block text-4xl">{card.value}</strong>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
