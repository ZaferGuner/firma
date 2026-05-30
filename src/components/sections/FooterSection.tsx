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
    <footer data-header-theme="dark" className="bg-site-dark px-5 pb-[88px] pt-12 text-site-dark-text sm:px-6 sm:pb-[88px] sm:pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl border-t border-[rgba(245,242,234,0.12)] pt-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="text-lg font-semibold tracking-[-0.02em] text-site-dark-text">
              TANER TÜMER
            </p>
            <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-site-dark-label">
              İnşaat
            </p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-site-dark-body">
              {globalSettings?.footerDescription || "Güvenilir yapı anlayışı, modern mimari çizgi ve kontrollü uygulama disipliniyle nitelikli yaşam alanları geliştirir."}
            </p>
          </div>

          <nav aria-label="Footer menü">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-site-dark-label">
              Menü
            </p>
            <div className="mt-6 grid gap-3">
              {footerLinks.map((link) => (
                <a
                  className="text-sm text-site-dark-body transition-colors hover:text-site-dark-text"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-site-dark-label">
              İletişim
            </p>
            <div className="mt-6 grid gap-3 text-sm text-site-dark-body">
              <a className="hover:text-site-dark-text transition-colors" href={contactInfo.phoneHref}>
                {contactInfo.phone}
              </a>
              <a className="hover:text-site-dark-text transition-colors" href={contactInfo.emailHref}>
                {contactInfo.email}
              </a>
              <p className="text-site-dark-muted">{contactInfo.address}</p>
              <div className="mt-4 flex gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-site-dark-label">
                <span>Instagram</span>
                <span>LinkedIn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[rgba(245,242,234,0.12)] pt-5 text-xs text-site-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{globalSettings?.footerCopyright || "© 2026 Taner Tümer İnşaat. Tüm hakları saklıdır."}</p>
          <p className="text-site-dark-muted">Premium mimari proje deneyimi.</p>
        </div>
      </div>
    </footer>
  );
}
