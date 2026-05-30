import { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutManifesto } from "@/components/sections/about/AboutManifesto";
import { AboutLivingStory } from "@/components/sections/about/AboutLivingStory";
import { MissionVisionSection } from "@/components/sections/about/MissionVisionSection";
import { AboutValues } from "@/components/sections/about/AboutValues";
import { AboutSignature } from "@/components/sections/about/AboutSignature";
import { AboutContactCTA } from "@/components/sections/about/AboutContactCTA";

export const metadata: Metadata = {
  title: "Hakkımızda | Taner Tümer İnşaat",
  description:
    "Taner Tümer İnşaat'ın yapı yaklaşımı, misyonu, vizyonu ve çalışma değerleri hakkında bilgi alın.",
};

export default function HakkimizdaPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <AboutHero />
      <AboutManifesto />
      <AboutLivingStory />
      <MissionVisionSection />
      <AboutValues />
      <AboutSignature />
      <AboutContactCTA />
      <Footer />
    </main>
  );
}
