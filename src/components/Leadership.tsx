import { motion } from "framer-motion";
import { Crown, Globe, Mail, Phone, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { LEADERSHIP } from "../data/content";
import { SectionHeading } from "./ui";

type Leader = (typeof LEADERSHIP)[number];

function LeaderPhoto({ person, index }: { person: Leader; index: number }) {
  const [failed, setFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(person.photo);

  useEffect(() => {
    setCurrentSrc(person.photo);
    setFailed(false);
  }, [person.photo]);

  const handleImgError = () => {
    setFailed(true);
  };

  const showPhoto = Boolean(currentSrc) && !failed;

  return (
    <div className="relative mx-auto w-fit">
      <div
        className={`flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br ${person.color} p-1.5 shadow-xl`}
      >
        {showPhoto ? (
          <img
            src={currentSrc}
            alt={person.name}
            onError={handleImgError}
            className="h-full w-full rounded-full border-4 border-white object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
            <UserRound size={42} className="text-[#1E40AF]" strokeWidth={1.5} />
            <span className="mt-1 font-display text-lg font-black tracking-widest text-[#0F172A]">
              {person.initials}
              {person.initials === "AN" ? index + 1 : ""}
            </span>
          </div>
        )}
      </div>
      <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] text-amber-300 ring-4 ring-white">
        <Crown size={16} />
      </span>
    </div>
  );
}

export default function Leadership() {
  return (
    <section id="leadership" className="relative bg-[#F4F7FE] py-20 md:py-28">
      <div className="dot-pattern absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Meet the Team"
          title={
            <>
              Our <span className="text-gradient-blue">Leadership</span>
            </>
          }
          desc="Experienced stewards of trust — guiding every property, project and partnership with professionalism and accountability."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {LEADERSHIP.map((p, i) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl border border-white bg-white/70 p-8 text-center shadow-[0_20px_60px_-20px_rgba(30,64,175,0.35)] backdrop-blur-xl"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${p.color}`} />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#E6F0FF] blur-2xl transition group-hover:scale-150" />

              <LeaderPhoto person={p} index={i} />

              <h3 className="mt-5 font-display text-xl font-extrabold text-[#0F172A]">{p.name}</h3>
              <span
                className={`mt-2 inline-block rounded-full bg-gradient-to-r ${p.color} px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow`}
              >
                {p.rank}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{p.desc}</p>

              {/* Contact details */}
              {(p as Leader).email || (p as Leader).phone ? (
                <div className="mt-5 space-y-2 rounded-2xl bg-[#F4F7FE] p-4 ring-1 ring-blue-100">
                  {(p as Leader).email && (
                    <a
                      href={`mailto:${(p as Leader).email}`}
                      className="flex items-center justify-center gap-2 break-all text-[13px] font-bold text-[#1E40AF] transition hover:text-[#0F172A]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF]">
                        <Mail size={13} />
                      </span>
                      {(p as Leader).email}
                    </a>
                  )}
                  {(p as Leader).phone && (
                    <a
                      href={`tel:${(p as Leader).phone}`}
                      className="flex items-center justify-center gap-2 text-[13px] font-bold text-[#1E40AF] transition hover:text-[#0F172A]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF]">
                        <Phone size={13} />
                      </span>
                      {(p as Leader).phone}
                    </a>
                  )}
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-center gap-2">
                {(p as Leader).email ? (
                  <a
                    href={`mailto:${(p as Leader).email}`}
                    title={`Email ${p.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] transition hover:bg-[#1E40AF] hover:text-white"
                  >
                    <Mail size={15} />
                  </a>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] opacity-60">
                    <Mail size={15} />
                  </span>
                )}
                {(p as Leader).phone ? (
                  <a
                    href={`tel:${(p as Leader).phone}`}
                    title={`Call ${p.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] transition hover:bg-[#1E40AF] hover:text-white"
                  >
                    <Phone size={15} />
                  </a>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] opacity-60">
                    <Phone size={15} />
                  </span>
                )}
                <span
                  title="Profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] opacity-60"
                >
                  <Globe size={15} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
