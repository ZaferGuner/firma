import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO ve Ayarlar | Taner Tümer İnşaat Admin",
};

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {children}
    </div>
  );
}
