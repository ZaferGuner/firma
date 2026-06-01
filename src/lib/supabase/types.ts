export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminUserRow = {
  id: string;
  user_id: string;
  email: string | null;
  role: string;
  created_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  status: "draft" | "published" | "archived";
  project_type: string | null;
  year: string | null;
  cover_image_url: string | null;
  cover_media_id: string | null;
  is_featured: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectFeatureRow = {
  id: string;
  project_id: string;
  title: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
};

export type ProjectImageRow = {
  id: string;
  project_id: string;
  media_id: string | null;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type MediaFolderRow = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  full_path: string;
  created_at: string;
  updated_at: string;
};

export type MediaAssetRow = {
  id: string;
  folder_id: string | null;
  bucket: string;
  path: string;
  public_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  alt_text: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  source_page: string | null;
  status: "new" | "read" | "contacted" | "archived";
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  id: string;
  key: string;
  value: Json;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUserRow;
        Insert: Partial<AdminUserRow> & { user_id: string };
        Update: Partial<AdminUserRow>;
        Relationships: [];
      };
      projects: {
        Row: ProjectRow;
        Insert: Partial<ProjectRow> & { slug: string; title: string };
        Update: Partial<ProjectRow>;
        Relationships: [];
      };
      project_features: {
        Row: ProjectFeatureRow;
        Insert: Partial<ProjectFeatureRow> & { project_id: string; title: string };
        Update: Partial<ProjectFeatureRow>;
        Relationships: [];
      };
      project_images: {
        Row: ProjectImageRow;
        Insert: Partial<ProjectImageRow> & { project_id: string; image_url: string };
        Update: Partial<ProjectImageRow>;
        Relationships: [];
      };
      media_folders: {
        Row: MediaFolderRow;
        Insert: Partial<MediaFolderRow> & { name: string; slug: string; full_path: string };
        Update: Partial<MediaFolderRow>;
        Relationships: [];
      };
      media_assets: {
        Row: MediaAssetRow;
        Insert: Partial<MediaAssetRow> & {
          bucket: string;
          path: string;
          public_url: string;
          file_name: string;
        };
        Update: Partial<MediaAssetRow>;
        Relationships: [];
      };
      inquiries: {
        Row: InquiryRow;
        Insert: Partial<InquiryRow> & { name: string };
        Update: Partial<InquiryRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: Partial<SiteSettingRow> & { key: string; value: Json };
        Update: Partial<SiteSettingRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
