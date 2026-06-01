export function slugifyTurkish(input: string) {
  return input
    .trim()
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function sanitizeFileName(fileName: string) {
  const parts = fileName.split(".");
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
  const baseName = slugifyTurkish(parts.join(".") || "image") || "image";
  return extension ? `${baseName}.${extension}` : baseName;
}
