import React from "react";
import { db } from "@/lib/data";
import { AdminEditProvider } from "@/context/AdminEditContext";
import { AdminEditBar } from "@/components/admin/AdminEditBar";
import { EditDrawer } from "@/components/admin/EditDrawer";
import { aboutValues, buildingApproach, expertiseAreas, processSteps } from "@/data/home";
import { projectsPageDefaults } from "@/data/projectsPage";

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
  {
    pageKey: "home",
    sectionKey: "featuredIntro",
    fallback: {
      supertitle: "MİMARİ YATIRIMLARIMIZ",
      title: "Öne Çıkan Projeler",
      description:
        "Modern yaşam standartlarını, mimari detayları ve konfor odaklı planlamayı bir araya getiren projelerimizi inceleyin.",
    },
  },
  {
    pageKey: "home",
    sectionKey: "expertise",
    fallback: {
      supertitle: "UZMANLIK ALANLARIMIZ",
      title: "Uzmanlık Alanlarımız",
      description:
        "Yaşam projelerinde mimari tasarım, inşaat kalitesi ve uygulama detaylarını bütüncül bir yaklaşımla ele alıyoruz.",
      items: expertiseAreas,
    },
  },
  {
    pageKey: "home",
    sectionKey: "trust",
    fallback: {
      supertitle: "GÜVEN VE KALİTE",
      title: "Güven üzerine kurulan yapılar.",
      description1:
        "Her projede yalnızca bugünün ihtiyaçlarını değil, uzun yıllar değerini koruyacak yaşam standartlarını hedefliyoruz.",
      description2:
        "Taner Tümer İnşaat olarak, projelerimizde estetik görünüm ile mühendislik doğruluğunu kusursuz bir uyumla birleştiriyoruz.",
      values: aboutValues,
    },
  },
  {
    pageKey: "home",
    sectionKey: "process",
    fallback: {
      supertitle: "UYGULAMA SÜRECİ",
      title: "Her proje doğru bir süreçle başlar.",
      description:
        "Planlamadan anahtar teslimine kadar tüm süreçlerimizi; yüksek teknik doğruluk, planlı saha disiplini ve sürekli kalite denetimiyle yürütüyoruz.",
      steps: processSteps,
    },
  },
  {
    pageKey: "home",
    sectionKey: "buildingApproach",
    fallback: {
      supertitle: "YAPI STANDARTLARIMIZ",
      title: "Güven Veren Yapı Anlayışı",
      description:
        "Projelerimizde estetik görünüm kadar; kullanım konforu, teknik doğruluk ve uzun ömürlü yapı kalitesi de önceliklidir.",
      items: buildingApproach,
    },
  },
  { pageKey: "home", sectionKey: "regions" },
  { pageKey: "home", sectionKey: "finalCta" },
  { pageKey: "global", sectionKey: "settings" },
  { pageKey: "projects", sectionKey: "hero", fallback: projectsPageDefaults.hero },
  { pageKey: "projects", sectionKey: "cta", fallback: projectsPageDefaults.cta },
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
    editableContentSections.map(async ({ pageKey, sectionKey, fallback }) => {
      const key = `${pageKey}.${sectionKey}`;
      const data =
        type === "published"
          ? await db.getSectionContent(pageKey, sectionKey)
          : await db.getDraftContent(pageKey, sectionKey);

      return [key, data || fallback || {}] as const;
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
