"use client";

import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";
import { useEditableContent } from "@/hooks/useEditableContent";
import { EditableSection } from "@/components/admin/EditableSection";

export function HomeStatement({ initialData }: { initialData?: any }) {
  const defaultStatementData = {
    eyebrow: "YAPI FELSEFEMİZ",
    title: "Yaşam alanlarını yalnızca inşa etmiyor; güven, konfor ve uzun ömürlü değer üzerine tasarlıyoruz.",
    paragraph: "Villa, konut ve yaşam projelerinde; planlama, malzeme seçimi ve uygulama kalitesini aynı bütünün ayrılmaz parçaları olarak ele alıyoruz.",
    pillar1Number: "01 / YAKLAŞIM",
    pillar1Title: "Modern Mimari Yaklaşım",
    pillar1Desc: "Estetik çizgiler, fonksiyonel mekan kurgusu ve çevreyle uyumlu yaşam senaryolarını modern mühendislikle bütünleştiriyoruz.",
    pillar2Number: "02 / STANDART",
    pillar2Title: "Kaliteli Malzeme Seçimi",
    pillar2Desc: "Yapılarımızın estetik karakterini korurken uzun yıllar güvenli, konforlu ve masrafsız kullanım sağlayan marka seçimleri yapıyoruz.",
    pillar3Number: "03 / DİSİPLİN",
    pillar3Title: "Detaylı Uygulama Disiplini",
    pillar3Desc: "Projelerimizi kağıt üstündeki kusursuz detaylardan şantiyedeki milimetrik imalatlara kadar tavizsiz bir kontrol ve işçilik kalitesiyle hayata geçiriyoruz.",
  };

  const data = useEditableContent("home.statement", initialData || defaultStatementData);


  return (
    <EditableSection sectionKey="home.statement" label="Yapı Felsefesi">
      <section
        data-header-theme="light"
        className="bg-site-bg py-28 text-site-text sm:py-36 lg:py-44"
        id="statement"
      >
        <Container>
          {/* Asymmetrical Top Layout */}
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <Reveal>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-site-accent">
                {data.eyebrow}
              </p>
              <h2 className="mt-8 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl text-site-text">
                {data.title}
              </h2>
            </Reveal>

            <div className="flex flex-col justify-end lg:pb-4">
              <Reveal delay={0.1}>
                <p className="text-lg leading-relaxed text-site-body sm:text-xl sm:leading-relaxed">
                  {data.paragraph}
                </p>
              </Reveal>
            </div>
          </div>

          {/* Separator line */}
          <div className="my-16 border-t border-site-border sm:my-20" />

          {/* Bottom Three Pillars */}
          <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-16">
            <Reveal delay={0.05}>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-site-accent mb-4">{data.pillar1Number}</span>
                <h3 className="text-2xl font-bold tracking-tight mb-3 text-site-text">{data.pillar1Title}</h3>
                <p className="text-sm leading-relaxed text-site-body">
                  {data.pillar1Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-site-accent mb-4">{data.pillar2Number}</span>
                <h3 className="text-2xl font-bold tracking-tight mb-3 text-site-text">{data.pillar2Title}</h3>
                <p className="text-sm leading-relaxed text-site-body">
                  {data.pillar2Desc}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.19}>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-site-accent mb-4">{data.pillar3Number}</span>
                <h3 className="text-2xl font-bold tracking-tight mb-3 text-site-text">{data.pillar3Title}</h3>
                <p className="text-sm leading-relaxed text-site-body">
                  {data.pillar3Desc}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </EditableSection>
  );
}
