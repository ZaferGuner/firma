import React from "react";
import { db } from "@/lib/data";
import { AdminEditProvider } from "@/context/AdminEditContext";
import { AdminEditBar } from "@/components/admin/AdminEditBar";
import { EditDrawer } from "@/components/admin/EditDrawer";

export const metadata = {
  title: "Taner Tümer İnşaat | Görsel Düzenleme Paneli",
  description: "Webflow/Framer tarzı inline görsel içerik düzenleme arayüzü.",
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminEditLayoutProps {
  children: React.ReactNode;
}

const editableContentSections = [
  { pageKey: "home", sectionKey: "hero" },
  { pageKey: "home", sectionKey: "statement" },
  { pageKey: "home", sectionKey: "finalCta" },
  { pageKey: "contact", sectionKey: "hero" },
  { pageKey: "contact", sectionKey: "quickActions" },
  { pageKey: "contact", sectionKey: "intent" },
  { pageKey: "contact", sectionKey: "info" },
  { pageKey: "contact", sectionKey: "form" },
  { pageKey: "contact", sectionKey: "process" },
  { pageKey: "contact", sectionKey: "cta" },
  { pageKey: "press", sectionKey: "hero" },
  { pageKey: "press", sectionKey: "empty" },
  { pageKey: "press", sectionKey: "mediaKit" },
  { pageKey: "press", sectionKey: "projectsCta" },
  { pageKey: "press", sectionKey: "finalCta" },
];

async function collectContent(type: "published" | "draft") {
  const entries = await Promise.all(
    editableContentSections.map(async ({ pageKey, sectionKey }) => {
      const key = `${pageKey}.${sectionKey}`;
      const data =
        type === "published"
          ? await db.getSectionContent(pageKey, sectionKey)
          : await db.getDraftContent(pageKey, sectionKey);

      return [key, data] as const;
    })
  );

  return Object.fromEntries(entries);
}

export default async function AdminEditLayout({ children }: AdminEditLayoutProps) {
  await db.seedDatabase();

  const [initialPublished, initialDrafts, projectsPub, projectsDraft, pressPublished, pressDrafts] =
    await Promise.all([
      collectContent("published"),
      collectContent("draft"),
      db.getProjects(false),
      db.getProjectsDrafts(),
      db.getPressItems(false),
      db.getPressDrafts(),
    ]);

  return (
    <AdminEditProvider
      initialDrafts={initialDrafts}
      initialPublished={initialPublished}
      initialProjectsPublished={projectsPub}
      initialProjectsDrafts={projectsDraft}
      initialPressPublished={pressPublished}
      initialPressDrafts={pressDrafts}
    >
      <div className="relative min-h-screen bg-background">
        <AdminEditBar />

        <div className="relative w-full overflow-hidden">
          {children}
        </div>

        <EditDrawer />
      </div>
    </AdminEditProvider>
  );
}
