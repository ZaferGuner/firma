"use client";

import { motion } from "motion/react";
import React from "react";
import { Building2, Home, Key, MailOpen } from "lucide-react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactPageDefaults } from "@/data/contact";

interface ContactIntentCardsProps {
  onSelect: (subject: string, projectType: string) => void;
  selectedSubject?: string;
  initialData?: any;
}

const icons = {
  building: Building2,
  home: Home,
  key: Key,
  mail: MailOpen,
} as const;

export const ContactIntentCards = ({ onSelect, selectedSubject, initialData }: ContactIntentCardsProps) => {
  const data = useEditableContent("contact.intent", initialData || contactPageDefaults.intent);
  const cards = Array.isArray(data.cards) ? data.cards : contactPageDefaults.intent.cards;

  return (
    <EditableSection sectionKey="contact.intent" label="İletişim Konuları">
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-light text-stone-900">{data.title}</h2>
          <p className="text-stone-500 mt-2 text-sm">{data.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((intent: any, index: number) => {
            const isSelected = selectedSubject === intent.subject;
            const Icon = icons[intent.icon as keyof typeof icons] || Building2;

            return (
              <motion.button
                key={intent.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => onSelect(intent.subject, intent.projectType)}
                className={`text-left p-5 border transition-all duration-300 rounded-none flex items-start gap-4 ${
                  isSelected
                    ? "border-black bg-stone-50"
                    : "border-stone-200 bg-surface hover:border-stone-300"
                }`}
                type="button"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-dark-bg text-dark-text" : "bg-stone-100 text-stone-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-medium mb-1 ${isSelected ? "text-text" : "text-stone-900"}`}>
                    {intent.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{intent.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </EditableSection>
  );
};
