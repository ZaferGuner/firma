import { NextResponse } from "next/server";
import { db } from "@/lib/data";
import { verifyPassword, signSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre gereklidir." },
        { status: 400 }
      );
    }

    // Trigger db seeding on verification load
    await db.seedDatabase();

    const user = await db.getAdminUser(email);
    if (!user) {
      // Return unified error message to prevent user enumeration
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    // Read environment auth secret
    const secretKey = process.env.AUTH_SECRET;
    if (!secretKey) {
      console.error("CRITICAL ERROR: AUTH_SECRET is not configured inside env variables!");
      return NextResponse.json(
        { error: "Sunucu yetkilendirme anahtarı yapılandırılmadı." },
        { status: 500 }
      );
    }

    // Signed token with 2 hours expiration
    const expTime = Date.now() + 2 * 60 * 60 * 1000;
    const sessionToken = signSessionToken({ email: user.email, exp: expTime }, secretKey);

    const response = NextResponse.json({ success: true });
    
    // Set secure HTTP-only cookie
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60, // 2 hours (in seconds)
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login endpoint server error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
