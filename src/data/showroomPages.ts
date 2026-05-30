export const showroomPages = [
  {
    slug: "mimari-deneyim",
    eyebrow: "MEKAN KURGUSU",
    title: "Mimari Deneyim",
    description:
      "Plan, ışık, malzeme ve dolaşım kararlarının kullanıcı deneyimine dönüştüğü mimari anlatı.",
    metric: "02",
  },
  {
    slug: "konum",
    eyebrow: "KENT BAĞLAMI",
    title: "Konum",
    description:
      "Projelerin ulaşım, sosyal yaşam ve şehir dokusu ile kurduğu ilişkiyi anlatan konum deneyimi.",
    metric: "03",
  },
  {
    slug: "muhendislik",
    eyebrow: "YAPI TEKNOLOJİSİ",
    title: "Mühendislik",
    description:
      "Taşıyıcı sistem, malzeme kalitesi ve uygulama disiplinini öne çıkaran teknik yaklaşım.",
    metric: "04",
  },
  {
    slug: "kurumsal",
    eyebrow: "MARKA HAFIZASI",
    title: "Kurumsal",
    description:
      "Taner Tümer İnşaat'ın mimari vizyonunu, üretim kültürünü ve kalite yaklaşımını sunan bölüm.",
    metric: "05",
  },
  {
    slug: "iletisim",
    eyebrow: "SATIŞ VE SHOWROOM",
    title: "İletişim",
    description:
      "Proje sunumu, satış ofisi görüşmesi ve detaylı bilgi talebi için iletişim deneyimi.",
    metric: "06",
  },
] as const;

export type ShowroomPage = (typeof showroomPages)[number];
