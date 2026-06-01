create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  unique (user_id)
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  location text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  project_type text,
  year text,
  cover_image_url text,
  cover_media_id uuid null,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_features (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_id uuid null,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  parent_id uuid references public.media_folders(id) on delete cascade,
  full_path text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders(id) on delete set null,
  bucket text not null default 'site-media',
  path text not null unique,
  public_url text not null,
  file_name text not null,
  file_size bigint,
  mime_type text,
  alt_text text,
  title text,
  width int,
  height int,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text,
  source_page text,
  status text not null default 'new' check (status in ('new', 'read', 'contacted', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_media_folders_updated_at on public.media_folders;
create trigger set_media_folders_updated_at
before update on public.media_folders
for each row execute function public.set_updated_at();

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_features enable row level security;
alter table public.project_images enable row level security;
alter table public.media_folders enable row level security;
alter table public.media_assets enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users for select
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published projects are public" on public.projects;
create policy "Published projects are public"
on public.projects for select
using (status = 'published' or public.is_admin());

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
on public.projects for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Project features are public" on public.project_features;
create policy "Project features are public"
on public.project_features for select
using (
  public.is_admin()
  or exists (
    select 1 from public.projects
    where projects.id = project_features.project_id
    and projects.status = 'published'
  )
);

drop policy if exists "Admins manage project features" on public.project_features;
create policy "Admins manage project features"
on public.project_features for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Project images are public" on public.project_images;
create policy "Project images are public"
on public.project_images for select
using (
  public.is_admin()
  or exists (
    select 1 from public.projects
    where projects.id = project_images.project_id
    and projects.status = 'published'
  )
);

drop policy if exists "Admins manage project images" on public.project_images;
create policy "Admins manage project images"
on public.project_images for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Media folders are public" on public.media_folders;
create policy "Media folders are public"
on public.media_folders for select
using (true);

drop policy if exists "Admins manage media folders" on public.media_folders;
create policy "Admins manage media folders"
on public.media_folders for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Media assets are public" on public.media_assets;
create policy "Media assets are public"
on public.media_assets for select
using (true);

drop policy if exists "Admins manage media assets" on public.media_assets;
create policy "Admins manage media assets"
on public.media_assets for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can create inquiries" on public.inquiries;
create policy "Anyone can create inquiries"
on public.inquiries for insert
with check (true);

drop policy if exists "Admins read inquiries" on public.inquiries;
create policy "Admins read inquiries"
on public.inquiries for select
using (public.is_admin());

drop policy if exists "Admins manage inquiries" on public.inquiries;
create policy "Admins manage inquiries"
on public.inquiries for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins delete inquiries" on public.inquiries;
create policy "Admins delete inquiries"
on public.inquiries for delete
using (public.is_admin());

drop policy if exists "Site settings are public" on public.site_settings;
create policy "Site settings are public"
on public.site_settings for select
using (true);

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read site media" on storage.objects;
create policy "Public read site media"
on storage.objects for select
using (bucket_id = 'site-media');

drop policy if exists "Admins upload site media" on storage.objects;
create policy "Admins upload site media"
on storage.objects for insert
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins update site media" on storage.objects;
create policy "Admins update site media"
on storage.objects for update
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins delete site media" on storage.objects;
create policy "Admins delete site media"
on storage.objects for delete
using (bucket_id = 'site-media' and public.is_admin());

insert into public.media_folders (name, slug, full_path)
values
  ('Projects', 'projects', 'projects'),
  ('Villa The Same', 'villa-the-same', 'projects/villa-the-same'),
  ('Tümerhan Twins', 'tumerhan-twins', 'projects/tumerhan-twins'),
  ('Tümerhan Towers', 'tumerhan-towers', 'projects/tumerhan-towers'),
  ('17-20', '17-20', 'projects/17-20'),
  ('Site', 'site', 'site'),
  ('Hero', 'hero', 'site/hero'),
  ('About', 'about', 'site/about'),
  ('General', 'general', 'general')
on conflict (full_path) do nothing;

update public.media_folders child
set parent_id = parent.id
from public.media_folders parent
where child.full_path like parent.full_path || '/%'
and child.parent_id is null
and parent.full_path in ('projects', 'site');

insert into public.site_settings (key, value)
values
  ('phone', '"0533 061 80 01"'::jsonb),
  ('whatsapp', '"905330618001"'::jsonb),
  ('email', '"info@tanertumerinsaat.com"'::jsonb),
  ('address', '"Adana, Türkiye"'::jsonb),
  ('instagram', '""'::jsonb),
  ('hero_title', '"Mimari Proje Deneyimi"'::jsonb),
  ('hero_description', '"Modern yaşam standartlarını, teknik disiplini ve estetik yaklaşımı bir araya getiren projeler."'::jsonb),
  ('footer_description', '"Projelerimizi teknik disiplin, modern mimari çizgiler ve insan odaklı yaşam değerleri üzerine inşa ediyoruz."'::jsonb),
  ('seo_default_title', '"Taner Tümer İnşaat"'::jsonb),
  ('seo_default_description', '"Taner Tümer İnşaat projeleri, kurumsal duyuruları ve iletişim bilgileri."'::jsonb)
on conflict (key) do nothing;
