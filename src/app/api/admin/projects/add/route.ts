import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Proje adı ve slug gereklidir." },
        { status: 400 }
      );
    }

    // Slug validation helper
    const slugRegex = /^[a-z0-9-_]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: "Slug yalnızca küçük harfler, sayılar, tire (-) ve alt çizgi (_) içermelidir." },
        { status: 400 }
      );
    }

    // Add project using database layers (handles uniqueness check internally)
    await db.addProject(body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add project API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Yeni proje eklenirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
