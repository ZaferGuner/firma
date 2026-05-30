export type FloorPlanArea = {
  id: string;
  label: string;
  value?: string;
};

export type FloorPlan = {
  id: string;
  label: string;
  title: string;
  description: string;
  size: string;
  rooms: string;
  orientation: string;
  balcony: string;
  features: string[];
  areas: FloorPlanArea[];
};

export const floorPlans: FloorPlan[] = [
  {
    id: "2-1",
    label: "2+1",
    title: "Kompakt ve fonksiyonel yaşam planı",
    description: "Günlük yaşamı kolaylaştıran, aile ve yatırım odaklı dengeli bir örnek plan kurgusu.",
    size: "95–115 m² (Yaklaşık)",
    rooms: "2 Oda + 1 Salon",
    orientation: "Şehir / Peyzaj",
    balcony: "Var",
    features: [
      "Fonksiyonel salon",
      "Ayrı mutfak kurgusu",
      "Balkon kullanımı",
      "Verimli metrekare"
    ],
    areas: [
      { id: "living", label: "Salon", value: "28 m²" },
      { id: "kitchen", label: "Mutfak", value: "11 m²" },
      { id: "master", label: "Yatak Odası", value: "14 m²" },
      { id: "room1", label: "Oda", value: "10 m²" },
      { id: "balcony", label: "Balkon", value: "6 m²" }
    ]
  },
  {
    id: "3-1",
    label: "3+1",
    title: "Aile yaşamı için dengeli plan",
    description: "Geniş yaşam alanları, oda dağılımı ve günlük kullanım kolaylığı düşünülerek tasarlanmış örnek plan yaklaşımı.",
    size: "135–165 m² (Yaklaşık)",
    rooms: "3 Oda + 1 Salon",
    orientation: "Cephe alternatifleri",
    balcony: "Geniş balkon",
    features: [
      "Geniş salon",
      "Ebeveyn odası",
      "Çocuk odaları",
      "Depolama alanı"
    ],
    areas: [
      { id: "living", label: "Salon", value: "35 m²" },
      { id: "kitchen", label: "Mutfak", value: "14 m²" },
      { id: "master", label: "Ebeveyn Odası", value: "18 m²" },
      { id: "room1", label: "Çocuk Odası", value: "12 m²" },
      { id: "room2", label: "Oda", value: "11 m²" },
      { id: "balcony", label: "Balkon", value: "8 m²" }
    ]
  },
  {
    id: "4-1",
    label: "4+1",
    title: "Geniş aileler için ferah yaşam",
    description: "Daha geniş kullanım ihtiyacı olan aileler için ferahlık, mahremiyet ve fonksiyonelliği bir araya getiren bilgi amaçlı plan.",
    size: "175–210 m² (Yaklaşık)",
    rooms: "4 Oda + 1 Salon",
    orientation: "Geniş cephe",
    balcony: "Çift balkon opsiyonu",
    features: [
      "Geniş salon",
      "Ebeveyn alanı",
      "Çok amaçlı oda",
      "Ferah dolaşım alanı"
    ],
    areas: [
      { id: "living", label: "Salon", value: "42 m²" },
      { id: "kitchen", label: "Mutfak", value: "16 m²" },
      { id: "master", label: "Ebeveyn Odası", value: "22 m²" },
      { id: "room1", label: "Oda 1", value: "14 m²" },
      { id: "room2", label: "Oda 2", value: "12 m²" },
      { id: "room3", label: "Oda 3", value: "12 m²" },
      { id: "balcony", label: "Balkon", value: "10 m²" }
    ]
  }
];
