import { Reveal } from "@/components/animation/Reveal";
import { Container } from "@/components/ui/Container";

export function IntroSection() {
  return (
    <section data-header-theme="light" className="bg-[#F4F2ED] py-24 text-background sm:py-32 lg:py-40">
      <Container>
        <Reveal className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            Yapı anlayışı
          </p>
          <h2 className="mt-8 text-[clamp(36px,6.8vw,86px)] font-medium leading-[0.95] tracking-[-0.055em]">
            Yaşam alanlarını yalnızca inşa etmiyoruz; güven, konfor ve
            uzun ömürlü mimari değer üzerine tasarlıyoruz.
          </h2>
        </Reveal>

        <Reveal
          className="mt-12 grid gap-8 border-t border-black/10 pt-8 lg:grid-cols-[0.8fr_1fr]"
          delay={0.08}
        >
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-text/38">
            Taner Tümer İnşaat / Modern yapı disiplini
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-text/62 sm:text-xl">
            Taner Tümer İnşaat, modern yapı anlayışını, estetik mimari
            çizgileri ve güvenilir uygulama disiplinini bir araya getirerek
            nitelikli yaşam alanları geliştirir.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
