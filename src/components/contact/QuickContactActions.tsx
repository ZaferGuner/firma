"use client";

import { motion } from "motion/react";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactInfo, contactPageDefaults } from "@/data/contact";

const actionMeta = {
  phone: {
    href: contactInfo.phoneHref,
    icon: Phone,
    target: "_self",
  },
  whatsapp: {
    href: contactInfo.whatsappHref,
    icon: MessageCircle,
    target: "_blank",
  },
  email: {
    href: contactInfo.emailHref,
    icon: Mail,
    target: "_self",
  },
  location: {
    href: contactInfo.mapHref,
    icon: MapPin,
    target: "_blank",
  },
} as const;

type QuickContactActionsProps = {
  initialData?: any;
};

export const QuickContactActions = ({ initialData }: QuickContactActionsProps) => {
  const data = useEditableContent("contact.quickActions", initialData || contactPageDefaults.quickActions);
  const actions = Array.isArray(data.actions) ? data.actions : contactPageDefaults.quickActions.actions;

  return (
    <EditableSection sectionKey="contact.quickActions" label="Hızlı İletişim">
      <section className="w-full pb-16 md:pb-24 bg-site-bg">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action: any, index: number) => {
              const meta = actionMeta[action.key as keyof typeof actionMeta] || actionMeta.phone;
              const Icon = meta.icon;

              return (
                <motion.div
                  key={action.key || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={meta.href}
                    target={meta.target}
                    rel={meta.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="group flex flex-col justify-between h-full p-5 bg-site-surface border border-site-border hover:border-[#CFC7BA] transition-colors duration-300 rounded-none hover:shadow-[0_8px_24px_rgba(46,48,43,0.03)]"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-full bg-site-soft flex items-center justify-center mb-4">
                        <Icon className="w-4 h-4 text-site-text" />
                      </div>
                      <h3 className="text-[15px] font-semibold text-site-text mb-1.5">{action.title}</h3>
                      <p className="text-site-muted text-[13px] leading-relaxed mb-4">{action.text}</p>
                    </div>

                    <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-site-text group-hover:text-site-accent transition-colors">
                      {action.linkText}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </EditableSection>
  );
};
