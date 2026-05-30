import Image from "next/image";

import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { ContactTrigger } from "@/components/ui/ContactTrigger";
import { IframeTransitionLink } from "@/components/animation/IframeTransitionLink";

export function FinalCTA() {
  return (
    <section data-header-theme="dark" className="relative overflow-hidden bg-background py-16 text-text sm:py-20 lg:py-24">
      <div className="absolute inset-0 opacity-[0.22]">
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover"
          fill
          sizes="100vw"
          src="/images/projects/hero-house.jpg"
          style={{ filter: "grayscale(1) brightness(0.42)" }}
        />
      </div>
      <div className="absolute inset-0 bg-background/78" />

      <Container className="relative z-10">
        <Reveal className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            Birlikte planlayalım
          </p>
          <h2 className="mt-6 text-[clamp(42px,8vw,104px)] font-medium leading-[0.9] tracking-[-0.058em]">
            Yeni yaşam alanınızı birlikte planlayalım.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text/64 sm:text-xl">
            Projelerimiz, teslim süreçleri and satış seçenekleri hakkında
            detaylı bilgi almak için bizimle iletişime geçin.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ContactTrigger className="inline-flex h-12 items-center justify-center bg-foreground px-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-background transition-colors hover:bg-primary hover:text-text">
              Bilgi Al
            </ContactTrigger>
            <IframeTransitionLink
              className="inline-flex h-12 items-center justify-center border border-white/16 bg-surface/[0.06] px-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-text transition-colors hover:bg-surface/[0.1]"
              href="/projects"
            >
              Projeleri İncele
            </IframeTransitionLink>
            <IframeTransitionLink
              className="inline-flex h-12 items-center justify-center bg-primary px-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-text transition-colors hover:bg-[#A81025]"
              href="/contact"
            >
              İletişim
            </IframeTransitionLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
