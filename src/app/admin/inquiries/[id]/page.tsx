import React from "react";
import { db } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { InquiryDetailClient } from "./InquiryDetailClient";

export const metadata: Metadata = {
  title: "Talep Detayı | Taner Tümer İnşaat Admin",
};

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiries = await db.getInquiries();
  const inquiry = inquiries.find((i) => i.id === params.id);

  if (!inquiry) {
    notFound();
  }

  return <InquiryDetailClient inquiry={inquiry} />;
}
