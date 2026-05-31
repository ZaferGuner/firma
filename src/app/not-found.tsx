import { StatusPage } from "@/components/status/StatusPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı | Taner Tümer İnşaat",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <StatusPage
      label="404"
      title="Aradığınız sayfa bulunamadı"
      description="Sayfa taşınmış, kaldırılmış veya adres yanlış yazılmış olabilir."
      primaryActionLabel="Ana Sayfaya Dön"
      primaryActionHref="/"
      secondaryActionLabel="Projeleri İncele"
      secondaryActionHref="/projeler"
    />
  );
}
