"use client";

import { ArrowRight, Check } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

type Point = {
  x: number;
  y: number;
};

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

const initialPoint: Point = { x: 50, y: 50 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getLocalPoint(event: PointerEvent<HTMLElement>): Point {
  const rect = event.currentTarget.getBoundingClientRect();

  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
    y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
  };
}

function useLocalPointer() {
  const [point, setPoint] = useState<Point>(initialPoint);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    setPoint(getLocalPoint(event));
  }, []);

  const resetPointer = useCallback(() => {
    setPoint(initialPoint);
  }, []);

  return { point, handlePointerMove, resetPointer };
}

function pointVars(point: Point): CssVars {
  return {
    "--mx": `${point.x}%`,
    "--my": `${point.y}%`,
  } as CssVars;
}

export function DemoStyles() {
  return (
    <style>{`
      @keyframes alab-breathe {
        0%, 100% { opacity: 0.56; transform: scale(1); }
        50% { opacity: 0.88; transform: scale(1.025); }
      }

      @keyframes alab-coordinate-drift {
        0% { background-position: 0 0, 0 0; }
        100% { background-position: 32px 22px, 22px 32px; }
      }

      @keyframes alab-line-draw {
        to { stroke-dashoffset: 0; }
      }

      @keyframes alab-sweep {
        0% { transform: translateX(-150%) rotate(16deg); opacity: 0; }
        16% { opacity: 0.85; }
        100% { transform: translateX(150%) rotate(16deg); opacity: 0; }
      }

      @keyframes alab-ripple {
        0% { transform: translate(-50%, -50%) scale(0.22); opacity: 0.48; }
        100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
      }

      @keyframes alab-radar {
        to { transform: rotate(360deg); }
      }

      @keyframes alab-road-draw {
        to { stroke-dashoffset: 0; }
      }

      @keyframes alab-flow {
        to { stroke-dashoffset: -26; }
      }

      @keyframes alab-distance-label {
        0%, 100% { offset-distance: 10%; opacity: 0.55; }
        50% { offset-distance: 78%; opacity: 1; }
      }

      @keyframes alab-flicker {
        0%, 19%, 21%, 78%, 100% { opacity: 0.72; }
        20%, 79% { opacity: 0.34; }
        52% { opacity: 0.95; }
      }

      @keyframes alab-origin-fill {
        0% { transform: translate(-50%, -50%) scale(0.08); opacity: 0.95; }
        72% { opacity: 0.98; }
        100% { transform: translate(-50%, -50%) scale(22); opacity: 0; }
      }

      @keyframes alab-timeline-fill {
        0% { transform: scaleX(0); }
        100% { transform: scaleX(1); }
      }

      @keyframes alab-timeline-pulse {
        0%, 18% { background: rgba(255,255,255,0.14); color: rgba(243,239,231,0.54); transform: translateY(0); }
        22%, 42% { background: #C5162E; color: #F3EFE7; transform: translateY(-3px); }
        48%, 100% { background: rgba(255,255,255,0.14); color: rgba(243,239,231,0.54); transform: translateY(0); }
      }

      @keyframes alab-loader-draw {
        0% { stroke-dashoffset: 180; opacity: 0.35; }
        50% { opacity: 1; }
        100% { stroke-dashoffset: 0; opacity: 0.55; }
      }

      @keyframes alab-liquid {
        0%, 100% { border-radius: 22px 18px 24px 20px; transform: translate3d(0, 0, 0); }
        33% { border-radius: 18px 24px 19px 27px; transform: translate3d(1px, -1px, 0); }
        66% { border-radius: 25px 17px 22px 18px; transform: translate3d(-1px, 1px, 0); }
      }

      @keyframes alab-grain-shift {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-16px, 12px, 0); }
      }

      .alab-breathing-surface {
        animation: alab-breathe 5.5s ease-in-out infinite;
      }

      .alab-coordinate-grid {
        animation: alab-coordinate-drift 12s linear infinite;
      }

      .alab-line-draw:hover .alab-draw-line,
      .group\\/demo:hover .alab-draw-line {
        animation: alab-line-draw 1.15s ease forwards;
      }

      .alab-road:hover .alab-road-line,
      .group\\/demo:hover .alab-road-line {
        animation: alab-road-draw 1.4s ease forwards;
      }

      .alab-sweep-on-hover:hover .alab-sweep-line,
      .group\\/demo:hover .alab-sweep-line {
        animation: alab-sweep 1.25s ease-out forwards;
      }

      .alab-liquid-border {
        animation: alab-liquid 4.8s ease-in-out infinite;
      }

      .alab-radar-arm {
        animation: alab-radar 3s linear infinite;
        transform-origin: 50% 50%;
      }

      .alab-ripple-one {
        animation: alab-ripple 2.4s ease-out infinite;
      }

      .alab-ripple-two {
        animation: alab-ripple 2.4s ease-out 0.9s infinite;
      }

      .alab-flow-line {
        animation: alab-flow 1.2s linear infinite;
      }

      .alab-distance-chip {
        animation: alab-distance-label 3.4s ease-in-out infinite;
        offset-path: path("M 22 92 C 62 36, 110 116, 166 46");
      }

      .alab-data-flicker span:nth-child(2n) {
        animation: alab-flicker 3.5s step-end infinite;
      }

      .alab-data-flicker span:nth-child(3n) {
        animation: alab-flicker 4.4s step-end 0.4s infinite;
      }

      .alab-origin-circle {
        animation: alab-origin-fill 820ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
      }

      .alab-timeline:hover .alab-timeline-fill {
        animation: alab-timeline-fill 3.2s ease-in-out infinite;
        transform-origin: left;
      }

      .alab-timeline:hover .alab-step-1 { animation: alab-timeline-pulse 3.2s ease-in-out infinite; }
      .alab-timeline:hover .alab-step-2 { animation: alab-timeline-pulse 3.2s ease-in-out 0.62s infinite; }
      .alab-timeline:hover .alab-step-3 { animation: alab-timeline-pulse 3.2s ease-in-out 1.24s infinite; }
      .alab-timeline:hover .alab-step-4 { animation: alab-timeline-pulse 3.2s ease-in-out 1.86s infinite; }

      .alab-loader-line {
        animation: alab-loader-draw 1.35s ease-in-out infinite alternate;
        stroke-dasharray: 180;
      }

      .alab-grain {
        animation: alab-grain-shift 1.5s steps(2, end) infinite;
        opacity: var(--grain-opacity, 0.2);
      }

      @media (prefers-reduced-motion: reduce) {
        .alab-breathing-surface,
        .alab-coordinate-grid,
        .alab-radar-arm,
        .alab-ripple-one,
        .alab-ripple-two,
        .alab-flow-line,
        .alab-distance-chip,
        .alab-data-flicker span,
        .alab-liquid-border,
        .alab-loader-line,
        .alab-grain {
          animation: none !important;
        }

        .alab-origin-circle {
          animation-duration: 1ms !important;
        }
      }
    `}</style>
  );
}

export function DefaultDemo() {
  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(197,22,46,0.22),transparent_42%)]">
      <div className="h-16 w-28 border border-white/12 bg-surface/[0.04]" />
    </div>
  );
}

function CursorLightInspectorDemo() {
  const { point, handlePointerMove, resetPointer } = useLocalPointer();

  return (
    <div
      className="relative h-full overflow-hidden bg-[#050A0A]"
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      style={pointVars(point)}
    >
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(180,210,210,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,210,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mx)_var(--my),rgba(243,239,231,0.28),rgba(197,22,46,0.13)_22%,transparent_44%)] transition-[background] duration-100" />
      <div className="absolute left-5 top-5 h-10 w-16 border border-white/12 bg-surface/[0.035]" />
      <div className="absolute bottom-5 right-6 h-14 w-24 border border-dark-text/10 bg-dark-bg/20" />
      <span className="absolute bottom-4 left-5 font-mono text-[10px] text-[#F3EFE7]/45">
        X{Math.round(point.x).toString().padStart(2, "0")} Y
        {Math.round(point.y).toString().padStart(2, "0")}
      </span>
    </div>
  );
}

function GlassRefractionCursorDemo() {
  const { point, handlePointerMove, resetPointer } = useLocalPointer();
  const shiftX = (point.x - 50) * 0.9;
  const shiftY = (point.y - 50) * 0.45;

  return (
    <div
      className="relative flex h-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_34%),#050A0A]"
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
    >
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,rgba(255,255,255,0.10)_0,transparent_28%,rgba(197,22,46,0.10)_55%,transparent_82%)]" />
      <div className="relative h-24 w-36 overflow-hidden rounded-[18px] border border-white/16 bg-surface/[0.055] shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
        <div
          className="absolute -inset-10 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.34)_48%,transparent_62%)] transition-transform duration-150"
          style={{ transform: `translate3d(${shiftX}px, ${shiftY}px, 0)` }}
        />
        <div className="absolute inset-4 border border-white/12" />
        <div className="absolute bottom-4 left-4 h-2 w-20 bg-surface/18" />
      </div>
    </div>
  );
}

function DynamicCornerBracketsDemo() {
  return (
    <div className="group/demo relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <div className="relative h-24 w-36 border border-dark-text/10 bg-surface/[0.035] transition-colors duration-300 group-hover/demo:border-[#C5162E]/35">
        {[
          "left-0 top-0 -translate-x-1 -translate-y-1 border-l border-t",
          "right-0 top-0 translate-x-1 -translate-y-1 border-r border-t",
          "bottom-0 left-0 -translate-x-1 translate-y-1 border-b border-l",
          "bottom-0 right-0 translate-x-1 translate-y-1 border-b border-r",
        ].map((position) => (
          <span
            className={`absolute h-8 w-8 border-[#C5162E] opacity-55 transition-all duration-300 group-hover/demo:h-10 group-hover/demo:w-10 group-hover/demo:opacity-100 ${position}`}
            key={position}
          />
        ))}
        <div className="absolute inset-5 border border-white/8" />
      </div>
    </div>
  );
}

function CardBorderWakeDemo() {
  return (
    <div className="group/demo alab-line-draw relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <svg
        aria-hidden="true"
        className="absolute h-[112px] w-[164px]"
        viewBox="0 0 164 112"
      >
        <rect
          className="stroke-white/10"
          fill="rgba(255,255,255,0.035)"
          height="104"
          rx="18"
          width="156"
          x="4"
          y="4"
        />
        <rect
          className="alab-draw-line stroke-[#C5162E]"
          fill="transparent"
          height="104"
          rx="18"
          strokeDasharray="500"
          strokeDashoffset="500"
          strokeWidth="2"
          width="156"
          x="4"
          y="4"
        />
      </svg>
      <span className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-[#F3EFE7]/48">
        perimeter
      </span>
    </div>
  );
}

function SoftShadowDepthShiftDemo() {
  return (
    <div className="group/demo flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(197,22,46,0.12),transparent_40%),#050A0A]">
      <div className="h-24 w-36 border border-dark-text/10 bg-[#071010] shadow-[0_8px_22px_rgba(0,0,0,0.24)] transition-shadow duration-300 group-hover/demo:shadow-[0_26px_56px_rgba(0,0,0,0.58),0_0_0_1px_rgba(197,22,46,0.24)]">
        <div className="m-4 h-3 w-20 bg-surface/12" />
        <div className="mx-4 h-2 w-14 bg-[#C5162E]/45" />
      </div>
    </div>
  );
}

function MagneticCtaDemo() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setOffset({
      x: clamp((event.clientX - centerX) * 0.16, -10, 10),
      y: clamp((event.clientY - centerY) * 0.16, -8, 8),
    });
  };

  return (
    <div
      className="relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]"
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      onPointerMove={handlePointerMove}
    >
      <button
        className="inline-flex h-11 items-center gap-2 border border-[#C5162E]/70 bg-[#C5162E] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F3EFE7] shadow-[0_16px_34px_rgba(197,22,46,0.18)] transition-transform duration-150"
        ref={buttonRef}
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        type="button"
      >
        İncele
        <ArrowRight size={14} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function CtaArrowGlideDemo() {
  return (
    <div className="flex h-full items-center justify-center bg-[#050A0A]">
      <button
        className="group/demo inline-flex h-11 items-center gap-3 overflow-hidden border border-white/12 bg-surface/[0.04] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F3EFE7] transition-colors hover:border-[#C5162E]/55"
        type="button"
      >
        Keşfet
        <span className="relative h-4 w-5 overflow-hidden">
          <ArrowRight
            className="absolute left-0 top-0 transition-transform duration-300 group-hover/demo:translate-x-7"
            size={16}
            strokeWidth={1.8}
          />
          <ArrowRight
            className="absolute -left-7 top-0 transition-transform duration-300 group-hover/demo:translate-x-7"
            size={16}
            strokeWidth={1.8}
          />
        </span>
      </button>
    </div>
  );
}

function ArchitecturalNoiseBreathingDemo() {
  return (
    <div className="relative h-full overflow-hidden bg-[#050A0A]">
      <div className="alab-breathing-surface absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(197,22,46,0.18),transparent_30%),radial-gradient(circle_at_70%_68%,rgba(180,210,210,0.12),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_44%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:7px_7px]" />
      <div className="absolute inset-7 border border-dark-text/10 bg-surface/[0.03]" />
    </div>
  );
}

function MicroBlueprintCoordinatesDemo() {
  return (
    <div className="alab-coordinate-grid relative h-full overflow-hidden bg-[#050A0A] [background-image:linear-gradient(rgba(180,210,210,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,210,0.14)_1px,transparent_1px)] [background-size:22px_22px]">
      <span className="absolute left-4 top-4 font-mono text-[10px] text-[#F3EFE7]/44">
        X: 41.012
      </span>
      <span className="absolute bottom-4 right-4 font-mono text-[10px] text-[#F3EFE7]/44">
        Y: 28.978
      </span>
      <span className="absolute right-8 top-12 h-9 w-14 border border-[#B4D2D2]/24" />
      <span className="absolute bottom-9 left-9 h-8 w-20 border border-[#C5162E]/28" />
    </div>
  );
}

function BlueprintGridCompressionDemo() {
  return (
    <div className="group/demo relative h-full overflow-hidden bg-[#050A0A]">
      <div className="absolute inset-0 opacity-80 transition-[background-size] duration-500 [background-image:linear-gradient(rgba(180,210,210,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,210,0.14)_1px,transparent_1px)] [background-size:34px_34px] group-hover/demo:[background-size:18px_18px]" />
      <div className="absolute left-8 top-8 h-20 w-28 border border-dark-text/10 transition-all duration-500 group-hover/demo:left-12 group-hover/demo:top-6 group-hover/demo:h-24 group-hover/demo:w-24 group-hover/demo:border-[#C5162E]/45" />
      <div className="absolute bottom-7 right-8 h-8 w-20 border border-dark-text/10 transition-all duration-500 group-hover/demo:bottom-10 group-hover/demo:right-12 group-hover/demo:w-14" />
    </div>
  );
}

function BlueprintLineDrawDemo() {
  return (
    <div className="group/demo alab-line-draw relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <svg
        aria-hidden="true"
        className="h-[112px] w-[184px]"
        viewBox="0 0 184 112"
      >
        <path
          d="M18 90 V28 H74 V50 H132 V90 Z"
          fill="rgba(255,255,255,0.025)"
          stroke="rgba(180,210,210,0.16)"
          strokeWidth="1"
        />
        <path
          className="alab-draw-line"
          d="M18 90 V28 H74 V50 H132 V90 H18 M74 28 V90 M74 50 H18 M132 50 H166 V90 H132"
          fill="none"
          stroke="#C5162E"
          strokeDasharray="310"
          strokeDashoffset="310"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </div>
  );
}

function DynamicBlueprintLensDemo() {
  const { point, handlePointerMove, resetPointer } = useLocalPointer();
  const maskStyle = {
    ...pointVars(point),
    WebkitMaskImage:
      "radial-gradient(circle at var(--mx) var(--my), black 0 32%, transparent 34%)",
    maskImage:
      "radial-gradient(circle at var(--mx) var(--my), black 0 32%, transparent 34%)",
  } as CSSProperties;

  return (
    <div
      className="relative h-full overflow-hidden bg-[#050A0A]"
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_36%,rgba(255,255,255,0.1),transparent_24%),linear-gradient(145deg,rgba(255,255,255,0.06),transparent_42%)]" />
      <div className="absolute left-9 top-7 h-20 w-32 bg-dark-bg/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
      <div className="absolute bottom-7 right-7 h-12 w-20 bg-surface/[0.035] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]" />
      <div
        className="absolute inset-0 bg-[#071010] [background-image:linear-gradient(rgba(180,210,210,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,210,0.18)_1px,transparent_1px)] [background-size:20px_20px]"
        style={maskStyle}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)]"
          viewBox="0 0 180 100"
        >
          <path
            d="M10 82 H54 V30 H106 V52 H160 V82 H10"
            fill="none"
            stroke="#C5162E"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

function ManifestoLineActivationDemo() {
  return (
    <div className="group/demo flex h-full items-center justify-center bg-[#050A0A] px-8">
      <div className="space-y-3 text-lg font-semibold leading-none text-[#F3EFE7]/30">
        <p className="transition-colors delay-75 duration-300 group-hover/demo:text-[#F3EFE7]">
          Güven inşa edilir.
        </p>
        <p className="transition-colors delay-150 duration-300 group-hover/demo:text-[#F3EFE7]/86">
          Detay korunur.
        </p>
        <p className="transition-colors delay-300 duration-300 group-hover/demo:text-[#C5162E]">
          Yaşam başlar.
        </p>
      </div>
    </div>
  );
}

function MaskBasedTitleRevealDemo() {
  return (
    <div className="group/demo flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <div className="relative overflow-hidden pb-1">
        <span className="block text-3xl font-semibold text-[#F3EFE7]/18">
          TANER
        </span>
        <span className="absolute inset-0 translate-y-full text-3xl font-semibold text-[#F3EFE7] transition-transform duration-500 group-hover/demo:translate-y-0">
          TANER
        </span>
        <span className="absolute bottom-0 left-0 h-px w-full scale-x-0 bg-[#C5162E] transition-transform delay-150 duration-500 group-hover/demo:scale-x-100" />
      </div>
    </div>
  );
}

function TextReflectionSweepDemo() {
  return (
    <div className="group/demo alab-sweep-on-hover relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <h3 className="relative text-4xl font-semibold text-[#F3EFE7]/85">
        YAPI
      </h3>
      <span className="alab-sweep-line absolute h-28 w-7 bg-surface/35 blur-[1px]" />
    </div>
  );
}

function RedKeywordActivationDemo() {
  return (
    <div className="group/demo flex h-full items-center justify-center bg-[#050A0A] px-8 text-center">
      <p className="text-xl font-semibold leading-tight text-[#F3EFE7]/70">
        Her yapı{" "}
        <span className="text-[#C5162E] transition-colors duration-300 group-hover/demo:text-[#F3EFE7]/70">
          güven
        </span>{" "}
        ve{" "}
        <span className="text-[#F3EFE7]/70 transition-colors duration-300 group-hover/demo:text-[#C5162E]">
          detay
        </span>{" "}
        ister.
      </p>
    </div>
  );
}

function FounderSignatureDrawDemo() {
  return (
    <div className="group/demo alab-line-draw flex h-full items-center justify-center bg-[#050A0A]">
      <svg
        aria-label="Taner Tümer imza çizimi"
        className="h-[96px] w-[190px]"
        viewBox="0 0 190 96"
      >
        <path
          d="M18 60 C34 28, 47 72, 63 42 C76 18, 82 78, 96 48 C110 22, 122 72, 137 42 C148 22, 160 34, 174 24"
          fill="none"
          stroke="rgba(243,239,231,0.16)"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className="alab-draw-line"
          d="M18 60 C34 28, 47 72, 63 42 C76 18, 82 78, 96 48 C110 22, 122 72, 137 42 C148 22, 160 34, 174 24"
          fill="none"
          stroke="#C5162E"
          strokeDasharray="260"
          strokeDashoffset="260"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

function ProjectImageDepthRevealDemo() {
  const { point, handlePointerMove, resetPointer } = useLocalPointer();
  const x = (point.x - 50) / 50;
  const y = (point.y - 50) / 50;

  return (
    <div
      className="relative h-full overflow-hidden bg-[#050A0A]"
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
    >
      <div
        className="absolute inset-6 bg-[linear-gradient(135deg,rgba(180,210,210,0.14),rgba(255,255,255,0.04))] transition-transform duration-150"
        style={{ transform: `translate3d(${x * -8}px, ${y * -5}px, 0)` }}
      />
      <div
        className="absolute left-10 top-8 h-20 w-28 bg-[#182120] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-150"
        style={{ transform: `translate3d(${x * 10}px, ${y * 7}px, 0)` }}
      />
      <div
        className="absolute bottom-7 right-9 h-16 w-24 bg-[#C5162E]/24 shadow-[inset_0_0_0_1px_rgba(197,22,46,0.24)] transition-transform duration-150"
        style={{ transform: `translate3d(${x * 16}px, ${y * 10}px, 0)` }}
      />
    </div>
  );
}

function ProjectCardPortalHoverDemo() {
  return (
    <div className="group/demo relative h-full overflow-hidden bg-[#050A0A]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_36%),radial-gradient(circle_at_50%_55%,rgba(197,22,46,0.16),transparent_36%)]" />
      <div className="absolute inset-6 border border-dark-text/10 bg-surface/[0.025]" />
      <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-0 overflow-hidden rounded-full border border-[#C5162E]/60 bg-[#071010] shadow-[0_0_42px_rgba(197,22,46,0.24)] transition-all duration-500 group-hover/demo:h-24 group-hover/demo:w-32 group-hover/demo:scale-100 group-hover/demo:rounded-[18px]">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(180,210,210,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,210,0.14)_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute bottom-4 left-5 h-8 w-16 border border-white/14" />
      </div>
    </div>
  );
}

function MaterialLayerPeelDemo() {
  return (
    <div className="group/demo relative h-full overflow-hidden bg-[#050A0A]">
      <div className="absolute inset-6 [background-image:linear-gradient(rgba(180,210,210,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,210,0.14)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute inset-7 border border-[#C5162E]/30" />
      <div className="absolute inset-6 origin-top-right border border-dark-text/10 bg-[#111817] shadow-[0_16px_34px_rgba(0,0,0,0.26)] transition-transform duration-500 group-hover/demo:-translate-y-3 group-hover/demo:translate-x-5 group-hover/demo:-rotate-6">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_42%)]" />
        <div className="absolute bottom-5 left-5 h-2 w-24 bg-surface/12" />
      </div>
    </div>
  );
}

function GlassPanelDepthStackDemo() {
  return (
    <div className="group/demo relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      {[0, 1, 2].map((index) => (
        <div
          className="absolute h-20 w-32 border border-white/14 bg-surface/[0.045] shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-[2px] transition-transform duration-500"
          key={index}
          style={{
            transform: `translate3d(${(index - 1) * 10}px, ${
              (index - 1) * 8
            }px, 0)`,
          }}
        />
      ))}
      <div className="absolute h-20 w-32 border border-[#C5162E]/28 bg-surface/[0.06] transition-transform duration-500 group-hover/demo:-translate-y-5 group-hover/demo:translate-x-6" />
      <div className="absolute h-20 w-32 border border-white/12 bg-surface/[0.04] transition-transform duration-500 group-hover/demo:translate-y-4 group-hover/demo:-translate-x-5" />
    </div>
  );
}

function LiquidBorderDistortionDemo() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <div className="alab-liquid-border h-24 w-36 border border-[#C5162E]/45 bg-surface/[0.035] shadow-[0_0_28px_rgba(197,22,46,0.08)]" />
      <div className="pointer-events-none absolute h-16 w-24 border border-dark-text/10" />
    </div>
  );
}

function SpecularHighlightSweepDemo() {
  return (
    <div className="group/demo alab-sweep-on-hover relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <div className="relative h-24 w-36 overflow-hidden rounded-[18px] border border-white/14 bg-surface/[0.045] backdrop-blur-[2px]">
        <div className="absolute inset-4 border border-dark-text/10" />
      </div>
      <span className="alab-sweep-line absolute h-40 w-5 bg-surface/34 blur-[1px]" />
    </div>
  );
}

function FooterRevealCurtainDemo() {
  const [open, setOpen] = useState(false);

  return (
    <button
      aria-pressed={open}
      className="relative h-full w-full overflow-hidden bg-[#050A0A] text-left"
      onClick={() => setOpen((current) => !current)}
      type="button"
    >
      <div className="absolute inset-x-5 bottom-5 h-20 border border-dark-text/10 bg-[#071010] p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#F3EFE7]/45">
          Mini footer
        </p>
        <p className="mt-3 text-sm font-semibold text-[#F3EFE7]">
          Proje, konum, iletişim
        </p>
      </div>
      <div
        className="absolute inset-x-5 bottom-5 h-20 bg-[#C5162E] transition-transform duration-500"
        style={{ transform: open ? "translateY(-72px)" : "translateY(0)" }}
      />
      <span className="absolute right-8 top-6 text-xs text-[#F3EFE7]/60">
        {open ? "Kapat" : "Aç"}
      </span>
    </button>
  );
}

function SectionMagneticTitleDemo() {
  return (
    <div className="group/demo flex h-full items-center justify-center overflow-hidden bg-[#050A0A] px-7">
      <div>
        <h3 className="text-2xl font-semibold text-[#F3EFE7] transition-transform duration-300 group-hover/demo:-translate-y-3">
          Lokasyon
        </h3>
        <div className="mt-3 h-px w-32 origin-left scale-x-70 bg-[#C5162E] transition-transform duration-300 group-hover/demo:scale-x-100" />
        <p className="mt-4 text-xs leading-5 text-[#F3EFE7]/45">
          Başlık sahneye tutunur, içerik sakin kalır.
        </p>
      </div>
    </div>
  );
}

function ScrollVelocityGrainDemo() {
  const [intensity, setIntensity] = useState(0.16);
  const lastScrollTop = useRef(0);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (settleTimer.current !== null) {
        window.clearTimeout(settleTimer.current);
      }
    };
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const nextScrollTop = event.currentTarget.scrollTop;
    const delta = Math.abs(nextScrollTop - lastScrollTop.current);
    lastScrollTop.current = nextScrollTop;
    setIntensity(clamp(0.16 + delta / 34, 0.16, 0.78));

    if (settleTimer.current !== null) {
      window.clearTimeout(settleTimer.current);
    }
    settleTimer.current = window.setTimeout(() => setIntensity(0.16), 180);
  };

  return (
    <div className="relative h-full overflow-hidden bg-[#050A0A]">
      <div
        className="h-full overflow-y-auto p-5 pr-3 [scrollbar-width:thin]"
        onScroll={handleScroll}
      >
        {["Temel hazırlığı", "Kolon aksları", "Cephe ritmi", "Peyzaj", "Yaşam"].map(
          (item, index) => (
            <div
              className="mb-3 border border-dark-text/10 bg-surface/[0.035] p-3 text-xs text-[#F3EFE7]/62"
              key={item}
            >
              <span className="font-mono text-[#C5162E]">0{index + 1}</span>{" "}
              {item}
            </div>
          ),
        )}
      </div>
      <div
        className="alab-grain pointer-events-none absolute -inset-6 [background-image:radial-gradient(rgba(255,255,255,0.58)_1px,transparent_1px)] [background-size:5px_5px]"
        style={{ "--grain-opacity": intensity } as CssVars}
      />
    </div>
  );
}

function AdaptivePageTintDemo() {
  const tints = [
    { label: "Temel", background: "rgba(197,22,46,0.16)" },
    { label: "Cephe", background: "rgba(180,210,210,0.14)" },
    { label: "Yaşam", background: "rgba(214,176,92,0.12)" },
  ];
  const [active, setActive] = useState(0);

  return (
    <div
      className="flex h-full items-center justify-center transition-colors duration-400"
      style={{ backgroundColor: tints[active].background }}
    >
      <div className="flex gap-2">
        {tints.map((tint, index) => (
          <button
            className={`border px-3 py-2 text-xs transition-colors ${
              active === index
                ? "border-[#C5162E] bg-[#C5162E] text-[#F3EFE7]"
                : "border-dark-text/10 bg-dark-bg/20 text-[#F3EFE7]/58"
            }`}
            key={tint.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {tint.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MapPinRippleDemo() {
  return (
    <div className="relative h-full overflow-hidden bg-[#050A0A]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-55"
        viewBox="0 0 220 150"
      >
        <path
          d="M0 118 C40 86, 70 96, 104 70 S166 38, 220 54"
          fill="none"
          stroke="rgba(180,210,210,0.22)"
        />
        <path
          d="M44 0 C66 48, 74 86, 124 150"
          fill="none"
          stroke="rgba(180,210,210,0.16)"
        />
      </svg>
      <span className="alab-ripple-one absolute left-1/2 top-1/2 h-16 w-16 rounded-full border border-[#C5162E]/45" />
      <span className="alab-ripple-two absolute left-1/2 top-1/2 h-16 w-16 rounded-full border border-[#C5162E]/32" />
      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C5162E] shadow-[0_0_20px_rgba(197,22,46,0.5)]" />
    </div>
  );
}

function RoadNetworkDrawDemo() {
  return (
    <div className="group/demo alab-road flex h-full items-center justify-center bg-[#050A0A]">
      <svg aria-hidden="true" className="h-[120px] w-[200px]" viewBox="0 0 200 120">
        <path
          d="M12 92 C44 54, 75 88, 112 48 S166 30, 188 58"
          fill="none"
          stroke="rgba(180,210,210,0.16)"
          strokeWidth="8"
        />
        <path
          className="alab-road-line"
          d="M12 92 C44 54, 75 88, 112 48 S166 30, 188 58"
          fill="none"
          stroke="#C5162E"
          strokeDasharray="240"
          strokeDashoffset="240"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        <path
          className="alab-road-line"
          d="M54 20 C62 48, 72 74, 88 108"
          fill="none"
          stroke="rgba(243,239,231,0.74)"
          strokeDasharray="128"
          strokeDashoffset="128"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

function LocationRadarSweepDemo() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A]">
      <div className="relative h-28 w-28 rounded-full border border-dark-text/10">
        <span className="absolute inset-5 rounded-full border border-dark-text/10" />
        <span className="absolute inset-10 rounded-full border border-dark-text/10" />
        <span className="alab-radar-arm absolute left-1/2 top-1/2 h-14 w-px origin-bottom bg-gradient-to-t from-[#C5162E] to-transparent" />
        <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C5162E]" />
      </div>
    </div>
  );
}

function DistanceCounterLinesDemo() {
  return (
    <div className="relative h-full overflow-hidden bg-[#050A0A]">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 220 150">
        <path
          d="M22 92 C62 36, 110 116, 166 46"
          fill="none"
          stroke="rgba(180,210,210,0.2)"
          strokeWidth="2"
        />
        <path
          className="alab-flow-line"
          d="M22 92 C62 36, 110 116, 166 46"
          fill="none"
          stroke="#C5162E"
          strokeDasharray="12 14"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <span className="absolute left-[18px] top-[88px] h-3 w-3 rounded-full bg-[#F3EFE7]" />
      <span className="absolute left-[160px] top-[42px] h-3 w-3 rounded-full bg-[#C5162E]" />
      <span className="alab-distance-chip absolute rounded-full border border-dark-text/10 bg-[#071010] px-2 py-1 font-mono text-[10px] text-[#F3EFE7]">
        8 dk
      </span>
    </div>
  );
}

function InputFocusBreathingDemo() {
  return (
    <div className="flex h-full items-center justify-center bg-[#050A0A] px-6">
      <label className="group/demo w-full max-w-[190px]">
        <span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#F3EFE7]/40">
          E-posta
        </span>
        <input
          className="h-11 w-full border border-dark-text/10 bg-surface/[0.035] px-3 text-sm text-[#F3EFE7] outline-none transition-shadow duration-300 focus:border-[#C5162E]/70 focus:shadow-[0_0_0_1px_rgba(197,22,46,0.35),0_0_24px_rgba(197,22,46,0.22)]"
          placeholder="bilgi@"
          type="email"
        />
      </label>
    </div>
  );
}

function SubmitSuccessMorphDemo() {
  const [success, setSuccess] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  const handleClick = () => {
    setSuccess(true);
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setSuccess(false), 1600);
  };

  return (
    <div className="flex h-full items-center justify-center bg-[#050A0A]">
      <button
        className={`inline-flex h-11 min-w-[126px] items-center justify-center gap-2 border px-5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
          success
            ? "border-emerald-300/35 bg-emerald-400/14 text-emerald-100"
            : "border-[#C5162E] bg-[#C5162E] text-[#F3EFE7]"
        }`}
        onClick={handleClick}
        type="button"
      >
        {success ? (
          <>
            <Check size={15} strokeWidth={2} />
            Alındı
          </>
        ) : (
          "Gönder"
        )}
      </button>
    </div>
  );
}

function TinyDataFlickerDemo() {
  return (
    <div className="alab-data-flicker flex h-full flex-col justify-center gap-2 bg-[#050A0A] px-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F3EFE7]/62">
      <span>LOAD 084.2</span>
      <span>AXIS A-17 OK</span>
      <span>WIND 0.32 KN</span>
      <span>GRID REF 28/41</span>
      <span className="text-[#C5162E]/80">SITE LIVE</span>
    </div>
  );
}

function PageTransitionOriginFromClickPointDemo() {
  const [circle, setCircle] = useState<{
    active: boolean;
    key: number;
    x: number;
    y: number;
  }>({ active: false, key: 0, x: 50, y: 50 });
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  const trigger = (point: Point) => {
    setCircle((current) => ({
      active: true,
      key: current.key + 1,
      x: point.x,
      y: point.y,
    }));

    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      setCircle((current) => ({ ...current, active: false }));
    }, 860);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    trigger(getLocalPoint(event as unknown as PointerEvent<HTMLElement>));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      trigger(initialPoint);
    }
  };

  return (
    <div
      className="relative flex h-full cursor-pointer items-center justify-center overflow-hidden bg-[#050A0A]"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <span className="border border-dark-text/10 bg-surface/[0.04] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F3EFE7]">
        Geçişi dene
      </span>
      {circle.active ? (
        <span
          className="alab-origin-circle absolute h-6 w-6 rounded-full bg-[#C5162E]"
          key={circle.key}
          style={{ left: `${circle.x}%`, top: `${circle.y}%` }}
        />
      ) : null}
    </div>
  );
}

function TextToPlanMorphDemo() {
  const [plan, setPlan] = useState(false);

  return (
    <button
      aria-pressed={plan}
      className="relative h-full w-full overflow-hidden bg-[#050A0A]"
      onClick={() => setPlan((current) => !current)}
      type="button"
    >
      <span
        className={`absolute inset-0 flex items-center justify-center text-4xl font-semibold text-[#F3EFE7] transition-all duration-500 ${
          plan ? "-translate-y-4 opacity-0 blur-sm" : "opacity-100"
        }`}
      >
        PLAN
      </span>
      <svg
        aria-hidden="true"
        className={`absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)] transition-all duration-500 ${
          plan ? "opacity-100" : "scale-95 opacity-0"
        }`}
        viewBox="0 0 160 92"
      >
        <path
          d="M12 78 H52 V22 H98 V44 H144 V78 H12"
          fill="rgba(255,255,255,0.025)"
          stroke="#C5162E"
          strokeWidth="2"
        />
        <path
          d="M52 22 V78 M98 44 V78 M12 44 H52 M98 58 H144"
          fill="none"
          stroke="rgba(180,210,210,0.45)"
        />
      </svg>
    </button>
  );
}

function BuildingVolumeWithoutWebglDemo() {
  return (
    <div className="group/demo relative flex h-full items-center justify-center overflow-hidden bg-[#050A0A] [perspective:560px]">
      <div className="relative h-24 w-28 [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-36deg)]">
        {[0, 1, 2, 3].map((level) => (
          <div
            className="absolute left-4 top-4 h-16 w-20 border border-white/12 bg-[#0C1716] transition-transform duration-500"
            key={level}
            style={{
              transform: `translate3d(${level * 5}px, ${level * -5}px, ${
                level * 14
              }px)`,
            }}
          >
            <span className="absolute inset-x-3 top-3 h-px bg-[#C5162E]/45" />
            <span className="absolute inset-x-3 top-7 h-px bg-surface/12" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 left-1/2 h-px w-28 -translate-x-1/2 bg-[#C5162E]/30 transition-transform duration-500 group-hover/demo:scale-x-125" />
    </div>
  );
}

function AnimatedConstructionTimelineDemo() {
  const steps = ["Temel", "Kolon", "Cephe", "Yaşam"];

  return (
    <div className="alab-timeline flex h-full items-center justify-center bg-[#050A0A] px-6">
      <div className="relative w-full max-w-[250px]">
        <div className="absolute left-5 right-5 top-4 h-px bg-surface/12" />
        <div className="alab-timeline-fill absolute left-5 right-5 top-4 h-px origin-left scale-x-0 bg-[#C5162E]" />
        <div className="relative grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div className="flex flex-col items-center gap-3" key={step}>
              <span
                className={`alab-step-${index + 1} flex h-8 w-8 items-center justify-center rounded-full bg-surface/[0.08] font-mono text-[10px] text-[#F3EFE7]/54`}
              >
                {index + 1}
              </span>
              <span className="text-[10px] text-[#F3EFE7]/50">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RouteTransitionWithDepthBlurDemo() {
  const [active, setActive] = useState(false);

  return (
    <button
      aria-pressed={active}
      className="relative h-full w-full overflow-hidden bg-[#050A0A] text-left"
      onClick={() => setActive((current) => !current)}
      type="button"
    >
      <div
        className={`absolute inset-6 border border-dark-text/10 bg-surface/[0.04] p-4 transition-all duration-500 ${
          active ? "scale-95 opacity-35 blur-[2px]" : "scale-100 opacity-100"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#F3EFE7]/42">
          Eski panel
        </p>
        <div className="mt-5 h-3 w-24 bg-surface/12" />
      </div>
      <div
        className={`absolute inset-6 border border-[#C5162E]/38 bg-[#071010] p-4 shadow-[0_22px_56px_rgba(0,0,0,0.45)] transition-all duration-500 ${
          active
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 blur-[1px]"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5162E]">
          Yeni panel
        </p>
        <div className="mt-5 h-3 w-24 bg-surface/16" />
      </div>
    </button>
  );
}

function PremiumLoadingLessPreloaderDemo() {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      aria-pressed={loaded}
      className="relative h-full w-full overflow-hidden bg-[#050A0A]"
      onClick={() => setLoaded((current) => !current)}
      type="button"
    >
      <svg
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 h-20 w-40 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
          loaded ? "scale-75 opacity-0" : "opacity-100"
        }`}
        viewBox="0 0 160 80"
      >
        <path
          className="alab-loader-line"
          d="M18 62 V18 H70 V38 H126 V62 H18"
          fill="none"
          stroke="#C5162E"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          className="alab-loader-line"
          d="M70 18 V62 M18 38 H70 M126 38 H144"
          fill="none"
          stroke="rgba(180,210,210,0.5)"
          strokeLinecap="round"
          strokeWidth="1"
        />
      </svg>
      <div
        className={`absolute inset-6 border border-[#C5162E]/38 bg-[#071010] p-4 text-left shadow-[0_22px_56px_rgba(0,0,0,0.42)] transition-all duration-500 ${
          loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5162E]">
          Hero hazır
        </p>
        <p className="mt-4 text-xl font-semibold text-[#F3EFE7]">
          Teknik çizimden yaşam alanına
        </p>
      </div>
    </button>
  );
}

export const demoMap: Record<string, ComponentType> = {
  "cursor-light-inspector": CursorLightInspectorDemo,
  "glass-refraction-cursor": GlassRefractionCursorDemo,
  "dynamic-corner-brackets": DynamicCornerBracketsDemo,
  "card-border-wake": CardBorderWakeDemo,
  "soft-shadow-depth-shift": SoftShadowDepthShiftDemo,
  "magnetic-cta": MagneticCtaDemo,
  "cta-arrow-glide": CtaArrowGlideDemo,
  "architectural-noise-breathing": ArchitecturalNoiseBreathingDemo,
  "micro-blueprint-coordinates": MicroBlueprintCoordinatesDemo,
  "blueprint-grid-compression": BlueprintGridCompressionDemo,
  "blueprint-line-draw": BlueprintLineDrawDemo,
  "dynamic-blueprint-lens": DynamicBlueprintLensDemo,
  "manifesto-line-activation": ManifestoLineActivationDemo,
  "mask-based-title-reveal": MaskBasedTitleRevealDemo,
  "text-reflection-sweep": TextReflectionSweepDemo,
  "red-keyword-activation": RedKeywordActivationDemo,
  "founder-signature-draw": FounderSignatureDrawDemo,
  "project-image-depth-reveal": ProjectImageDepthRevealDemo,
  "project-card-portal-hover": ProjectCardPortalHoverDemo,
  "material-layer-peel": MaterialLayerPeelDemo,
  "glass-panel-depth-stack": GlassPanelDepthStackDemo,
  "liquid-border-distortion": LiquidBorderDistortionDemo,
  "specular-highlight-sweep": SpecularHighlightSweepDemo,
  "footer-reveal-curtain": FooterRevealCurtainDemo,
  "section-magnetic-title": SectionMagneticTitleDemo,
  "scroll-velocity-grain": ScrollVelocityGrainDemo,
  "adaptive-page-tint": AdaptivePageTintDemo,
  "map-pin-ripple": MapPinRippleDemo,
  "road-network-draw": RoadNetworkDrawDemo,
  "location-radar-sweep": LocationRadarSweepDemo,
  "distance-counter-lines": DistanceCounterLinesDemo,
  "input-focus-breathing": InputFocusBreathingDemo,
  "submit-success-morph": SubmitSuccessMorphDemo,
  "tiny-data-flicker": TinyDataFlickerDemo,
  "page-transition-origin-from-click-point": PageTransitionOriginFromClickPointDemo,
  "text-to-plan-morph": TextToPlanMorphDemo,
  "3d-building-volume-without-webgl": BuildingVolumeWithoutWebglDemo,
  "animated-construction-timeline": AnimatedConstructionTimelineDemo,
  "route-transition-with-depth-blur": RouteTransitionWithDepthBlurDemo,
  "premium-loading-less-preloader": PremiumLoadingLessPreloaderDemo,
};
