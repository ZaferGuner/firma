import React from "react";

export interface StatusPageProps {
  label: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  primaryActionOnClick?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  showContact?: boolean;
}

export function StatusPage({
  label,
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  primaryActionOnClick,
  secondaryActionLabel,
  secondaryActionHref,
  showContact,
}: StatusPageProps) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#F7F4EF] text-[#2E2E2B] relative overflow-hidden font-sans">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E1DDD4 1px, transparent 1px),
            linear-gradient(to bottom, #E1DDD4 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Background typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-5">
        <span className="font-mono text-[20vw] font-bold tracking-tighter whitespace-nowrap text-[#74746A]">
          {label}
        </span>
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center mb-8 px-3 py-1 rounded-full border border-[#E1DDD4] bg-[#FFFEFA]">
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#74746A] uppercase">
            {label}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {title}
        </h1>

        <p className="text-sm md:text-base text-[#76736C] leading-relaxed mb-10 max-w-md mx-auto">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryActionLabel && (
            primaryActionHref ? (
              <a 
                href={primaryActionHref}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center bg-[#2E302B] px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFEFA] transition-colors hover:bg-[#1a1c18]"
              >
                {primaryActionLabel}
              </a>
            ) : (
              <button 
                onClick={primaryActionOnClick}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center bg-[#2E302B] px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFEFA] transition-colors hover:bg-[#1a1c18]"
              >
                {primaryActionLabel}
              </button>
            )
          )}

          {secondaryActionLabel && secondaryActionHref && (
            <a 
              href={secondaryActionHref}
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center bg-transparent border border-[#E1DDD4] px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2E2E2B] transition-colors hover:bg-[#EEEAE2]"
            >
              {secondaryActionLabel}
            </a>
          )}
        </div>

        {showContact && (
          <div className="mt-16 pt-8 border-t border-[#E1DDD4] flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#74746A] uppercase mb-2">
              İletişim
            </span>
            <a href="tel:+905330618001" className="text-sm font-medium text-[#2E2E2B] hover:text-[#B6A18D] transition-colors">
              0 (533) 061 80 01
            </a>
            <a href="mailto:info@tanertumerinsaat.com" className="text-sm font-medium text-[#2E2E2B] hover:text-[#B6A18D] transition-colors">
              info@tanertumerinsaat.com
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
