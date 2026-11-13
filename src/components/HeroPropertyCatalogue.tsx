import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { PageKey } from "./Navbar";
import { ON_SALES } from "../data/content";

// Find the "Commercial Plaza — 8 Shops" property from ON_SALES
const PLAZA_PROPERTY =
  ON_SALES.find((p) => p.title.toLowerCase().includes("commercial plaza")) ||
  ON_SALES.find((p) => p.title.toLowerCase().includes("plaza")) ||
  ON_SALES[4];

const PLAZA_IMAGES: string[] =
  (PLAZA_PROPERTY as any)?.images && (PLAZA_PROPERTY as any).images.length > 0
    ? (PLAZA_PROPERTY as any).images
    : [
        "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/plaza/plaza.jpeg",
        "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/plaza/WhatsApp%20Image%202026-10-28%20at%207.24.34%20AM.jpeg",
      ];



export function HeroPropertyCatalogue({
  onNavigate,
  intervalMs = 6000,
}: {
  onNavigate: (p: PageKey) => void;
  intervalMs?: number;
}) {
  const [imageIdx, setImageIdx] = useState(0);

  // Auto-slide through all images of Commercial Plaza — 8 Shops
  useEffect(() => {
    if (PLAZA_IMAGES.length <= 1) return;
    const timer = setInterval(() => {
      setImageIdx((prev) => (prev + 1) % PLAZA_IMAGES.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIdx((prev) => (prev - 1 + PLAZA_IMAGES.length) % PLAZA_IMAGES.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIdx((prev) => (prev + 1) % PLAZA_IMAGES.length);
  };

  const activeSrc = PLAZA_IMAGES[imageIdx] || PLAZA_IMAGES[0];

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[2rem] border-4 border-white/70 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.55)] sm:h-[430px] lg:h-[490px] bg-slate-900 group/hero">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${imageIdx}-${activeSrc}`}
          src={activeSrc}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            const primaryBackup = PLAZA_IMAGES[0];
            if (target.src !== primaryBackup) {
              target.src = primaryBackup;
            } else {
              target.src = "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/plaza/plaza.jpeg";
            }
          }}
          alt={PLAZA_PROPERTY.title}
          initial={{ opacity: 0.75, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.75 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/25 to-transparent" />

      {/* Top badges: Property Tag, Category & Photo Counter */}
      <div className="absolute left-4 top-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-white shadow">
            {PLAZA_PROPERTY.tag}
          </span>
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            Commercial Plaza
          </span>
        </div>

        {PLAZA_IMAGES.length > 1 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
            <Images size={12} />
            Photo {imageIdx + 1}/{PLAZA_IMAGES.length}
          </span>
        )}
      </div>

      {/* Side Arrows for Photo Navigation */}
      {PLAZA_IMAGES.length > 1 && (
        <>
          <button
            onClick={prevImage}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/80 hover:scale-110 z-10 shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/80 hover:scale-110 z-10 shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slide Indicators / Dots */}
      {PLAZA_IMAGES.length > 1 && (
        <div className="absolute bottom-[92px] left-4 right-4 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
          {PLAZA_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setImageIdx(idx);
              }}
              title={`Photo ${idx + 1}`}
              className={`h-1.5 transition-all rounded-full ${
                idx === imageIdx
                  ? "w-8 bg-sky-300 shadow-md"
                  : "w-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom info card with price and CTA */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 z-10">
        <div className="glass rounded-2xl px-4 py-3 max-w-[calc(100%-60px)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E40AF]">
            Featured Catalogue • {PLAZA_PROPERTY.location}
          </p>
          <p className="font-display text-sm font-extrabold text-[#0F172A] sm:text-base truncate">
            {PLAZA_PROPERTY.title}
          </p>
          <p className="text-xs font-bold text-[#1E40AF]">
            {PLAZA_PROPERTY.price}
            {PLAZA_PROPERTY.baths > 0 && ` • ${PLAZA_PROPERTY.baths} Baths`}
            {PLAZA_PROPERTY.area && ` • ${PLAZA_PROPERTY.area}`}
          </p>
        </div>

        <button
          onClick={() => onNavigate("on-sales")}
          title="Browse all properties on sales"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow-xl transition hover:scale-110 active:scale-95"
        >
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
