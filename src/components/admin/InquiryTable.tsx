"use client";

import { useTransition } from "react";
import { deleteInquiryAction, updateInquiryStatusAction } from "@/app/actions/inquiries";
import type { InquiryRow } from "@/lib/supabase/types";

const statuses = ["new", "read", "contacted", "archived"];

export function InquiryTable({ inquiries }: { inquiries: InquiryRow[] }) {
  const [isPending, startTransition] = useTransition();

  if (inquiries.length === 0) {
    return <div className="border border-dashed border-[#CCC7BD] bg-white px-5 py-12 text-center text-sm text-[#66635E]">Henüz talep yok.</div>;
  }

  return (
    <div className="overflow-x-auto border border-[#DDD8CE] bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#EEEAE2] text-[10px] uppercase tracking-[0.16em] text-[#66635E]">
          <tr>
            <th className="px-4 py-3">Kişi</th>
            <th className="px-4 py-3">İletişim</th>
            <th className="px-4 py-3">Mesaj</th>
            <th className="px-4 py-3">Durum</th>
            <th className="px-4 py-3">Tarih</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="border-t border-[#EEEAE2] align-top">
              <td className="px-4 py-4 font-semibold">{inquiry.name}</td>
              <td className="px-4 py-4 text-[#66635E]">
                <div>{inquiry.phone || "-"}</div>
                <div>{inquiry.email || "-"}</div>
              </td>
              <td className="max-w-md whitespace-pre-wrap px-4 py-4 text-[#44413C]">{inquiry.message || "-"}</td>
              <td className="px-4 py-4">
                <form action={updateInquiryStatusAction}>
                  <input type="hidden" name="id" value={inquiry.id} />
                  <select name="status" defaultValue={inquiry.status} onChange={(event) => event.currentTarget.form?.requestSubmit()} className="border border-[#CCC7BD] px-2 py-2">
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </form>
              </td>
              <td className="px-4 py-4 text-xs text-[#66635E]">{new Date(inquiry.created_at).toLocaleString("tr-TR")}</td>
              <td className="px-4 py-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (!window.confirm("Talep silinsin mi?")) return;
                    const data = new FormData();
                    data.set("id", inquiry.id);
                    startTransition(() => {
                      void deleteInquiryAction(data);
                    });
                  }}
                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700 disabled:opacity-60"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
