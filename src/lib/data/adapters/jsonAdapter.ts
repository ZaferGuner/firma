import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { IDataLayer } from "../IDataLayer";
import { hashPassword } from "../../auth";
import { contactPageDefaults } from "../../../data/contact";
import { pressPageDefaults } from "../../../data/press";

// Path to the development JSON database
const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "db.json");

interface DbSchema {
  adminUsers: Array<{
    id: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  }>;
  contentSections: Array<{
    id: string;
    pageKey: string;
    sectionKey: string;
    label: string;
    dataJson: any;
    updatedAt: string;
  }>;
  contentDrafts: Array<{
    id: string;
    pageKey: string;
    sectionKey: string;
    dataJson: any;
    updatedAt: string;
  }>;
  projects: Array<{
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
    gallery: string[];
    featured: boolean;
    published: boolean;
    order: number;
    ctaText?: string;
    ctaBtnText?: string;
    ctaBtnLink?: string;

    // Özel Proje Ön Gösterim Alanları
    specialPreviewEnabled?: boolean;
    specialPreviewNoIndex?: boolean;
    specialPreviewAccessMode?: string;
    specialPreviewTitle?: string;
    specialPreviewSubtitle?: string;
    specialPreviewIntro?: string;
    specialPreviewStatus?: string;
    specialPreviewAccessLabel?: string;
    specialPreviewSections?: any;
    specialPreviewHighlights?: string[];
    specialPreviewBlueprintNotes?: any;
    specialPreviewTextureNotes?: any;
    specialPreviewCtaTitle?: string;
    specialPreviewCtaText?: string;
    specialPreviewCtaButtonLabel?: string;

    updatedAt: string;
  }>;
  projectDrafts: Array<{
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
    gallery: string[];
    featured: boolean;
    published: boolean;
    order: number;
    ctaText?: string;
    ctaBtnText?: string;
    ctaBtnLink?: string;

    // Özel Proje Ön Gösterim Alanları
    specialPreviewEnabled?: boolean;
    specialPreviewNoIndex?: boolean;
    specialPreviewAccessMode?: string;
    specialPreviewTitle?: string;
    specialPreviewSubtitle?: string;
    specialPreviewIntro?: string;
    specialPreviewStatus?: string;
    specialPreviewAccessLabel?: string;
    specialPreviewSections?: any;
    specialPreviewHighlights?: string[];
    specialPreviewBlueprintNotes?: any;
    specialPreviewTextureNotes?: any;
    specialPreviewCtaTitle?: string;
    specialPreviewCtaText?: string;
    specialPreviewCtaButtonLabel?: string;

    updatedAt: string;
  }>;
  pressItems: Array<{
    id: string;
    title: string;
    source: string;
    date: string;
    type: string;
    description: string;
    image?: string;
    url?: string;
    featured?: boolean;
    published?: boolean;
    order?: number;
    updatedAt: string;
  }>;
  pressDrafts: Array<{
    id: string;
    title: string;
    source: string;
    date: string;
    type: string;
    description: string;
    image?: string;
    url?: string;
    featured?: boolean;
    published?: boolean;
    order?: number;
    updatedAt: string;
  }>;
  inquiries: Array<{
    id: string;
    name: string;
    phone?: string;
    email?: string;
    subject: string;
    projectType?: string;
    district?: string;
    message: string;
    status: string;
    source: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  updatedAt: string;
}

export class JsonAdapter implements IDataLayer {
  private async readDb(): Promise<DbSchema> {
    try {
      const content = await fs.readFile(DB_FILE_PATH, "utf8");
      const db = JSON.parse(content);
      // Backwards-compatibility checks to avoid undefined keys
      db.adminUsers = db.adminUsers || [];
      db.contentSections = db.contentSections || [];
      db.contentDrafts = db.contentDrafts || [];
      db.projects = db.projects || [];
      db.projectDrafts = db.projectDrafts || [];
      db.pressItems = db.pressItems || [];
      db.pressDrafts = db.pressDrafts || [];
      db.inquiries = db.inquiries || [];
      return db;
    } catch (error) {
      // If file doesn't exist, we will seed it during seedDatabase()
      return {
        adminUsers: [],
        contentSections: [],
        contentDrafts: [],
        projects: [],
        projectDrafts: [],
        pressItems: [],
        pressDrafts: [],
        inquiries: [],
        updatedAt: new Date().toISOString(),
      };
    }
  }

  private async writeDb(db: DbSchema): Promise<void> {
    const dir = path.dirname(DB_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf8");
  }

  // --- Content Sections Management ---

  async getSectionContent(pageKey: string, sectionKey: string): Promise<any | null> {
    await this.seedDatabase(); // Ensure DB is loaded/seeded
    const db = await this.readDb();
    const section = db.contentSections.find(
      (s) => s.pageKey === pageKey && s.sectionKey === sectionKey
    );
    return section ? section.dataJson : null;
  }

  async getDraftContent(pageKey: string, sectionKey: string): Promise<any | null> {
    await this.seedDatabase();
    const db = await this.readDb();
    const draft = db.contentDrafts.find(
      (d) => d.pageKey === pageKey && d.sectionKey === sectionKey
    );
    if (draft) {
      return draft.dataJson;
    }
    // Fallback to published section content if no draft exists
    return this.getSectionContent(pageKey, sectionKey);
  }

  async saveDraftContent(pageKey: string, sectionKey: string, data: any): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();
    
    const draftIndex = db.contentDrafts.findIndex(
      (d) => d.pageKey === pageKey && d.sectionKey === sectionKey
    );

    const draftEntry = {
      id: crypto.randomUUID(),
      pageKey,
      sectionKey,
      dataJson: data,
      updatedAt: new Date().toISOString(),
    };

    if (draftIndex > -1) {
      db.contentDrafts[draftIndex] = draftEntry;
    } else {
      db.contentDrafts.push(draftEntry);
    }

    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }

  // --- Projects Management ---

  async getProjects(onlyPublished?: boolean): Promise<any[]> {
    await this.seedDatabase();
    const db = await this.readDb();
    let list = db.projects;
    if (onlyPublished) {
      list = list.filter((p) => p.published);
    }
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getProjectsDrafts(): Promise<any[]> {
    await this.seedDatabase();
    const db = await this.readDb();
    
    // Fallback to published projects, overridden by draft projects where matching slug
    const list = db.projects.map((p) => {
      const draft = db.projectDrafts.find((d) => d.slug === p.slug);
      return draft || p;
    });

    // Check for brand new projects that only exist as drafts
    db.projectDrafts.forEach((draft) => {
      if (!db.projects.some((p) => p.slug === draft.slug)) {
        list.push(draft);
      }
    });

    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getProjectBySlug(slug: string): Promise<any | null> {
    await this.seedDatabase();
    const db = await this.readDb();
    const project = db.projects.find((p) => p.slug === slug);
    return project || null;
  }

  async getProjectDraft(slug: string): Promise<any | null> {
    await this.seedDatabase();
    const db = await this.readDb();
    const draft = db.projectDrafts.find((d) => d.slug === slug);
    if (draft) {
      return draft;
    }
    return this.getProjectBySlug(slug);
  }

  async saveProjectDraft(slug: string, data: any): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();
    
    const draftIndex = db.projectDrafts.findIndex((d) => d.slug === slug);
    const draftEntry = {
      ...data,
      slug, // Ensure slug matches target
      updatedAt: new Date().toISOString(),
    };

    if (draftIndex > -1) {
      db.projectDrafts[draftIndex] = draftEntry;
    } else {
      db.projectDrafts.push(draftEntry);
    }

    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }

  async addProject(project: any): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();

    // Check for unique slug
    const exists = db.projects.some((p) => p.slug === project.slug) || 
                   db.projectDrafts.some((d) => d.slug === project.slug);
    if (exists) {
      throw new Error(`Slug '${project.slug}' benzersiz olmalıdır. Bu slug başka bir proje tarafından kullanılıyor.`);
    }

    // Add to project drafts (so it stays a draft and is not public until published)
    const newDraftProject = {
      id: crypto.randomUUID(),
      title: project.title,
      slug: project.slug,
      category: project.category,
      location: project.location,
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      coverImage: project.coverImage || "/projects/villa-the-same/01.jpg",
      imagesFolder: project.imagesFolder || `/projects/${project.slug}`,
      imageCount: project.imageCount || 1,
      featured: project.featured ?? false,
      published: project.published ?? false,
      order: project.order ?? (db.projects.length + 1),
      features: project.features || [],
      gallery: project.gallery || [project.coverImage || "/projects/villa-the-same/01.jpg"],
      ctaText: project.ctaText || "Yeni yaşam alanınızı birlikte planlayalım.",
      ctaBtnText: project.ctaBtnText || "Bilgi Al",
      ctaBtnLink: project.ctaBtnLink || "/iletisim",

      // Özel Proje Ön Gösterim Alanları
      specialPreviewEnabled: project.specialPreviewEnabled ?? false,
      specialPreviewNoIndex: project.specialPreviewNoIndex ?? true,
      specialPreviewAccessMode: project.specialPreviewAccessMode || "public",
      specialPreviewTitle: project.specialPreviewTitle || "",
      specialPreviewSubtitle: project.specialPreviewSubtitle || "",
      specialPreviewIntro: project.specialPreviewIntro || "",
      specialPreviewStatus: project.specialPreviewStatus || "",
      specialPreviewAccessLabel: project.specialPreviewAccessLabel || "",
      specialPreviewSections: project.specialPreviewSections || {},
      specialPreviewHighlights: project.specialPreviewHighlights || [],
      specialPreviewBlueprintNotes: project.specialPreviewBlueprintNotes || [],
      specialPreviewTextureNotes: project.specialPreviewTextureNotes || [],
      specialPreviewCtaTitle: project.specialPreviewCtaTitle || "",
      specialPreviewCtaText: project.specialPreviewCtaText || "",
      specialPreviewCtaButtonLabel: project.specialPreviewCtaButtonLabel || "",

      updatedAt: new Date().toISOString(),
    };

    db.projectDrafts.push(newDraftProject);
    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }

  // --- Press Items Management ---

  async getPressItems(onlyPublished = true): Promise<any[]> {
    await this.seedDatabase();
    const db = await this.readDb();
    let list = db.pressItems || [];
    if (onlyPublished) {
      list = list.filter((item) => item.published);
    }
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getPressDrafts(): Promise<any[]> {
    await this.seedDatabase();
    const db = await this.readDb();

    const list = (db.pressItems || []).map((item) => {
      const draft = db.pressDrafts.find((draftItem) => draftItem.id === item.id);
      return draft || item;
    });

    db.pressDrafts.forEach((draft) => {
      if (!db.pressItems.some((item) => item.id === draft.id)) {
        list.push(draft);
      }
    });

    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async savePressDraft(id: string, data: any): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();

    const draftIndex = db.pressDrafts.findIndex((item) => item.id === id);
    const draftEntry = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    if (draftIndex > -1) {
      db.pressDrafts[draftIndex] = draftEntry;
    } else {
      db.pressDrafts.push(draftEntry);
    }

    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }

  async addPressItem(item: any): Promise<any> {
    await this.seedDatabase();
    const db = await this.readDb();

    const id = item.id || crypto.randomUUID();
    const exists =
      db.pressItems.some((pressItem) => pressItem.id === id) ||
      db.pressDrafts.some((pressItem) => pressItem.id === id);

    if (exists) {
      throw new Error(`Basın içerik kimliği '${id}' benzersiz olmalıdır.`);
    }

    const newDraftItem = {
      id,
      title: item.title || "",
      source: item.source || "",
      date: item.date || "",
      type: item.type || "Duyuru",
      description: item.description || "",
      image: item.image || "",
      url: item.url || "",
      featured: item.featured ?? false,
      published: item.published ?? false,
      order: item.order ?? ((db.pressItems?.length || 0) + (db.pressDrafts?.length || 0) + 1),
      updatedAt: new Date().toISOString(),
    };

    db.pressDrafts.push(newDraftItem);
    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);

    return newDraftItem;
  }

  // --- Inquiries Management ---

  async getInquiries(): Promise<any[]> {
    await this.seedDatabase();
    const db = await this.readDb();
    // Sort by createdAt descending (newest first)
    return (db.inquiries || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async addInquiry(inquiry: any): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();

    db.inquiries.push({
      id: crypto.randomUUID(),
      name: inquiry.name || "",
      phone: inquiry.phone || "",
      email: inquiry.email || "",
      subject: inquiry.subject || "Genel Bilgi",
      projectType: inquiry.projectType || "Diğer",
      district: inquiry.district || "Belirtilmedi",
      message: inquiry.message || "",
      status: "Yeni",
      source: "contact-form",
      note: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }

  async updateInquiry(id: string, updates: any): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();

    const inquiryIndex = db.inquiries.findIndex((i) => i.id === id);
    if (inquiryIndex === -1) {
      throw new Error("Talep bulunamadı.");
    }

    db.inquiries[inquiryIndex] = {
      ...db.inquiries[inquiryIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }

  // --- Global Transactions ---

  async commitDrafts(): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();
    
    // 1. Simulate transactional reliability using deep-copy clones
    const dbBackup = JSON.parse(JSON.stringify(db));

    try {
      // A. Merge content section drafts
      for (const draft of db.contentDrafts) {
        const sectionIndex = db.contentSections.findIndex(
          (s) => s.pageKey === draft.pageKey && s.sectionKey === draft.sectionKey
        );

        const updatedSection = {
          id: db.contentSections[sectionIndex]?.id || crypto.randomUUID(),
          pageKey: draft.pageKey,
          sectionKey: draft.sectionKey,
          label: `${draft.pageKey}.${draft.sectionKey} section`,
          dataJson: draft.dataJson,
          updatedAt: new Date().toISOString(),
        };

        if (sectionIndex > -1) {
          db.contentSections[sectionIndex] = updatedSection;
        } else {
          db.contentSections.push(updatedSection);
        }
      }

      // B. Merge projects drafts
      for (const draft of db.projectDrafts) {
        const projectIndex = db.projects.findIndex((p) => p.slug === draft.slug);
        
        const updatedProject = {
          ...draft,
          updatedAt: new Date().toISOString(),
        };

        if (projectIndex > -1) {
          db.projects[projectIndex] = updatedProject;
        } else {
          db.projects.push(updatedProject);
        }
      }

      // C. Merge press item drafts
      for (const draft of db.pressDrafts) {
        const pressIndex = db.pressItems.findIndex((item) => item.id === draft.id);

        const updatedPressItem = {
          ...draft,
          updatedAt: new Date().toISOString(),
        };

        if (pressIndex > -1) {
          db.pressItems[pressIndex] = updatedPressItem;
        } else {
          db.pressItems.push(updatedPressItem);
        }
      }

      // 3. Clear draft states after successful transactional commit
      db.contentDrafts = [];
      db.projectDrafts = [];
      db.pressDrafts = [];
      db.updatedAt = new Date().toISOString();

      await this.writeDb(db);
    } catch (error) {
      // 4. Roll back database completely if any error occurs
      await this.writeDb(dbBackup);
      throw new Error(
        `Transactional commit failed: ${error instanceof Error ? error.message : String(error)}. Database rolled back.`
      );
    }
  }

  async discardDrafts(): Promise<void> {
    await this.seedDatabase();
    const db = await this.readDb();
    db.contentDrafts = [];
    db.projectDrafts = [];
    db.pressDrafts = [];
    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }

  async getAdminUser(email: string): Promise<{ id: string; email: string; passwordHash: string } | null> {
    await this.seedDatabase();
    const db = await this.readDb();
    const user = db.adminUsers.find((u) => u.email === email);
    return user || null;
  }

  async seedDatabase(): Promise<void> {
    let fileExists = false;
    try {
      await fs.access(DB_FILE_PATH);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    const db = await this.readDb();

    // Check if admin needs seeding, page sections need seeding, or projects need seeding
    const needsAdminSeed = db.adminUsers.length === 0;
    const needsContentSeed = db.contentSections.length === 0;
    const needsProjectsSeed = db.projects.length === 0;
    const phase3Sections = [
      { pageKey: "contact", sectionKey: "hero", label: "Contact Page Hero Section", dataJson: contactPageDefaults.hero },
      { pageKey: "contact", sectionKey: "quickActions", label: "Contact Quick Actions Section", dataJson: contactPageDefaults.quickActions },
      { pageKey: "contact", sectionKey: "intent", label: "Contact Intent Cards Section", dataJson: contactPageDefaults.intent },
      { pageKey: "contact", sectionKey: "info", label: "Contact Info Section", dataJson: contactPageDefaults.info },
      { pageKey: "contact", sectionKey: "form", label: "Contact Form Section", dataJson: contactPageDefaults.form },
      { pageKey: "contact", sectionKey: "process", label: "Contact Process Section", dataJson: contactPageDefaults.process },
      { pageKey: "contact", sectionKey: "cta", label: "Contact CTA Section", dataJson: contactPageDefaults.cta },
      { pageKey: "press", sectionKey: "hero", label: "Press Page Hero Section", dataJson: pressPageDefaults.hero },
      { pageKey: "press", sectionKey: "empty", label: "Press Empty State Section", dataJson: pressPageDefaults.empty },
      { pageKey: "press", sectionKey: "mediaKit", label: "Press Media Kit Section", dataJson: pressPageDefaults.mediaKit },
      { pageKey: "press", sectionKey: "projectsCta", label: "Press Projects CTA Section", dataJson: pressPageDefaults.projectsCta },
      { pageKey: "press", sectionKey: "finalCta", label: "Press Final CTA Section", dataJson: pressPageDefaults.finalCta },
    ];
    const needsPhase3ContentSeed = phase3Sections.some(
      (section) =>
        !db.contentSections.some(
          (existing) =>
            existing.pageKey === section.pageKey && existing.sectionKey === section.sectionKey
        )
    );

    const phase4Sections = [
      {
        pageKey: "global",
        sectionKey: "settings",
        label: "Site Ayarları",
        dataJson: {
          siteName: "Taner Tümer İnşaat",
          headerCtaText: "Bilgi Al",
          headerCtaLink: "/iletisim",
          footerDescription: "Geleceği sağlam temeller üzerine inşa ediyoruz. Güven, kalite ve estetik bir arada.",
          footerCopyright: "© 2026 Taner Tümer İnşaat. Tüm hakları saklıdır.",
          defaultOgImage: "/og-image.jpg"
        }
      },
      {
        pageKey: "seo",
        sectionKey: "home",
        label: "Ana Sayfa SEO",
        dataJson: { title: "Ana Sayfa | Taner Tümer İnşaat", description: "Adana'nın güvenilir inşaat firması Taner Tümer İnşaat ile geleceği inşa ediyoruz.", ogImage: "", noIndex: false }
      },
      {
        pageKey: "seo",
        sectionKey: "projects",
        label: "Projeler SEO",
        dataJson: { title: "Projelerimiz | Taner Tümer İnşaat", description: "Tamamlanan ve devam eden projelerimizi inceleyin.", ogImage: "", noIndex: false }
      },
      {
        pageKey: "seo",
        sectionKey: "contact",
        label: "İletişim SEO",
        dataJson: { title: "İletişim | Taner Tümer İnşaat", description: "Bize ulaşın ve projelerimiz hakkında detaylı bilgi alın.", ogImage: "", noIndex: false }
      },
      {
        pageKey: "seo",
        sectionKey: "press",
        label: "Basında Biz SEO",
        dataJson: { title: "Basında Biz | Taner Tümer İnşaat", description: "Medyada yer alan haberlerimiz ve duyurularımız.", ogImage: "", noIndex: false }
      },
      {
        pageKey: "seo",
        sectionKey: "projectDefault",
        label: "Proje Detay Fallback SEO",
        dataJson: { title: "Proje Detayı | Taner Tümer İnşaat", description: "Taner Tümer İnşaat özel proje detayları.", ogImage: "", noIndex: false }
      }
    ];

    const needsPhase4SettingsSeed = phase4Sections.some(
      (section) =>
        !db.contentSections.some(
          (existing) =>
            existing.pageKey === section.pageKey && existing.sectionKey === section.sectionKey
        )
    );

    const needsRegionsSeed = !db.contentSections.some(
      (existing) => existing.pageKey === "home" && existing.sectionKey === "regions"
    );

    if (!needsAdminSeed && !needsContentSeed && !needsProjectsSeed && !needsPhase3ContentSeed && !needsPhase4SettingsSeed && !needsRegionsSeed && fileExists) {
      return; // Database is already fully seeded
    }

    console.log("Database seed process triggered...");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    const authSecret = process.env.AUTH_SECRET;

    if (needsAdminSeed) {
      if (!adminEmail || !adminPassword || !authSecret) {
        console.error("CRITICAL ERROR: Required seeding environment variables are missing!");
        console.error("Please configure ADMIN_EMAIL, ADMIN_INITIAL_PASSWORD, and AUTH_SECRET inside your .env file.");
        throw new Error("Missing required environment variables for secure database seeding. Execution halted.");
      }

      const hashedPassword = await hashPassword(adminPassword);
      db.adminUsers.push({
        id: crypto.randomUUID(),
        email: adminEmail,
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString(),
      });
      console.log("Admin account seeded successfully with environment-configured credentials.");
    }

    if (needsContentSeed) {
      // Seed default Homepage Hero Content
      db.contentSections.push({
        id: crypto.randomUUID(),
        pageKey: "home",
        sectionKey: "hero",
        label: "Home Page Hero Section",
        dataJson: {
          eyebrow: "SEÇKİN YAŞAM PROJELERİ",
          title: "Düşünülmüş detaylarla<br className=\"hidden sm:inline\" /> inşa edilen yaşam alanları.",
          subtext: "Taner Tümer İnşaat; modern mimariyi, kaliteli malzeme seçimini ve güven veren uygulama disiplinini bir araya getirerek Adana’da seçkin yaşam projeleri geliştirir.",
          button1Text: "Projelerimizi İncele",
          button1Link: "#projects",
          button2Text: "Bilgi Al",
          button2Link: "#contact",
        },
        updatedAt: new Date().toISOString(),
      });

      // Seed default Homepage Statement Content
      db.contentSections.push({
        id: crypto.randomUUID(),
        pageKey: "home",
        sectionKey: "statement",
        label: "Home Page Statement Section",
        dataJson: {
          eyebrow: "YAPI FELSEFEMİZ",
          title: "Yaşam alanlarını yalnızca inşa etmiyor; güven, konfor ve uzun ömürlü değer üzerine tasarlıyoruz.",
          paragraph: "Villa, konut ve yaşam projelerinde; planlama, malzeme seçimi ve uygulama kalitesini aynı bütünün ayrılmaz parçaları olarak ele alıyoruz.",
          pillar1Number: "01 / YAKLAŞIM",
          pillar1Title: "Modern Mimari Yaklaşım",
          pillar1Desc: "Estetik çizgiler, fonksiyonel mekan kurgusu ve çevreyle uyumlu yaşam senaryolarını modern mühendislikle bütünleştiriyoruz.",
          pillar2Number: "02 / STANDART",
          pillar2Title: "Kaliteli Malzeme Seçimi",
          pillar2Desc: "Yapılarımızın estetik karakterini korurken uzun yıllar güvenli, konforlu ve masrafsız kullanım sağlayan marka seçimleri yapıyoruz.",
          pillar3Number: "03 / DİSİPLİN",
          pillar3Title: "Detaylı Uygulama Disiplini",
          pillar3Desc: "Projelerimizi kağıt üstündeki kusursuz detaylardan şantiyedeki milimetrik imalatlara kadar tavizsiz bir kontrol ve işçilik kalitesiyle hayata geçiriyoruz.",
        },
        updatedAt: new Date().toISOString(),
      });

      // Seed default Homepage Final CTA Content
      db.contentSections.push({
        id: crypto.randomUUID(),
        pageKey: "home",
        sectionKey: "finalCta",
        label: "Home Page Final CTA Section",
        dataJson: {
          eyebrow: "İLETİŞİME GEÇİN",
          title: "Yeni yaşam alanınızı<br className=\"hidden sm:inline\" /> birlikte planlayalım.",
          description: "Villa, konut veya yatırım projeniz hakkında detaylı bilgi almak, güncel fiyat listelerimizi öğrenmek ya da satış ofisimizden randevu almak için bizimle iletişime geçebilirsiniz.",
          buttonText: "Bilgi Al",
          buttonLink: "#contact",
          secondaryButtonText: "Projelerimizi İncele",
          secondaryButtonLink: "#projects"
        },
        updatedAt: new Date().toISOString(),
      });

      console.log("Homepage content sections seeded successfully.");
    }

    for (const section of phase3Sections) {
      const exists = db.contentSections.some(
        (existing) =>
          existing.pageKey === section.pageKey && existing.sectionKey === section.sectionKey
      );

      if (!exists) {
        db.contentSections.push({
          id: crypto.randomUUID(),
          pageKey: section.pageKey,
          sectionKey: section.sectionKey,
          label: section.label,
          dataJson: section.dataJson,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (needsPhase4SettingsSeed) {
      for (const section of phase4Sections) {
        const exists = db.contentSections.some(
          (existing) =>
            existing.pageKey === section.pageKey && existing.sectionKey === section.sectionKey
        );
        if (!exists) {
          db.contentSections.push({
            id: crypto.randomUUID(),
            pageKey: section.pageKey,
            sectionKey: section.sectionKey,
            label: section.label,
            dataJson: section.dataJson,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    if (needsRegionsSeed) {
      // Create initial regions array from mapData.ts
      const { districtInfoData } = await import("../../../components/map/mapData");
      const defaultRegions = Object.entries(districtInfoData).map(([key, info]) => ({
        id: crypto.randomUUID(),
        district: key,
        title: info.title,
        status: info.status,
        description: info.description,
        services: info.services,
        projectTypes: info.projectTypes,
        note: info.note,
        isActive: true,
        order: 1
      }));

      db.contentSections.push({
        id: crypto.randomUUID(),
        pageKey: "home",
        sectionKey: "regions",
        label: "Faaliyet Bölgeleri",
        dataJson: {
          sectionTitle: "Faaliyet Bölgelerimiz",
          sectionDescription: "Adana merkezli projelerimizde, şehrin farklı bölgelerinde proje geliştirme, arsa keşfi, mimari tasarım ve üst düzey uygulama süreçleri yürütüyoruz.",
          districts: defaultRegions
        },
        updatedAt: new Date().toISOString(),
      });
    }

    if (needsProjectsSeed) {
      // 1. Villa The Same Seeding
      db.projects.push({
        id: "villa-the-same",
        slug: "villa-the-same",
        title: "Villa The Same",
        category: "Villa Projesi",
        location: "Adana",
        imageCount: 25,
        coverImage: "/projects/villa-the-same/01.jpg",
        imagesFolder: "/projects/villa-the-same",
        shortDescription: "Akıllı ev altyapısı, özel araç girişi ve modern villa yaşamı için tasarlanan seçkin proje.",
        description: "Villa The Same; özel araç girişi, geniş kullanım alanları ve akıllı ev altyapısıyla modern villa yaşamına odaklanan seçkin bir projedir.",
        features: [
          "Her eve 2 araçlık otopark ve araç girişi",
          "Akıllı ev sistemleri"
        ],
        gallery: [
          "/projects/villa-the-same/01.jpg"
        ],
        featured: true,
        published: true,
        order: 1,
        ctaText: "Yeni yaşam alanınızı birlikte planlayalım.",
        ctaBtnText: "Bilgi Al",
        ctaBtnLink: "/iletisim",
        updatedAt: new Date().toISOString()
      });

      // 2. Tümerhan Twins Seeding
      db.projects.push({
        id: "tumerhan-twins",
        slug: "tumerhan-twins",
        title: "Tümerhan Twins",
        category: "Villa Projesi",
        location: "Adana",
        imageCount: 24,
        coverImage: "/projects/tumerhan-twins/01.jpg",
        imagesFolder: "/projects/tumerhan-twins",
        shortDescription: "Bağımsız bahçe, sosyal alanlar, havuz ve yüksek konfor standartlarıyla planlanan özel yaşam alanı.",
        description: "Tümerhan Twins; geniş villa planı, bağımsız bahçe kullanımı, sosyal donatılar ve modern teknik altyapısıyla konforlu bir yaşam standardı sunar.",
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
        ],
        gallery: [
          "/projects/tumerhan-twins/01.jpg"
        ],
        featured: true,
        published: true,
        order: 2,
        ctaText: "Yeni yaşam alanınızı birlikte planlayalım.",
        ctaBtnText: "Bilgi Al",
        ctaBtnLink: "/iletisim",
        updatedAt: new Date().toISOString()
      });

      // 3. Tümerhan Towers Seeding
      db.projects.push({
        id: "tumerhan-towers",
        slug: "tumerhan-towers",
        title: "Tümerhan Towers",
        category: "Konut Projesi",
        location: "Adana",
        imageCount: 6,
        coverImage: "/projects/tumerhan-towers/01.jpg",
        imagesFolder: "/projects/tumerhan-towers",
        shortDescription: "Geniş kapalı mutfak, kaliteli iç mekan malzemeleri ve modern detaylarla tasarlanmış konut projesi.",
        description: "Tümerhan Towers; fonksiyonel daire planı, kaliteli marka tercihleri ve detaylı iç mimari uygulamalarıyla modern konut yaşamı için tasarlanmıştır.",
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
        ],
        gallery: [
          "/projects/tumerhan-towers/01.jpg"
        ],
        featured: true,
        published: true,
        order: 3,
        ctaText: "Yeni yaşam alanınızı birlikte planlayalım.",
        ctaBtnText: "Bilgi Al",
        ctaBtnLink: "/iletisim",
        updatedAt: new Date().toISOString()
      });

      console.log("Projects seeded successfully.");
    }

    db.updatedAt = new Date().toISOString();
    await this.writeDb(db);
  }
}
