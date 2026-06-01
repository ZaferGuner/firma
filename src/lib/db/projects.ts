import { projects as staticProjects } from "@/data/projects";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { ProjectFeatureRow, ProjectImageRow, ProjectRow } from "@/lib/supabase/types";

export type CmsProject = ProjectRow & {
  project_features?: ProjectFeatureRow[];
  project_images?: ProjectImageRow[];
};

export type SiteProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  imageCount: number;
  coverImage: string;
  imagesFolder: string;
  shortDescription: string;
  description: string;
  features: string[];
  gallery: string[];
  featured: boolean;
  published: boolean;
  order: number;
  year?: string;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
};

function mapProject(row: CmsProject): SiteProject {
  const gallery = (row.project_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => image.image_url)
    .filter(Boolean);

  const features = (row.project_features || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((feature) => feature.title)
    .filter(Boolean);

  const coverImage = row.cover_image_url || gallery[0] || "/images/projects/hero-house.jpg";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.project_type || "Proje",
    location: row.location || "",
    imageCount: gallery.length || (coverImage ? 1 : 0),
    coverImage,
    imagesFolder: "",
    shortDescription: row.subtitle || row.description || "",
    description: row.description || row.subtitle || "",
    features,
    gallery,
    featured: row.is_featured,
    published: row.status === "published",
    order: row.sort_order,
    year: row.year || undefined,
    status: row.status,
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
  };
}

function normalizeStaticProject(project: (typeof staticProjects)[number]): SiteProject {
  return {
    ...project,
    gallery: "gallery" in project && Array.isArray(project.gallery) ? project.gallery : [],
    featured: "featured" in project ? Boolean(project.featured) : project.slug === "villa-the-same",
    published: true,
    order: "order" in project && typeof project.order === "number" ? project.order : 0,
    status: "published",
  };
}

async function attachProjectRelations(projects: ProjectRow[]) {
  if (projects.length === 0) return [];

  const supabase = createPublicSupabaseClient();
  const ids = projects.map((project) => project.id);

  const [{ data: features, error: featureError }, { data: images, error: imageError }] = await Promise.all([
    supabase.from("project_features").select("*").in("project_id", ids).order("sort_order", { ascending: true }),
    supabase.from("project_images").select("*").in("project_id", ids).order("sort_order", { ascending: true }),
  ]);

  if (featureError) throw new Error(featureError.message);
  if (imageError) throw new Error(imageError.message);

  return projects.map((project) => ({
    ...project,
    project_features: (features || []).filter((feature) => feature.project_id === project.id),
    project_images: (images || []).filter((image) => image.project_id === project.id),
  }));
}

export async function getPublishedProjectsFromSupabase() {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const withRelations = await attachProjectRelations((data || []) as ProjectRow[]);
  return withRelations.map(mapProject);
}

export async function getFeaturedProjectsFromSupabase() {
  const projects = await getPublishedProjectsFromSupabase();
  return projects.filter((project) => project.featured);
}

export async function getProjectBySlugFromSupabase(slug: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const [withRelations] = await attachProjectRelations([data as ProjectRow]);
  return mapProject(withRelations);
}

export async function getPublishedProjectsWithFallback() {
  try {
    const projects = await getPublishedProjectsFromSupabase();
    return projects.length > 0 ? projects : staticProjects.map(normalizeStaticProject);
  } catch (error) {
    console.error("Supabase projects fallback:", error);
    return staticProjects.map(normalizeStaticProject);
  }
}

export async function getFeaturedProjectsWithFallback() {
  try {
    const projects = await getFeaturedProjectsFromSupabase();
    return projects.length > 0 ? projects : staticProjects.slice(0, 3).map(normalizeStaticProject);
  } catch (error) {
    console.error("Supabase featured projects fallback:", error);
    return staticProjects.slice(0, 3).map(normalizeStaticProject);
  }
}

export async function getProjectBySlugWithFallback(slug: string) {
  try {
    const project = await getProjectBySlugFromSupabase(slug);
    if (project) return project;
  } catch (error) {
    console.error("Supabase project detail fallback:", error);
  }

  const staticProject = staticProjects.find((project) => project.slug === slug);
  return staticProject ? normalizeStaticProject(staticProject) : null;
}
