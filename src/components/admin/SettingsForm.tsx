"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsState } from "@/app/actions/settings";
import type { SiteSettingsMap } from "@/lib/db/settings";

const fields = [
  { name: "phone", label: "Telefon" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "email", label: "E-posta" },
  { name: "address", label: "Adres" },
  { name: "instagram", label: "Instagram" },
  { name: "hero_title", label: "Hero Başlığı" },
  { name: "hero_description", label: "Hero Açıklaması", textarea: true },
  { name: "footer_description", label: "Footer Açıklaması", textarea: true },
  { name: "seo_default_title", label: "SEO Varsayılan Başlık" },
  { name: "seo_default_description", label: "SEO Varsayılan Açıklama", textarea: true },
];

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function SettingsForm({ settings }: { settings: SiteSettingsMap }) {
  const [state, formAction, isPending] = useActionState<SettingsState, FormData>(updateSettingsAction, {});

  return (
    <form action={formAction} className="grid gap-5 border border-[#DDD8CE] bg-white p-5">
      {state.error && <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.message && <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{state.message}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={`grid gap-1 text-sm ${field.textarea ? "md:col-span-2" : ""}`}>
            {field.label}
            {field.textarea ? (
              <textarea name={field.name} defaultValue={stringValue(settings[field.name])} rows={4} className="border border-[#CCC7BD] px-3 py-2" />
            ) : (
              <input name={field.name} defaultValue={stringValue(settings[field.name])} className="border border-[#CCC7BD] px-3 py-2" />
            )}
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="bg-[#2563EB] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60">
          {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  );
}
