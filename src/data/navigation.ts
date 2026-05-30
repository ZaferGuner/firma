export const navigationItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/about" },
  { label: "Projeler", href: "/projects" },
  { label: "Basında Biz", href: "/press" },
  { label: "İletişim", href: "/contact" },
] as const;

export const contactActions = {
  phoneLabel: "Ara",
  phoneText: "0 (533) 061 80 01",
  phoneHref: "tel:+905330618001",
  whatsappLabel: "WhatsApp",
  whatsappHref: "https://wa.me/905330618001",
  quoteLabel: "Bilgi Al",
  quoteHref: "/contact",
} as const;
