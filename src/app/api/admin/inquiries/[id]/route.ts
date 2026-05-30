import { NextResponse } from "next/server";
import { db } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { status, note } = body;
    const { id } = await params;

    await db.updateInquiry(id, {
      ...(status && { status }),
      ...(note !== undefined && { note }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
