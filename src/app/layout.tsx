import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { IframeTransitionProvider } from "@/components/animation/IframeTransitionProvider";
import { IframeTransitionOverlay } from "@/components/animation/IframeTransitionOverlay";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { db } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const globalSettings = await db.getSectionContent("global", "settings") || { siteName: "Taner Tümer İnşaat" };
  const seoHome = await db.getSectionContent("seo", "home") || { title: "Mimari Proje Deneyimi", description: "Taner Tümer İnşaat için premium, teknolojik ve mimari odaklı proje deneyimi." };

  return {
    title: {
      template: `%s | ${globalSettings.siteName}`,
      default: `${seoHome.title} | ${globalSettings.siteName}`,
    },
    description: seoHome.description,
  };
}

import { IframePreviewBoot } from "@/components/animation/IframePreviewBoot";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { PageIntroProvider } from "@/providers/PageIntroProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSettings = await db.getSectionContent("global", "settings") || {};

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="bg-background text-text antialiased">
        <Suspense fallback={null}>
          <IframePreviewBoot />
        </Suspense>
        <PageIntroProvider>
          <IframeTransitionProvider>
            <SmoothScroll>
              <Header initialCtaText={globalSettings.headerCtaText} initialCtaLink={globalSettings.headerCtaLink} />
              {children}
            </SmoothScroll>
            <IframeTransitionOverlay />
            <FloatingWhatsApp />
          </IframeTransitionProvider>
        </PageIntroProvider>
      </body>
    </html>
  );
}
