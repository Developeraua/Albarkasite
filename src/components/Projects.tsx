import { motion } from "framer-motion";
import {
  ArrowRight,
  FolderKanban,
  MapPin,
  MessageSquare,
  MessageCircle,
  Phone,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import { useState } from "react";
import { COMPANY } from "../data/content";
import type { PageKey } from "./Navbar";
import { SectionHeading } from "./ui";
import { CommentModal } from "./CommentModal";
import { ProjectEditorModal } from "./ProjectEditorModal";
import { useRealtimeProjects, ProjectItem } from "../utils/useRealtimeCatalogues";
import { useUserRole } from "../utils/useUserRole";

function ProjectCardImage({ project }: { project: ProjectItem }) {
  const images = project.images && project.images.length > 0 ? project.images : [project.image];
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const currentImage = images[currentIdx] || images[0] || project.image;

  return (
    <div className="relative h-52 overflow-hidden bg-slate-900 group/pimg">
      <img
        src={currentImage}
        alt={project.title}
        className="img-zoom h-full w-full object-cover transition duration-500"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
                    "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/5%20bedrooms/facee4.jpeg";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 to-transparent pointer-events-none" />

      {/* Status Badge */}
      <span
        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest z-10 ${
          project.status === "Completed" ? "bg-emerald-500 text-white" : "bg-amber-400 text-[#0F172A]"
        }`}
      >
        {project.status}
      </span>

      {/* Category Tag */}
      <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#1E40AF] backdrop-blur z-10">
        {project.category}
      </span>

      {/* Multiple Photos Indicator */}
      {images.length > 1 && (
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur z-10">
          <Images size={11} />
          {currentIdx + 1}/{images.length}
        </span>
      )}

      {/* Slide Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover/pimg:opacity-100 hover:bg-black/80 z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover/pimg:opacity-100 hover:bg-black/80 z-10"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-4 right-16 pointer-events-none">
        <h3 className="font-display text-[15px] font-extrabold leading-tight text-white drop-shadow truncate">
          {project.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-blue-200">
          <MapPin size={11} /> {project.location}
        </p>
      </div>
    </div>
  );
}

export function ProjectsGrid({
  limit,
  onNavigate,
}: {
  limit?: number;
  onNavigate?: (p: PageKey) => void;
}) {
  const { projects, saveProject, deleteProject } = useRealtimeProjects();
  const { isSuperAdmin } = useUserRole();

  const [filter, setFilter] = useState("All");
  const [commentTarget, setCommentTarget] = useState<{ id: string; title: string } | null>(null);

  // Super Admin editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);

  const cats = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const list = (limit ? projects.slice(0, limit) : projects).filter(
    (p) => filter === "All" || p.category === filter
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (item: ProjectItem) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleDelete = async (item: ProjectItem) => {
    const confirmed = window.confirm(
      `CONFIRM SUPER ADMIN DELETION: Are you sure you want to permanently delete "${item.title}"? This will update Supabase in real-time.`
    );
    if (!confirmed) return;
    await deleteProject(item.id);
  };

  return (
    <>
      {/* Super Admin Top Control Bar on PROJECTS PAGE */}
      {!limit && isSuperAdmin && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-950">
                Super Admin Project Controls Active
              </p>
              <p className="text-[11px] text-emerald-700">
                Add, edit, or delete portfolio projects. Real-time changes sync directly with Supabase.
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
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === c
                  ? "bg-[#0F172A] text-white shadow"
                  : "bg-white text-slate-600 ring-1 ring-blue-100 hover:bg-[#E6F0FF] hover:text-[#1E40AF]"
              }`}
            >
              {c}
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
            <ProjectCardImage project={p} />

            {/* SUPER ADMIN ONLY: Edit & Delete Overlay Buttons on each project card */}
            {isSuperAdmin && (
              <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-xl bg-black/75 p-1.5 backdrop-blur shadow-lg">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  title="Edit Project Data (Super Admin)"
                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-blue-500"
                >
                  <Edit2 size={11} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  title="Delete Project (Super Admin)"
                  className="flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white transition hover:bg-red-500"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              <p className="text-[13px] leading-relaxed text-slate-600 flex-1">{p.desc}</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="uppercase tracking-widest text-slate-400">Progress</span>
                  <span className="text-[#1E40AF]">{p.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-blue-50">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9]"
                  />
                </div>
              </div>

              {/* Action Buttons for Normal Users: View, Comment, WhatsApp Contact */}
              <div className="mt-5 space-y-2 border-t border-blue-50 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("projects");
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-[11px] font-bold text-slate-700 transition"
                  >
                    View Project
                  </button>

                  <button
                    onClick={() =>
                      setCommentTarget({
                        id: p.id,
                        title: p.title,
                      })
                    }
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E6F0FF] hover:bg-blue-100 px-3 py-2 text-[11px] font-bold text-[#1E40AF] transition"
                  >
                    <MessageSquare size={13} /> Comment
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/2348060473796?text=${encodeURIComponent(
                      `Hello Albarka Admin! I'm inquiring about project: ${p.title} (${p.location})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-3 py-2.5 text-[11px] font-bold text-white transition hover:brightness-110 shadow-sm"
                  >
                    <MessageCircle size={13} /> WhatsApp
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

      {/* Comment Modal for Normal Users & Admins */}
      {commentTarget && (
        <CommentModal
          isOpen={Boolean(commentTarget)}
          onClose={() => setCommentTarget(null)}
          itemId={commentTarget.id}
          itemTitle={commentTarget.title}
        />
      )}

      {/* Super Admin Project Editor Modal */}
      {editorOpen && (
        <ProjectEditorModal
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={saveProject}
          initialData={editingItem}
        />
      )}
    </>
  );
}

export function ProjectsPreview({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  return (
    <section className="bg-[#F4F7FE] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Track Record"
          title={
            <>
              Featured <span className="text-gradient-blue">Projects</span>
            </>
          }
          desc="Ongoing and completed works across estates, buildings, water, energy and security systems."
        />
        <ProjectsGrid limit={3} onNavigate={onNavigate} />
        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate("projects")}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:scale-[1.03]"
          >
            <FolderKanban size={17} /> View All Projects <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
