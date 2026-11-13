import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  Bath,
  BedDouble,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Images,
  Building,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { COMPANY } from "../data/content";
import type { PageKey } from "./Navbar";
import { SectionHeading } from "./ui";
import { CommentModal } from "./CommentModal";
import { PropertyEditorModal } from "./PropertyEditorModal";
import { useRealtimeProperties, PropertyItem } from "../utils/useRealtimeCatalogues";
import { useUserRole } from "../utils/useUserRole";

function PropertyCardImage({ property }: { property: PropertyItem }) {
  const configuredImages: string[] =
    property.images && property.images.length > 0 ? property.images : [property.image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  const allImages = configuredImages;
  const currentImage = allImages[currentIdx] || allImages[0] || property.image;

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgFailed(false);
    setCurrentIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgFailed(false);
    setCurrentIdx((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div className="relative h-60 overflow-hidden group/img bg-slate-900">
      {!imgFailed ? (
        <img
          src={currentImage}
          onError={() => setImgFailed(true)}
          alt={property.title}
          className="img-zoom h-full w-full object-cover transition duration-500"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0EA5E9] p-6 text-center text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25">
            <Building size={28} className="text-sky-300" />
          </div>
          <p className="mt-3 font-display text-sm font-bold text-white">{property.title}</p>
          <p className="mt-1 text-xs text-blue-200">{property.location}</p>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent pointer-events-none" />

      {/* Tag badge */}
      <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow z-10">
        {property.tag}
      </span>

      {/* Photo counter */}
      {allImages.length > 1 && !imgFailed && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur z-10">
          <Images size={11} />
          {currentIdx + 1}/{allImages.length}
        </span>
      )}

      {/* Navigation arrows */}
      {allImages.length > 1 && !imgFailed && (
        <>
          <button
            onClick={prevImage}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover/img:opacity-100 hover:bg-black/80 z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextImage}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover/img:opacity-100 hover:bg-black/80 z-10"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Price pill */}
      <span className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-1.5 font-display text-[15px] font-black text-[#0F172A] shadow backdrop-blur z-10">
        {property.price}
      </span>
    </div>
  );
}

export function PropertyGrid({
  limit,
  onNavigate,
}: {
  limit?: number;
  onNavigate?: (page: PageKey) => void;
}) {
  const { properties, saveProperty, deleteProperty } = useRealtimeProperties();
  const { isSuperAdmin } = useUserRole();

  const [filter, setFilter] = useState("All");
  const [commentTarget, setCommentTarget] = useState<{ id: string; title: string } | null>(null);

  // Super Admin editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PropertyItem | null>(null);

  const tags = ["All", "For Sale", "For Lease", "Land"];
  const list = (limit ? properties.slice(0, limit) : properties).filter(
    (p) => filter === "All" || p.tag === filter
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (item: PropertyItem) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleDelete = async (item: PropertyItem) => {
    const confirmed = window.confirm(
      `CONFIRM SUPER ADMIN DELETION: Are you sure you want to permanently delete "${item.title}"? This will update Supabase in real-time.`
    );
    if (!confirmed) return;
    await deleteProperty(item.id);
  };

  return (
    <>
      {/* Super Admin Top Control Bar on ON SALE PAGE */}
      {!limit && isSuperAdmin && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-950">
                Super Admin Content Controls Active
              </p>
              <p className="text-[11px] text-emerald-700">
                Add, edit, or delete on-sale properties. Changes sync directly to Supabase in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition hover:brightness-110 active:scale-95"
          >
            <Plus size={16} />
            <span>Add Item (Super Admin)</span>
          </button>
        </div>
      )}

      {!limit && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                filter === t
                  ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow-lg"
                  : "bg-white text-slate-600 ring-1 ring-blue-100 hover:bg-[#E6F0FF] hover:text-[#1E40AF]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.1, duration: 0.55 }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_-20px_rgba(30,64,175,0.4)]"
          >
            <PropertyCardImage property={p} />

            {/* SUPER ADMIN ONLY: Edit & Delete Overlay Buttons directly on each property card */}
            {isSuperAdmin && (
              <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-xl bg-black/75 p-1.5 backdrop-blur shadow-lg">
                <button
                  onClick={() => handleOpenEdit(p)}
                  title="Edit Property (Super Admin)"
                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-blue-500"
                >
                  <Edit2 size={11} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  title="Delete Property (Super Admin)"
                  className="flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white transition hover:bg-red-500"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-[16px] font-extrabold leading-tight text-[#0F172A]">{p.title}</h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
                <MapPin size={12} className="text-[#1E40AF]" /> {p.location}
              </p>
              {(p.beds > 0 || p.baths > 0) && (
                <div className="mt-3 flex items-center gap-4 text-[12px] font-bold text-slate-600">
                  {p.beds > 0 && (
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={15} className="text-[#1E40AF]" /> {p.beds} Beds
                    </span>
                  )}
                  {p.baths > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Bath size={15} className="text-[#1E40AF]" /> {p.baths} Baths
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Ruler size={15} className="text-[#1E40AF]" /> {p.area}
                  </span>
                </div>
              )}
              {p.beds === 0 && p.baths === 0 && (
                <div className="mt-3 flex items-center gap-2 text-[12px] font-bold text-slate-600">
                  <Ruler size={15} className="text-[#1E40AF]" /> {p.area}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.features.map((f) => (
                  <span key={f} className="rounded-full bg-[#E6F0FF] px-2.5 py-1 text-[10.5px] font-bold text-[#1E40AF]">
                    {f}
                  </span>
                ))}
              </div>

              {/* Action Buttons for Normal Users: View, Comment, WhatsApp Contact */}
              <div className="mt-5 space-y-2 border-t border-blue-50 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("on-sales");
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700 transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => setCommentTarget({ id: p.id, title: p.title })}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E6F0FF] hover:bg-blue-100 px-3 py-2 text-[11px] font-bold text-[#1E40AF] transition"
                  >
                    <MessageSquare size={13} /> Comment
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/2348060473796?text=${encodeURIComponent(
                      `Hello Albarka Admin! I'm interested in: ${p.title} (${p.location}) — ${p.price}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-3 py-2.5 text-[11px] font-bold text-white transition hover:brightness-110 shadow-sm"
                  >
                    <MessageCircle size={13} /> WhatsApp Admin
                  </a>
                  <a
                    href={`tel:${COMPANY.phones[0]}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0F172A] px-3 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#1E40AF]"
                  >
                    <Phone size={13} /> Call
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Comments Modal */}
      {commentTarget && (
        <CommentModal
          isOpen={Boolean(commentTarget)}
          onClose={() => setCommentTarget(null)}
          itemId={commentTarget.id}
          itemTitle={commentTarget.title}
        />
      )}

      {/* Super Admin Property Editor Modal */}
      {editorOpen && (
        <PropertyEditorModal
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={saveProperty}
          initialData={editingItem}
        />
      )}
    </>
  );
}

export function OnSalesPreview({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-24">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#E6F0FF] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Hot Listings"
          title={
            <>
              Properties <span className="text-gradient-blue">On Sales</span>
            </>
          }
          desc="Handpicked homes, lands and commercial spaces — verified, well-located and ready for inspection in Bauchi."
        />
        <PropertyGrid limit={3} onNavigate={onNavigate} />
        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate("on-sales")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/30 transition hover:scale-[1.03]"
          >
            <BadgePercent size={17} /> Browse All Listings <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
