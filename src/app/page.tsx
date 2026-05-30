import { db } from "@/lib/data";
import { HomePageContent } from "@/components/sections/HomePageContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Initial validation seed run
  await db.seedDatabase();

  // 2. Query published homepage sections
  const heroData = await db.getSectionContent("home", "hero");
  const statementData = await db.getSectionContent("home", "statement");
  const finalCtaData = await db.getSectionContent("home", "finalCta");
  const globalSettings = await db.getSectionContent("global", "settings");
  
  const featuredIntroData = await db.getSectionContent("home", "featuredIntro");
  const expertiseData = await db.getSectionContent("home", "expertise");
  const trustData = await db.getSectionContent("home", "trust");
  const processData = await db.getSectionContent("home", "process");
  const buildingApproachData = await db.getSectionContent("home", "buildingApproach");
  const regionsData = await db.getSectionContent("home", "regions");

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

  return <HomePageContent initialData={initialData} />;
}

