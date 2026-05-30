import { db } from "@/lib/data";
import { ProjectsClient } from "./_components/ProjectsClient";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await db.getSectionContent("seo", "projects") || { title: "Projeler", description: "Taner Tümer İnşaat projeleri." };
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function ProjectsPage() {
  // 1. Initial db checks
  await db.seedDatabase();

  // 2. Fetch only published projects for visitors
  const publishedProjects = await db.getProjects(true);
  const globalSettings = await db.getSectionContent("global", "settings");

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <ProjectsClient initialProjects={publishedProjects} />
      <Footer globalSettings={globalSettings} />
    </main>
  );
}
