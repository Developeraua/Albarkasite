import { motion } from "framer-motion";
import { Eye, Quote, Target } from "lucide-react";
import { SectionHeading } from "./ui";

export default function VisionMission() {
  const cards = [
    {
      icon: Eye,
      title: "Our Vision",
      text: "To become a trusted and respected Nigerian service partner in real estate development, construction, infrastructure, and project support—recognised for integrity, dependable delivery, and solutions that create lasting value.",
    },
    {
      icon: Target,
      title: "Our Mission",
      text: "To provide responsive, practical, and value-driven property, project, contracting, and supply solutions; build enduring relationships with clients and partners; and pursue every engagement with professionalism, accountability, and respect for applicable standards.",
    },
  ];
  return (
    <section className="relative bg-white py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#E6F0FF] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Purpose & Direction"
          title={<>Vision & <span className="text-gradient-blue">Mission</span></>}
          desc="The principles that guide every foundation we lay and every relationship we build."
        />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.14, duration: 0.65 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#1E40AF] to-[#0F172A] p-8 text-white shadow-[0_25px_70px_-20px_rgba(30,64,175,0.6)] md:p-10"
            >
              <div className="hero-pattern absolute inset-0 opacity-50" />
              <Quote size={120} className="absolute -right-4 -top-4 text-white/10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
              <div className="relative">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                  <c.icon size={26} className="text-white" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-extrabold md:text-[1.7rem]">{c.title}</h3>
                <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-sky-300 to-white" />
                <p className="mt-5 text-[15px] leading-relaxed text-blue-50 md:text-base">“{c.text}”</p>
              </div>
              <div className="relative mt-8 flex items-center gap-3 border-t border-white/20 pt-5">
                <div className="flex -space-x-2">
                  {["AP", "RC", "HQ"].map((t) => (
                    <span key={t} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[9px] font-black ring-2 ring-[#1E40AF]">{t}</span>
                  ))}
                </div>
                <p className="text-xs font-semibold text-blue-100">Albarka Properties Consultant Ltd • RC 7062863</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
