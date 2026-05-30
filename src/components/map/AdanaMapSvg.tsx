"use client";

import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { activeDistricts, highlightedPins } from "./mapData";

type Feature = {
  type: string;
  properties: { name: string };
  geometry: GeoPermissibleObjects;
};

type GeoJSONData = {
  type: string;
  features: Feature[];
};

type AdanaMapSvgProps = {
  onDistrictSelect?: (district: string | null) => void;
  selectedDistrict?: string | null;
  districtInfoData?: Record<string, any>;
};

export function AdanaMapSvg({ onDistrictSelect, selectedDistrict, districtInfoData }: AdanaMapSvgProps) {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/maps/adana-districts.geojson?v=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Harita verisi yüklenemedi:", err));
  }, []);

  const { paths, pins } = useMemo(() => {
    if (!geoData) return { paths: [], pins: [] };

    const projection = geoMercator().fitExtent(
      [[80, 80], [800 - 80, 600 - 80]],
      geoData as unknown as GeoPermissibleObjects
    );
    const pathGenerator = geoPath().projection(projection);

    const activeList = districtInfoData ? Object.keys(districtInfoData).filter(key => districtInfoData[key]?.isActive !== false) : activeDistricts;

    const generatedPaths = geoData.features.map((feature) => {
      const name = feature.properties.name || "Bilinmiyor";
      const d = pathGenerator(feature as unknown as GeoPermissibleObjects) || "";
      const isActive = activeList.includes(name);
      
      return { name, d, isActive, feature };
    });

    return { paths: generatedPaths, pins: [] };
  }, [geoData, districtInfoData]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    setMousePos({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height
    });
  };

  if (!geoData) {
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center border border-site-border bg-site-bg text-site-text">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-site-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-site-accent border-r-transparent" />
          Harita Hazırlanıyor...
        </div>
      </div>
    );
  }

  // Which district is currently highlighted (hovered on desktop or selected on mobile)
  const highlighted = hoveredDistrict || selectedDistrict;
  const info = highlighted && districtInfoData ? districtInfoData[highlighted] : null;

  return (
    <div 
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-visible bg-transparent p-4 sm:min-h-[500px]"
      onPointerMove={handlePointerMove}
      onClick={(e) => {
        // Close selection if clicking outside any district path
        if (e.target === e.currentTarget || (e.target as Element).tagName === "svg") {
          onDistrictSelect?.(null);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(182,161,141,0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(116,116,106,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(116,116,106,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

      <svg
        aria-label="Adana Faaliyet Bölgeleri"
        className="relative h-full min-h-[400px] w-full drop-shadow-[0_16px_40px_rgba(46,48,43,0.15)]"
        viewBox="0 0 800 600"
      >
        <motion.g
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } }
          }}
        >
          {paths.map((p) => {
            const isHighlighted = highlighted === p.name;
            return (
              <motion.path
                key={p.name}
                d={p.d}
                className={cn(
                  "cursor-pointer transition-all duration-300 ease-out",
                  p.isActive
                    ? isHighlighted 
                      ? "fill-[#74746A]/35 stroke-[#74746A]" 
                      : "fill-[#74746A]/10 stroke-[#CFC7BA] hover:fill-[#74746A]/20 hover:stroke-[#74746A]"
                    : "fill-[#EEEAE2]/50 stroke-[#CFC7BA]/30 hover:fill-[#EEEAE2]/80"
                )}
                strokeWidth={isHighlighted ? 2 : (p.isActive ? 1.2 : 0.8)}
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { 
                    pathLength: 1, 
                    opacity: 1,
                    transition: { duration: 1.8, ease: "easeInOut" }
                  }
                }}
                onMouseEnter={() => {
                  if (p.isActive) setHoveredDistrict(p.name);
                }}
                onMouseLeave={() => {
                  if (p.isActive) setHoveredDistrict(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (p.isActive) onDistrictSelect?.(p.name);
                }}
                whileHover={p.isActive ? { scale: 1.008, zIndex: 10 } : {}}
                style={{ transformOrigin: "center" }}
              />
            )
          })}
        </motion.g>
      </svg>
      
      {/* Advanced Desktop Floating Tooltip (Strictly Solid - No Glass) */}
      {hoveredDistrict && info && (
        <div
          className="pointer-events-none absolute z-50 hidden md:block"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y,
            transform: `translate(${mousePos.x > mousePos.width / 2 ? "calc(-100% - 24px)" : "24px"}, ${mousePos.y > mousePos.height / 2 ? "calc(-100% - 24px)" : "24px"})`
          }}
        >
          <motion.div
            className="flex w-80 flex-col gap-3 rounded-none border border-[#E1DDD4] bg-[#FFFEFA] p-5 shadow-[0_16px_36px_rgba(46,48,43,0.12)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-[#2E2E2B] tracking-tight">{info.title}</h3>
              <span className="shrink-0 rounded-none border border-[#E1DDD4] bg-[#E9E8E1] px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-[#55564F]">
                {info.status}
              </span>
            </div>
            
            <p className="text-xs leading-relaxed text-site-body">
              {info.description}
            </p>

            <div className="mt-1 space-y-3 border-t border-[#E1DDD4] pt-3">
              <div>
                <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#76736C]">
                  HİZMET KAPSAMI
                </p>
                <div className="flex flex-wrap gap-1">
                  {info.services?.map((service: string) => (
                    <span key={service} className="rounded-none border border-[#E1DDD4] bg-[#EEEAE2] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#2E2E2B]">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#76736C]">
                  PROJE TİPLERİ
                </p>
                <div className="flex flex-wrap gap-1">
                  {info.projectTypes?.map((type: string) => (
                    <span key={type} className="rounded-none border border-[#B6A18D]/30 bg-[#EFE7DF] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#B6A18D]">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-2 bg-[#F7F4EF] p-2 border border-[#E1DDD4]">
              <p className="text-[10px] text-[#76736C]">
                <span className="mr-1 font-bold text-[#B6A18D]">Not:</span>
                {info.note}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Basic tooltip for non-active districts (Strictly Solid) */}
      {hoveredDistrict && !info && (
        <div
          className="pointer-events-none absolute z-50 hidden md:block"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y,
            transform: `translate(${mousePos.x > mousePos.width / 2 ? "calc(-100% - 20px)" : "20px"}, ${mousePos.y > mousePos.height / 2 ? "calc(-100% - 20px)" : "20px"})`
          }}
        >
          <motion.div
            className="rounded-none border border-[#E1DDD4] bg-[#FFFEFA] px-4 py-2 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-[10px] font-bold tracking-wide text-[#76736C] uppercase">
              YAKINDA PROJE ETÜT KAPSAMINDA
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
