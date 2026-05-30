"use client";

import React, { useState } from "react";
import { AdminEditBar } from "@/components/admin/AdminEditBar";
import { X, Save, Loader2 } from "lucide-react";
import { AdminEditProvider } from "@/context/AdminEditContext";

export function InquiriesClient({ initialInquiries }: { initialInquiries: any[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states for the selected inquiry
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const handleOpenDetail = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setStatus(inquiry.status);
    setNote(inquiry.note || "");
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedInquiry(null);
  };

  const handleUpdate = async () => {
    if (!selectedInquiry) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });

      if (response.ok) {
        setInquiries(inquiries.map((inq) => 
          inq.id === selectedInquiry.id ? { ...inq, status, note } : inq
        ));
        handleCloseDrawer();
      } else {
        alert("Güncelleme başarısız oldu.");
      }
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminEditProvider initialDrafts={{}} initialPublished={{}}>
      <AdminEditBar />
      <div className="pt-[60px]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-[#08090B]">
                Gelen Talepler
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                İletişim formundan gelen tüm talepleri buradan yönetebilirsiniz.
              </p>
            </div>
            <div className="font-mono text-xs text-neutral-400">
              Toplam Talep: <span className="font-bold text-text">{inquiries.length}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                <tr>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4">Gönderen</th>
                  <th className="px-6 py-4">İletişim</th>
                  <th className="px-6 py-4">Konu / Proje</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 text-neutral-500 font-mono text-[11px]">
                      {new Date(inq.createdAt).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-text">
                      {inq.name}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      <div className="flex flex-col gap-1 text-[13px]">
                        {inq.phone && <span>{inq.phone}</span>}
                        {inq.email && <span>{inq.email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-text text-[13px]">{inq.subject}</span>
                        <span className="text-[11px] text-neutral-400">{inq.projectType} • {inq.district}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                          inq.status === "Yeni"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : inq.status === "Arşiv"
                            ? "bg-neutral-100 text-neutral-500 border border-neutral-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(inq)}
                        className="inline-block border border-neutral-300 bg-surface px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-text transition-colors hover:border-black hover:bg-dark-bg hover:text-dark-text"
                      >
                        Detay
                      </button>
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-400 italic">
                      Henüz gelen talep bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedInquiry && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          <div className="absolute inset-0 bg-dark-bg/40 backdrop-blur-sm" onClick={handleCloseDrawer} />
          
          <div className="relative w-[min(500px,100vw)] bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-[#08090B]">
                Talep Detayı
              </h2>
              <button
                onClick={handleCloseDrawer}
                className="p-2 text-neutral-400 hover:text-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6 p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                <div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Gönderen</span>
                  <span className="font-medium text-text text-sm">{selectedInquiry.name}</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Tarih</span>
                  <span className="font-medium text-text text-sm">
                    {new Date(selectedInquiry.createdAt).toLocaleString("tr-TR")}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Telefon</span>
                  <span className="font-medium text-text text-sm">{selectedInquiry.phone || "-"}</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">E-posta</span>
                  <span className="font-medium text-text text-sm">{selectedInquiry.email || "-"}</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Konu</span>
                  <span className="font-medium text-text text-sm">{selectedInquiry.subject}</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Proje Tipi</span>
                  <span className="font-medium text-text text-sm">{selectedInquiry.projectType}</span>
                </div>
                <div className="col-span-2">
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">İlçe</span>
                  <span className="font-medium text-text text-sm">{selectedInquiry.district}</span>
                </div>
              </div>

              {/* Message */}
              <div>
                <span className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">Mesaj</span>
                <div className="p-5 bg-surface border border-neutral-200 rounded-lg text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message || <span className="italic text-neutral-400">Mesaj girilmemiş.</span>}
                </div>
              </div>

              {/* Edit Controls */}
              <div className="space-y-5 pt-4 border-t border-neutral-100">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">Durum</label>
                  <select
                    className="w-full bg-surface border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black rounded"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Yeni">Yeni</option>
                    <option value="İnceleniyor">İnceleniyor</option>
                    <option value="İletişime Geçildi">İletişime Geçildi</option>
                    <option value="Arşiv">Arşiv</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">Yönetici Notu</label>
                  <textarea
                    className="w-full bg-surface border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black rounded h-24 resize-none"
                    placeholder="Bu talep ile ilgili notlarınızı buraya yazabilirsiniz..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
              <button
                onClick={handleCloseDrawer}
                disabled={isUpdating}
                className="px-6 py-2 border border-neutral-300 text-neutral-600 bg-surface font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-50 transition-colors rounded"
              >
                İptal
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || (status === selectedInquiry.status && note === selectedInquiry.note)}
                className="px-6 py-2 border border-black bg-dark-bg text-dark-text font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-800 transition-colors rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminEditProvider>
  );
}
