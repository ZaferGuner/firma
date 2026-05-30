import { NextResponse } from "next/server";
import { db } from "@/lib/data";

const allowedTypes = new Set(["Haber", "Duyuru", "Röportaj", "Proje Tanıtımı"]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, type } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Basın içeriği başlığı gereklidir." },
        { status: 400 }
      );
    }

    if (type && !allowedTypes.has(type)) {
      return NextResponse.json(
        { error: "Geçersiz basın içeriği türü gönderildi." },
        { status: 400 }
      );
    }

    const item = await db.addPressItem(body);

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Add press item API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Basın içeriği eklenirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
