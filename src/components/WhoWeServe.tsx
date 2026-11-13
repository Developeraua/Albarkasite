import { motion } from "framer-motion";
import { Briefcase, Building2, HardHat, Landmark, Leaf, PackageCheck, UserRound, ArrowUpRight } from "lucide-react";
import { WHO_WE_SERVE } from "../data/content";
import { SectionHeading } from "./ui";

const ICONS: Record<string, any> = {
  UserRound, Building2, Briefcase, Landmark, HardHat, PackageCheck, Leaf,
};

export default function WhoWeServe({ onContact }: { onContact: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E6F0FF] via-white to-[#F4F7FE] py-20 md:py-28">
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Client Segments"
          title={<>Who <span className="text-gradient-blue">We Serve</span></>}
          desc="From individuals to government organisations — Albarka responds to the property, project, supply and development needs of all."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {WHO_WE_SERVE.map((s, i) => {
            const Icon = ICONS[s.icon] || Building2;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 4) * 0.1, duration: 0.55 }}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_15px_45px_-18px_rgba(30,64,175,0.35)] ${i === 6 ? "sm:col-span-2 lg:col-span-1 xl:col-span-1" : ""}`}
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] ring-1 ring-[#1E40AF]/15 transition-all duration-300 group-hover:bg-[#1E40AF] group-hover:text-white">
                    <Icon size={21} />
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-300 transition group-hover:bg-[#E6F0FF] group-hover:text-[#1E40AF]">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[15px] font-extrabold leading-snug text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{s.desc}</p>
                <span className="mt-4 block text-[11px] font-bold text-[#1E40AF]/60">0{i + 1}</span>
              </motion.div>
            );
          })}

          {/* CTA card to fill 8th grid slot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E40AF] to-[#0EA5E9] p-6 text-white shadow-xl"
          >
            <div className="hero-pattern absolute inset-0 opacity-40" />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-200">Not sure?</p>
              <h3 className="mt-2 font-display text-lg font-extrabold leading-snug">Tell us your need — we’ll map the right solution.</h3>
            </div>
            <button onClick={onContact} className="relative mt-6 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#1E40AF] transition hover:bg-blue-50">
              Talk to Albarka →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
