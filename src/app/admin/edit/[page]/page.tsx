import React from "react";
import { notFound } from "next/navigation";
import { HomePageContent } from "@/components/sections/HomePageContent";
import { ProjectsClient } from "@/app/projeler/_components/ProjectsClient";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/data";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { PressPageContent } from "@/components/press/PressPageContent";
import { projectsPageDefaults } from "@/data/projectsPage";

type AdminEditPageRouteProps = {
  params: Promise<{
    page: string;
  }>;
};

const allowedPages = new Set(["home", "projects", "contact", "press"]);

export default async function AdminEditPageRoute({ params }: AdminEditPageRouteProps) {
  const { page } = await params;

  if (!allowedPages.has(page)) {
    notFound();
  }

  await db.seedDatabase();

  if (page === "projects") {
    const [projects, heroData, ctaData] = await Promise.all([
      db.getProjectsDrafts(),
      db.getDraftContent("projects", "hero"),
      db.getDraftContent("projects", "cta"),
    ]);
    return (
      <main className="flex flex-col bg-background min-h-screen">
        <ProjectsClient
          initialProjects={projects}
          initialData={{
            hero: heroData || projectsPageDefaults.hero,
            cta: ctaData || projectsPageDefaults.cta,
          }}
        />
        <Footer />
      </main>
    );
  }

  if (page === "contact") {
    return (
      <main className="min-h-screen bg-surface selection:bg-stone-200">
        <ContactPageContent />
        <Footer />
      </main>
    );
  }

  if (page === "press") {
    const pressItems = await db.getPressDrafts();

    return (
      <main className="flex flex-col min-h-screen bg-surface">
        <PressPageContent initialItems={pressItems} />
        <Footer />
      </main>
    );
  }

  const heroData = await db.getDraftContent("home", "hero");
  const statementData = await db.getDraftContent("home", "statement");
  const finalCtaData = await db.getDraftContent("home", "finalCta");
  const globalSettings = await db.getDraftContent("global", "settings");
  
  const featuredIntroData = await db.getDraftContent("home", "featuredIntro");
  const expertiseData = await db.getDraftContent("home", "expertise");
  const trustData = await db.getDraftContent("home", "trust");
  const processData = await db.getDraftContent("home", "process");
  const buildingApproachData = await db.getDraftContent("home", "buildingApproach");
  const regionsData = await db.getDraftContent("home", "regions");

  const initialData = {
    hero: heroData,
    statement: statementData,
    finalCta: finalCtaData,
    globalSettings,
    featuredIntro: featuredIntroData,
    expertise: expertiseData,
    trust: trustData,
    process: processData,
    buildingApproach: buildingApproachData,
    regions: regionsData,
  };

  return <HomePageContent intro={false} initialData={initialData} />;
}
