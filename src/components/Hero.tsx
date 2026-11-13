import { motion } from "framer-motion";
import { ArrowRight, Award, Building2, MapPin, ShieldCheck, HeartHandshake, Wrench } from "lucide-react";
import type { PageKey } from "./Navbar";
import { GradientButton, logoImg } from "./ui";
import { HeroPropertyCatalogue } from "./HeroPropertyCatalogue";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as any } }),
};

export default function Hero({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#BFDBFE] to-[#1E3A8A] pb-16 pt-52 md:pb-24 md:pt-60">
      <div className="hero-pattern absolute inset-0" />
      {/* Company logo shadow / watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <motion.img
          src={logoImg}
          alt=""
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-[380px] w-[380px] object-contain opacity-[0.08] mix-blend-multiply [mask-image:radial-gradient(circle_at_center,black_52%,transparent_76%)] [filter:drop-shadow(0_35px_55px_rgba(15,23,42,0.35))] sm:h-[480px] sm:w-[480px] md:h-[580px] md:w-[580px] lg:h-[660px] lg:w-[660px]"
        />
      </div>
      {/* Soft floating shadow glow under watermark */}
      <motion.div
        animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F172A]/20 blur-3xl sm:w-[560px] md:h-[340px] md:w-[680px]"
        aria-hidden="true"
      />
      {/* Decorative blobs */}
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#0F172A]/20 blur-3xl" />
      <motion.div animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute right-[8%] top-[18%] hidden h-24 w-24 rounded-3xl bg-white/15 backdrop-blur lg:block" />
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute left-[4%] top-[62%] hidden h-16 w-16 rounded-2xl bg-[#0F172A]/15 backdrop-blur lg:block" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">
        {/* Left copy */}
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 text-xs font-bold text-[#1E40AF] shadow-lg ring-1 ring-white/60 backdrop-blur">
            <span className="rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-3 py-1 text-[10px] uppercase tracking-widest text-white">RC: 7062863</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} /> Headquarters: Bauchi, Bauchi State</span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1} className="mt-6 font-display text-4xl font-black leading-[1.05] text-[#0F172A] sm:text-5xl lg:text-[3.6rem]">
            Trusted Partner in{" "}
            <span className="bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#0EA5E9] bg-clip-text text-transparent">Real Estate,</span>{" "}
            Construction & Infrastructure
          </motion.h1>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-[#1E293B]/90 md:text-[16.5px]">
            <p>
              Albarka Properties Consultant Ltd is a professional real estate and consultancy firm committed to delivering reliable, efficient, and value-driven services across the property and infrastructure sector. With a strong foundation built on trust, integrity, and industry expertise, the company serves individuals, corporate organizations, and public institutions with tailored solutions that meet evolving needs.
            </p>
            <p>
              Guided by the motto, <strong className="font-bold text-[#1E40AF]">“Our Client’s Success is Our Success,”</strong> Albarka Properties Consultant Ltd focuses on creating lasting value by ensuring that every client engagement leads to measurable and meaningful outcomes.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-8 flex flex-wrap items-center gap-3">
            <GradientButton onClick={() => onNavigate("on-sales")}>
              Explore Properties <ArrowRight size={17} />
            </GradientButton>
            <GradientButton variant="white" onClick={() => onNavigate("services")}>
              <Wrench size={17} /> Our Services
            </GradientButton>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-semibold text-[#0F172A]">
            <span className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1E40AF] shadow"><ShieldCheck size={15} /></span> Integrity & Delivery</span>
            <span className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1E40AF] shadow"><Award size={15} /></span> 7 Service Categories</span>
            <span className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#1E40AF] shadow"><Building2 size={15} /></span> Homes • Lands • Projects</span>
          </motion.div>
        </div>

        {/* Right visual */}
        <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="relative">
          <HeroPropertyCatalogue onNavigate={onNavigate} intervalMs={6000} />

          {/* Floating cards */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="glass absolute -left-3 top-6 hidden rounded-2xl p-3 pr-5 shadow-xl sm:block md:-left-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#1E40AF] to-[#0EA5E9] text-white"><HeartHandshake size={18} /></span>
              <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Motto</p><p className="text-[13px] font-extrabold text-[#0F172A]">Client Success First</p></div>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="glass absolute -right-2 bottom-24 hidden rounded-2xl p-3 pr-5 shadow-xl sm:block md:-right-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] ring-1 ring-[#1E40AF]/20"><ShieldCheck size={18} /></span>
              <div><p className="font-display text-lg font-black leading-none text-[#0F172A]">100%</p><p className="text-[11px] font-bold text-slate-500">Commitment to Standards</p></div>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="glass-dark absolute -bottom-7 left-1/2 grid w-[92%] -translate-x-1/2 grid-cols-3 divide-x divide-white/15 rounded-2xl py-3 shadow-2xl">
            {[["7", "Services"], ["7", "Client Groups"], ["HQ", "Bauchi"]].map(([a, b]) => (
              <div key={b} className="text-center">
                <p className="font-display text-lg font-black text-white md:text-xl">{a}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{b}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="relative mx-auto mt-16 hidden w-fit flex-col items-center gap-2 text-white/80 md:flex">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1"><span className="h-2 w-1 rounded-full bg-white" /></span>
      </motion.div>
    </section>
  );
}
