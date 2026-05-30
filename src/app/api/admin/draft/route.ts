import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pageKey, sectionKey, data } = body;

    if (!pageKey || !sectionKey || !data) {
      return NextResponse.json(
        { error: "Eksik parametre gönderildi." },
        { status: 400 }
      );
    }

    // Save to the decoupled data-layer
    await db.saveDraftContent(pageKey, sectionKey, data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Draft autosave API error:", error);
    return NextResponse.json(
      { error: "Taslak kaydedilirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
