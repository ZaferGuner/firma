import { AdminSidebar } from "@/components/admin/AdminSidebar";

type AdminShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function AdminShell({ title, description, children, action }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#171A1D] md:flex">
      <AdminSidebar />
      <main className="flex-1">
        <header className="border-b border-[#DDD8CE] bg-[#F6F4EF] px-5 py-6 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66635E]">{description}</p>}
            </div>
            {action}
          </div>
        </header>
        <div className="px-5 py-6 md:px-8">{children}</div>
      </main>
    </div>
  );
}
