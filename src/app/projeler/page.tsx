import { db } from "@/lib/data";
import { getPublishedProjectsWithFallback } from "@/lib/db/projects";
import { ProjectsClient } from "./_components/ProjectsClient";
import { Footer } from "@/components/layout/Footer";
import { projectsPageDefaults } from "@/data/projectsPage";

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
  const [publishedProjects, globalSettings, heroData, ctaData] = await Promise.all([
    getPublishedProjectsWithFallback(),
    db.getSectionContent("global", "settings"),
    db.getSectionContent("projects", "hero"),
    db.getSectionContent("projects", "cta"),
  ]);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <ProjectsClient
        initialProjects={publishedProjects}
        initialData={{
          hero: heroData || projectsPageDefaults.hero,
          cta: ctaData || projectsPageDefaults.cta,
        }}
      />
      <Footer globalSettings={globalSettings} />
    </main>
  );
}
