import { Container } from "@/components/ui/Container";
import type { ShowroomPage } from "@/data/showroomPages";

type ShowroomPageContentProps = {
  page: ShowroomPage;
};

export function ShowroomPageContent({ page }: ShowroomPageContentProps) {
  return (
    <main className="min-h-screen bg-[#F4F2ED] pb-32 pt-32 text-[#08090B] sm:pt-36">
      <Container>
        <div className="grid min-h-[calc(100vh-12rem)] gap-12 border-t border-black/10 pt-10 md:grid-cols-[0.72fr_1fr] md:items-start md:gap-16">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C5162E]">
              {page.eyebrow}
            </p>
            <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-text/35">
              TANER TÜMER İNŞAAT / {page.metric}
            </p>
          </div>

          <div>
            <h1 className="max-w-4xl text-[clamp(48px,8vw,118px)] font-medium leading-[0.88] tracking-[-0.055em] text-[#08090B]">
              {page.title}
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-text/62 sm:text-xl">
              {page.description}
            </p>

            <div className="mt-20 grid gap-4 border-t border-black/10 pt-8 text-sm font-medium text-text/55 sm:grid-cols-3">
              <span>Mimari odak</span>
              <span>Premium deneyim</span>
              <span>Teknik anlatı</span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
