"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnchorHTMLAttributes } from "react";
import { useIframeTransition } from "./IframeTransitionProvider";
import { isSpecialHref, isSamePageHash, isSamePageNoHash } from "@/lib/transitionNavigation";
import { scrollToHash, smoothScrollToTop } from "@/lib/scrollToHash";
import { usePageIntro } from "@/providers/PageIntroProvider";

type IframeTransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export function IframeTransitionLink({
  href,
  children,
  className,
  onClick,
  target,
  ...props
}: IframeTransitionLinkProps) {
  const { navigate } = useIframeTransition();
  const { suppressNextPageIntro } = usePageIntro();
  const pathname = usePathname();
  const hrefStr = href.toString();

  const isExternalOrSpecial = isSpecialHref(hrefStr) || target === "_blank";

  if (isExternalOrSpecial) {
    return (
      <a href={hrefStr} className={className} onClick={onClick} target={target} {...props}>
        {children}
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }

    if (e.defaultPrevented) return;
    if (isSpecialHref(hrefStr)) return;

    if (isSamePageHash(hrefStr, pathname)) {
      e.preventDefault();
      const hash = hrefStr.split("#")[1] || "";
      scrollToHash(hash, "smooth");
      return;
    }

    if (isSamePageNoHash(hrefStr, pathname)) {
      e.preventDefault();
      smoothScrollToTop();
      return;
    }

    // Different page
    e.preventDefault();
    suppressNextPageIntro("transition-link");
    window.setTimeout(() => {
      navigate(hrefStr);
    }, 90);
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      target={target}
      scroll={false}
      {...props}
    >
      {children}
    </Link>
  );
}
