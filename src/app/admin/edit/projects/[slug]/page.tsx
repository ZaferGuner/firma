import { notFound } from "next/navigation";
import { db } from "@/lib/data";
import { Footer } from "@/components/layout/Footer";
import { ProjectDetailHero } from "@/app/projeler/[slug]/_components/ProjectDetailHero";
import { ProjectInfo } from "@/app/projeler/[slug]/_components/ProjectInfo";
import { ProjectFeatures } from "@/app/projeler/[slug]/_components/ProjectFeatures";
import { ProjectGallery } from "@/app/projeler/[slug]/_components/ProjectGallery";
import { ProjectDetailCTA } from "@/app/projeler/[slug]/_components/ProjectDetailCTA";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  await db.seedDatabase();
  const project = await db.getProjectDraft(slug);

  if (!project) {
    return {
      title: "Proje Bulunamadı | Taner Tümer İnşaat",
    };
  }

  return {
    title: `[Düzenle] ${project.title} | Taner Tümer İnşaat`,
    description: project.shortDescription,
  };
}

export default async function AdminEditProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  await db.seedDatabase();
  const project = await db.getProjectDraft(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <ProjectDetailHero project={project} />
      <ProjectInfo project={project} />
      <ProjectFeatures project={project} />
      <ProjectGallery project={project} />
      <ProjectDetailCTA project={project} />
      <Footer />
    </main>
  );
}
