"use client";

import { ContactHero } from "@/components/contact/ContactHero";
import { QuickContactActions } from "@/components/contact/QuickContactActions";
import { ContactContainer } from "@/components/contact/ContactContainer";
import { ContactProcess } from "@/components/contact/ContactProcess";
import { ContactCTA } from "@/components/contact/ContactCTA";

type ContactPageContentProps = {
  initialData?: Record<string, any>;
};

export function ContactPageContent({ initialData }: ContactPageContentProps) {
  return (
    <>
      <ContactHero initialData={initialData?.hero} />
      <QuickContactActions initialData={initialData?.quickActions} />
      <ContactContainer initialData={initialData} />
      <ContactProcess initialData={initialData?.process} />
      <ContactCTA initialData={initialData?.cta} />
    </>
  );
}
