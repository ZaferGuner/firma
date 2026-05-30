import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, data } = body;

    if (!slug || !data) {
      return NextResponse.json(
        { error: "Eksik parametre gönderildi." },
        { status: 400 }
      );
    }

    // Save to the decoupled data-layer
    await db.saveProjectDraft(slug, data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project draft autosave API error:", error);
    return NextResponse.json(
      { error: "Taslak proje kaydedilirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
