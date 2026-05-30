export type LocationPoint = {
  id: string;
  label: string;
  category: string;
  time: string;
  description: string;
  x: number; // Percentage coordinate (0-100)
  y: number; // Percentage coordinate (0-100)
};

export const locationPoints: LocationPoint[] = [
  {
    id: "project",
    label: "Tümerhan Towers",
    category: "Proje",
    time: "Merkez",
    description: "Projenin şehir içindeki ana yaşam noktası.",
    x: 50,
    y: 52
  },
  {
    id: "main-road",
    label: "Ana ulaşım aksı",
    category: "Ulaşım",
    time: "Yaklaşık 2 dk",
    description: "Günlük ulaşımı kolaylaştıran bağlantı noktası.",
    x: 68,
    y: 46
  },
  {
    id: "school",
    label: "Eğitim noktaları",
    category: "Eğitim",
    time: "Yaklaşık 4 dk",
    description: "Yakın çevrede eğitim ve günlük ihtiyaç alanları.",
    x: 38,
    y: 36
  },
  {
    id: "hospital",
    label: "Sağlık alanları",
    category: "Sağlık",
    time: "Yaklaşık 6 dk",
    description: "Sağlık ve acil ihtiyaçlara erişim kolaylığı.",
    x: 62,
    y: 64
  },
  {
    id: "shopping",
    label: "Alışveriş / sosyal alan",
    category: "Sosyal",
    time: "Yaklaşık 8 dk",
    description: "Günlük yaşamı destekleyen sosyal ve ticari çevre.",
    x: 29,
    y: 61
  },
  {
    id: "park",
    label: "Yeşil alan",
    category: "Yaşam",
    time: "Yaklaşık 5 dk",
    description: "Açık alan ve sosyal yaşam hissini destekleyen çevre.",
    x: 72,
    y: 28
  }
];
