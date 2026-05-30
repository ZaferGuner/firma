export type ProjectExperienceStat = {
  label: string;
  value: string;
};

export type ProjectExperienceStep = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  stats: ProjectExperienceStat[];
  visualLabel: string;
};

export const projectExperienceSteps: ProjectExperienceStep[] = [
  {
    id: "overview",
    eyebrow: "01 / PROJE",
    title: "Tümerhan Towers",
    description: "Adana’da modern yaşam, planlı mimari ve güven odaklı proje yaklaşımını bir araya getiren yeni yaşam alanı.",
    stats: [
      { label: "Proje", value: "Konut" },
      { label: "Konum", value: "Adana" }
    ],
    visualLabel: "Genel Bakış"
  },
  {
    id: "location",
    eyebrow: "02 / KONUM",
    title: "Şehrin içinde güçlü bir yaşam noktası",
    description: "Günlük ihtiyaçlara, ulaşım akslarına ve sosyal alanlara yakın konum kurgusuyla yaşamı kolaylaştıran bir proje deneyimi.",
    stats: [
      { label: "Ulaşım", value: "Yakın akslar" },
      { label: "Yaşam", value: "Merkezi çevre" }
    ],
    visualLabel: "Konum Analizi"
  },
  {
    id: "apartments",
    eyebrow: "03 / DAİRELER",
    title: "Farklı yaşam ihtiyaçlarına uygun planlar",
    description: "Aile yaşamı, kullanım kolaylığı ve uzun vadeli konfor düşünülerek geliştirilecek daire tipleri için esnek bir tanıtım yapısı.",
    stats: [
      { label: "Tipler", value: "2+1 / 3+1 / 4+1" },
      { label: "Plan", value: "Fonksiyonel" }
    ],
    visualLabel: "Kat Planları"
  },
  {
    id: "social",
    eyebrow: "04 / YAŞAM",
    title: "Günlük hayatı tamamlayan sosyal kurgu",
    description: "Peyzaj, ortak alanlar ve güvenli çevre hissiyle yalnızca konut değil, bütünlüklü bir yaşam atmosferi hedeflenir.",
    stats: [
      { label: "Alan", value: "Sosyal yaşam" },
      { label: "Hisset", value: "Aile odaklı" }
    ],
    visualLabel: "Sosyal Donatılar"
  },
  {
    id: "engineering",
    eyebrow: "05 / GÜVEN",
    title: "Planlı mühendislik yaklaşımı",
    description: "Yapı kararları; yönetmeliklere uygunluk, taşıyıcı sistem disiplini ve uzun ömürlü kullanım hedefiyle ele alınır.",
    stats: [
      { label: "Yaklaşım", value: "Teknik disiplin" },
      { label: "Odak", value: "Güven" }
    ],
    visualLabel: "Mühendislik"
  },
  {
    id: "contact",
    eyebrow: "06 / BİLGİ",
    title: "Projeyi yakından inceleyin",
    description: "Daire tipleri, teslim durumu ve satış süreci hakkında bilgi almak için iletişime geçebilirsiniz.",
    stats: [
      { label: "Aksiyon", value: "Bilgi al" },
      { label: "Kanal", value: "WhatsApp / Form" }
    ],
    visualLabel: "Satış Süreci"
  }
];
