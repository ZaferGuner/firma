export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  imageCount: number;
  coverImage: string;
  imagesFolder: string;
  shortDescription: string;
  description: string;
  features: string[];
};

export const categories = [
  "Tümü",
  "Villa Projeleri",
  "Konut Projeleri"
];

export const projects: Project[] = [
  {
    id: "villa-the-same",
    slug: "villa-the-same",
    title: "Villa The Same",
    category: "Villa Projesi",
    location: "Adana",
    imageCount: 25,
    coverImage: "/projects/villa-the-same/01.jpg",
    imagesFolder: "/projects/villa-the-same",
    shortDescription:
      "Modern villa yaşamı için tasarlanan, konfor ve teknolojiyi bir araya getiren özel yaşam projesi.",
    description:
      "Villa The Same; özel araç girişi, geniş kullanım alanları ve akıllı ev altyapısıyla modern villa yaşamına odaklanan seçkin bir projedir.",
    features: [
      "Her eve 2 araçlık otopark ve araç girişi",
      "Akıllı ev sistemleri"
    ]
  },
  {
    id: "tumerhan-twins",
    slug: "tumerhan-twins",
    title: "Tümerhan Twins",
    category: "Villa Projesi",
    location: "Adana",
    imageCount: 24,
    coverImage: "/projects/tumerhan-twins/01.jpg",
    imagesFolder: "/projects/tumerhan-twins",
    shortDescription:
      "Bağımsız bahçe, sosyal alanlar ve yüksek konfor standartlarıyla planlanan özel villa yaşam alanı.",
    description:
      "Tümerhan Twins; geniş villa planı, bağımsız bahçe kullanımı, sosyal donatılar ve modern teknik altyapısıyla konforlu bir yaşam standardı sunar.",
    features: [
      "Her eve 2 araçlık otopark ve araç girişi",
      "Akıllı ev sistemleri",
      "Yerden ısıtma",
      "Güvenlik kameraları",
      "Havuz",
      "Elektrikli araç şarj istasyonu",
      "Merkezi lokasyon",
      "Basketbol sahası",
      "Havuzbaşı kafeterya",
      "Her eve bağımsız bahçe",
      "Merkezi klima",
      "GES altyapısı",
      "5+1 tüm villalar",
      "5'li ankastre",
      "Dış cephe mekanik kaplama"
    ]
  },
  {
    id: "tumerhan-towers",
    slug: "tumerhan-towers",
    title: "Tümerhan Towers",
    category: "Konut Projesi",
    location: "Adana",
    imageCount: 6,
    coverImage: "/projects/tumerhan-towers/01.jpg",
    imagesFolder: "/projects/tumerhan-towers",
    shortDescription:
      "Geniş kapalı mutfak, kaliteli iç mekan malzemeleri ve modern detaylarla tasarlanmış konut projesi.",
    description:
      "Tümerhan Towers; fonksiyonel daire planı, kaliteli marka tercihleri ve detaylı iç mimari uygulamalarıyla modern konut yaşamı için tasarlanmıştır.",
    features: [
      "3+1 geniş kapalı mutfak",
      "Üçlü ankastre set",
      "Quartz mutfak tezgahı",
      "ECA armatürler",
      "Baymak radyatörler",
      "Multi klima sistemine uygun tesisat",
      "Vario Exclusive derzli parke",
      "Egepen PVC doğramalar ve aksesuarlar",
      "Özel tasarım gizli ledli asma tavanlar",
      "Filli Momento Max iç cephe boyası",
      "Kütahya 60x120 seramik",
      "Özel tasarım lake mutfak dolapları",
      "Özel tasarım lake vestiyer",
      "Özel tasarım lake kapılar",
      "Özel tasarım lake banyo dolapları",
      "Ebeveyn banyosu",
      "Giyinme odası",
      "Misafir WC"
    ]
  }
];
