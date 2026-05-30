export type DistrictInfo = {
  status: string;
  title: string;
  description: string;
  services: string[];
  projectTypes: string[];
  note: string;
};

export const districtInfoData: Record<string, DistrictInfo> = {
  Seyhan: {
    status: "Aktif Bölge",
    title: "Seyhan",
    description:
      "Prestijli kentsel konut projeleri ve modern iş merkezleri. Seyhan bölgesinde kentsel dönüşüm, mimari tasarım ve yüksek konforlu daire projeleri yürütüyoruz.",
    services: ["Mimari Tasarım", "Kentsel Dönüşüm", "Anahtar Teslim İnşaat"],
    projectTypes: ["Lüks Konut", "İş Merkezi", "Rezidans"],
    note: "Şehir merkezinde modern dönüşüm projeleri devam ediyor.",
  },
  Çukurova: {
    status: "Aktif Bölge",
    title: "Çukurova",
    description:
      "Doğa ve göl manzaralı lüks villa projeleri, bağımsız bahçeli yaşam alanları ve modern rezidans konseptleri ile seçkin yaşam projeleri geliştiriyoruz.",
    services: ["Villa Geliştirme", "İç Mimari Tasarım", "Peyzaj ve Çevre Düzeni"],
    projectTypes: ["Akıllı Villa", "Premium Rezidans", "Özel Yaşam Alanları"],
    note: "Çukurova aksında yeni nesil villa konseptleri.",
  },
  Yüreğir: {
    status: "Aktif Bölge",
    title: "Yüreğir",
    description:
      "Gelişen yaşam akslarında büyük konut projeleri, sosyal alan entegrasyonlu siteler ve modern ticari alanlar geliştirerek bölgeye değer katıyoruz.",
    services: ["Proje Geliştirme", "Kaba & İnce İnşaat", "Sosyal Donatı Planlama"],
    projectTypes: ["Toplu Konut", "Ticari Kompleks", "Sosyal Yaşam Alanı"],
    note: "Modern şehirleşme standartlarında planlı projeler.",
  },
  Sarıçam: {
    status: "Aktif Bölge",
    title: "Sarıçam",
    description:
      "Yeni nesil geniş oturumlu siteler, yeşil bina standartlarına uygun konut tasarımları ve planlı kentleşme ilkelerine dayanan konut projeleri tasarlıyoruz.",
    services: ["Sürdürülebilir Tasarım", "Mühendislik Çözümleri", "Saha Koordinasyonu"],
    projectTypes: ["Modern Site", "Enerji Etkin Konut", "Açık Yaşam Alanı"],
    note: "Üniversite ve yeni yerleşim bölgelerinde aktif keşif ve inşaat.",
  },
  Ceyhan: {
    status: "Bölgesel Hizmet",
    title: "Ceyhan",
    description:
      "Bölgesel ihtiyaçlara duyarlı konut projeleri, ticari yapılar ve kurumsal yapı çözümleriyle planlı inşaat faaliyetleri yürütüyoruz.",
    services: ["Yapı Keşif", "Mimari Uygulama", "Proje Danışmanlığı"],
    projectTypes: ["Konut Projesi", "Ticari Depolama", "Ofis Alanı"],
    note: "Planlı bölgesel keşif ve inşaat danışmanlığı desteği.",
  },
  Kozan: {
    status: "Bölgesel Hizmet",
    title: "Kozan",
    description:
      "Tarihi doku ve coğrafi koşullarla uyumlu modern bağ evleri, villa tasarımları ve dayanıklı kırsal konut projeleri hayata geçiriyoruz.",
    services: ["Konsept Tasarım", "Coğrafi Yapı Analizi", "Saha Denetimi"],
    projectTypes: ["Bağ Evi", "Müstakil Villa", "Butik Konut"],
    note: "Randevulu arsa analizi ve konsept tasarım desteği.",
  },
  Karataş: {
    status: "Proje Bazlı Hizmet",
    title: "Karataş",
    description:
      "Sahil şeridine özel, deniz iklimine, neme ve korozyona dayanıklı lüks yazlık konutlar ve butik villa projeleri tasarlayıp uyguluyoruz.",
    services: ["Malzeme Dayanım Analizi", "Yazlık Konsept Tasarım", "Uygulama"],
    projectTypes: ["Yazlık Villa", "Sahil Butik Konut", "Sosyal Tesis"],
    note: "Deniz iklimine uygun uzun ömürlü malzeme spesifikasyonları.",
  },
  Yumurtalık: {
    status: "Proje Bazlı Hizmet",
    title: "Yumurtalık",
    description:
      "Turizm ve deniz aksında yüksek yatırım değeri sunan, modern mimari dile sahip yazlık konut siteleri ve sahil villa projeleri planlıyoruz.",
    services: ["Yatırım Analizi", "Mimari Planlama", "Saha Kontrolü"],
    projectTypes: ["Sahil Sitesi", "Modern Yazlık", "Yatırım Yapıları"],
    note: "Proje bazlı arsa geliştirme ve konsept çalışmaları.",
  },
};

export const activeDistricts = Object.keys(districtInfoData);
