import { useContext } from "react";
import { AdminEditContext } from "@/context/AdminEditContext";

/**
 * Visual Editor Custom Data Hook
 * Decouples rendering:
 * - Public Visitors: Returns the static baseline or published database content instantly (zero performance impact).
 * - Admin Visual Editor: Connects to the React draft state, supporting live preview updates as the admin typing inputs.
 */
export function useEditableContent<T>(sectionKey: string, defaultValue: T): T {
  const context = useContext(AdminEditContext);

  // 1. Context is absent (meaning public visitor mode). Return published value immediately.
  if (!context) {
    return defaultValue;
  }

  // 2. Visual Editor Mode. Return active database-backed draft content.
  if (sectionKey.startsWith("project.")) {
    const slug = sectionKey.substring("project.".length);
    const draftProj = context.draftProjects.find((p: any) => p.slug === slug);
    return (draftProj as unknown as T) || defaultValue;
  }

  if (sectionKey.startsWith("pressItem.")) {
    const id = sectionKey.substring("pressItem.".length);
    const draftPressItem = context.draftPressItems.find((item: any) => item.id === id);
    return (draftPressItem as unknown as T) || defaultValue;
  }

  return (context.draftContent[sectionKey] as T) || defaultValue;
}
export default useEditableContent;
