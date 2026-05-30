import { IDataLayer } from "../IDataLayer";
import { prisma } from "../../prisma";
import { hashPassword } from "../../auth";

export class PrismaAdapter implements IDataLayer {
  
  // --- Content Sections Management ---

  async getSectionContent(pageKey: string, sectionKey: string): Promise<any | null> {
    const section = await prisma.contentSection.findUnique({
      where: {
        pageKey_sectionKey: {
          pageKey,
          sectionKey,
        },
      },
    });
    return section ? section.dataJson : null;
  }

  async getDraftContent(pageKey: string, sectionKey: string): Promise<any | null> {
    const draft = await prisma.contentDraft.findUnique({
      where: {
        pageKey_sectionKey: {
          pageKey,
          sectionKey,
        },
      },
    });
    if (draft) return draft.dataJson;
    return this.getSectionContent(pageKey, sectionKey);
  }

  async saveDraftContent(pageKey: string, sectionKey: string, data: any): Promise<void> {
    await prisma.contentDraft.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey,
          sectionKey,
        },
      },
      update: {
        dataJson: data,
      },
      create: {
        pageKey,
        sectionKey,
        dataJson: data,
      },
    });
  }

  // --- Projects Management ---

  async getProjects(onlyPublished?: boolean): Promise<any[]> {
    const projects = await prisma.project.findMany({
      where: onlyPublished ? { published: true } : undefined,
      orderBy: { order: 'asc' },
    });
    return projects;
  }

  async getProjectsDrafts(): Promise<any[]> {
    const published = await prisma.project.findMany();
    const drafts = await prisma.projectDraft.findMany();

    const draftMap = new Map(drafts.map(d => [d.slug, d]));
    
    const list: any[] = published.map((p) => {
      return draftMap.has(p.slug) ? draftMap.get(p.slug)! : p;
    });

    // Append new drafts that don't exist in published
    for (const d of drafts) {
      if (!published.some(p => p.slug === d.slug)) {
        list.push(d);
      }
    }

    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getProjectBySlug(slug: string): Promise<any | null> {
    return prisma.project.findUnique({ where: { slug } });
  }

  async getProjectDraft(slug: string): Promise<any | null> {
    const draft = await prisma.projectDraft.findUnique({ where: { slug } });
    if (draft) return draft;
    return this.getProjectBySlug(slug);
  }

  async saveProjectDraft(slug: string, data: any): Promise<void> {
    const { id, createdAt, updatedAt, ...updates } = data;
    await prisma.projectDraft.upsert({
      where: { slug },
      update: updates,
      create: {
        ...updates,
        slug,
      },
    });
  }

  async addProject(project: any): Promise<void> {
    const existsInPub = await prisma.project.findUnique({ where: { slug: project.slug } });
    const existsInDraft = await prisma.projectDraft.findUnique({ where: { slug: project.slug } });

    if (existsInPub || existsInDraft) {
      throw new Error(`Slug '${project.slug}' benzersiz olmalıdır. Bu slug başka bir proje tarafından kullanılıyor.`);
    }

    const { id, createdAt, updatedAt, ...projectData } = project;

    const newDraftProject = {
      title: projectData.title,
      slug: projectData.slug,
      category: projectData.category,
      location: projectData.location,
      shortDescription: projectData.shortDescription || "",
      description: projectData.description || "",
      coverImage: projectData.coverImage || "/projects/villa-the-same/01.jpg",
      imagesFolder: projectData.imagesFolder || `/projects/${projectData.slug}`,
      imageCount: projectData.imageCount || 1,
      featured: projectData.featured ?? false,
      published: projectData.published ?? false,
      order: projectData.order ?? (await prisma.project.count() + await prisma.projectDraft.count() + 1),
      features: projectData.features || [],
      gallery: projectData.gallery || [projectData.coverImage || "/projects/villa-the-same/01.jpg"],
      ctaText: projectData.ctaText || "Yeni yaşam alanınızı birlikte planlayalım.",
      ctaBtnText: projectData.ctaBtnText || "Bilgi Al",
      ctaBtnLink: projectData.ctaBtnLink || "/iletisim",
    };

    await prisma.projectDraft.create({ data: newDraftProject });
  }

  // --- Press Items Management ---

  async getPressItems(onlyPublished = true): Promise<any[]> {
    return prisma.pressItem.findMany({
      where: onlyPublished ? { published: true } : undefined,
      orderBy: { order: 'asc' },
    });
  }

  async getPressDrafts(): Promise<any[]> {
    const published = await prisma.pressItem.findMany();
    const drafts = await prisma.pressDraft.findMany();

    const draftMap = new Map(drafts.map(d => [d.id, d]));
    
    const list: any[] = published.map((p) => {
      return draftMap.has(p.id) ? draftMap.get(p.id)! : p;
    });

    for (const d of drafts) {
      if (!published.some(p => p.id === d.id)) {
        list.push(d);
      }
    }

    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async savePressDraft(id: string, data: any): Promise<void> {
    const { createdAt, updatedAt, ...updates } = data;
    await prisma.pressDraft.upsert({
      where: { id },
      update: { ...updates, id },
      create: { ...updates, id },
    });
  }

  async addPressItem(item: any): Promise<any> {
    const id = item.id || crypto.randomUUID();
    const existsInPub = await prisma.pressItem.findUnique({ where: { id } });
    const existsInDraft = await prisma.pressDraft.findUnique({ where: { id } });

    if (existsInPub || existsInDraft) {
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
      order: item.order ?? (await prisma.pressItem.count() + await prisma.pressDraft.count() + 1),
    };

    return prisma.pressDraft.create({ data: newDraftItem });
  }

  // --- Inquiries Management ---

  async getInquiries(): Promise<any[]> {
    return prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async addInquiry(inquiry: any): Promise<void> {
    await prisma.inquiry.create({
      data: {
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
      },
    });
  }

  async updateInquiry(id: string, updates: any): Promise<void> {
    await prisma.inquiry.update({
      where: { id },
      data: updates,
    });
  }

  // --- Global Transactions ---

  async commitDrafts(): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const contentDrafts = await tx.contentDraft.findMany();
      for (const draft of contentDrafts) {
        await tx.contentSection.upsert({
          where: {
            pageKey_sectionKey: {
              pageKey: draft.pageKey,
              sectionKey: draft.sectionKey,
            },
          },
          update: {
            dataJson: draft.dataJson as any,
          },
          create: {
            pageKey: draft.pageKey,
            sectionKey: draft.sectionKey,
            label: `${draft.pageKey}.${draft.sectionKey} section`,
            dataJson: draft.dataJson as any,
          },
        });
      }

      const projectDrafts = await tx.projectDraft.findMany();
      for (const draft of projectDrafts) {
        const { id, createdAt, updatedAt, ...projectData } = draft as any;
        await tx.project.upsert({
          where: { slug: draft.slug },
          update: projectData,
          create: projectData,
        });
      }

      const pressDrafts = await tx.pressDraft.findMany();
      for (const draft of pressDrafts) {
        const { createdAt, updatedAt, ...pressData } = draft as any;
        await tx.pressItem.upsert({
          where: { id: draft.id },
          update: pressData,
          create: pressData,
        });
      }

      await tx.contentDraft.deleteMany();
      await tx.projectDraft.deleteMany();
      await tx.pressDraft.deleteMany();
    });
  }

  async discardDrafts(): Promise<void> {
    await prisma.$transaction([
      prisma.contentDraft.deleteMany(),
      prisma.projectDraft.deleteMany(),
      prisma.pressDraft.deleteMany(),
    ]);
  }

  async getAdminUser(email: string): Promise<{ id: string; email: string; passwordHash: string } | null> {
    return prisma.adminUser.findUnique({ where: { email } });
  }

  async seedDatabase(): Promise<void> {
    const adminCount = await prisma.adminUser.count();
    
    if (adminCount === 0) {
      console.log("Database seed process triggered for AdminUser...");

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
      const authSecret = process.env.AUTH_SECRET;

      if (!adminEmail || !adminPassword || !authSecret) {
        console.error("CRITICAL ERROR: Required seeding environment variables are missing!");
        console.error("Please configure ADMIN_EMAIL, ADMIN_INITIAL_PASSWORD, and AUTH_SECRET inside your .env file.");
        throw new Error("Missing required environment variables for secure database seeding. Execution halted.");
      }

      const hashedPassword = await hashPassword(adminPassword);
      await prisma.adminUser.create({
        data: {
          email: adminEmail,
          passwordHash: hashedPassword,
        },
      });
      console.log("Admin account seeded successfully with environment-configured credentials.");
    }
  }
}
