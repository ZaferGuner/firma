import { AdminShell } from "@/components/admin/AdminShell";
import { InquiryTable } from "@/components/admin/InquiryTable";
import { requireAdmin } from "@/lib/auth/admin";
import type { InquiryRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <AdminShell title="Inquiries" description="İletişim formundan gelen talepleri yönetin, durum değiştirin veya arşivleyin.">
      <InquiryTable inquiries={(data || []) as InquiryRow[]} />
    </AdminShell>
  );
}
