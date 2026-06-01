import Link from "next/link";
import { logoutAction } from "@/app/actions/admin-auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#111518] text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-4 px-5 py-5 md:block">
        <Link href="/admin" className="block">
          <span className="block text-sm font-semibold tracking-[0.2em]">TANER TÜMER</span>
          <span className="mt-1 block text-[10px] tracking-[0.28em] text-white/55">CMS</span>
        </Link>
        <form action={logoutAction} className="md:hidden">
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65" type="submit">
            Çıkış
          </button>
        </form>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:block md:px-3 md:pb-0">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 hover:bg-white/5 hover:text-white md:mb-1"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <form action={logoutAction} className="mt-auto hidden px-5 py-6 md:block">
        <button className="w-full border border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white" type="submit">
          Çıkış Yap
        </button>
      </form>
    </aside>
  );
}
