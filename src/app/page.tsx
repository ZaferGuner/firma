import { db } from "@/lib/data";
import { getFeaturedProjectsWithFallback } from "@/lib/db/projects";
import { getSiteSettingsMap, getStringSetting } from "@/lib/db/settings";
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
  const featuredProjects = await getFeaturedProjectsWithFallback();
  const siteSettings = await getSiteSettingsMap();

  const mergedHeroData = {
    ...(heroData || {}),
    ...(getStringSetting(siteSettings, "hero_title") ? { title: getStringSetting(siteSettings, "hero_title") } : {}),
    ...(getStringSetting(siteSettings, "hero_description") ? { subtext: getStringSetting(siteSettings, "hero_description") } : {}),
  };

  const mergedGlobalSettings = {
    ...(globalSettings || {}),
    ...(getStringSetting(siteSettings, "footer_description") ? { footerDescription: getStringSetting(siteSettings, "footer_description") } : {}),
  };

  const initialData = {
    hero: mergedHeroData,
    statement: statementData,
    finalCta: finalCtaData,
    globalSettings: mergedGlobalSettings,
    featuredIntro: featuredIntroData,
    expertise: expertiseData,
    trust: trustData,
    process: processData,
    buildingApproach: buildingApproachData,
    regions: regionsData,
    featuredProjects,
  };

  return <HomePageContent initialData={initialData} />;
}
