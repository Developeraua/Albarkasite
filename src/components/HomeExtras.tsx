import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Building2, Droplets, Hammer, Phone, ShieldCheck, Sun } from "lucide-react";
import { COMPANY } from "../data/content";
import type { PageKey } from "./Navbar";
import { HeadquartersSlideView } from "./HeadquartersSlideView";

export function TrustMarquee() {
  const items = [
    "Agency For Land & Landed Properties",
    "Management",
    "Valuation for all Purposes",
    "Facility Management",
    "General Contracts",
    "Supplies",
    "Consultancy Services",
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-blue-100 bg-white py-4">
      <div className="animate-marquee flex w-max items-center gap-3">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[#E6F0FF] px-4 py-2 text-[12px] font-bold text-[#1E40AF]">
            <BadgeCheck size={14} /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StatsBand() {
  const stats = [
    { icon: Building2, value: "7", label: "Service Categories" },
    { icon: ShieldCheck, value: "7", label: "Client Segments Served" },
    { icon: Hammer, value: "360°", label: "Property Lifecycle Cover" },
    { icon: Sun, value: "24/7", label: "Support & Response" },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E40AF] to-[#0EA5E9] py-10">
      <div className="hero-pattern absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#1E40AF]"><s.icon size={20} /></span>
            <div><p className="font-display text-2xl font-black text-white">{s.value}</p><p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">{s.label}</p></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CTABand({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  return (
    <section className="bg-[#F4F7FE] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#E6F0FF] via-[#3B82F6] to-[#0F172A] p-8 shadow-2xl md:p-12"
        >
          <div className="hero-pattern absolute inset-0" />
          <Droplets size={180} className="absolute -bottom-8 -right-8 text-white/10" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/30 backdrop-blur">Ready when you are</span>
              <h2 className="mt-4 font-display text-2xl font-black leading-tight text-white md:text-4xl">Have land, a building dream, or an infrastructure need in Bauchi?</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-50 md:text-[15px]">Get a free consultation — property inspection, borehole assessment, solar sizing or project costing. “Our Client’s Success is Our Success.”</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => onNavigate("contact")} className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-[#1E40AF] shadow-xl transition hover:scale-[1.03]">
                  Get Free Consultation <ArrowRight size={16} />
                </button>
                <a href={`tel:${COMPANY.phones[0]}`} className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-7 py-3.5 text-sm font-bold text-white ring-1 ring-white/40 backdrop-blur transition hover:bg-white/25">
                  <Phone size={16} /> {COMPANY.phones[0]}
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <HeadquartersSlideView
                  className="h-64 w-full rounded-2xl border-4 border-white/40 object-cover shadow-2xl"
                  intervalMs={4000}
                />
              </div>
              <div className="glass absolute -bottom-4 left-6 right-6 rounded-2xl p-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#1E40AF]">Headquarters</p>
                <p className="font-display text-[13px] font-extrabold text-[#0F172A]">Nasara Shopping Complex, Bauchi</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
