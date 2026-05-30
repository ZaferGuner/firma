export function isExternalHref(href: string): boolean {
  if (!href) return false;

  const trimmed = href.trim().toLowerCase();
  return (
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("whatsapp:") ||
    trimmed.startsWith("sms:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  );
}

export function getHashFromHref(href: string): string | null {
  if (!href) return null;
  const index = href.indexOf("#");
  if (index === -1) return null;
  const hash = href.slice(index);
  return hash || null;
}

export function isSamePageHash(href: string, currentPathname: string): boolean {
  if (!href) return false;

  const trimmed = href.trim();
  if (trimmed.startsWith("#")) {
    return true;
  }

  if (!trimmed.startsWith("/")) {
    return false;
  }

  const [path, hash] = trimmed.split("#");
  if (!hash) return false;

  return normalizePathname(path) === normalizePathname(currentPathname);
}

export function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  const normalized = pathname.trim().split("#")[0].split("?")[0];
  if (normalized === "") return "/";
  if (normalized !== "/" && normalized.endsWith("/")) {
    return normalized.slice(0, -1);
  }
  return normalized;
}

export function getPathFromHref(href: string): string {
  if (!href) return "/";
  const trimmed = href.trim();
  const pathname = trimmed.split("#")[0].split("?")[0];
  return normalizePathname(pathname || "/");
}

export function shouldUseRouteTransition(
  href: string,
  currentPathname: string,
): boolean {
  if (!href) return false;
  if (isExternalHref(href)) return false;
  if (isSamePageHash(href, currentPathname)) return false;

  const targetPath = getPathFromHref(href);
  if (normalizePathname(currentPathname) === targetPath) return false;

  return targetPath.startsWith("/");
}
