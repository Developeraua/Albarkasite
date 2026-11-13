import { motion } from "framer-motion";
import type { ReactNode } from "react";
import logoImg from "../assets/logo.svg";

export { logoImg };

export function LogoMark({ height = 48, className = "" }: { height?: number; className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Albarka Properties Consultant Limited — RC: 7062863"
      height={height}
      width={height}
      style={{ height, width: "auto" }}
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  dark = false,
  center = true,
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`mb-10 md:mb-14 ${center ? "mx-auto max-w-3xl text-center" : "text-left"}`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
          dark ? "bg-white/15 text-[#CCE0FF] ring-1 ring-white/25" : "bg-[#E6F0FF] text-[#1E40AF] ring-1 ring-[#1E40AF]/15"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-sky-300" : "bg-[#1E40AF]"} animate-pulse`} />
        {eyebrow}
      </span>
      <h2 className={`mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl lg:text-[2.75rem] ${dark ? "text-white" : "text-[#0F172A]"}`}>
        {title}
      </h2>
      {desc && <p className={`mt-4 text-[15px] leading-relaxed md:text-base ${dark ? "text-blue-100/90" : "text-slate-600"}`}>{desc}</p>}
    </motion.div>
  );
}

export function IconBadge({ children, size = "md" }: { children: ReactNode; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-10 w-10", md: "h-12 w-12", lg: "h-14 w-14" };
  return (
    <div className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-[#E6F0FF] text-[#1E40AF] ring-1 ring-[#1E40AF]/15 shadow-[0_6px_20px_-6px_rgba(30,64,175,0.4)]`}>
      {children}
    </div>
  );
}

export function GradientButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "white" | "outline";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#0EA5E9] text-white shadow-[0_15px_35px_-10px_rgba(30,64,175,0.6)] hover:shadow-[0_20px_45px_-10px_rgba(30,64,175,0.7)]"
      : variant === "white"
      ? "bg-white text-[#1E40AF] shadow-xl hover:bg-blue-50"
      : "bg-white/10 text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/20";
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-300 ${styles} ${className}`}
    >
      {children}
    </motion.button>
  );
}
