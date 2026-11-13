import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY } from "../data/content";

export function HeadquartersSlideView({
  className = "h-64 w-full rounded-2xl border-4 border-white/40 object-cover shadow-2xl",
  intervalMs = 4000,
}: {
  className?: string;
  intervalMs?: number;
}) {
  const images = (COMPANY as any).headquartersImages || [
    "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/Office/IMG_20261031_132321.jpg.jpeg",
    "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/Office/IMG_20261031_132344.jpg.jpeg",
    "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/Office/IMG_20261031_132418.jpg.jpeg",
    "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/Office/HH.jpg",
    "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/admins/OFF.webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images, intervalMs]);

  const activeSrc = images[currentIndex] || images[0];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeSrc}
          src={activeSrc}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            const primaryBackup = images[0] || "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/Office/HH.jpg";
            if (target.src !== primaryBackup) {
              target.src = primaryBackup;
            }
          }}
          alt="Albarka Properties Headquarters — Nasara Shopping Complex, Bauchi"
          initial={{ opacity: 0.75, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.75 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={className}
        />
      </AnimatePresence>

      {/* Slide indicator badge */}
      {images.length > 1 && (
        <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white shadow backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span>{currentIndex + 1}/{images.length}</span>
        </div>
      )}
    </div>
  );
}
