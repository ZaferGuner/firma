import React from "react";
import { db } from "@/lib/data";
import { Metadata } from "next";
import { InquiriesClient } from "./InquiriesClient";

export const metadata: Metadata = {
  title: "Gelen Talepler | Taner Tümer İnşaat Admin",
};

// Next.js config to ensure fresh data since we mutate JSON directly without standard revalidation
export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await db.getInquiries();

  return <InquiriesClient initialInquiries={inquiries} />;
}
