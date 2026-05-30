export const TRANSITION_PREVIEW_PARAM = "__ttPreview";

export function isTransitionPreviewHref() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  return (
    params.get(TRANSITION_PREVIEW_PARAM) === "1" ||
    params.get("__transitionPreview") === "1"
  );
}

export function toIframePreviewHref(href: string) {
  if (!href) return href;

  const [withoutHash, hashPart] = href.split("#");
  const hash = hashPart ? `#${hashPart}` : "";

  const base = withoutHash || "/";

  const hasQuery = base.includes("?");

  // Add both params to cover all bases beautifully
  const previewHref = hasQuery
    ? `${base}&${TRANSITION_PREVIEW_PARAM}=1&__transitionPreview=1`
    : `${base}?${TRANSITION_PREVIEW_PARAM}=1&__transitionPreview=1`;

  return `${previewHref}${hash}`;
}
