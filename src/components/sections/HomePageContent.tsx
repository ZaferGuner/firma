"use client";

import { HomeHero } from "@/components/sections/HomeHero";
import { HomeStatement } from "@/components/sections/HomeStatement";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServiceAreasSection } from "@/components/sections/ServiceAreasSection";
import { BuildingApproachSection } from "@/components/sections/BuildingApproachSection";
import { HomeCTA } from "@/components/sections/HomeCTA";
import { FooterSection } from "@/components/sections/FooterSection";

type HomePageContentProps = {
  intro?: boolean;
  initialData?: {
    hero?: any;
    statement?: any;
    finalCta?: any;
    globalSettings?: any;
    featuredIntro?: any;
    expertise?: any;
    trust?: any;
    process?: any;
    buildingApproach?: any;
    regions?: any;
  };
};

export function HomePageContent({ intro = true, initialData }: HomePageContentProps) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* 1. Hero: Koyu */}
      <HomeHero intro={intro} initialData={initialData?.hero} />
      
      {/* 2. Statement (Açıklama): Açık */}
      <HomeStatement initialData={initialData?.statement} />
      
      {/* 3. Öne Çıkan Projeler: Açık */}
      <FeaturedProjects initialData={initialData?.featuredIntro} />
      
      {/* 4. Uzmanlık Alanlarımız: Koyu */}
      <ExpertiseSection initialData={initialData?.expertise} />
      
      {/* 5. Güven Anlatısı: Açık */}
      <TrustSection initialData={initialData?.trust} />
      
      {/* 6. Süreç (Timeline): Açık */}
      <ProcessSection initialData={initialData?.process} />
      
      {/* 7. Faaliyet Bölgelerimiz: Koyu */}
      <ServiceAreasSection initialData={initialData?.regions} />
      
      {/* 8. Güven Veren Yapı Anlayışı: Açık */}
      <BuildingApproachSection initialData={initialData?.buildingApproach} />
      
      {/* 9. Final CTA: Koyu */}
      <HomeCTA initialData={initialData?.finalCta} />
      
      {/* 10. Footer: Koyu */}
      <FooterSection globalSettings={initialData?.globalSettings} />
    </main>
  );
}

