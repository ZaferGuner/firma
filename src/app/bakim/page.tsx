import { StatusPage } from "@/components/status/StatusPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bakımdayız | Taner Tümer İnşaat",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <StatusPage
      label="BAKIM"
      title="Kısa bir bakımdayız"
      description="Taner Tümer İnşaat web sitesi daha iyi bir deneyim için güncelleniyor. Kısa süre içinde tekrar yayında olacağız."
      primaryActionLabel="WhatsApp ile İletişime Geç"
      primaryActionHref="https://wa.me/905330618001?text=Merhaba%2C%20Taner%20T%C3%BCmer%20%C4%B0n%C5%9Faat%20projeleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
      secondaryActionLabel="Ana Sayfa"
      secondaryActionHref="/"
      showContact={true}
    />
  );
}
