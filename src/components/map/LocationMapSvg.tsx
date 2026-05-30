"use client";

import { cn } from "@/lib/utils";
import { LocationPoint } from "@/data/locationPoints";

type LocationMapSvgProps = {
  points: LocationPoint[];
  activePointId: string;
  onPointChange: (id: string) => void;
};

export function LocationMapSvg({ points, activePointId, onPointChange }: LocationMapSvgProps) {
  const projectPoint = points.find((p) => p.id === "project");

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] max-w-4xl mx-auto flex items-center justify-center bg-[#070A09] rounded-md border border-white/5 overflow-hidden">
      
      {/* Blueprint background lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <svg
        viewBox="0 0 100 100"
        className="relative z-10 w-full h-full drop-shadow-xl"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Abstract road paths */}
        <path d="M -10 50 Q 30 40 50 52 T 110 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        <path d="M 20 -10 Q 30 30 50 52 T 70 110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
        <path d="M 50 110 Q 60 70 50 52 T 80 -10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        
        {/* Connection lines from project to active point */}
        {projectPoint && points.map((point) => {
          if (point.id === "project") return null;
          const isActive = point.id === activePointId;
          return (
            <line
              key={`line-${point.id}`}
              x1={projectPoint.x}
              y1={projectPoint.y}
              x2={point.x}
              y2={point.y}
              stroke={isActive ? "rgba(220, 38, 38, 0.4)" : "rgba(255,255,255,0.05)"}
              strokeWidth={isActive ? "0.4" : "0.2"}
              strokeDasharray={isActive ? "1 1" : "none"}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Outer subtle rings for project point */}
        {projectPoint && (
          <g className="pointer-events-none">
            <circle cx={projectPoint.x} cy={projectPoint.y} r="15" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
            <circle cx={projectPoint.x} cy={projectPoint.y} r="25" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.2" />
            <circle cx={projectPoint.x} cy={projectPoint.y} r="35" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="0.2" />
          </g>
        )}

        {/* Points */}
        {points.map((point) => {
          const isProject = point.id === "project";
          const isActive = point.id === activePointId;
          
          return (
            <g
              key={point.id}
              className={cn(
                "cursor-pointer transition-all duration-300",
                isProject ? "pointer-events-none" : "pointer-events-auto"
              )}
              onClick={() => {
                if (!isProject) onPointChange(point.id);
              }}
              onMouseEnter={() => {
                if (!isProject) onPointChange(point.id);
              }}
            >
              {/* Hit area for easier hover/click */}
              <circle cx={point.x} cy={point.y} r="4" fill="transparent" />

              {/* Point Dot */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isProject ? "1.2" : isActive ? "1" : "0.8"}
                fill={isProject ? "rgb(220, 38, 38)" : isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.3)"}
                className="transition-all duration-300"
              />

              {/* Ping effect for Project and Active Point */}
              {(isProject || isActive) && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isProject ? "2.5" : "1.8"}
                  fill="none"
                  stroke={isProject ? "rgba(220, 38, 38, 0.4)" : "rgba(255,255,255,0.4)"}
                  strokeWidth="0.2"
                  className={cn("transition-all duration-300", isProject ? "animate-pulse" : "")}
                />
              )}

              {/* Label */}
              <text
                x={point.x}
                y={point.y - (isProject ? 2.5 : 2)}
                textAnchor="middle"
                className={cn(
                  "font-mono text-[2.5px] font-medium tracking-wide transition-all duration-300 pointer-events-none",
                  isProject ? "fill-primary" : isActive ? "fill-white" : "fill-white/30"
                )}
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
