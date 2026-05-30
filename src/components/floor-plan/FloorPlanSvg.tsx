"use client";

import { cn } from "@/lib/utils";

type FloorPlanSvgProps = {
  activePlanId: string;
  activeArea: string | null;
  onAreaChange: (areaId: string | null) => void;
};

// SVG Rect details for abstract floor plans
type RectArea = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

const planShapes: Record<string, RectArea[]> = {
  "2-1": [
    { id: "living", x: 50, y: 50, w: 300, h: 400, label: "SALON" },
    { id: "balcony", x: 50, y: 450, w: 300, h: 100, label: "BALKON" },
    { id: "kitchen", x: 350, y: 50, w: 200, h: 200, label: "MUTFAK" },
    { id: "room1", x: 350, y: 250, w: 200, h: 200, label: "ODA" },
    { id: "master", x: 550, y: 150, w: 200, h: 300, label: "E. ODASI" },
  ],
  "3-1": [
    { id: "living", x: 50, y: 50, w: 350, h: 400, label: "SALON" },
    { id: "balcony", x: 50, y: 450, w: 350, h: 100, label: "BALKON" },
    { id: "kitchen", x: 400, y: 50, w: 200, h: 180, label: "MUTFAK" },
    { id: "room1", x: 400, y: 230, w: 200, h: 160, label: "ÇOCUK ODASI" },
    { id: "room2", x: 400, y: 390, w: 200, h: 160, label: "ODA" },
    { id: "master", x: 600, y: 230, w: 150, h: 320, label: "E. ODASI" },
  ],
  "4-1": [
    { id: "living", x: 50, y: 50, w: 350, h: 420, label: "SALON" },
    { id: "balcony", x: 50, y: 470, w: 500, h: 80, label: "BALKON" },
    { id: "kitchen", x: 400, y: 50, w: 150, h: 200, label: "MUTFAK" },
    { id: "room1", x: 550, y: 50, w: 200, h: 150, label: "ODA 1" },
    { id: "room2", x: 400, y: 250, w: 150, h: 220, label: "ODA 2" },
    { id: "room3", x: 550, y: 200, w: 200, h: 150, label: "ODA 3" },
    { id: "master", x: 550, y: 350, w: 200, h: 200, label: "E. ODASI" },
  ]
};

export function FloorPlanSvg({ activePlanId, activeArea, onAreaChange }: FloorPlanSvgProps) {
  const areas = planShapes[activePlanId] || planShapes["2-1"];

  return (
    <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto flex items-center justify-center p-4">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Outer Frame (representing the apartment border) */}
        <rect
          x="40"
          y="40"
          width="720"
          height="520"
          fill="rgba(0,0,0,0.4)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
        />

        {/* Areas */}
        {areas.map((area) => {
          const isActive = activeArea === area.id;
          return (
            <g
              key={area.id}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => onAreaChange(area.id)}
              onMouseLeave={() => onAreaChange(null)}
              onClick={() => onAreaChange(isActive ? null : area.id)} // For mobile tap
            >
              <rect
                x={area.x}
                y={area.y}
                width={area.w}
                height={area.h}
                fill={isActive ? "rgba(220,38,38,0.15)" : "url(#hatch)"}
                stroke={isActive ? "rgba(220,38,38,0.8)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isActive ? "2" : "1"}
                className="transition-colors duration-300"
              />
              
              {/* Abstract inner lines to make it look like a technical blueprint */}
              <rect
                x={area.x + 10}
                y={area.y + 10}
                width={area.w - 20}
                height={area.h - 20}
                fill="none"
                stroke={isActive ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.05)"}
                strokeWidth="1"
                className="transition-colors duration-300"
              />

              {/* Text Label */}
              <text
                x={area.x + area.w / 2}
                y={area.y + area.h / 2}
                textAnchor="middle"
                alignmentBaseline="middle"
                className={cn(
                  "font-mono text-[12px] font-semibold tracking-[0.2em] transition-colors duration-300 pointer-events-none",
                  isActive ? "fill-primary" : "fill-white/40"
                )}
              >
                {area.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
