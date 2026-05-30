"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import { useAdminEdit } from "@/context/AdminEditContext";

const inputClass =
  "w-full bg-[var(--color-surface)] border border-neutral-300 px-3 py-2 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]";
const monoInputClass = `${inputClass} font-mono`;

const pressTypes = ["Haber", "Duyuru", "Röportaj", "Proje Tanıtımı"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-2">
      {children}
    </h4>
  );
}

function generateSlug(title: string) {
  return title
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function EditDrawer() {
  const context = useAdminEdit();

  const [newProjState, setNewProjState] = useState({
    title: "",
    slug: "",
    category: "Villa Projesi",
    location: "Adana",
    shortDescription: "",
    description: "",
    coverImage: "/projects/villa-the-same/01.jpg",
    published: false,
    featured: false,
    order: 1,
  });

  const [newPressState, setNewPressState] = useState({
    title: "",
    source: "",
    date: todayString(),
    type: "Duyuru",
    description: "",
    image: "",
    url: "",
    published: false,
    featured: false,
    order: 1,
  });

  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  useEffect(() => {
    if (!context) return;

    if (context.activeSectionKey === "new-project") {
      setNewProjState({
        title: "",
        slug: "",
        category: "Villa Projesi",
        location: "Adana",
        shortDescription: "",
        description: "",
        coverImage: "/projects/villa-the-same/01.jpg",
        published: false,
        featured: false,
        order: (context.draftProjects?.length || 0) + 1,
      });
    }

    if (context.activeSectionKey === "new-press-item") {
      setNewPressState({
        title: "",
        source: "",
        date: todayString(),
        type: "Duyuru",
        description: "",
        image: "",
        url: "",
        published: false,
        featured: false,
        order: (context.draftPressItems?.length || 0) + 1,
      });
    }
  }, [context?.activeSectionKey, context?.draftProjects?.length, context?.draftPressItems?.length]);

  if (!context) {
    return null;
  }

  const {
    activeSectionKey,
    draftContent,
    updateDraftContent,
    updateProjectDraft,
    updatePressDraft,
    closeSectionEditor,
  } = context;

  if (!activeSectionKey) {
    return null;
  }

  const isProjectEdit = activeSectionKey.startsWith("project.");
  const isPressEdit = activeSectionKey.startsWith("pressItem.");
  const isRegionEdit = activeSectionKey.startsWith("region.");
  const projectSlug = isProjectEdit ? activeSectionKey.substring("project.".length) : "";
  const pressId = isPressEdit ? activeSectionKey.substring("pressItem.".length) : "";
  const regionId = isRegionEdit ? activeSectionKey.substring("region.".length) : "";
  const projectData = isProjectEdit
    ? context.draftProjects.find((project) => project.slug === projectSlug)
    : null;
  const pressData = isPressEdit
    ? context.draftPressItems.find((item) => item.id === pressId)
    : null;
  const regionData = isRegionEdit
    ? (draftContent["home.regions"]?.districts || []).find((d: any) => d.district === regionId)
    : null;
  const sectionData = !isProjectEdit && !isPressEdit && !isRegionEdit ? (draftContent[activeSectionKey] || {}) : {};

  const handleFieldChange = (field: string, value: any) => {
    updateDraftContent(activeSectionKey, field, value);
  };

  const handleProjectFieldChange = (field: string, value: any) => {
    if (!projectData) return;
    updateProjectDraft(projectSlug, {
      ...projectData,
      [field]: value,
    });
  };

  const handlePressFieldChange = (field: string, value: any) => {
    if (!pressData) return;
    updatePressDraft(pressId, {
      ...pressData,
      [field]: value,
    });
  };

  const handleRegionFieldChange = (field: string, value: any) => {
    if (!regionData) return;
    const districts = draftContent["home.regions"]?.districts || [];
    const index = districts.findIndex((d: any) => d.district === regionId);
    if (index === -1) return;
    
    const newDistricts = [...districts];
    newDistricts[index] = { ...regionData, [field]: value };
    
    updateDraftContent("home.regions", "districts", newDistricts);
  };

  const updateSectionObjectArray = (field: string, index: number, itemField: string, value: any) => {
    const list = Array.isArray(sectionData[field]) ? [...sectionData[field]] : [];
    list[index] = {
      ...(list[index] || {}),
      [itemField]: value,
    };
    handleFieldChange(field, list);
  };

  const addSectionObjectArrayItem = (field: string, item: Record<string, any>) => {
    const list = Array.isArray(sectionData[field]) ? [...sectionData[field]] : [];
    handleFieldChange(field, [...list, item]);
  };

  const removeSectionObjectArrayItem = (field: string, index: number) => {
    const list = Array.isArray(sectionData[field]) ? [...sectionData[field]] : [];
    handleFieldChange(field, list.filter((_, itemIndex) => itemIndex !== index));
  };

  const renderTextInput = (
    label: string,
    field: string,
    options?: { monospaced?: boolean; type?: string; placeholder?: string }
  ) => (
    <Field label={label}>
      <input
        type={options?.type || "text"}
        className={options?.monospaced ? monoInputClass : inputClass}
        value={sectionData[field] || ""}
        placeholder={options?.placeholder}
        onChange={(event) => handleFieldChange(field, event.target.value)}
      />
    </Field>
  );

  const renderTextarea = (
    label: string,
    field: string,
    rows = 3,
    options?: { monospaced?: boolean; placeholder?: string }
  ) => (
    <Field label={label}>
      <textarea
        rows={rows}
        className={`${options?.monospaced ? monoInputClass : inputClass} resize-none`}
        value={sectionData[field] || ""}
        placeholder={options?.placeholder}
        onChange={(event) => handleFieldChange(field, event.target.value)}
      />
    </Field>
  );

  const renderStringList = (label: string, field: string) => {
    const value = Array.isArray(sectionData[field]) ? sectionData[field].join("\n") : "";

    return (
      <Field label={label}>
        <textarea
          rows={6}
          className={`${inputClass} resize-none`}
          value={value}
          onChange={(event) =>
            handleFieldChange(
              field,
              event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
        />
        <span className="text-[10px] text-neutral-400">Her satır bir seçenek olarak kaydedilir.</span>
      </Field>
    );
  };

  const renderObjectList = (
    title: string,
    field: string,
    fields: Array<{ key: string; label: string; rows?: number }>,
    newItem: Record<string, any>,
    addLabel: string
  ) => {
    const list = Array.isArray(sectionData[field]) ? sectionData[field] : [];

    return (
      <div className="space-y-4">
        <SectionTitle>{title}</SectionTitle>
        {list.map((item: any, index: number) => (
          <div key={item.id || item.key || index} className="space-y-3 border border-neutral-200 bg-surface p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                Öğe {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeSectionObjectArrayItem(field, index)}
                className="p-1.5 text-neutral-400 hover:text-[var(--color-primary)] hover:bg-red-50 transition-colors"
                title="Sil"
              >
                <Trash2 size={13} />
              </button>
            </div>
            {fields.map((itemField) => (
              <Field key={itemField.key} label={itemField.label}>
                {itemField.rows ? (
                  <textarea
                    rows={itemField.rows}
                    className={`${inputClass} resize-none`}
                    value={item[itemField.key] || ""}
                    onChange={(event) =>
                      updateSectionObjectArray(field, index, itemField.key, event.target.value)
                    }
                  />
                ) : (
                  <input
                    type="text"
                    className={inputClass}
                    value={item[itemField.key] || ""}
                    onChange={(event) =>
                      updateSectionObjectArray(field, index, itemField.key, event.target.value)
                    }
                  />
                )}
              </Field>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addSectionObjectArrayItem(field, newItem)}
          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-neutral-300 py-2 text-xs font-mono text-neutral-500 uppercase tracking-wider hover:border-black hover:text-text transition-all cursor-pointer"
        >
          <Plus size={14} /> {addLabel}
        </button>
      </div>
    );
  };

  const renderProjectEditor = () => {
    if (!projectData) {
      return (
        <p className="text-xs text-neutral-500 font-mono italic">
          Seçilen proje bulunamadı ({projectSlug}).
        </p>
      );
    }

    const updateFeature = (index: number, value: string) => {
      const features = [...(projectData.features || [])];
      features[index] = value;
      handleProjectFieldChange("features", features);
    };

    const addFeature = () => {
      handleProjectFieldChange("features", [...(projectData.features || []), "Yeni özellik detayı"]);
    };

    const removeFeature = (index: number) => {
      handleProjectFieldChange(
        "features",
        (projectData.features || []).filter((_: any, itemIndex: number) => itemIndex !== index)
      );
    };

    const moveFeature = (index: number, direction: "up" | "down") => {
      const list = [...(projectData.features || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;
      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
      handleProjectFieldChange("features", list);
    };

    const updateGallery = (index: number, value: string) => {
      const gallery = [...(projectData.gallery || [])];
      gallery[index] = value;
      handleProjectFieldChange("gallery", gallery);
    };

    const addGalleryImage = () => {
      handleProjectFieldChange("gallery", [...(projectData.gallery || []), "/projects/villa-the-same/01.jpg"]);
    };

    const removeGalleryImage = (index: number) => {
      handleProjectFieldChange(
        "gallery",
        (projectData.gallery || []).filter((_: any, itemIndex: number) => itemIndex !== index)
      );
    };

    const moveGalleryImage = (index: number, direction: "up" | "down") => {
      const list = [...(projectData.gallery || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;
      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
      handleProjectFieldChange("gallery", list);
    };

    return (
      <div className="space-y-6">
        <SectionTitle>Proje Meta Detayları</SectionTitle>
        <Field label="Proje Adı">
          <input className={inputClass} value={projectData.title || ""} onChange={(event) => handleProjectFieldChange("title", event.target.value)} />
        </Field>
        <Field label="Kategori">
          <select className={inputClass} value={projectData.category || "Villa Projesi"} onChange={(event) => handleProjectFieldChange("category", event.target.value)}>
            <option value="Villa Projesi">Villa Projesi</option>
            <option value="Konut Projesi">Konut Projesi</option>
            <option value="Ticari Proje">Ticari Proje</option>
          </select>
        </Field>
        <Field label="Lokasyon">
          <input className={inputClass} value={projectData.location || ""} onChange={(event) => handleProjectFieldChange("location", event.target.value)} />
        </Field>
        <Field label="Kısa Açıklama">
          <textarea rows={3} className={inputClass} value={projectData.shortDescription || ""} onChange={(event) => handleProjectFieldChange("shortDescription", event.target.value)} />
        </Field>
        <Field label="Uzun Açıklama">
          <textarea rows={5} className={inputClass} value={projectData.description || ""} onChange={(event) => handleProjectFieldChange("description", event.target.value)} />
        </Field>
        <Field label="Kapak Görseli Yolu">
          <input className={monoInputClass} value={projectData.coverImage || ""} onChange={(event) => handleProjectFieldChange("coverImage", event.target.value)} />
        </Field>
        <Field label="Fotoğraf Sayısı">
          <input type="number" className={inputClass} value={projectData.imageCount || 0} onChange={(event) => handleProjectFieldChange("imageCount", parseInt(event.target.value, 10) || 0)} />
        </Field>
        <Field label="Sıralama Değeri">
          <input type="number" className={inputClass} value={projectData.order || 0} onChange={(event) => handleProjectFieldChange("order", parseInt(event.target.value, 10) || 0)} />
        </Field>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={!!projectData.published} onChange={(event) => handleProjectFieldChange("published", event.target.checked)} />
            <span>Yayında / Aktif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={!!projectData.featured} onChange={(event) => handleProjectFieldChange("featured", event.target.checked)} />
            <span>Öne Çıkarılmış</span>
          </label>
        </div>

        <SectionTitle>Proje Teknik Özellikleri</SectionTitle>
        <div className="space-y-3">
          {(projectData.features || []).map((feature: string, index: number) => (
            <div key={`${feature}-${index}`} className="flex items-center gap-1.5">
              <input className="flex-1 bg-[var(--color-surface)] border border-neutral-300 px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" value={feature} onChange={(event) => updateFeature(index, event.target.value)} />
              <button type="button" onClick={() => moveFeature(index, "up")} className="p-1 text-neutral-400 hover:text-text hover:bg-neutral-100" title="Yukarı Taşı" disabled={index === 0}><ChevronUp size={14} /></button>
              <button type="button" onClick={() => moveFeature(index, "down")} className="p-1 text-neutral-400 hover:text-text hover:bg-neutral-100" title="Aşağı Taşı" disabled={index === (projectData.features || []).length - 1}><ChevronDown size={14} /></button>
              <button type="button" onClick={() => removeFeature(index)} className="p-1.5 text-neutral-400 hover:text-[var(--color-primary)] hover:bg-red-50" title="Sil"><Trash2 size={13} /></button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="w-full flex items-center justify-center gap-1.5 border border-dashed border-neutral-300 py-2 text-xs font-mono text-neutral-500 uppercase tracking-wider hover:border-black hover:text-text">
            <Plus size={14} /> Özellik Ekle
          </button>
        </div>

        <SectionTitle>Galeri Görsel Yolları</SectionTitle>
        <div className="space-y-3">
          {(projectData.gallery || []).map((imageSrc: string, index: number) => (
            <div key={`${imageSrc}-${index}`} className="flex items-center gap-1.5">
              <input className="flex-1 bg-[var(--color-surface)] border border-neutral-300 px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] font-mono" value={imageSrc} onChange={(event) => updateGallery(index, event.target.value)} />
              <button type="button" onClick={() => moveGalleryImage(index, "up")} className="p-1 text-neutral-400 hover:text-text hover:bg-neutral-100" title="Yukarı Taşı" disabled={index === 0}><ChevronUp size={14} /></button>
              <button type="button" onClick={() => moveGalleryImage(index, "down")} className="p-1 text-neutral-400 hover:text-text hover:bg-neutral-100" title="Aşağı Taşı" disabled={index === (projectData.gallery || []).length - 1}><ChevronDown size={14} /></button>
              <button type="button" onClick={() => removeGalleryImage(index)} className="p-1.5 text-neutral-400 hover:text-[var(--color-primary)] hover:bg-red-50" title="Sil"><Trash2 size={13} /></button>
            </div>
          ))}
          <button type="button" onClick={addGalleryImage} className="w-full flex items-center justify-center gap-1.5 border border-dashed border-neutral-300 py-2 text-xs font-mono text-neutral-500 uppercase tracking-wider hover:border-black hover:text-text">
            <Plus size={14} /> Görsel Yolu Ekle
          </button>
        </div>

        <SectionTitle>Proje Detay CTA Alanı</SectionTitle>
        <Field label="CTA Metni">
          <input className={inputClass} value={projectData.ctaText || ""} onChange={(event) => handleProjectFieldChange("ctaText", event.target.value)} />
        </Field>
        <Field label="Buton Metni">
          <input className={inputClass} value={projectData.ctaBtnText || ""} onChange={(event) => handleProjectFieldChange("ctaBtnText", event.target.value)} />
        </Field>
        <Field label="Buton Linki">
          <input className={monoInputClass} value={projectData.ctaBtnLink || ""} onChange={(event) => handleProjectFieldChange("ctaBtnLink", event.target.value)} />
        </Field>
      </div>
    );
  };

  const renderNewProjectForm = () => (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!newProjState.title || !newProjState.slug) {
          window.alert("Lütfen proje adı ve slug alanlarını doldurun.");
          return;
        }

        setIsSubmittingNew(true);
        try {
          await context.addNewProject(newProjState);
        } finally {
          setIsSubmittingNew(false);
        }
      }}
      className="space-y-5"
    >
      <SectionTitle>Yeni Proje Tanımla</SectionTitle>
      {context.errorMessage && context.saveStatus === "error" && (
        <div className="bg-red-50 text-red-700 p-3 text-xs border border-red-200">
          {context.errorMessage}
        </div>
      )}
      <Field label="Proje Adı">
        <input
          className={inputClass}
          required
          value={newProjState.title}
          onChange={(event) =>
            setNewProjState((prev) => ({
              ...prev,
              title: event.target.value,
              slug: prev.slug || generateSlug(event.target.value),
            }))
          }
        />
      </Field>
      <Field label="Slug">
        <input className={monoInputClass} required value={newProjState.slug} onChange={(event) => setNewProjState((prev) => ({ ...prev, slug: generateSlug(event.target.value) }))} />
      </Field>
      <Field label="Kategori">
        <select className={inputClass} value={newProjState.category} onChange={(event) => setNewProjState((prev) => ({ ...prev, category: event.target.value }))}>
          <option value="Villa Projesi">Villa Projesi</option>
          <option value="Konut Projesi">Konut Projesi</option>
          <option value="Ticari Proje">Ticari Proje</option>
        </select>
      </Field>
      <Field label="Lokasyon">
        <input className={inputClass} value={newProjState.location} onChange={(event) => setNewProjState((prev) => ({ ...prev, location: event.target.value }))} />
      </Field>
      <Field label="Kısa Açıklama">
        <textarea rows={3} className={inputClass} value={newProjState.shortDescription} onChange={(event) => setNewProjState((prev) => ({ ...prev, shortDescription: event.target.value }))} />
      </Field>
      <Field label="Uzun Açıklama">
        <textarea rows={5} className={inputClass} value={newProjState.description} onChange={(event) => setNewProjState((prev) => ({ ...prev, description: event.target.value }))} />
      </Field>
      <Field label="Kapak Görseli Yolu">
        <input className={monoInputClass} value={newProjState.coverImage} onChange={(event) => setNewProjState((prev) => ({ ...prev, coverImage: event.target.value }))} />
      </Field>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
          <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={newProjState.published} onChange={(event) => setNewProjState((prev) => ({ ...prev, published: event.target.checked }))} />
          <span>Yayında / Aktif</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
          <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={newProjState.featured} onChange={(event) => setNewProjState((prev) => ({ ...prev, featured: event.target.checked }))} />
          <span>Öne Çıkarılmış</span>
        </label>
      </div>
      <button type="submit" disabled={isSubmittingNew} className="w-full flex items-center justify-center gap-2 bg-dark-bg hover:bg-[var(--color-primary)] disabled:bg-neutral-400 text-dark-text py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] transition-colors cursor-pointer mt-4">
        {isSubmittingNew ? "Ekleniyor..." : "Projeyi Ekle (Taslak)"}
      </button>
    </form>
  );

  const renderPressEditor = () => {
    if (!pressData) {
      return (
        <p className="text-xs text-neutral-500 font-mono italic">
          Seçilen basın içeriği bulunamadı ({pressId}).
        </p>
      );
    }

    return (
      <div className="space-y-6">
        <SectionTitle>Basın İçeriği</SectionTitle>
        <Field label="Başlık">
          <input className={inputClass} value={pressData.title || ""} onChange={(event) => handlePressFieldChange("title", event.target.value)} />
        </Field>
        <Field label="Kaynak">
          <input className={inputClass} value={pressData.source || ""} onChange={(event) => handlePressFieldChange("source", event.target.value)} />
        </Field>
        <Field label="Tarih">
          <input className={inputClass} value={pressData.date || ""} onChange={(event) => handlePressFieldChange("date", event.target.value)} />
        </Field>
        <Field label="Tür">
          <select className={inputClass} value={pressData.type || "Duyuru"} onChange={(event) => handlePressFieldChange("type", event.target.value)}>
            {pressTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Açıklama">
          <textarea rows={5} className={inputClass} value={pressData.description || ""} onChange={(event) => handlePressFieldChange("description", event.target.value)} />
        </Field>
        <Field label="Görsel URL / Yol">
          <input className={monoInputClass} value={pressData.image || ""} onChange={(event) => handlePressFieldChange("image", event.target.value)} />
        </Field>
        <Field label="Dış Link">
          <input className={monoInputClass} value={pressData.url || ""} onChange={(event) => handlePressFieldChange("url", event.target.value)} />
        </Field>
        <Field label="Sıralama">
          <input type="number" className={inputClass} value={pressData.order || 0} onChange={(event) => handlePressFieldChange("order", parseInt(event.target.value, 10) || 0)} />
        </Field>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={!!pressData.published} onChange={(event) => handlePressFieldChange("published", event.target.checked)} />
            <span>Yayında</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={!!pressData.featured} onChange={(event) => handlePressFieldChange("featured", event.target.checked)} />
            <span>Öne Çıkan</span>
          </label>
        </div>
      </div>
    );
  };

  const renderRegionEditor = () => {
    if (!regionData) {
      return (
        <p className="text-xs text-neutral-500 font-mono italic">
          Seçilen ilçe bulunamadı ({regionId}).
        </p>
      );
    }

    const updateListField = (field: string, value: string) => {
      const list = value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      handleRegionFieldChange(field, list);
    };

    return (
      <div className="space-y-6">
        <SectionTitle>{regionData.district} Bölgesi</SectionTitle>
        <Field label="Bölge Adı / Başlık">
          <input className={inputClass} value={regionData.title || ""} onChange={(event) => handleRegionFieldChange("title", event.target.value)} />
        </Field>
        <Field label="Durum (Örn: Tamamlandı)">
          <input className={inputClass} value={regionData.status || ""} onChange={(event) => handleRegionFieldChange("status", event.target.value)} />
        </Field>
        <Field label="Açıklama">
          <textarea rows={4} className={inputClass} value={regionData.description || ""} onChange={(event) => handleRegionFieldChange("description", event.target.value)} />
        </Field>
        
        <SectionTitle>Hizmet & Proje Kapsamı</SectionTitle>
        <Field label="Hizmet Detayları (Her satıra bir tane)">
          <textarea
            rows={5}
            className={`${inputClass} resize-none`}
            value={(regionData.services || []).join("\n")}
            onChange={(event) => updateListField("services", event.target.value)}
          />
        </Field>
        <Field label="Proje Yatırımları (Her satıra bir tane)">
          <textarea
            rows={5}
            className={`${inputClass} resize-none`}
            value={(regionData.projectTypes || []).join("\n")}
            onChange={(event) => updateListField("projectTypes", event.target.value)}
          />
        </Field>
        
        <Field label="Bölgesel Not">
          <textarea rows={3} className={inputClass} value={regionData.note || ""} onChange={(event) => handleRegionFieldChange("note", event.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={!!regionData.isActive} onChange={(event) => handleRegionFieldChange("isActive", event.target.checked)} />
            <span>Aktif Hizmet Alanı</span>
          </label>
        </div>
      </div>
    );
  };

  const renderNewPressForm = () => (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!newPressState.title) {
          window.alert("Lütfen basın içeriği başlığını doldurun.");
          return;
        }

        setIsSubmittingNew(true);
        try {
          await context.addNewPressItem(newPressState);
        } finally {
          setIsSubmittingNew(false);
        }
      }}
      className="space-y-5"
    >
      <SectionTitle>Yeni Basın İçeriği</SectionTitle>
      {context.errorMessage && context.saveStatus === "error" && (
        <div className="bg-red-50 text-red-700 p-3 text-xs border border-red-200">
          {context.errorMessage}
        </div>
      )}
      <Field label="Başlık">
        <input className={inputClass} required value={newPressState.title} onChange={(event) => setNewPressState((prev) => ({ ...prev, title: event.target.value }))} />
      </Field>
      <Field label="Kaynak">
        <input className={inputClass} value={newPressState.source} onChange={(event) => setNewPressState((prev) => ({ ...prev, source: event.target.value }))} />
      </Field>
      <Field label="Tarih">
        <input className={inputClass} value={newPressState.date} onChange={(event) => setNewPressState((prev) => ({ ...prev, date: event.target.value }))} />
      </Field>
      <Field label="Tür">
        <select className={inputClass} value={newPressState.type} onChange={(event) => setNewPressState((prev) => ({ ...prev, type: event.target.value }))}>
          {pressTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </Field>
      <Field label="Açıklama">
        <textarea rows={5} className={inputClass} value={newPressState.description} onChange={(event) => setNewPressState((prev) => ({ ...prev, description: event.target.value }))} />
      </Field>
      <Field label="Görsel URL / Yol">
        <input className={monoInputClass} value={newPressState.image} onChange={(event) => setNewPressState((prev) => ({ ...prev, image: event.target.value }))} />
      </Field>
      <Field label="Dış Link">
        <input className={monoInputClass} value={newPressState.url} onChange={(event) => setNewPressState((prev) => ({ ...prev, url: event.target.value }))} />
      </Field>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
          <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={newPressState.published} onChange={(event) => setNewPressState((prev) => ({ ...prev, published: event.target.checked }))} />
          <span>Yayında</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
          <input type="checkbox" className="accent-[var(--color-primary)] h-4 w-4" checked={newPressState.featured} onChange={(event) => setNewPressState((prev) => ({ ...prev, featured: event.target.checked }))} />
          <span>Öne Çıkan</span>
        </label>
      </div>
      <button type="submit" disabled={isSubmittingNew} className="w-full flex items-center justify-center gap-2 bg-dark-bg hover:bg-[var(--color-primary)] disabled:bg-neutral-400 text-dark-text py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] transition-colors cursor-pointer mt-4">
        {isSubmittingNew ? "Ekleniyor..." : "Basın İçeriğini Ekle (Taslak)"}
      </button>
    </form>
  );

  const renderFormFields = () => {
    if (isProjectEdit) return renderProjectEditor();
    if (activeSectionKey === "new-project") return renderNewProjectForm();
    if (isPressEdit) return renderPressEditor();
    if (activeSectionKey === "new-press-item") return renderNewPressForm();
    if (isRegionEdit) return renderRegionEditor();

    switch (activeSectionKey) {
      case "home.hero":
        return (
          <div className="space-y-6">
            <SectionTitle>Ana Hero İçeriği</SectionTitle>
            {renderTextInput("Küçük Üst Etiket", "eyebrow")}
            {renderTextarea("Ana Başlık", "title", 3, { placeholder: "HTML satır atlama için <br /> kullanabilirsiniz." })}
            {renderTextarea("Açıklama Metni", "subtext", 4)}
            <SectionTitle>Birinci Buton</SectionTitle>
            {renderTextInput("Buton Metni", "button1Text")}
            {renderTextInput("Buton Linki", "button1Link", { monospaced: true })}
            <SectionTitle>İkinci Buton</SectionTitle>
            {renderTextInput("Buton Metni", "button2Text")}
            {renderTextInput("Buton Linki", "button2Link", { monospaced: true })}
          </div>
        );
      case "home.statement":
        return (
          <div className="space-y-6">
            <SectionTitle>Felsefe & Giriş Anlatısı</SectionTitle>
            {renderTextInput("Üst Kategori Etiketi", "eyebrow")}
            {renderTextarea("Büyük Vurgulu Başlık", "title", 4)}
            {renderTextarea("Yan Açıklama Paragrafı", "paragraph", 4)}
            <SectionTitle>Sütun 1</SectionTitle>
            {renderTextInput("Numara", "pillar1Number")}
            {renderTextInput("Başlık", "pillar1Title")}
            {renderTextarea("Açıklama", "pillar1Desc", 3)}
            <SectionTitle>Sütun 2</SectionTitle>
            {renderTextInput("Numara", "pillar2Number")}
            {renderTextInput("Başlık", "pillar2Title")}
            {renderTextarea("Açıklama", "pillar2Desc", 3)}
            <SectionTitle>Sütun 3</SectionTitle>
            {renderTextInput("Numara", "pillar3Number")}
            {renderTextInput("Başlık", "pillar3Title")}
            {renderTextarea("Açıklama", "pillar3Desc", 3)}
          </div>
        );
      case "home.featuredIntro":
        return (
          <div className="space-y-6">
            <SectionTitle>Öne Çıkan Projeler</SectionTitle>
            {renderTextInput("Üst Başlık", "supertitle")}
            {renderTextInput("Ana Başlık", "title")}
            {renderTextarea("Açıklama", "description", 4)}
          </div>
        );
      case "home.expertise":
        return (
          <div className="space-y-6">
            <SectionTitle>Uzmanlık Alanlarımız</SectionTitle>
            {renderTextInput("Üst Başlık", "supertitle")}
            {renderTextInput("Ana Başlık", "title")}
            {renderTextarea("Açıklama", "description", 4)}
            {renderObjectList(
              "Alanlar",
              "items",
              [
                { key: "number", label: "Numara (Örn: 01)" },
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", rows: 3 },
              ],
              { number: "05", title: "Yeni Alan", description: "" },
              "Alan Ekle"
            )}
          </div>
        );
      case "home.trust":
        return (
          <div className="space-y-6">
            <SectionTitle>Güven Anlatısı</SectionTitle>
            {renderTextInput("Üst Başlık", "supertitle")}
            {renderTextarea("Ana Başlık", "title", 2)}
            {renderTextarea("Kısa Açıklama", "description1", 3)}
            {renderTextarea("Geniş Açıklama", "description2", 5)}
            {renderStringList("İlkeler (Her satıra bir tane)", "values")}
          </div>
        );
      case "home.process":
        return (
          <div className="space-y-6">
            <SectionTitle>Uygulama Süreci</SectionTitle>
            {renderTextInput("Üst Başlık", "supertitle")}
            {renderTextInput("Ana Başlık", "title")}
            {renderTextarea("Açıklama", "description", 4)}
            {renderObjectList(
              "Süreç Adımları",
              "steps",
              [
                { key: "number", label: "Adım Numarası (Örn: 01)" },
                { key: "title", label: "Adım Başlığı" },
                { key: "description", label: "Adım Açıklaması", rows: 3 },
              ],
              { number: "05", title: "Yeni Adım", description: "" },
              "Adım Ekle"
            )}
          </div>
        );
      case "home.buildingApproach":
        return (
          <div className="space-y-6">
            <SectionTitle>Yapı Standartları</SectionTitle>
            {renderTextInput("Üst Başlık", "supertitle")}
            {renderTextInput("Ana Başlık", "title")}
            {renderTextarea("Açıklama", "description", 4)}
            {renderObjectList(
              "Standartlar",
              "items",
              [
                { key: "number", label: "Madde Numarası (Örn: 01)" },
                { key: "title", label: "Madde Başlığı" },
                { key: "description", label: "Madde Açıklaması", rows: 3 },
              ],
              { number: "05", title: "Yeni Standart", description: "" },
              "Standart Ekle"
            )}
          </div>
        );
      case "home.regions":
        return (
          <div className="space-y-6">
            <SectionTitle>Bölgeler Ana Bilgileri</SectionTitle>
            {renderTextInput("Bölüm Başlığı", "sectionTitle")}
            {renderTextarea("Bölüm Açıklaması", "sectionDescription", 4)}
            {/* Bölgelerin kendisi harita üzerinden (region.X) tıklanınca düzenlenecek */}
            <p className="text-xs text-neutral-500 font-mono italic">
              Harita üzerinden bir bölgeye tıklayarak bölgeye özel içerikleri (hizmetler, açıklama, aktiflik durumu) düzenleyebilirsiniz.
            </p>
          </div>
        );
      case "home.finalCta":
        return (
          <div className="space-y-6">
            <SectionTitle>Final İletişim CTA Alanı</SectionTitle>
            {renderTextInput("Küçük Üst Etiket", "eyebrow")}
            {renderTextarea("Bölüm Başlığı", "title", 3, { placeholder: "HTML satır atlama için <br /> kullanabilirsiniz." })}
            {renderTextarea("Açıklama Paragrafı", "description", 4)}
            <SectionTitle>Birinci Buton</SectionTitle>
            {renderTextInput("Buton Metni", "buttonText")}
            {renderTextInput("Buton Linki", "buttonLink", { monospaced: true })}
            <SectionTitle>İkinci Buton</SectionTitle>
            {renderTextInput("Buton Metni", "secondaryButtonText")}
            {renderTextInput("Buton Linki", "secondaryButtonLink", { monospaced: true })}
          </div>
        );
      case "global.settings":
        return (
          <div className="space-y-6">
            <SectionTitle>Global Site Ayarları & Footer</SectionTitle>
            {renderTextInput("Firma / Site Adı", "siteName")}
            {renderTextarea("Footer Açıklaması", "footerDescription", 3)}
            {renderTextInput("Footer Copyright", "footerCopyright")}
            <SectionTitle>Header İletişim (Sağ Üst)</SectionTitle>
            {renderTextInput("İletişim Metni", "headerCtaText")}
            {renderTextInput("İletişim Linki", "headerCtaLink")}
            <SectionTitle>Meta & SEO</SectionTitle>
            {renderTextInput("Varsayılan OG Görsel Yolu", "defaultOgImage")}
          </div>
        );
      case "contact.hero":
        return (
          <div className="space-y-6">
            <SectionTitle>İletişim Hero</SectionTitle>
            {renderTextInput("Üst Etiket", "eyebrow")}
            {renderTextInput("Başlık İlk Satır", "title")}
            {renderTextInput("Vurgulu Başlık", "highlight")}
            {renderTextarea("Açıklama", "description", 4)}
          </div>
        );
      case "contact.quickActions":
        return (
          <div className="space-y-6">
            {renderObjectList(
              "Hızlı İletişim Kartları",
              "actions",
              [
                { key: "title", label: "Başlık" },
                { key: "text", label: "Metin", rows: 2 },
                { key: "linkText", label: "Link Metni" },
              ],
              { key: "phone", title: "Yeni Kart", text: "", linkText: "Git" },
              "Kart Ekle"
            )}
          </div>
        );
      case "contact.intent":
        return (
          <div className="space-y-6">
            <SectionTitle>İletişim Konu Kartları</SectionTitle>
            {renderTextInput("Başlık", "title")}
            {renderTextarea("Açıklama", "description", 3)}
            {renderObjectList(
              "Konu Kartları",
              "cards",
              [
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", rows: 2 },
                { key: "subject", label: "Form Konusu" },
                { key: "projectType", label: "Form Proje Türü" },
              ],
              { id: `intent-${Date.now()}`, title: "Yeni Konu", description: "", subject: "", projectType: "Diğer", icon: "building" },
              "Konu Kartı Ekle"
            )}
          </div>
        );
      case "contact.info":
        return (
          <div className="space-y-6">
            <SectionTitle>İletişim Bilgileri</SectionTitle>
            {renderTextInput("Başlık", "title")}
            {renderTextInput("Adres Etiketi", "addressLabel")}
            {renderTextInput("Telefon Etiketi", "phoneLabel")}
            {renderTextInput("E-posta Etiketi", "emailLabel")}
            {renderTextInput("Sosyal Medya Başlığı", "socialsTitle")}
            <SectionTitle>Harita</SectionTitle>
            {renderTextInput("Harita Başlığı", "mapTitle")}
            {renderTextarea("Harita Açıklaması", "mapDescription", 3)}
            {renderTextInput("Harita Buton Metni", "mapButtonText")}
          </div>
        );
      case "contact.form":
        return (
          <div className="space-y-6">
            <SectionTitle>Form Giriş Metni</SectionTitle>
            {renderTextInput("Başlık", "title")}
            {renderTextarea("Açıklama", "description", 3)}
            <SectionTitle>Alan Etiketleri</SectionTitle>
            {renderTextInput("Ad Etiketi", "nameLabel")}
            {renderTextInput("Ad Placeholder", "namePlaceholder")}
            {renderTextInput("Telefon Etiketi", "phoneLabel")}
            {renderTextInput("Telefon Placeholder", "phonePlaceholder")}
            {renderTextInput("E-posta Etiketi", "emailLabel")}
            {renderTextInput("E-posta Placeholder", "emailPlaceholder")}
            {renderTextInput("Konu Etiketi", "subjectLabel")}
            {renderTextInput("Konu Placeholder", "subjectPlaceholder")}
            {renderTextInput("Proje Türü Etiketi", "projectTypeLabel")}
            {renderTextInput("Proje Türü Placeholder", "projectTypePlaceholder")}
            {renderTextInput("Bölge Etiketi", "regionLabel")}
            {renderTextInput("Bölge Placeholder", "regionPlaceholder")}
            {renderTextInput("Mesaj Etiketi", "messageLabel")}
            {renderTextarea("Mesaj Placeholder", "messagePlaceholder", 3)}
            <SectionTitle>Seçenekler</SectionTitle>
            {renderStringList("Proje Türü Seçenekleri", "projectTypeOptions")}
            {renderStringList("Bölge Seçenekleri", "regionOptions")}
            <SectionTitle>Durum Mesajları</SectionTitle>
            {renderTextInput("Buton Metni", "submitText")}
            {renderTextarea("Alt Bilgi", "helperText", 3)}
            {renderTextInput("Başarı Başlığı", "successTitle")}
            {renderTextInput("Başarı Metni", "successText")}
            {renderTextarea("Zorunlu Alan Hatası", "requiredError", 2)}
            {renderTextarea("İletişim Hatası", "contactError", 2)}
            {renderTextarea("Gönderim Hatası", "submitError", 3)}
          </div>
        );
      case "contact.process":
        return (
          <div className="space-y-6">
            <SectionTitle>İletişim Süreci</SectionTitle>
            {renderTextInput("Başlık", "title")}
            {renderTextarea("Açıklama", "description", 3)}
            {renderObjectList(
              "Süreç Adımları",
              "steps",
              [
                { key: "number", label: "Numara" },
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", rows: 2 },
              ],
              { number: "04", title: "Yeni Adım", description: "" },
              "Adım Ekle"
            )}
          </div>
        );
      case "contact.cta":
        return (
          <div className="space-y-6">
            <SectionTitle>İletişim CTA</SectionTitle>
            {renderTextarea("Başlık", "title", 3)}
            {renderTextarea("Açıklama", "description", 3)}
            {renderTextInput("Telefon Buton Metni", "phoneButtonText")}
            {renderTextInput("WhatsApp Buton Metni", "whatsappButtonText")}
          </div>
        );
      case "press.hero":
        return (
          <div className="space-y-6">
            <SectionTitle>Basın Hero</SectionTitle>
            {renderTextInput("Üst Etiket", "eyebrow")}
            {renderTextInput("Başlık", "title")}
            {renderTextarea("Açıklama", "description", 4)}
          </div>
        );
      case "press.empty":
        return (
          <div className="space-y-6">
            <SectionTitle>Basın Boş Durum</SectionTitle>
            {renderTextInput("Üst Etiket", "eyebrow")}
            {renderTextInput("Başlık", "title")}
            {renderTextarea("Açıklama", "description", 3)}
            {renderTextarea("İkincil Metin", "secondaryText", 3)}
            {renderTextInput("Buton Metni", "buttonText")}
          </div>
        );
      case "press.mediaKit":
        return (
          <div className="space-y-6">
            <SectionTitle>Medya Kiti</SectionTitle>
            {renderTextInput("Başlık", "title")}
            {renderTextarea("Açıklama", "description", 4)}
            {renderTextInput("Talep Metni", "requestText")}
            {renderObjectList(
              "Medya Kiti Öğeleri",
              "items",
              [
                { key: "title", label: "Başlık" },
                { key: "description", label: "Açıklama", rows: 3 },
              ],
              { title: "Yeni Öğe", description: "" },
              "Öğe Ekle"
            )}
          </div>
        );
      case "press.projectsCta":
      case "press.finalCta":
        return (
          <div className="space-y-6">
            <SectionTitle>{activeSectionKey === "press.projectsCta" ? "Projeler CTA" : "Final CTA"}</SectionTitle>
            {renderTextarea("Başlık", "title", 3)}
            {renderTextarea("Açıklama", "description", 4)}
            {renderTextInput("Buton Metni", "buttonText")}
          </div>
        );
      default:
        return (
          <p className="text-xs text-neutral-500 font-mono italic">
            Bu bölüm için form alanı tanımlanmamış.
          </p>
        );
    }
  };

  const sectionLabel = (() => {
    if (isProjectEdit) return `Proje Düzenleme: ${projectData?.title || ""}`;
    if (isPressEdit) return `Basın İçeriği: ${pressData?.title || ""}`;
    if (activeSectionKey === "new-project") return "Yeni Proje Ekle";
    if (activeSectionKey === "new-press-item") return "Yeni Basın İçeriği";

    const labels: Record<string, string> = {
      "home.hero": "Hero Bölümü",
      "home.statement": "Yapı Felsefesi",
      "home.featuredIntro": "Öne Çıkan Projeler",
      "home.expertise": "Uzmanlık Alanlarımız",
      "home.trust": "Güven Anlatısı",
      "home.process": "Uygulama Süreci",
      "home.buildingApproach": "Yapı Standartları",
      "home.regions": "Bölgeler Ana Bilgileri",
      "home.finalCta": "Final CTA İletişim",
      "global.settings": "Site Ayarları",
      "contact.hero": "İletişim Hero",
      "contact.quickActions": "Hızlı İletişim",
      "contact.intent": "İletişim Konuları",
      "contact.info": "İletişim Bilgileri",
      "contact.form": "İletişim Formu",
      "contact.process": "İletişim Süreci",
      "contact.cta": "İletişim CTA",
      "press.hero": "Basın Hero",
      "press.empty": "Basın Boş Durum",
      "press.mediaKit": "Medya Kiti",
      "press.projectsCta": "Projeler CTA",
      "press.finalCta": "Final CTA",
    };

    return labels[activeSectionKey] || activeSectionKey;
  })();

  return (
    <div className="fixed top-[60px] right-0 bottom-0 z-[150] w-[380px] border-l border-neutral-200 bg-surface text-[var(--color-text)] flex flex-col select-none shadow-[0_-8px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between border-b border-neutral-200 p-5">
        <div className="flex flex-col">
          <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">
            Aktif Alan
          </span>
          <span className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide mt-0.5">
            {sectionLabel}
          </span>
        </div>
        <button
          onClick={closeSectionEditor}
          type="button"
          className="flex h-7 w-7 items-center justify-center border border-neutral-200 text-neutral-400 hover:text-text hover:border-black transition-colors cursor-pointer"
          title="Kapat"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {renderFormFields()}
      </div>

      <div className="border-t border-neutral-200 bg-[var(--color-surface)] p-4 text-center">
        <span className="flex items-center justify-center gap-1.5 font-mono text-[9px] text-green-700 uppercase tracking-widest">
          <Check size={11} strokeWidth={3} />
          Otomatik taslak kaydedildi
        </span>
        <p className="mt-1.5 font-sans text-[10px] text-neutral-500">
          Değişikliklerin yayına alınması için üst bar üzerindeki "Kaydet & Yayınla" butonuna basılması gerekir.
        </p>
      </div>
    </div>
  );
}
