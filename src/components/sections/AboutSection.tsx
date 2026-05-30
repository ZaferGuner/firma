import Image from "next/image";

import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { aboutValues } from "@/data/home";

export function AboutSection() {
  return (
    <section data-header-theme="light" id="about" className="bg-[#F4F2ED] py-24 text-background sm:py-32 lg:py-40">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
              Hakkımızda
            </p>
            <h2 className="mt-5 text-[clamp(42px,7vw,94px)] font-medium leading-[0.9] tracking-[-0.058em]">
              Güven üzerine kurulan yapılar.
            </h2>
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-text/62 sm:text-xl">
              Taner Tümer İnşaat, projelerinde estetik mimariyi, sağlam
              mühendislik yaklaşımını ve kullanıcı odaklı yaşam çözümlerini
              bir araya getirir. Her yapı; bulunduğu çevreye değer katmak,
              uzun yıllar güvenle kullanılmak ve sakinlerine nitelikli bir
              yaşam sunmak için geliştirilir.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative overflow-hidden bg-background">
              <div className="relative aspect-[4/5]">
                <Image
                  alt="Mimari cephe ve yapı detayı"
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  src="/images/projects/hero-house.jpg"
                  style={{
                    filter: "brightness(0.78) contrast(1.03) saturate(0.82)",
                    objectPosition: "58% center",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 border border-black/10">
              {aboutValues.map((value) => (
                <div
                  className="min-h-[112px] border-b border-r border-black/10 p-5 text-sm font-medium text-text/66 odd:border-r last:border-b-0 [&:nth-last-child(2)]:border-b-0"
                  key={value}
                >
                  {value}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
