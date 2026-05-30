export function isSpecialHref(href: string): boolean {
  if (!href) return true;
  const trimmed = href.trim().toLowerCase();
  if (trimmed === "") return true;

  return (
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.includes("wa.me")
  );
}

export function normalizeHref(href: string): string {
  if (!href) return "";
  return href.trim();
}

export function getHrefParts(href: string) {
  const cleaned = normalizeHref(href);
  const hashIndex = cleaned.indexOf("#");
  
  if (hashIndex === -1) {
    return { path: cleaned, hash: "" };
  }

  return {
    path: cleaned.slice(0, hashIndex),
    hash: cleaned.slice(hashIndex),
  };
}

export function normalizePath(path: string): string {
  if (!path) return "/";
  const cleaned = path.split("?")[0].trim();
  if (cleaned === "") return "/";
  if (cleaned !== "/" && cleaned.endsWith("/")) {
    return cleaned.slice(0, -1);
  }
  return cleaned;
}

export function isSamePageHash(href: string, currentPathname: string): boolean {
  if (!href) return false;

  const { path, hash } = getHrefParts(href);
  if (!hash) return false;
  if (path === "") return true;

  return normalizePath(path) === normalizePath(currentPathname);
}

export function isSamePageNoHash(href: string, currentPathname: string): boolean {
  if (!href) return false;

  const { path, hash } = getHrefParts(href);
  if (hash) return false;
  if (path === "") return true;

  return normalizePath(path) === normalizePath(currentPathname);
}

export function shouldTransition(href: string, currentPathname: string): boolean {
  if (isSpecialHref(href)) return false;
  if (isSamePageHash(href, currentPathname)) return false;
  if (isSamePageNoHash(href, currentPathname)) return false;
  
  return true;
}
