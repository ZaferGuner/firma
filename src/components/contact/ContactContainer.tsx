"use client";

import React, { useState } from "react";
import { ContactIntentCards } from "./ContactIntentCards";
import { ContactInfoPanel } from "./ContactInfoPanel";
import { ContactForm } from "./ContactForm";
import { ContactMap } from "./ContactMap";

type ContactContainerProps = {
  initialData?: Record<string, any>;
};

export const ContactContainer = ({ initialData }: ContactContainerProps) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");

  const handleIntentSelect = (subject: string, projectType: string) => {
    setSelectedSubject(subject);
    setSelectedProjectType(projectType);

    const formElement = document.getElementById("contact-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-site-bg relative z-20">
      <div className="container mx-auto px-6">
        <ContactIntentCards
          initialData={initialData?.intent}
          onSelect={handleIntentSelect}
          selectedSubject={selectedSubject}
        />

        <div id="contact-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pt-8">
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-between">
            <ContactInfoPanel initialData={initialData?.info} />
            <ContactMap initialData={initialData?.info} />
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <ContactForm
              initialData={initialData?.form}
              selectedSubject={selectedSubject}
              selectedProjectType={selectedProjectType}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
