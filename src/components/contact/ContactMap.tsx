"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactInfo, contactPageDefaults } from "@/data/contact";

type ContactMapProps = {
  initialData?: Partial<typeof contactPageDefaults.info>;
};

export const ContactMap = ({ initialData }: ContactMapProps) => {
  const data = useEditableContent("contact.info", {
    ...contactPageDefaults.info,
    ...initialData,
  });

  return (
    <EditableSection sectionKey="contact.info" label="Konum Bilgisi">
      <div className="mt-12">
        <h2 className="text-2xl font-light text-stone-900 mb-4">{data.mapTitle}</h2>
        <p className="text-stone-500 text-sm mb-6">{data.mapDescription}</p>

        <div className="w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden border border-stone-200 relative bg-stone-100">
          <iframe
            src={contactInfo.mapEmbedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute -top-[64px] left-0 z-10 h-[calc(100%+64px)] w-full"
            title="Taner Tümer İnşaat Konum"
          />

          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
            <MapPin className="w-8 h-8 text-stone-300 mb-4" />
            <p className="text-stone-600 font-medium mb-2">{contactInfo.address}</p>
            <Link
              href={contactInfo.mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-surface border border-stone-200 rounded-full text-stone-900 hover:bg-stone-100 transition-colors"
            >
              {data.mapButtonText}
            </Link>
          </div>
        </div>
      </div>
    </EditableSection>
  );
};
