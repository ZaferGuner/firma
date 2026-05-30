export type PressType = "Haber" | "Duyuru" | "Röportaj" | "Proje Tanıtımı";

export type PressItem = {
  id: string;
  title: string;
  source: string;
  date: string;
  type: PressType;
  description: string;
  image?: string;
  url?: string;
  featured?: boolean;
  published?: boolean;
  order?: number;
  updatedAt?: string;
};

export const pressPageDefaults = {
  hero: {
    eyebrow: "Medya & Duyurular",
    title: "Basında Biz",
    description:
      "Taner Tümer İnşaat'ın projeleri, kurumsal duyuruları ve medya yansımalarını bu sayfada takip edebilirsiniz.",
  },
  empty: {
    eyebrow: "Medya Arşivi",
    title: "Basın İçerikleri Yakında",
    description:
      "Projelerimiz, kurumsal duyurularımız ve medya yansımalarımız bu sayfada düzenli olarak paylaşılacaktır.",
    secondaryText:
      "Basın, iş birliği veya proje tanıtımı talepleriniz için bizimle iletişime geçebilirsiniz.",
    buttonText: "İletişime Geç",
  },
  mediaKit: {
    title: "Medya Kiti",
    description:
      "Taner Tümer İnşaat marka kullanımı, proje görselleri ve kurumsal bilgi talepleri için bizimle iletişime geçebilirsiniz.",
    items: [
      {
        title: "Kurumsal Bilgiler",
        description: "Şirket profili, faaliyet alanları ve proje bilgileri.",
      },
      {
        title: "Proje Görselleri",
        description:
          "Mevcut proje görselleri ve kurumsal kullanım talepleri için iletişime geçebilirsiniz.",
      },
      {
        title: "Logo & Marka Kullanımı",
        description: "Marka materyalleri ve kullanım talepleri.",
      },
      {
        title: "Basın İletişimi",
        description: "Röportaj, haber ve proje tanıtımı talepleri için iletişim.",
      },
    ],
    requestText: "Talep Et",
  },
  projectsCta: {
    title: "Projelerimizi İnceleyin",
    description:
      "Villa The Same, Tümerhan Twins ve Tümerhan Towers projelerimizi detaylı olarak inceleyebilirsiniz.",
    buttonText: "Projelerimize Git",
  },
  finalCta: {
    title: "Basın ve iş birliği talepleriniz için bizimle iletişime geçin.",
    description:
      "Proje tanıtımı, medya iş birliği veya kurumsal bilgi talepleriniz için ekibimizle iletişime geçebilirsiniz.",
    buttonText: "Bilgi Al",
  },
} as const;

export const pressItems: PressItem[] = [];
export const pressDrafts: PressItem[] = [];
