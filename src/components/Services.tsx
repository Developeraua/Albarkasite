import { AnimatePresence, motion } from "framer-motion";
import { Building2, CheckCircle2, Compass, Handshake, KanbanSquare, Minus, PackageCheck, Plus, Scale, Wrench, ArrowRight } from "lucide-react";
import { useState } from "react";
import { SERVICES } from "../data/content";
import { SectionHeading } from "./ui";
import type { PageKey } from "./Navbar";

const ICONS: Record<string, any> = {
  Building2, Scale, Wrench, KanbanSquare, PackageCheck, Compass,
};

export function ServiceCard({ s, i, defaultOpen = false }: { s: (typeof SERVICES)[0]; i: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = ICONS[s.icon] || Building2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (i % 3) * 0.1, duration: 0.55 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_50px_-20px_rgba(30,64,175,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-20px_rgba(30,64,175,0.5)]"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={s.image} alt={s.title} className="img-zoom h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/75 via-[#0F172A]/10 to-transparent" />
        <span className="absolute bottom-3 left-3 right-3 font-display text-[15px] font-extrabold leading-tight text-white drop-shadow">{s.title}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] ring-1 ring-[#1E40AF]/15"><Icon size={19} /></span>
          <p className="text-[13px] font-medium leading-snug text-slate-600">{s.short}</p>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2 border-t border-blue-50 pt-4">
                {s.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[13px] font-medium text-slate-700">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#1E40AF]" /> {it}
                  </li>
                ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
        <button
          onClick={() => setOpen(!open)}
          className={`mt-4 flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition ${open ? "bg-[#0F172A] text-white" : "bg-[#E6F0FF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"}`}
        >
          {open ? "Show less" : "View details"}
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </button>
      </div>
    </motion.div>
  );
}

export function ServicesIntro() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E6F0FF] via-[#DBEAFE] to-[#BFDBFE] p-7 ring-1 ring-[#1E40AF]/10 md:p-10">
      <Handshake size={130} className="absolute -right-6 -top-6 text-[#1E40AF]/10" />
      <div className="relative max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E40AF] shadow">
          Open to Collaboration
        </span>
        <p className="mt-4 text-[15px] leading-relaxed text-[#1E293B] md:text-base">
          Albarka recognises that complex property and infrastructure needs may require expertise beyond the scope of a single provider. The company is open to professional collaboration where partners bring complementary skills, capacity, or specialised knowledge — so every client gets the right team for the job, without compromise.
        </p>
      </div>
    </div>
  );
}

export function ServicesPreview({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title={<>Our Solutions & <span className="text-gradient-blue">Services</span></>}
          desc="Eight integrated categories covering the full lifecycle of property, construction and infrastructure."
        />
        <ServicesIntro />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} defaultOpen={i === 0} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => onNavigate("services")} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/30 transition hover:scale-[1.03]">
            View All 7 Services <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function ServicesFull() {
  const [filter, setFilter] = useState<string>("all");
  const cats = ["all", ...SERVICES.map((s) => s.id)];
  const shown = filter === "all" ? SERVICES : SERVICES.filter((s) => s.id === filter);
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <ServicesIntro />
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter("all")} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${filter === "all" ? "bg-[#0F172A] text-white" : "bg-[#E6F0FF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"}`}>All Services</button>
        {SERVICES.map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${filter === s.id ? "bg-[#0F172A] text-white" : "bg-white text-slate-600 ring-1 ring-blue-100 hover:bg-[#E6F0FF] hover:text-[#1E40AF]"}`}>
            {s.title.split(" and ")[0]}
          </button>
        ))}
        <span className="hidden">{cats.length}</span>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s, i) => (
          <ServiceCard key={s.id} s={s} i={i} defaultOpen={filter !== "all"} />
        ))}
      </div>
    </div>
  );
}
