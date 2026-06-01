import { notFound } from "next/navigation";
import { db } from "@/lib/data";
import { getProjectBySlugWithFallback } from "@/lib/db/projects";
import { Footer } from "@/components/layout/Footer";
import { ProjectDetailHero } from "./_components/ProjectDetailHero";
import { ProjectInfo } from "./_components/ProjectInfo";
import { ProjectFeatures } from "./_components/ProjectFeatures";
import { ProjectGallery } from "./_components/ProjectGallery";
import { ProjectDetailCTA } from "./_components/ProjectDetailCTA";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  await db.seedDatabase();
  const project = await getProjectBySlugWithFallback(slug);

  const defaultSeo = await db.getSectionContent("seo", "projectDefault") || { title: "Proje Detayı", description: "Taner Tümer İnşaat özel proje detayları." };

  if (!project || !project.published) {
    return {
      title: "Proje Bulunamadı | Taner Tümer İnşaat",
      description: defaultSeo.description,
    };
  }

  return {
    title: `${project.title} | ${defaultSeo.title}`,
    description: project.shortDescription || defaultSeo.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  await db.seedDatabase();
  const project = await getProjectBySlugWithFallback(slug);
  const globalSettings = await db.getSectionContent("global", "settings");

  if (!project || !project.published) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <ProjectDetailHero project={project} />
      <ProjectInfo project={project} />
      <ProjectFeatures project={project} />
      <ProjectGallery project={project} />
      <ProjectDetailCTA project={project} />
      <Footer globalSettings={globalSettings} />
    </main>
  );
}
