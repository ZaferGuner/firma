import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, data } = body;

    if (!id || !data) {
      return NextResponse.json(
        { error: "Eksik parametre gönderildi." },
        { status: 400 }
      );
    }

    await db.savePressDraft(id, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Press draft autosave API error:", error);
    return NextResponse.json(
      { error: "Basın içeriği taslağı kaydedilirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
