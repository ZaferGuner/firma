import { notFound } from "next/navigation";

import { ShowroomPageContent } from "@/components/sections/ShowroomPageContent";
import { showroomPages } from "@/data/showroomPages";

type ShowroomRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return showroomPages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function ShowroomRoute({ params }: ShowroomRouteProps) {
  const { slug } = await params;
  const page = showroomPages.find((item) => item.slug === slug);

  if (!page) {
    notFound();
  }

  return <ShowroomPageContent page={page} />;
}
