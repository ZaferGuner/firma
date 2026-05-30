import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { ContactTrigger } from "@/components/ui/ContactTrigger";
import { contactInfo } from "@/data/home";

export function ContactOfficeSection() {
  return (
    <section data-header-theme="light"
      className="bg-[#F4F2ED] py-24 text-background sm:py-32 lg:py-40"
      id="contact"
    >
      <Container>
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <div className="flex min-h-[620px] flex-col justify-between bg-background p-7 text-text sm:p-10">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                  Satış Ofisi
                </p>
                <h2 className="mt-5 text-[clamp(38px,6vw,76px)] font-medium leading-[0.94] tracking-[-0.055em]">
                  Projeler hakkında detaylı bilgi alın.
                </h2>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-text/62 sm:text-lg">
                  Projelerimiz hakkında detaylı bilgi almak, fiyatlandırma ve
                  uygun seçenekleri görüşmek için bizimle iletişime
                  geçebilirsiniz.
                </p>
              </div>

              <div className="mt-12 divide-y divide-white/10">
                <a
                  className="flex items-center justify-between gap-4 py-5 text-text/78 transition-colors hover:text-text"
                  href={contactInfo.phoneHref}
                >
                  <span className="flex items-center gap-3">
                    <Phone size={16} strokeWidth={1.7} />
                    Telefon
                  </span>
                  <span>{contactInfo.phone}</span>
                </a>
                <a
                  className="flex items-center justify-between gap-4 py-5 text-text/78 transition-colors hover:text-text"
                  href={contactInfo.emailHref}
                >
                  <span className="flex items-center gap-3">
                    <Mail size={16} strokeWidth={1.7} />
                    E-posta
                  </span>
                  <span>{contactInfo.email}</span>
                </a>
                <a
                  className="flex items-center justify-between gap-4 py-5 text-text/78 transition-colors hover:text-text"
                  href={contactInfo.mapsHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="flex items-center gap-3">
                    <MapPin size={16} strokeWidth={1.7} />
                    Adres
                  </span>
                  <span>{contactInfo.address}</span>
                </a>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex h-12 items-center justify-center bg-foreground px-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-background transition-colors hover:bg-primary hover:text-text"
                  href={contactInfo.whatsappHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  WhatsApp ile İletişime Geç
                </a>
                <ContactTrigger className="inline-flex h-12 items-center justify-center border border-white/12 bg-surface/[0.06] px-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-text transition-colors hover:bg-surface/[0.1]">
                  Bilgi Al
                </ContactTrigger>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative min-h-[420px] overflow-hidden bg-dark-bg lg:min-h-[620px]">
              <Image
                alt="Taner Tümer İnşaat satış ofisi ve proje atmosferi"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                src="/images/projects/hero-house.jpg"
                style={{
                  filter: "brightness(0.78) contrast(1.04) saturate(0.82)",
                  objectPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/12 to-transparent" />
              <a
                className="absolute bottom-7 left-7 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-text/82 transition-colors hover:text-dark-text sm:bottom-10 sm:left-10"
                href={contactInfo.mapsHref}
                rel="noreferrer"
                target="_blank"
              >
                Google Maps bağlantısı
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
