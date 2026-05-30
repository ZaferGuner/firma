import { Metadata } from "next";
import { db } from "@/lib/data";
import { Footer } from "@/components/layout/Footer";
import { PressPageContent } from "@/components/press/PressPageContent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await db.getSectionContent("seo", "press") || {
    title: "Basında Biz",
    description: "Taner Tümer İnşaat'ın basın içerikleri, kurumsal duyuruları, proje tanıtımları ve medya yansımalarını inceleyin.",
  };
  return {
    title: seo.title,
    description: seo.description,
  };
}

const pressSections = ["hero", "empty", "mediaKit", "projectsCta", "finalCta"];

export default async function BasindaBizPage() {
  await db.seedDatabase();

  const [sectionEntries, pressItems] = await Promise.all([
    Promise.all(
      pressSections.map(async (sectionKey) => [
        sectionKey,
        await db.getSectionContent("press", sectionKey),
      ] as const)
    ),
    db.getPressItems(true),
  ]);

  const globalSettings = await db.getSectionContent("global", "settings");

  return (
    <main className="flex flex-col min-h-screen">
      <PressPageContent
        initialData={Object.fromEntries(sectionEntries)}
        initialItems={pressItems}
      />
      <Footer globalSettings={globalSettings} />
    </main>
  );
}
