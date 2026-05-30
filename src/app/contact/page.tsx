import { Metadata } from "next";
import { db } from "@/lib/data";
import { Footer } from "@/components/layout/Footer";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await db.getSectionContent("seo", "contact") || {
    title: "İletişim",
    description: "Taner Tümer İnşaat ile iletişime geçin. Villa, konut ve inşaat projeleri hakkında detaylı bilgi almak için bize ulaşın.",
  };
  return {
    title: seo.title,
    description: seo.description,
  };
}

const contactSections = ["hero", "quickActions", "intent", "info", "form", "process", "cta"];

export default async function IletisimPage() {
  await db.seedDatabase();

  const entries = await Promise.all(
    contactSections.map(async (sectionKey) => [
      sectionKey,
      await db.getSectionContent("contact", sectionKey),
    ] as const)
  );

  const globalSettings = await db.getSectionContent("global", "settings");

  return (
    <main className="min-h-screen bg-surface selection:bg-stone-200">
      <ContactPageContent initialData={Object.fromEntries(entries)} />
      <Footer globalSettings={globalSettings} />
    </main>
  );
}
