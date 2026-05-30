"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactInfo, contactPageDefaults } from "@/data/contact";

type ContactInfoPanelProps = {
  initialData?: any;
};

export const ContactInfoPanel = ({ initialData }: ContactInfoPanelProps) => {
  const data = useEditableContent("contact.info", initialData || contactPageDefaults.info);

  return (
    <EditableSection sectionKey="contact.info" label="İletişim Bilgileri">
      <div>
        <h2 className="text-2xl font-light text-site-text mb-8">{data.title}</h2>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-site-soft flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-site-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-site-label mb-1">{data.addressLabel}</h3>
              <p className="text-site-body leading-relaxed text-sm max-w-xs">
                {contactInfo.address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-site-soft flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-site-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-site-label mb-1">{data.phoneLabel}</h3>
              <Link href={contactInfo.phoneHref} className="text-site-body hover:text-site-accent transition-colors text-sm block">
                {contactInfo.phone}
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-site-soft flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-site-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-site-label mb-1">{data.emailLabel}</h3>
              <Link href={contactInfo.emailHref} className="text-site-body hover:text-site-accent transition-colors text-sm block">
                {contactInfo.email}
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-site-border">
            <h3 className="text-sm font-medium text-site-label mb-4">{data.socialsTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {contactInfo.socials.map((social) =>
                social.href ? (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-site-border rounded-full text-sm text-site-body hover:border-site-primary hover:text-site-text transition-colors"
                  >
                    {social.name}
                  </Link>
                ) : (
                  <span
                    key={social.name}
                    className="px-4 py-2 border border-site-border bg-site-primary-soft rounded-full text-sm text-site-muted cursor-not-allowed"
                  >
                    {social.name}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </EditableSection>
  );
};
