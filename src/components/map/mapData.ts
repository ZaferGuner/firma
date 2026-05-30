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
      "Kentsel dönüşüm ve lüks konut projeleri odağımız. Seyhan ilçesinde depreme dayanıklı, modern daire ve prestijli iş merkezi inşaatları yürütmekteyiz.",
    services: ["Mimari Tasarım", "Kentsel Dönüşüm", "Anahtar Teslim İnşaat"],
    projectTypes: ["Lüks Konut", "İş Merkezi", "Rezidans"],
    note: "Şehir merkezinde modern kentsel dönüşüm projelerimiz sürüyor.",
  },
  Çukurova: {
    status: "Aktif Bölge",
    title: "Çukurova",
    description:
      "Seçkin villa projeleri ve göl manzaralı lüks rezidans konseptleri geliştiriyoruz. Çukurova aksında doğayla dost ve akıllı ev altyapısına sahip projelerimiz yer almaktadır.",
    services: ["Villa Geliştirme", "İç Mimari Tasarım", "Peyzaj ve Çevre Düzeni"],
    projectTypes: ["Akıllı Villa", "Premium Rezidans", "Özel Yaşam Alanları"],
    note: "Bölgede lüks müstakil villa yatırımlarımız devam ediyor.",
  },
  Yüreğir: {
    status: "Aktif Bölge",
    title: "Yüreğir",
    description:
      "Bölgesel gelişim alanlarında geniş planlı konut projeleri, sosyal alan entegrasyonlu modern siteler ve ticari alanlar geliştirerek katma değer sağlıyoruz.",
    services: ["Proje Tasarımı", "Kaba & İnce İnşaat", "Sosyal Donatı Planlama"],
    projectTypes: ["Toplu Konut", "Ticari Yapı", "Sosyal Yaşam Alanı"],
    note: "Şehirleşme standartlarında planlı konut projeleri geliştirilmektedir.",
  },
  Sarıçam: {
    status: "Aktif Bölge",
    title: "Sarıçam",
    description:
      "Gelişen konut alanlarında yeni nesil geniş oturumlu site yapıları, enerji etkin yeşil bina tasarımları ve modern aile konutları planlıyoruz.",
    services: ["Sürdürülebilir Tasarım", "Mühendislik Çözümleri", "Saha Koordinasyonu"],
    projectTypes: ["Modern Site", "Enerji Etkin Konut", "Geniş Aile Daireleri"],
    note: "Yeni yerleşim bölgelerinde aktif keşif ve inşaat faaliyetleri.",
  },
  Ceyhan: {
    status: "Bölgesel Hizmet",
    title: "Ceyhan",
    description:
      "Bölgesel ihtiyaçlara göre şekillendirilmiş konut projeleri, ofis yapıları ve kurumsal inşaat çözümleri sunuyoruz.",
    services: ["Yapı Keşif", "Mimari Uygulama", "İnşaat Danışmanlığı"],
    projectTypes: ["Konut Projesi", "Ofis Alanı", "Ticari Yapı"],
    note: "Planlı bölgesel etüt ve mimari danışmanlık hizmeti.",
  },
  Kozan: {
    status: "Bölgesel Hizmet",
    title: "Kozan",
    description:
      "Coğrafi koşullara ve bölgenin tarihi dokusuna uyumlu modern bağ evleri, butik müstakil villalar ve sağlam konut projeleri inşa ediyoruz.",
    services: ["Konsept Tasarım", "Coğrafi Yapı Analizi", "Saha Denetimi"],
    projectTypes: ["Bağ Evi", "Müstakil Villa", "Butik Konut"],
    note: "Randevulu arsa analizi ve konsept villa tasarımı desteği.",
  },
  Karataş: {
    status: "Proje Bazlı Hizmet",
    title: "Karataş",
    description:
      "Sahil şeridine özel, nemli deniz iklimine ve korozyona yüksek dayanım gösteren lüks yazlık yapılar, butik villa projeleri tasarlıyoruz.",
    services: ["Malzeme Dayanım Analizi", "Yazlık Konsept Tasarım", "Uygulama"],
    projectTypes: ["Yazlık Villa", "Sahil Butik Konut", "Sosyal Tesis"],
    note: "Deniz iklimine uygun uzun ömürlü malzeme spesifikasyonları kullanılır.",
  },
  Yumurtalık: {
    status: "Proje Bazlı Hizmet",
    title: "Yumurtalık",
    description:
      "Yatırım değeri yüksek sahil villaları, modern yazlık siteler ve turizm aksında uzun ömürlü butik tatil konutları tasarlayıp hayata geçiriyoruz.",
    services: ["Yatırım Analizi", "Mimari Planlama", "Saha Kontrolü"],
    projectTypes: ["Sahil Sitesi", "Modern Yazlık", "Yatırım Yapıları"],
    note: "Proje bazlı arsa geliştirme ve konsept çalışmaları yürütülür.",
  },
};

export const activeDistricts = Object.keys(districtInfoData);
export const highlightedPins = [];
