# Taner Tümer İnşaat Supabase CMS Kurulumu

Bu panel Next.js App Router, Supabase Auth, Supabase PostgreSQL ve Supabase Storage ile çalışır.

## 1. Paketler

Gerekli paketler projeye eklendi:

- `@supabase/supabase-js`
- `@supabase/ssr`
- `zod`
- `react-hook-form`

## 2. Env

`.env.local` içine şu değerleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` sadece server-side dosyalarda kullanılmalıdır. Client component içine import edilmemelidir.

## 3. Migration

Supabase CLI ile migration çalıştırın:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Eklenen migration:

```text
supabase/migrations/001_initial_admin_cms.sql
```

Bu migration şunları oluşturur:

- `admin_users`
- `projects`
- `project_features`
- `project_images`
- `media_folders`
- `media_assets`
- `inquiries`
- `site_settings`
- RLS policy'leri
- `site-media` storage bucket
- varsayılan medya klasörleri
- varsayılan site ayarları

## 4. Storage Bucket

Migration bucket'ı oluşturur:

```text
site-media
```

Bucket public read açıktır. Upload, update ve delete işlemleri sadece `admin_users` içinde olan kullanıcıya açıktır.

## 5. İlk Admin

1. Supabase Dashboard > Authentication üzerinden kullanıcı oluşturun.
2. Kullanıcının `id` değerini alın.
3. SQL editor içinde çalıştırın:

```sql
insert into public.admin_users (user_id, email, role)
values ('AUTH_USER_ID', 'admin@example.com', 'admin');
```

## 6. Admin Login

Panel:

```text
/admin/login
```

Giriş başarılı olursa kullanıcı `/admin` dashboard'a yönlenir. Kullanıcı Supabase Auth'ta var olsa bile `admin_users` içinde yoksa panele alınmaz.

## 7. Admin Route'ları

- `/admin`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]/edit`
- `/admin/media`
- `/admin/inquiries`
- `/admin/settings`

## 8. Public Site Davranışı

- `/projeler` Supabase `projects` tablosundan `status = published` projeleri okur.
- `/projeler/[slug]` proje detayını Supabase'den okur.
- Ana sayfa öne çıkan projeler için `is_featured = true` ve `status = published` kayıtlarını kullanır.
- Supabase env yoksa veya DB boşsa mevcut statik proje verisi fallback olarak kullanılır.
- İletişim formu `inquiries` tablosuna kayıt atar. Supabase env yoksa form kaydı yapılmaz.

## 9. Görsel Yönetimi

`/admin/media` içinde:

- klasör oluşturma
- klasöre girme
- çoklu görsel yükleme
- görsel silme
- URL kopyalama
- alt text ve başlık düzenleme
- dosya adı, boyut ve mime type görme

Upload kuralları:

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/avif`
- maksimum `10MB`

Dosya path formatı:

```text
{folder_full_path}/{timestamp}-{safe-file-name}
```

## 10. Test Listesi

- Admin login çalışıyor mu?
- Admin olmayan kullanıcı `/admin` altına giremiyor mu?
- Proje ekleniyor mu?
- Kapak görseli Supabase Storage'a yükleniyor mu?
- Galeri görselleri yükleniyor mu?
- Klasör oluşturuluyor mu?
- Görsel medya kütüphanesinden seçiliyor mu?
- Proje `published` yapılınca `/projeler` sayfasında çıkıyor mu?
- `draft` proje public sitede gizleniyor mu?
- İletişim formu `inquiries` tablosuna düşüyor mu?
- Talep durumu admin panelden değişiyor mu?
- `npm run build` hatasız mı?
