import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function POST() {
  try {
    // Clear drafts and restore original state
    await db.discardDrafts();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discard drafts API error:", error);
    return NextResponse.json(
      { error: "Değişiklikleri geri alma işlemi başarısız oldu." },
      { status: 500 }
    );
  }
}
