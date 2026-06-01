import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { InquiryRow } from "@/lib/supabase/types";

export type InquiryInput = {
  name: string;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
  source_page?: string | null;
};

export async function createInquiry(input: InquiryInput) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase yapılandırması eksik olduğu için talep kaydedilemedi.");
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      message: input.message || null,
      source_page: input.source_page || "contact-form",
      status: "new",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as InquiryRow;
}
