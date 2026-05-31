import { contactInfo } from "@/data/home";

const footerLinks = [
  { label: "Projeler", href: "/projeler" },
  { label: "Hakkımızda", href: "/kurumsal" },
  { label: "İletişim", href: "/iletisim" },
  { label: "KVKK", href: "/kurumsal" },
  { label: "Gizlilik Politikası", href: "/kurumsal" },
] as const;

export function FooterSection({ globalSettings }: { globalSettings?: any }) {
  return (
    <footer data-header-theme="dark" className="bg-[#2E302B] py-16 lg:py-24 relative group border-t border-[rgba(245,242,234,0.10)] pb-[140px] lg:pb-[120px]">
      <div className="container mx-auto px-6 lg:px-12 xl:px-20 flex flex-col items-center text-center">
        
        {/* LOGO & TITLE */}
        <div className="mb-8">
          <span className="block text-2xl lg:text-3xl font-light tracking-[0.1em] text-[#F5F2EA] uppercase mb-2">
            {globalSettings?.siteName || "Taner Tümer"}
          </span>
          <span className="block text-[10px] font-medium tracking-[0.3em] text-[#C8C2B6] uppercase">
            Mimari Proje Deneyimi
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="max-w-md mx-auto text-[13px] leading-relaxed text-[#C8C2B6] font-light mb-12">
          {globalSettings?.footerDescription || "Projelerimizi teknik disiplin, modern mimari çizgiler ve insan odaklı yaşam değerleri üzerine inşa ediyoruz."}
        </p>

        {/* LINKS */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16">
          <a href="/" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#F5F2EA] hover:text-white transition-colors">Ana Sayfa</a>
          <a href="/about" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#F5F2EA] hover:text-white transition-colors">Hakkımızda</a>
          <a href="/projeler" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#F5F2EA] hover:text-white transition-colors">Projeler</a>
          <a href="/contact" className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#F5F2EA] hover:text-white transition-colors">İletişim</a>
        </div>

        {/* COPYRIGHT */}
        <div className="w-full max-w-2xl border-t border-[rgba(245,242,234,0.10)] pt-8 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#C8C2B6]">
            {globalSettings?.footerCopyright || "© 2026 Taner Tümer İnşaat. Tüm hakları saklıdır."}
          </p>
        </div>
        
      </div>
    </footer>
  );
}
