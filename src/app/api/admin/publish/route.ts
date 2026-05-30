import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/data";

export async function POST() {
  try {
    // Commit drafts to published content atomically inside transactional layer
    await db.commitDrafts();
    revalidatePath("/");
    revalidatePath("/projeler");
    revalidatePath("/iletisim");
    revalidatePath("/basinda-biz");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Publish commit API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Yayınlama işlemi başarısız oldu." },
      { status: 500 }
    );
  }
}
