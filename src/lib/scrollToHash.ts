export function hardScrollToTop() {
  if (typeof window === "undefined") return;

  window.history.scrollRestoration = "manual";

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

export function smoothScrollToTop() {
  if (typeof window === "undefined") return;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

export function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;

  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!cleanHash) return;

  const element = document.getElementById(cleanHash);
  if (!element) return;

  const offset = 96;

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    offset;

  window.scrollTo({
    top,
    left: 0,
    behavior,
  });
}

export function hardScrollToHash(hash: string) {
  if (typeof window === "undefined") return;

  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;

  if (!cleanHash) {
    hardScrollToTop();
    return;
  }

  const element = document.getElementById(cleanHash);

  if (!element) {
    hardScrollToTop();
    return;
  }

  const offset = 96;

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    offset;

  window.history.scrollRestoration = "manual";
  window.scrollTo({ top, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;

  requestAnimationFrame(() => {
    window.scrollTo({ top, left: 0, behavior: "auto" });
  });
}

export function hardScrollToHashWithRetry(hash: string, attempts = 8) {
  if (typeof window === "undefined") return;

  let count = 0;

  const run = () => {
    const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
    const element = document.getElementById(cleanHash);

    if (element) {
      hardScrollToHash(hash);
      return;
    }

    count += 1;

    if (count >= attempts) {
      hardScrollToTop();
      return;
    }

    window.setTimeout(run, 50);
  };

  run();
}
