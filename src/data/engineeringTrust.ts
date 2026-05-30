export type EngineeringItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  x: number; // For visual frame percentage coordinates
  y: number; // For visual frame percentage coordinates
};

export const engineeringItems: EngineeringItem[] = [
  {
    id: "ground",
    eyebrow: "01 / ZEMİN",
    title: "Zemin ve temel yaklaşımı",
    description: "Proje kararları, zemin verileri ve taşıyıcı sistem gereklilikleri birlikte ele alınarak planlanır.",
    metricLabel: "Odak",
    metricValue: "Temel güvenliği",
    x: 42,
    y: 78
  },
  {
    id: "structure",
    eyebrow: "02 / TAŞIYICI",
    title: "Taşıyıcı sistem disiplini",
    description: "Yapı kurgusu, mühendislik hesapları ve güncel yönetmeliklere uygunluk yaklaşımıyla değerlendirilir.",
    metricLabel: "Sistem",
    metricValue: "Betonarme kurgu",
    x: 48,
    y: 46
  },
  {
    id: "facade",
    eyebrow: "03 / CEPHE",
    title: "Cephe ve malzeme hissi",
    description: "Cephe kararları; kullanım, estetik, bakım ve uzun ömürlü görünüm hedefleriyle birlikte ele alınır.",
    metricLabel: "Detay",
    metricValue: "Cephe ritmi",
    x: 64,
    y: 34
  },
  {
    id: "insulation",
    eyebrow: "04 / YALITIM",
    title: "Konforu destekleyen yapı detayları",
    description: "Yalıtım, cephe ve iç mekân kararları; yaşam konforunu destekleyen bütünlüklü bir yaklaşım içinde düşünülür.",
    metricLabel: "Konfor",
    metricValue: "Isı / ses yaklaşımı",
    x: 36,
    y: 58
  },
  {
    id: "circulation",
    eyebrow: "05 / DOLAŞIM",
    title: "Günlük kullanım kolaylığı",
    description: "Ortak alanlar, otopark, giriş ve dolaşım kararları kullanıcı deneyimini kolaylaştıracak şekilde planlanır.",
    metricLabel: "Yaşam",
    metricValue: "Akış planı",
    x: 56,
    y: 66
  },
  {
    id: "control",
    eyebrow: "06 / KONTROL",
    title: "Planlı uygulama süreci",
    description: "Proje geliştirme ve uygulama sürecinde detay, koordinasyon ve kontrol adımları birlikte yönetilir.",
    metricLabel: "Süreç",
    metricValue: "Kontrol",
    x: 72,
    y: 52
  }
];
