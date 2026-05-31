import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "db.json");

async function runMigration() {
  try {
    console.log("Starting JSON to Prisma migration...");

    // 1. Read JSON file
    const content = await fs.readFile(DB_FILE_PATH, "utf8");
    const db = JSON.parse(content);

    console.log("\n--- JSON Database Summary ---");
    console.log(`Admin Users: ${db.adminUsers?.length || 0}`);
    console.log(`Content Sections: ${db.contentSections?.length || 0}`);
    console.log(`Content Drafts: ${db.contentDrafts?.length || 0}`);
    console.log(`Projects: ${db.projects?.length || 0}`);
    console.log(`Project Drafts: ${db.projectDrafts?.length || 0}`);
    console.log(`Press Items: ${db.pressItems?.length || 0}`);
    console.log(`Press Drafts: ${db.pressDrafts?.length || 0}`);
    console.log(`Inquiries: ${db.inquiries?.length || 0}`);
    console.log("-----------------------------\n");

    // 2. Perform Migration within a transaction
    await prisma.$transaction(async (tx) => {
      // Migrate Admin Users
      for (const admin of db.adminUsers || []) {
        await tx.adminUser.upsert({
          where: { email: admin.email },
          update: {
            passwordHash: admin.passwordHash,
          },
          create: {
            email: admin.email,
            passwordHash: admin.passwordHash,
            createdAt: new Date(admin.createdAt),
          },
        });
      }
      console.log("✅ Admin users migrated");

      // Migrate Content Sections
      for (const section of db.contentSections || []) {
        await tx.contentSection.upsert({
          where: {
            pageKey_sectionKey: {
              pageKey: section.pageKey,
              sectionKey: section.sectionKey,
            },
          },
          update: {
            dataJson: section.dataJson,
          },
          create: {
            pageKey: section.pageKey,
            sectionKey: section.sectionKey,
            label: section.label,
            dataJson: section.dataJson,
          },
        });
      }
      console.log("✅ Content Sections migrated");

      // Migrate Content Drafts
      for (const draft of db.contentDrafts || []) {
        await tx.contentDraft.upsert({
          where: {
            pageKey_sectionKey: {
              pageKey: draft.pageKey,
              sectionKey: draft.sectionKey,
            },
          },
          update: {
            dataJson: draft.dataJson,
          },
          create: {
            pageKey: draft.pageKey,
            sectionKey: draft.sectionKey,
            dataJson: draft.dataJson,
          },
        });
      }
      console.log("✅ Content Drafts migrated");

      // Migrate Projects
      for (const project of db.projects || []) {
        const { id, createdAt, updatedAt, ...projectData } = project;
        await tx.project.upsert({
          where: { slug: projectData.slug },
          update: projectData,
          create: {
            ...projectData,
            specialPreviewEnabled: projectData.specialPreviewEnabled ?? false,
            specialPreviewNoIndex: projectData.specialPreviewNoIndex ?? true,
            specialPreviewAccessMode: projectData.specialPreviewAccessMode || "public",
            specialPreviewHighlights: projectData.specialPreviewHighlights || [],
          },
        });
      }
      console.log("✅ Projects migrated");

      // Migrate Project Drafts
      for (const draft of db.projectDrafts || []) {
        const { id, createdAt, updatedAt, ...projectData } = draft;
        await tx.projectDraft.upsert({
          where: { slug: projectData.slug },
          update: projectData,
          create: {
            ...projectData,
            specialPreviewEnabled: projectData.specialPreviewEnabled ?? false,
            specialPreviewNoIndex: projectData.specialPreviewNoIndex ?? true,
            specialPreviewAccessMode: projectData.specialPreviewAccessMode || "public",
            specialPreviewHighlights: projectData.specialPreviewHighlights || [],
          },
        });
      }
      console.log("✅ Project Drafts migrated");

      // Migrate Press Items
      for (const press of db.pressItems || []) {
        const { createdAt, updatedAt, ...pressData } = press;
        await tx.pressItem.upsert({
          where: { id: pressData.id },
          update: pressData,
          create: pressData,
        });
      }
      console.log("✅ Press Items migrated");

      // Migrate Press Drafts
      for (const draft of db.pressDrafts || []) {
        const { createdAt, updatedAt, ...pressData } = draft;
        await tx.pressDraft.upsert({
          where: { id: pressData.id },
          update: pressData,
          create: pressData,
        });
      }
      console.log("✅ Press Drafts migrated");

      // Migrate Inquiries
      for (const inquiry of db.inquiries || []) {
        await tx.inquiry.upsert({
          where: { id: inquiry.id },
          update: {
            status: inquiry.status,
            note: inquiry.note,
          },
          create: {
            id: inquiry.id,
            name: inquiry.name,
            phone: inquiry.phone,
            email: inquiry.email,
            subject: inquiry.subject,
            projectType: inquiry.projectType,
            district: inquiry.district,
            message: inquiry.message,
            status: inquiry.status,
            source: inquiry.source,
            note: inquiry.note,
            createdAt: new Date(inquiry.createdAt),
          },
        });
      }
      console.log("✅ Inquiries migrated");
    });

    console.log("\n🎉 Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed. Transaction rolled back.");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
