import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml)$/i.test(pathname)
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  if (isMaintenanceMode) {
    const isExcluded =
      pathname === "/bakim" ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/api/contact");

    if (!isExcluded) {
      return NextResponse.redirect(new URL("/bakim", request.url));
    }
  }

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApiRoute = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!isAdminRoute && !isAdminApiRoute && pathname !== "/admin/login") {
    return NextResponse.next();
  }

  if (!isSupabaseConfigured()) {
    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Supabase yapılandırması eksik." }, { status: 503 });
    }

    return pathname === "/admin/login"
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { url, anonKey } = getSupabaseConfig();
  const response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (pathname === "/admin/login") {
      return response;
    }

    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminUser) {
    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return pathname === "/admin/login"
      ? response
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
