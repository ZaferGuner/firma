"use client";

import { contactInfo } from "@/data/contact";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";
import { useAdminEdit } from "@/context/AdminEditContext";
import { AdminEditButton } from "@/components/admin/AdminEditButton";

export function Footer({ globalSettings }: { globalSettings?: any }) {
  const adminContext = useAdminEdit();

  return (
    <footer className="bg-site-dark border-t border-[rgba(245,242,234,0.12)] py-12 pb-[88px] lg:pb-[88px] relative group">
      {adminContext && !adminContext.isPreviewMode && (
        <AdminEditButton onClick={() => adminContext.openSectionEditor("global.settings")} label="Site Ayarları / Footer Düzenle" position="top-right" />
      )}
      <div className="container mx-auto px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24 mb-10">
          
          {/* BRAND & DESCRIPTION */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="flex flex-col">
              <span className="text-xl font-medium tracking-tight text-site-dark-text uppercase">{globalSettings?.siteName || "Taner Tümer İnşaat"}</span>
              <span className="text-xs tracking-[0.2em] text-site-dark-label uppercase mt-1">Mimari Proje Deneyimi</span>
            </div>
            <p className="text-sm leading-relaxed text-site-dark-body">
              {globalSettings?.footerDescription || "Projelerimizi teknik disiplin, modern mimari çizgiler ve insan odaklı yaşam değerleri üzerine inşa ediyoruz."}
            </p>
          </div>

          {/* NAVIGATION LINKS */}
          <div className="w-full sm:w-1/2 lg:w-1/4 flex flex-col gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-site-dark-label mb-2">Keşfet</span>
            <IframeTransitionLink href="/" className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">Ana Sayfa</IframeTransitionLink>
            <IframeTransitionLink href="/about" className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">Hakkımızda</IframeTransitionLink>
            <IframeTransitionLink href="/projects" className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">Projeler</IframeTransitionLink>
            <IframeTransitionLink href="/press" className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">Basında Biz</IframeTransitionLink>
            <IframeTransitionLink href="/#company" className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">Yaklaşım</IframeTransitionLink>
            <IframeTransitionLink href="/#engineering" className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">Mühendislik</IframeTransitionLink>
            <IframeTransitionLink href="/contact" className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">İletişim</IframeTransitionLink>
          </div>

          {/* CONTACT INFO */}
          <div className="w-full sm:w-1/2 lg:w-1/4 flex flex-col gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-site-dark-label mb-2">İletişim</span>
            <a href={contactInfo.phoneHref} className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">
              {contactInfo.phone}
            </a>
            <a href={contactInfo.emailHref} className="text-sm text-site-dark-body hover:text-site-dark-text transition-colors">
              {contactInfo.email}
            </a>
            <span className="text-sm text-site-dark-muted">
              Adana / Türkiye
            </span>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[rgba(245,242,234,0.12)]">
          <p className="text-xs text-site-dark-muted">
            {globalSettings?.footerCopyright || "© 2026 Taner Tümer İnşaat. Tüm hakları saklıdır."}
          </p>
          <div className="flex gap-4">
            <a href="/kurumsal" className="text-[10px] uppercase tracking-widest text-site-dark-muted hover:text-site-dark-text transition-colors">KVKK</a>
            <a href="/kurumsal" className="text-[10px] uppercase tracking-widest text-site-dark-muted hover:text-site-dark-text transition-colors">Aydınlatma Metni</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

