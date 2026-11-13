import { motion } from "framer-motion";
import { Award, Building2, CheckCircle2, Eye, HeartHandshake, MapPin, Quote, ShieldCheck, Target } from "lucide-react";
import type { PageKey } from "./Navbar";
import { ServicesFull } from "./Services";
import { logoImg } from "./ui";
import { HeadquartersSlideView } from "./HeadquartersSlideView";

export function PageHero({ eyebrow, title, desc }: { eyebrow: string; title: React.ReactNode; desc?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#93C5FD] to-[#1E3A8A] pb-16 pt-56 md:pb-20 md:pt-64">
      <div className="hero-pattern absolute inset-0" />
      {/* Company logo shadow / watermark */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end overflow-hidden" aria-hidden="true">
        <motion.img
          src={logoImg}
          alt=""
          initial={{ opacity: 0, scale: 0.92, x: 40 }}
          animate={{ opacity: 0.08, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-[300px] w-[300px] translate-x-1/4 object-contain opacity-[0.08] mix-blend-multiply [mask-image:radial-gradient(circle_at_center,black_52%,transparent_76%)] [filter:drop-shadow(0_30px_50px_rgba(15,23,42,0.35))] sm:h-[360px] sm:w-[360px] md:h-[420px] md:w-[420px] lg:h-[460px] lg:w-[460px]"
        />
      </div>
      <div className="pointer-events-none absolute right-10 top-1/2 hidden h-56 w-72 -translate-y-1/2 rounded-full bg-[#0F172A]/15 blur-3xl lg:block" aria-hidden="true" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E40AF] ring-1 ring-white/60 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1E40AF]" /> {eyebrow}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-black leading-tight text-[#0F172A] sm:text-4xl lg:text-5xl">{title}</h1>
          {desc && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#1E293B]/90">{desc}</p>}
        </motion.div>
      </div>
      <svg className="absolute bottom-0 left-0 w-full text-[#F4F7FE]" viewBox="0 0 1440 70" fill="currentColor" preserveAspectRatio="none"><path d="M0,40 C360,90 1080,0 1440,50 L1440,70 L0,70 Z" /></svg>
    </section>
  );
}

export function AboutPage({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  const values = [
    { icon: ShieldCheck, title: "Integrity", desc: "Honest advice, transparent pricing, dependable delivery." },
    { icon: HeartHandshake, title: "Client Success", desc: "“Our Client's Success is Our Success” — lived daily." },
    { icon: Award, title: "Excellence", desc: "Precision and purpose across every engagement." },
    { icon: Target, title: "Accountability", desc: "Professionalism and respect for applicable standards." },
  ];
  return (
    <div className="bg-[#F4F7FE]">
      <PageHero
        eyebrow="About Albarka"
        title={<>Excellence in Real Estate, Construction & Infrastructure</>}
        desc="A private Nigerian company limited by shares — built to respond to the property, project, supply and development needs of individuals, businesses and institutions."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white bg-white/80 p-7 shadow-xl backdrop-blur md:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F0FF] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E40AF]"><Building2 size={13} /> Our Story</span>
            <h2 className="mt-4 font-display text-2xl font-extrabold text-[#0F172A] md:text-3xl">About ALBARKA PROPERTIES</h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9]" />
            <p className="mt-5 text-[15px] leading-[1.85] text-slate-700">
              ALBARKA PROPERTIES is a real estate company in Bauchi, Nigeria. We sell verified plots, land, and houses. All documents are genuine. Contact us on WhatsApp to book inspection. Guided by our motto, <strong className="text-[#1E40AF]">“Our Client’s Success is Our Success,”</strong> we provide direct, honest property agency and consultancy services with zero hassle.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Private company limited by shares", "HQ: Bauchi, Bauchi State", "RC: 7062863", "Multi-sector business scope"].map((t) => (
                <span key={t} className="flex items-center gap-2 rounded-xl bg-[#E6F0FF] px-3 py-2.5 text-[12.5px] font-bold text-[#1E40AF]"><CheckCircle2 size={15} /> {t}</span>
              ))}
            </div>
          </motion.div>
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl shadow-2xl">
              <HeadquartersSlideView
                className="h-72 w-full object-cover md:h-80"
                intervalMs={4000}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1E40AF]"><MapPin size={18} /></span>
                <div><p className="font-display text-sm font-extrabold text-white">Headquarters — Bauchi</p><p className="text-[11px] text-blue-200">Nasara Shopping Complex, Opposite Old Dass Park Junction</p></div>
              </div>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF]"><v.icon size={19} /></span>
                  <h3 className="mt-3 font-display text-[15px] font-extrabold text-[#0F172A]">{v.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision / Mission mini */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {[
            { icon: Eye, t: "Our Vision", d: "To become a trusted and respected Nigerian service partner in real estate development, construction, infrastructure, and project support—recognised for integrity, dependable delivery, and solutions that create lasting value." },
            { icon: Target, t: "Our Mission", d: "To provide responsive, practical, and value-driven property, project, contracting, and supply solutions; build enduring relationships with clients and partners; and pursue every engagement with professionalism, accountability, and respect for applicable standards." },
          ].map((c) => (
            <div key={c.t} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#0F172A] p-7 text-white md:p-8">
              <Quote size={100} className="absolute -right-3 -top-3 text-white/10" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25"><c.icon size={22} /></span>
              <h3 className="mt-4 font-display text-xl font-extrabold">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-blue-50">“{c.d}”</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => onNavigate("services")} className="rounded-2xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-7 py-3.5 text-sm font-bold text-white shadow-xl">Explore Our Services</button>
          <button onClick={() => onNavigate("contact")} className="rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-[#1E40AF] ring-1 ring-blue-100 shadow">Contact Our Team</button>
        </div>
      </section>
    </div>
  );
}

export function ServicesPage() {
  return (
    <div className="bg-[#F4F7FE] pb-16">
      <PageHero
        eyebrow="Services Catalogue"
        title={<>Our Solutions & Services — 7 Integrated Categories</>}
        desc="From land and buildings to water, power, procurement and project management — one accountable partner for complex needs."
      />
      <section className="py-12">
        <ServicesFull />
        <div className="mx-auto mt-10 flex max-w-7xl items-center gap-3 rounded-2xl bg-[#0F172A] p-6 text-white md:p-8 lg:mx-8">
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex"><Building2 size={24} className="text-sky-300" /></span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-extrabold">Need a combination of services?</h3>
            <p className="mt-1 text-sm text-blue-200">We design bundled solutions — e.g. land + construction + solar + borehole + CCTV — under one contract and one accountable team.</p>
          </div>
          <a href="https://wa.me/2348060473796?text=Hello%20Albarka!%20I%20need%20an%20integrated%20solution." target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-5 py-3 text-sm font-bold shadow-lg transition hover:scale-105">Chat on WhatsApp</a>
        </div>
      </section>
    </div>
  );
}

export function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />;
}
