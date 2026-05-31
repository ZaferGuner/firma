"use client";

import { StatusPage } from "@/components/status/StatusPage";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusPage
      label="HATA"
      title="Bir şeyler ters gitti"
      description="Sayfayı yüklerken beklenmeyen bir sorun oluştu. Yeniden deneyebilir veya ana sayfaya dönebilirsiniz."
      primaryActionLabel="Tekrar Dene"
      primaryActionOnClick={() => reset()}
      secondaryActionLabel="Ana Sayfa"
      secondaryActionHref="/"
    />
  );
}
