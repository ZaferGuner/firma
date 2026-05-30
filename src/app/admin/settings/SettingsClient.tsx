"use client";

import React, { useState } from "react";
import { AdminEditProvider } from "@/context/AdminEditContext";
import { AdminEditBar } from "@/components/admin/AdminEditBar";
import { useEditableContent } from "@/hooks/useEditableContent";
import { useAdminEdit } from "@/context/AdminEditContext";

function SettingsForm() {
  const adminContext = useAdminEdit();
  
  const globalSettings = useEditableContent("global.settings", {
    siteName: "Taner Tümer İnşaat",
    headerCtaText: "Bilgi Al",
    headerCtaLink: "/iletisim",
    footerDescription: "Geleceği sağlam temeller üzerine inşa ediyoruz. Güven, kalite ve estetik bir arada.",
    footerCopyright: "© 2026 Taner Tümer İnşaat. Tüm hakları saklıdır.",
    defaultOgImage: "/og-image.jpg"
  });

  const seoHome = useEditableContent("seo.home", { title: "", description: "", ogImage: "", noIndex: false });
  const seoProjects = useEditableContent("seo.projects", { title: "", description: "", ogImage: "", noIndex: false });
  const seoContact = useEditableContent("seo.contact", { title: "", description: "", ogImage: "", noIndex: false });
  const seoPress = useEditableContent("seo.press", { title: "", description: "", ogImage: "", noIndex: false });
  const seoProjectDefault = useEditableContent("seo.projectDefault", { title: "", description: "", ogImage: "", noIndex: false });

  const handleFieldChange = (section: string, field: string, value: any) => {
    adminContext?.updateDraftContent(section, field, value);
  };

  const inputClass = "w-full bg-surface border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black rounded";

  const renderSeoSection = (title: string, sectionKey: string, data: any) => (
    <div className="bg-surface p-6 rounded-xl border border-neutral-200">
      <h3 className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
        {title} SEO
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Sayfa Title</label>
          <input
            className={inputClass}
            value={data.title || ""}
            onChange={(e) => handleFieldChange(sectionKey, "title", e.target.value)}
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Meta Description</label>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            value={data.description || ""}
            onChange={(e) => handleFieldChange(sectionKey, "description", e.target.value)}
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">OG Image URL</label>
          <input
            className={inputClass}
            value={data.ogImage || ""}
            onChange={(e) => handleFieldChange(sectionKey, "ogImage", e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-[#C5162E]"
            checked={!!data.noIndex}
            onChange={(e) => handleFieldChange(sectionKey, "noIndex", e.target.checked)}
          />
          <label className="font-mono text-[10px] uppercase text-neutral-500">noIndex (Arama Motorlarına Kapat)</label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 mt-[60px]">
      <div className="mb-8">
        <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-[#08090B]">
          Ayarlar ve SEO Yönetimi
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Bu sayfadaki değişiklikleri yukarıdaki "Kaydet & Yayınla" butonuna basarak kaydedebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-surface p-6 rounded-xl border border-neutral-200">
            <h3 className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">
              Genel Ayarlar
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Site Adı</label>
                <input
                  className={inputClass}
                  value={globalSettings.siteName || ""}
                  onChange={(e) => handleFieldChange("global.settings", "siteName", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Header CTA Metni</label>
                <input
                  className={inputClass}
                  value={globalSettings.headerCtaText || ""}
                  onChange={(e) => handleFieldChange("global.settings", "headerCtaText", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Header CTA Linki</label>
                <input
                  className={inputClass}
                  value={globalSettings.headerCtaLink || ""}
                  onChange={(e) => handleFieldChange("global.settings", "headerCtaLink", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Footer Açıklama Metni</label>
                <textarea
                  rows={3}
                  className={`${inputClass} resize-none`}
                  value={globalSettings.footerDescription || ""}
                  onChange={(e) => handleFieldChange("global.settings", "footerDescription", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Footer Telif Hakkı (Copyright)</label>
                <input
                  className={inputClass}
                  value={globalSettings.footerCopyright || ""}
                  onChange={(e) => handleFieldChange("global.settings", "footerCopyright", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">Varsayılan OG Image</label>
                <input
                  className={inputClass}
                  value={globalSettings.defaultOgImage || ""}
                  onChange={(e) => handleFieldChange("global.settings", "defaultOgImage", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {renderSeoSection("Ana Sayfa", "seo.home", seoHome)}
          {renderSeoSection("Projeler", "seo.projects", seoProjects)}
          {renderSeoSection("İletişim", "seo.contact", seoContact)}
          {renderSeoSection("Basında Biz", "seo.press", seoPress)}
          {renderSeoSection("Proje Detayları (Varsayılan)", "seo.projectDefault", seoProjectDefault)}
        </div>
      </div>
    </div>
  );
}

export function SettingsClient({ initialData }: { initialData: any }) {
  return (
    <AdminEditProvider initialDrafts={initialData} initialPublished={initialData}>
      <AdminEditBar />
      <SettingsForm />
    </AdminEditProvider>
  );
}
