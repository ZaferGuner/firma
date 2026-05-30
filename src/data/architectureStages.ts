export type ArchitectureStage = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  progressLabel: string;
};

export const architectureStages: ArchitectureStage[] = [
  {
    id: "ground",
    eyebrow: "01 / ARAZİ",
    title: "Mekanın topografyası",
    description: "Doğru bir mimari kurgu, arazinin karakteristik özelliklerini anlamak ve ona uyum sağlamakla başlar.",
    progressLabel: "Arazi"
  },
  {
    id: "foundation",
    eyebrow: "02 / TEMEL",
    title: "Yapının ilk güven katmanı",
    description: "Her proje, zemin ve taşıyıcı sistem kararlarının birlikte ele alındığı planlı bir süreçle şekillenir.",
    progressLabel: "Temel"
  },
  {
    id: "structure",
    eyebrow: "03 / TAŞIYICI",
    title: "Statik ve güvenliğin omurgası",
    description: "Mimari tasarım, deprem standartlarına uygun güçlü bir kolon ve kiriş sistemi üzerinde yükselir.",
    progressLabel: "Taşıyıcı"
  },
  {
    id: "floors",
    eyebrow: "04 / KATLAR",
    title: "Yaşam alanlarının organizasyonu",
    description: "Plan kurgusu, her katta maksimum verimlilik ve konfor sağlayacak şekilde özenle tasarlanır.",
    progressLabel: "Katlar"
  },
  {
    id: "facade",
    eyebrow: "05 / CEPHE",
    title: "Karakteristik dış kabuk",
    description: "Estetik detaylar, dayanıklı materyallerle buluşarak yapının özgün ve modern kimliğini oluşturur.",
    progressLabel: "Cephe"
  },
  {
    id: "glass",
    eyebrow: "06 / IŞIK",
    title: "Doğal aydınlatma",
    description: "Geniş cam yüzeyler, mekanları doğal ışıkla buluştururken ferah ve nefes alan iç hacimler yaratır.",
    progressLabel: "Işık"
  },
  {
    id: "living",
    eyebrow: "07 / YAŞAM",
    title: "Son dokunuş",
    description: "İnce detaylar, sıcak dokular ve peyzaj alanları ile yapı, yaşanabilir bir yuvaya dönüşür.",
    progressLabel: "Yaşam"
  }
];
