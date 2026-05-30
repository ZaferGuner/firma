"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactInfo, contactPageDefaults } from "@/data/contact";

type ContactCTAProps = {
  initialData?: any;
};

export const ContactCTA = ({ initialData }: ContactCTAProps) => {
  const data = useEditableContent("contact.cta", initialData || contactPageDefaults.cta);

  return (
    <EditableSection sectionKey="contact.cta" label="İletişim CTA">
      <section className="w-full py-12 md:py-16 bg-site-dark text-site-dark-text">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6 text-site-dark-text">
            {data.title}
          </h2>
          <p className="text-lg text-site-dark-body font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            {data.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={contactInfo.phoneHref}
              className="w-full sm:w-auto px-8 py-4 bg-site-primary text-white font-bold transition-colors hover:bg-site-primary-hover flex items-center justify-center gap-2 uppercase tracking-[0.22em] text-[11px]"
            >
              <Phone className="w-5 h-5" />
              {data.phoneButtonText}
            </Link>
            <Link
              href={contactInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[rgba(245,242,234,0.20)] text-site-dark-text font-bold transition-colors hover:bg-site-primary-soft hover:text-site-text hover:border-site-primary flex items-center justify-center gap-2 uppercase tracking-[0.22em] text-[11px]"
            >
              <MessageCircle className="w-5 h-5" />
              {data.whatsappButtonText}
            </Link>
          </div>
        </div>
      </section>
    </EditableSection>
  );
};
