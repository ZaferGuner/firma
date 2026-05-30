"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function InquiryDetailClient({ inquiry }: { inquiry: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(inquiry.status);
  const [note, setNote] = useState(inquiry.note || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      if (res.ok) {
        alert("Başarıyla güncellendi.");
        router.refresh();
      } else {
        alert("Bir hata oluştu.");
      }
    } catch (e) {
      alert("Bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <a href="/admin/inquiries" className="text-xs text-neutral-500 hover:text-text mb-2 inline-block">
            ← Tüm Taleplere Dön
          </a>
          <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-[#08090B]">
            Talep Detayı
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface p-6 border border-neutral-200 rounded-xl">
            <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
              İletişim Bilgileri
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-neutral-400 font-mono uppercase">Ad Soyad</div>
                <div className="font-medium">{inquiry.name}</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 font-mono uppercase">Tarih</div>
                <div className="text-sm">{new Date(inquiry.createdAt).toLocaleString("tr-TR")}</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 font-mono uppercase">Telefon</div>
                <div className="text-sm">{inquiry.phone || "-"}</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 font-mono uppercase">E-posta</div>
                <div className="text-sm">{inquiry.email || "-"}</div>
              </div>
            </div>
          </div>

          <div className="bg-surface p-6 border border-neutral-200 rounded-xl">
            <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
              Talep Detayı
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-[10px] text-neutral-400 font-mono uppercase">Konu</div>
                <div className="font-medium">{inquiry.subject}</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 font-mono uppercase">Proje Türü / Bölge</div>
                <div className="text-sm">{inquiry.projectType} • {inquiry.district}</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-mono uppercase mb-1">Mesaj</div>
              <div className="text-sm whitespace-pre-wrap bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                {inquiry.message || <span className="italic text-neutral-400">Mesaj girilmemiş.</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface p-6 border border-neutral-200 rounded-xl">
            <h2 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
              Yönetim
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-neutral-400 font-mono uppercase mb-1 block">Durum</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                >
                  <option value="Yeni">Yeni</option>
                  <option value="Görüşüldü">Görüşüldü</option>
                  <option value="Arşiv">Arşiv</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 font-mono uppercase mb-1 block">Dahili Not</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Sadece yöneticilerin görebileceği notlar..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-dark-bg text-dark-text rounded font-mono text-[10px] font-bold uppercase tracking-widest py-3 transition-colors hover:bg-neutral-800 disabled:opacity-50"
              >
                {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
