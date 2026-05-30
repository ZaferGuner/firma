"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { EditableSection } from "@/components/admin/EditableSection";
import { useEditableContent } from "@/hooks/useEditableContent";
import { contactInfo, contactPageDefaults } from "@/data/contact";

interface ContactFormProps {
  selectedSubject: string;
  selectedProjectType: string;
  initialData?: any;
}

export const ContactForm = ({ selectedSubject, selectedProjectType, initialData }: ContactFormProps) => {
  const data = useEditableContent("contact.form", initialData || contactPageDefaults.form);
  const projectTypes = Array.isArray(data.projectTypeOptions)
    ? data.projectTypeOptions
    : contactPageDefaults.form.projectTypeOptions;
  const regions = Array.isArray(data.regionOptions)
    ? data.regionOptions
    : contactPageDefaults.form.regionOptions;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    projectType: "",
    region: "",
    message: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subject: selectedSubject || prev.subject,
      projectType: selectedProjectType || prev.projectType,
    }));
  }, [selectedSubject, selectedProjectType]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    if (!formData.name.trim() || !formData.subject.trim()) {
      setErrorMsg(data.requiredError);
      return;
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMsg(data.contactError);
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          district: formData.region,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Network response was not ok");
      }

      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        projectType: "",
        region: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "Talebiniz gönderilemedi. Lütfen telefon veya WhatsApp üzerinden bize ulaşın.");
    }
  };

  return (
    <EditableSection sectionKey="contact.form" label="İletişim Formu">
      <div className="bg-site-surface p-8 md:p-10 border border-site-border rounded-2xl shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-site-text mb-2">{data.title}</h2>
          <p className="text-site-muted text-sm leading-relaxed">{data.description}</p>
        </div>

        {status === "success" ? (
          <div className="bg-site-soft border border-site-border text-site-text p-6 rounded-xl text-center">
            <p className="font-medium text-lg mb-2">{data.successTitle}</p>
            <p className="text-sm text-site-muted">{data.successText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                {errorMsg}
              </div>
            )}
            {status === "error" && (
              <div className="text-sm text-site-text bg-site-soft p-4 rounded-xl border border-site-border">
                {data.submitError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-site-label">
                  {data.nameLabel}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-site-surface border border-site-border text-site-text placeholder-site-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-site-primary focus:border-site-primary transition-colors"
                  placeholder={data.namePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-site-label">
                  {data.phoneLabel}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-site-surface border border-site-border text-site-text placeholder-site-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-site-primary focus:border-site-primary transition-colors"
                  placeholder={data.phonePlaceholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-site-label">
                  {data.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-site-surface border border-site-border text-site-text placeholder-site-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-site-primary focus:border-site-primary transition-colors"
                  placeholder={data.emailPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-site-label">
                  {data.subjectLabel}
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-site-surface border border-site-border text-site-text placeholder-site-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-site-primary focus:border-site-primary transition-colors"
                  placeholder={data.subjectPlaceholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="projectType" className="text-sm font-medium text-site-label">
                  {data.projectTypeLabel}
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-site-surface border border-site-border text-site-text placeholder-site-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-site-primary focus:border-site-primary transition-colors appearance-none"
                >
                  <option value="">{data.projectTypePlaceholder}</option>
                  {projectTypes.map((type: string) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="region" className="text-sm font-medium text-site-label">
                  {data.regionLabel}
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-site-surface border border-site-border text-site-text placeholder-site-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-site-primary focus:border-site-primary transition-colors appearance-none"
                >
                  <option value="">{data.regionPlaceholder}</option>
                  {regions.map((region: string) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-site-label">
                {data.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-site-surface border border-site-border text-site-text placeholder-site-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-site-primary focus:border-site-primary transition-colors resize-none"
                placeholder={data.messagePlaceholder}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-8 py-4 bg-[#C5162E] text-white font-bold transition-colors hover:bg-[#A31224] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5162E] disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-[0.22em] text-[11px]"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {data.submitText}
              </button>
              <p className="text-xs text-site-muted mt-4 text-center sm:text-left">
                {data.helperText}
              </p>
            </div>
          </form>
        )}
      </div>
    </EditableSection>
  );
};
