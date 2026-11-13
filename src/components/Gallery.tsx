import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, Expand, Pause, Play, MapPin, Tag, Building2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ON_SALES } from "../data/content";
import { SectionHeading } from "./ui";

export interface GallerySlideItem {
  id: string;
  src: string;
  title: string;
  propertyTitle: string;
  tag: string;
  location: string;
  price: string;
  photoIndex: number;
  totalPhotos: number;
}

export default function Gallery() {
  // Extract all photo slides dynamically from every ON_SALES property catalogue
  const slides: GallerySlideItem[] = useMemo(() => {
    const list: GallerySlideItem[] = [];

    ON_SALES.forEach((prop, propIdx) => {
      const images: string[] =
        (prop as any).images && (prop as any).images.length > 0
          ? (prop as any).images
          : [prop.image];

      images.forEach((imgUrl, imgIdx) => {
        list.push({
          id: `${propIdx}-${imgIdx}-${imgUrl}`,
          src: imgUrl,
          title: `${prop.title} — View ${imgIdx + 1}`,
          propertyTitle: prop.title,
          tag: prop.tag,
          location: prop.location,
          price: prop.price,
          photoIndex: imgIdx + 1,
          totalPhotos: images.length,
        });
      });
    });

    return list;
  }, []);

  const [activePropertyFilter, setActivePropertyFilter] = useState<string>("All");
  const filteredSlides = useMemo(() => {
    if (activePropertyFilter === "All") return slides;
    return slides.filter((s) => s.propertyTitle === activePropertyFilter);
  }, [slides, activePropertyFilter]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const timer = useRef<any>(null);

  // Reset index when filter changes
  useEffect(() => {
    setIndex(0);
  }, [activePropertyFilter]);

  const safeIndex = index < filteredSlides.length ? index : 0;
  const current = filteredSlides[safeIndex] || slides[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % filteredSlides.length);
  }, [filteredSlides.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + filteredSlides.length) % filteredSlides.length);
  }, [filteredSlides.length]);

  useEffect(() => {
    if (!playing || lightbox || filteredSlides.length <= 1) return;
    timer.current = setInterval(next, 4500);
    return () => clearInterval(timer.current);
  }, [playing, lightbox, next, safeIndex, filteredSlides.length]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E3A8A] to-[#0F172A] py-20 md:py-28">
      <div className="grid-pattern-dark absolute inset-0" />
      <div className="absolute -top-20 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[#3B82F6]/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Real Estate Portfolio &amp; Site Showcase"
          title={
            <>
              Project <span className="bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent">Photo Gallery</span>
            </>
          }
          desc="Explore real on-site photography across our verified duplexes, bungalows, apartments, commercial plazas, and prime plots in Bauchi."
        />

        {/* Property Filter Tabs */}
        <div className="no-scrollbar mb-8 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActivePropertyFilter("All")}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activePropertyFilter === "All"
                ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow-lg shadow-blue-500/30 scale-105"
                : "bg-white/10 text-blue-200 ring-1 ring-white/15 hover:bg-white/20 hover:text-white"
            }`}
          >
            All Catalogues ({slides.length})
          </button>
          {ON_SALES.map((prop) => (
            <button
              key={prop.title}
              onClick={() => setActivePropertyFilter(prop.title)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activePropertyFilter === prop.title
                  ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-white/10 text-blue-200 ring-1 ring-white/15 hover:bg-white/20 hover:text-white"
              }`}
            >
              {prop.title.split("—")[0].replace("Fully Detached ", "")}
            </button>
          ))}
        </div>

        {/* Main slider */}
        {current && (
          <div
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] bg-slate-900"
            onMouseEnter={() => setPlaying(false)}
            onMouseLeave={() => setPlaying(true)}
          >
            <div className="relative h-[340px] sm:h-[460px] lg:h-[540px]">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={current.id}
                  src={current.src}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const safeFallback = "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/Office/HH.jpg";
                    if (target.src !== safeFallback) {
                      target.src = safeFallback;
                    }
                  }}
                  alt={current.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65 }}
                  className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
                  onClick={() => setLightbox(true)}
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />

              {/* Top Floating Tag & Slide Counter */}
              <div className="absolute left-4 top-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-white shadow">
                    <Tag size={12} /> {current.tag}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    <Building2 size={12} className="text-sky-400" />
                    {current.propertyTitle}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                  <Camera size={12} className="text-sky-400" />
                  Photo {current.photoIndex} of {current.totalPhotos}
                </span>
              </div>

              {/* Caption & Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-7 z-10">
                <div className="max-w-xl">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-200">
                    <MapPin size={13} className="text-sky-400" /> {current.location}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-extrabold text-white sm:text-2xl lg:text-3xl drop-shadow">
                    {current.propertyTitle}
                  </h3>
                  <p className="mt-1.5 inline-block rounded-xl bg-white/15 px-3 py-1 text-sm font-black text-sky-300 ring-1 ring-white/20 backdrop-blur">
                    {current.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/30 hover:scale-105"
                    aria-label="Play or Pause"
                  >
                    {playing ? <Pause size={17} /> : <Play size={17} />}
                  </button>
                  <button
                    onClick={() => setLightbox(true)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/30 hover:scale-105"
                    aria-label="Expand image"
                  >
                    <Expand size={17} />
                  </button>
                </div>
              </div>

              {/* Side Navigation Arrows */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 ring-1 ring-white/30 backdrop-blur transition hover:bg-[#1E40AF] group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 ring-1 ring-white/30 backdrop-blur transition hover:bg-[#1E40AF] group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>

              {/* Top Progress Bar */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-white/15 z-10">
                <motion.div
                  key={`${current.id}-${String(playing)}`}
                  initial={{ width: "0%" }}
                  animate={{ width: playing && !lightbox ? "100%" : "0%" }}
                  transition={{ duration: 4.5, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-sky-400 via-blue-200 to-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Filmstrip */}
        <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-2">
          {filteredSlides.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setIndex(i)}
              className={`group relative h-20 w-32 shrink-0 overflow-hidden rounded-xl ring-2 transition-all sm:h-24 sm:w-40 bg-slate-900 ${
                i === safeIndex ? "ring-sky-300 scale-[1.03] shadow-lg" : "ring-white/15 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={g.src}
                alt={g.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/Office/HH.jpg";
                }}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-1 left-2 right-2 truncate text-left text-[10px] font-bold text-white">
                {g.propertyTitle.split("—")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Dots Counter */}
        <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap max-w-lg mx-auto">
          {filteredSlides.slice(0, 25).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === safeIndex ? "w-7 bg-sky-300 shadow" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
          {filteredSlides.length > 25 && (
            <span className="text-[11px] font-bold text-blue-300 ml-1">+{filteredSlides.length - 25} more</span>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0F172A]/95 p-4 backdrop-blur"
            onClick={() => setLightbox(false)}
          >
            <div className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">
              <motion.img
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.94 }}
                src={current.src}
                alt={current.title}
                className="max-h-[80vh] w-auto max-w-full object-contain"
              />
              <div className="p-4 bg-gradient-to-t from-black to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-base font-extrabold text-white">{current.propertyTitle}</p>
                  <p className="text-xs text-sky-300">{current.price} • {current.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">
                    Photo {current.photoIndex} / {current.totalPhotos}
                  </span>
                  <button
                    onClick={() => setLightbox(false)}
                    className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white ring-1 ring-white/30 hover:bg-white/30"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
