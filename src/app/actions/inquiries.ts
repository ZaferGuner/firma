"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import type { InquiryRow } from "@/lib/supabase/types";

export async function updateInquiryStatusAction(formData: FormData) {
  const { supabase } = await assertAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "new") as InquiryRow["status"];

  if (!["new", "read", "contacted", "archived"].includes(status)) {
    throw new Error("Geçersiz talep durumu.");
  }

  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
}

export async function deleteInquiryAction(formData: FormData) {
  const { supabase } = await assertAdmin();
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
}
