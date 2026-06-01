export const contactInfo = {
  address: "Huzurevleri Mah. 77246 Sk. Mehmet Tümer Apt. Zemin Kat No: 37 Çukurova / Adana",
  phone: "0 (533) 061 80 01",
  phoneHref: "tel:+905330618001",
  whatsapp: "+905330618001",
  whatsappHref:
    "https://wa.me/905330618001?text=Merhaba%2C%20Taner%20T%C3%BCmer%20%C4%B0n%C5%9Faat%20projeleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
  email: "info@tanertumerinsaat.com",
  emailHref: "mailto:info@tanertumerinsaat.com",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=Huzurevleri%20Mah.%2077246%20Sk.%20Mehmet%20T%C3%BCmer%20Apt.%20Zemin%20Kat%20No%3A%2037%20%C3%87ukurova%20Adana",
  mapEmbedSrc:
    "https://www.google.com/maps/d/embed?mid=1HXdI1gtwN-FPv-0w1K_nF_3c8BHaX5Vl&ehbc=2E312F",
  socials: [
    { name: "Facebook", href: "" },
    { name: "Instagram", href: "" },
    { name: "Youtube", href: "" },
  ],
} as const;

export const contactPageDefaults = {
  hero: {
    eyebrow: "İletişim & Proje Görüşmesi",
    title: "Projenizi Birlikte",
    highlight: "Konuşalım",
    description:
      "Villa, konut ve yaşam alanı projeleriniz için bizimle iletişime geçebilir; detaylı bilgi, keşif ve proje görüşmesi talebinizi iletebilirsiniz.",
  },
  quickActions: {
    actions: [
      {
        key: "phone",
        title: "Telefon",
        text: contactInfo.phone,
        linkText: "Hemen Ara",
      },
      {
        key: "whatsapp",
        title: "WhatsApp",
        text: "Proje detaylarınızı hızlıca paylaşın.",
        linkText: "WhatsApp'tan Yaz",
      },
      {
        key: "email",
        title: "E-posta",
        text: contactInfo.email,
        linkText: "E-posta Gönder",
      },
      {
        key: "location",
        title: "Konum",
        text: "Çukurova / Adana",
        linkText: "Yol Tarifi Al",
      },
    ],
  },
  intent: {
    title: "Size Nasıl Yardımcı Olabiliriz?",
    description: "İlgilendiğiniz konuyu seçerek formu hızlıca doldurabilirsiniz.",
    cards: [
      {
        id: "proje-bilgisi",
        title: "Proje Bilgisi",
        description:
          "Villa The Same, Tümerhan Twins ve Tümerhan Towers projeleri hakkında bilgi alın.",
        subject: "Proje hakkında bilgi almak istiyorum",
        projectType: "Satış / Detaylı Bilgi",
        icon: "building",
      },
      {
        id: "satis-gorusmesi",
        title: "Satış Görüşmesi",
        description:
          "Daire, villa veya yatırım seçenekleri için görüşme talebi oluşturun.",
        subject: "Satış görüşmesi talep ediyorum",
        projectType: "Satış / Detaylı Bilgi",
        icon: "key",
      },
      {
        id: "kesif-planlama",
        title: "Keşif & Planlama",
        description:
          "Yeni proje, arsa veya uygulama detaylarınız için ön görüşme başlatın.",
        subject: "Keşif ve planlama görüşmesi istiyorum",
        projectType: "Diğer",
        icon: "home",
      },
      {
        id: "kurumsal-iletisim",
        title: "Kurumsal İletişim",
        description: "Basın, iş birliği veya kurumsal taleplerinizi iletin.",
        subject: "Kurumsal iletişim talebi",
        projectType: "Diğer",
        icon: "mail",
      },
    ],
  },
  info: {
    title: "İletişim Bilgilerimiz",
    addressLabel: "Adres",
    phoneLabel: "Telefon",
    emailLabel: "E-posta",
    socialsTitle: "Sosyal Medya",
    mapTitle: "Bizi Ziyaret Edin",
    mapDescription:
      "Çukurova / Adana'daki ofisimize ulaşmak için yol tarifi alabilirsiniz.",
    mapButtonText: "Haritada Aç",
  },
  form: {
    title: "İletişime Geç",
    description:
      "Lütfen formu doldurun. Detayları görüşmek veya bir toplantı planlamak için sizinle iletişime geçeceğiz.",
    nameLabel: "Adınız *",
    namePlaceholder: "Adınız Soyadınız",
    phoneLabel: "Telefon Numaranız",
    phonePlaceholder: contactInfo.phone,
    emailLabel: "E-posta Adresiniz",
    emailPlaceholder: contactInfo.email,
    subjectLabel: "Konu *",
    subjectPlaceholder: "Proje hakkında bilgi almak istiyorum",
    projectTypeLabel: "Proje Türü",
    projectTypePlaceholder: "Seçiniz",
    regionLabel: "İlçe / Bölge",
    regionPlaceholder: "Seçiniz",
    messageLabel: "İletiniz",
    messagePlaceholder:
      "Talebinizi, ilgilendiğiniz projeyi veya görüşmek istediğiniz detayı yazabilirsiniz.",
    submitText: "Talebimi Gönder",
    helperText:
      "İlgilendiğiniz proje, bölge veya görüşmek istediğiniz konuyu belirttiğinizde ekibimiz sizinle daha hızlı ve doğru şekilde iletişime geçebilir.",
    successTitle: "Talebiniz alındı.",
    successText: "En kısa sürede sizinle iletişime geçeceğiz.",
    requiredError: "Lütfen zorunlu alanları (Adınız, Konu) doldurunuz.",
    contactError:
      "Lütfen size ulaşabilmemiz için telefon veya e-posta adresinden en az birini giriniz.",
    submitError:
      "Talebiniz gönderilemedi. Lütfen e-posta uygulamanız üzerinden gönderimi tamamlayın veya telefon/WhatsApp üzerinden bize ulaşın.",
    mailtoSubjectFallback: "İletişim Formu",
    projectTypeOptions: [
      "Villa Projesi",
      "Konut Projesi",
      "Tümerhan Twins",
      "Tümerhan Towers",
      "Villa The Same",
      "Satış / Detaylı Bilgi",
      "Diğer",
    ],
    regionOptions: [
      "Çukurova",
      "Seyhan",
      "Yüreğir",
      "Sarıçam",
      "Ceyhan",
      "Kozan",
      "Diğer",
    ],
  },
  process: {
    title: "Talebinizden Sonra Süreç Nasıl İlerler?",
    description:
      "İletişim taleplerinizi en kısa sürede, profesyonel bir şekilde yanıtlıyoruz.",
    steps: [
      {
        number: "01",
        title: "Talebinizi Alıyoruz",
        description: "Form, telefon veya WhatsApp üzerinden gelen talebinizi inceliyoruz.",
      },
      {
        number: "02",
        title: "Detayları Görüşüyoruz",
        description:
          "İlgilendiğiniz proje, ihtiyaçlarınız ve uygun görüşme zamanı netleştiriliyor.",
      },
      {
        number: "03",
        title: "Size Dönüş Sağlıyoruz",
        description:
          "Proje detayları, uygunluk ve sonraki adımlar için sizinle iletişime geçiyoruz.",
      },
    ],
  },
  cta: {
    title: "Projeniz için doğru başlangıcı birlikte yapalım.",
    description:
      "Villa, konut veya yatırım projeniz hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.",
    phoneButtonText: "Hemen Ara",
    whatsappButtonText: "WhatsApp'tan Yaz",
  },
} as const;
