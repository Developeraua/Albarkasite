import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercent,
  FolderKanban,
  Home,
  Info,
  LogIn,
  Mail,
  Menu,
  Phone,
  Wrench,
  X,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { COMPANY } from "../data/content";
import { LogoMark } from "./ui";
import { useUserRole } from "../utils/useUserRole";

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "on-sales"
  | "contact"
  | "signin"
  | "signup"
  | "dashboard"
  | "admin"
  | "unauthorized";

const BASE_MENU: { key: PageKey | "login"; label: string; icon: any; desc: string }[] = [
  { key: "login", label: "Sign In / Sign Up", icon: LogIn, desc: "Staff & client portal" },
  { key: "about", label: "About", icon: Info, desc: "Who we are & our story" },
  { key: "services", label: "Services", icon: Wrench, desc: "7 solution categories" },
  { key: "projects", label: "Projects", icon: FolderKanban, desc: "Ongoing & completed" },
  { key: "on-sales", label: "On Sales", icon: BadgePercent, desc: "Homes, lands & leases" },
  { key: "contact", label: "Contact", icon: Mail, desc: "Talk to our team" },
];

export default function Navbar({
  page,
  onNavigate,
  onLogin,
}: {
  page: PageKey;
  onNavigate: (p: PageKey) => void;
  onLogin: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSuperAdmin, user } = useUserRole();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const go = (key: PageKey | "login") => {
    setOpen(false);
    if (key === "login") onLogin();
    else onNavigate(key);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top mini bar */}
      <div
        className={`hidden bg-[#0F172A] text-blue-100 transition-all duration-300 md:block ${
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[11.5px] font-medium lg:px-8">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-sky-300" /> Bauchi, Bauchi State, Nigeria
            </span>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-white">
              <Mail size={12} className="text-sky-300" /> {COMPANY.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            {isSuperAdmin && (
              <button
                onClick={() => onNavigate("admin")}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ring-1 ring-emerald-400/30 hover:bg-emerald-500/30 transition"
              >
                <ShieldCheck size={12} />
                <span>Super Admin Panel</span>
              </button>
            )}
            <span className="italic text-sky-200">“{COMPANY.motto}”</span>
            <a
              href={`tel:${COMPANY.phones[0]}`}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-bold text-white ring-1 ring-white/20 hover:bg-white/20"
            >
              <Phone size={11} /> {COMPANY.phones[0]}
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-blue-100 bg-white/85 shadow-[0_10px_35px_-12px_rgba(30,64,175,0.35)] backdrop-blur-xl"
            : "border-white/30 bg-white/70 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 lg:px-8">
          {/* Left: Logo only */}
          <button
            onClick={() => onNavigate("home")}
            className="group flex shrink-0 items-center"
            aria-label="Albarka Properties Consultant Limited — Home"
          >
            <span className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-blue-100 transition group-hover:ring-2 group-hover:ring-[#1E40AF]/30">
              <LogoMark height={scrolled ? 48 : 60} />
            </span>
          </button>

          {/* Center: Company name — centre aligned, bold, responsive on all screens */}
          <button
            onClick={() => onNavigate("home")}
            className="flex min-w-0 flex-1 items-center justify-center px-1 text-center"
            aria-label="Albarka Properties Consultant Limited — Home"
          >
            {/* MOBILE: stacked block (phones) */}
            <span className="flex w-full flex-col items-center justify-center md:hidden">
              <span
                className="block w-full font-display font-black uppercase leading-[1.12] text-[#0F172A]"
                style={{ fontSize: "clamp(14px, 5vw, 22px)", letterSpacing: "0.08em", wordSpacing: "0.28em" }}
              >
                Albarka Properties
              </span>
              <span
                className="mt-1 block w-full font-display font-black uppercase leading-[1.15] text-[#0F172A]"
                style={{ fontSize: "clamp(11px, 3.9vw, 17px)", letterSpacing: "0.16em", wordSpacing: "0.3em" }}
              >
                Consultant Limited
              </span>
              <span
                className="mt-1.5 block w-full font-display font-black uppercase leading-none text-[#ED1C24]"
                style={{ fontSize: "clamp(10px, 3.2vw, 14px)", letterSpacing: "0.3em", wordSpacing: "0.35em" }}
              >
                {COMPANY.rc}
              </span>
            </span>

            {/* TABLET + PC: straight single-line block (md and up) */}
            <span className="hidden w-full flex-col items-center justify-center md:flex">
              <span
                className="block w-full whitespace-nowrap text-center font-display font-black uppercase leading-[1.1] text-[#0F172A]"
                style={{ fontSize: "clamp(16px, 2.3vw, 28px)", letterSpacing: "0.06em", wordSpacing: "0.32em" }}
              >
                Albarka Properties Consultant Limited
              </span>
              <span
                className="mt-2 block text-center font-display font-black uppercase leading-none text-[#ED1C24]"
                style={{ fontSize: "clamp(12px, 1.3vw, 16px)", letterSpacing: "0.34em", wordSpacing: "0.4em" }}
              >
                {COMPANY.rc}
              </span>
            </span>
          </button>

          {/* Right: hamburger dropbox only */}
          <div className="flex shrink-0 items-center">
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                  open
                    ? "bg-[#0F172A] text-white"
                    : "bg-gradient-to-br from-[#1E40AF] to-[#0EA5E9] text-white shadow-lg shadow-blue-500/30"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "x" : "m"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {open ? <X size={20} /> : <Menu size={20} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {open && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                      className="absolute right-0 top-[calc(100%+12px)] max-h-[78vh] w-[300px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-blue-100 bg-white/95 p-2 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                    >
                      <div className="rounded-xl bg-gradient-to-br from-[#E6F0FF] to-[#1E3A8A] p-4 text-white">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-100">Menu</p>
                        <p className="mt-1 font-display text-sm font-bold">
                          {user ? `Logged in: ${user.email?.split("@")[0]}` : "Navigate Albarka"}
                        </p>
                      </div>

                      <div className="mt-2 space-y-1">
                        <button
                          onClick={() => go("home")}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                            page === "home" ? "bg-[#E6F0FF]" : "hover:bg-blue-50"
                          }`}
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF]">
                            <Home size={16} />
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-bold text-[#0F172A]">Home</span>
                            <span className="block text-[11px] text-slate-500">Start here</span>
                          </span>
                          <ChevronRight size={15} className="text-slate-300" />
                        </button>

                        {/* SUPER ADMIN LINK - visible ONLY to Super Admins */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => go("admin")}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                              page === "admin" ? "bg-emerald-50 border border-emerald-200" : "bg-emerald-50/60 hover:bg-emerald-100/70"
                            }`}
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                              <ShieldCheck size={16} />
                            </span>
                            <span className="flex-1">
                              <span className="block text-sm font-black text-emerald-900">Admin Dashboard</span>
                              <span className="block text-[10px] font-semibold text-emerald-700">SUPER_ADMIN Control</span>
                            </span>
                            <ChevronRight size={15} className="text-emerald-400" />
                          </button>
                        )}

                        {BASE_MENU.map((m, i) => (
                          <motion.button
                            key={m.key}
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 + i * 0.05 }}
                            onClick={() => go(m.key)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                              page === m.key ? "bg-[#E6F0FF]" : "hover:bg-blue-50"
                            }`}
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF]">
                              <m.icon size={16} />
                            </span>
                            <span className="flex-1">
                              <span className="block text-sm font-bold text-[#0F172A]">{m.label}</span>
                              <span className="block text-[11px] text-slate-500">{m.desc}</span>
                            </span>
                            <ChevronRight size={15} className="text-slate-300" />
                          </motion.button>
                        ))}
                      </div>

                      <button
                        onClick={() => go("contact")}
                        className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30 transition hover:brightness-110"
                      >
                        Get a Quote
                      </button>

                      <div className="mt-2 rounded-xl bg-[#0F172A] p-3 text-center">
                        <p className="text-[11px] font-semibold text-blue-100">Need help? Call us</p>
                        <a
                          href={`tel:${COMPANY.phones[0]}`}
                          className="font-display text-sm font-extrabold text-white"
                        >
                          {COMPANY.phones[0]} • {COMPANY.phones[1]}
                        </a>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Agency tagline strip */}
      <div
        className={`overflow-hidden border-b transition-all duration-300 ease-in-out ${
          scrolled
            ? "max-h-0 border-transparent opacity-0 pointer-events-none"
            : "max-h-28 border-blue-200/70 opacity-100 bg-gradient-to-r from-[#E6F0FF] via-white to-[#E6F0FF]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-2.5 py-1.5 sm:px-4 sm:py-2 lg:px-8">
          <p
            className="mx-auto rounded-xl border-2 border-[#1E40AF]/30 bg-white/90 px-2.5 py-1.5 text-center font-display font-bold uppercase leading-snug text-[#1E40AF] shadow-sm sm:px-4 sm:py-2"
            style={{ fontSize: "clamp(9px, 2.6vw, 13.5px)", letterSpacing: "0.03em" }}
          >
            AGENCY FOR LAND &amp; LANDED PROPERTIES, PROPERTIES MANAGEMENT, VALUATION FOR ALL PURPOSES, FACILITY
            MANAGEMENT, GENERAL CONTRACTS, SUPPLIES &amp; CONSULTANCY SERVICES.
          </p>
        </div>
      </div>
    </header>
  );
}
