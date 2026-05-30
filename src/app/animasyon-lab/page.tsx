import type { Metadata } from "next";

import { AnimationLab } from "@/components/animation-lab/AnimationLab";

export const metadata: Metadata = {
  title: "Animasyon Laboratuvarı | Taner Tümer İnşaat",
  description:
    "Taner Tümer İnşaat sitesi için mikro animasyon ve etkileşim test alanı.",
};

export default function AnimasyonLabPage() {
  return <AnimationLab />;
}
