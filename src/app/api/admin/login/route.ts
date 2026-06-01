import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Admin login Supabase Auth server action üzerinden yapılır." },
    { status: 410 },
  );
}
