"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export function ProjectsCTA() {
  return (
    <section className="px-6 md:px-12 py-16 md:py-24 bg-[#f4f2ed] border-t border-[rgba(0,0,0,0.12)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
        {/* Left text column */}
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111] leading-tight">
            Yeni yaşam alanınız için bizimle görüşün.
          </h2>
          <p className="text-sm md:text-base text-[rgba(0,0,0,0.55)] leading-relaxed">
            Projelerimiz, teslim süreçleri ve uygun daire seçenekleri hakkında bilgi almak için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        {/* Right buttons column */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
          <Link
            href="/iletisim"
            className="flex h-13 items-center justify-center gap-2 bg-[#C5162E] hover:bg-[#A31224] text-white px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-none cursor-pointer"
          >
            <span>İLETİŞİME GEÇ</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href="tel:+905330618001"
            className="flex h-13 items-center justify-center gap-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white px-8 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-none cursor-pointer"
          >
            <Phone size={14} />
            <span>TELEFONLA ARA</span>
          </a>
        </div>
      </div>
    </section>
  );
}
