import { ArrowUp, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { COMPANY, SERVICES, SOCIALS } from "../data/content";
import type { PageKey } from "./Navbar";
import { LogoMark } from "./ui";
import type { ReactNode } from "react";

function SocialBadge({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl shadow-[0_10px_25px_-10px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </span>
  );
}

const BrandIcons: Record<string, () => React.ReactNode> = {
  google: () => (
    <SocialBadge className="bg-white ring-1 ring-black/5">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h6.44a5.51 5.51 0 0 1-2.39 3.62v3.01h3.88c2.27-2.09 3.56-5.17 3.56-8.65Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.01c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.29V6.61H1.27A12 12 0 0 0 0 12c0 1.93.46 3.75 1.27 5.39l4.01-3.1Z" />
        <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.96 1.12 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4.01 3.1c.94-2.84 3.59-4.95 6.72-4.95Z" />
      </svg>
    </SocialBadge>
  ),
  facebook: () => (
    <SocialBadge className="bg-[#1877F2] text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.26-1.46 1.51-1.46H16.7V5.02c-.29-.04-1.27-.12-2.42-.12-2.39 0-4.03 1.46-4.03 4.14V11H7.5v3h2.75v8h3.25Z" />
      </svg>
    </SocialBadge>
  ),
  twitter: () => (
    <SocialBadge className="bg-black text-white">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.26l-4.9-6-5.25 6H3.68l7.24-8.28L1.29 2H7.7l4.43 5.47L18.9 2Zm-1.1 18h1.74L6.75 3.9H4.89L17.8 20Z" />
      </svg>
    </SocialBadge>
  ),
  tiktok: () => (
    <SocialBadge className="bg-black text-white">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.5 3c.5 1.8 1.8 3.15 3.5 3.62V9.3a7.1 7.1 0 0 1-3.5-1.13v6.16A5.05 5.05 0 1 1 9.45 9.3c.33 0 .65.03.95.09v2.8a2.4 2.4 0 0 0-.95-.2 2.34 2.34 0 0 0-2.33 2.33 2.34 2.34 0 0 0 2.33 2.34c1.46 0 2.51-1.08 2.51-2.7V3h2.54Z" />
      </svg>
    </SocialBadge>
  ),
  instagram: () => (
    <SocialBadge className="bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    </SocialBadge>
  ),
  whatsapp: () => (
    <SocialBadge className="bg-[#25D366] text-white">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.13 0C5.57 0 .24 5.33.24 11.89c0 2.1.55 4.15 1.58 5.96L0 24l6.34-1.66a11.9 11.9 0 0 0 5.79 1.48h.01c6.56 0 11.89-5.33 11.89-11.89 0-3.17-1.23-6.15-3.51-8.45Zm-8.39 18.33h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.76.98 1-3.66-.24-.38a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.45-9.91 9.92-9.91 2.65 0 5.14 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.47-4.45 9.92-9.88 9.93Zm5.44-7.41c-.3-.15-1.8-.89-2.08-.99-.28-.1-.48-.15-.69.15-.2.3-.78.99-.95 1.19-.18.2-.35.23-.65.08-.3-.15-1.25-.46-2.39-1.46-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.69-1.67-.95-2.29-.24-.58-.48-.5-.69-.51l-.59-.01c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.54 0 1.49 1.08 2.93 1.23 3.13.15.2 2.12 3.25 5.14 4.56.72.31 1.28.49 1.72.62.72.23 1.37.2 1.88.12.58-.09 1.8-.73 2.06-1.43.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35Z" />
      </svg>
    </SocialBadge>
  ),
};

export default function Footer({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  return (
    <footer className="relative overflow-hidden bg-[#0F172A] text-blue-100">
      <div className="grid-pattern-dark absolute inset-0 opacity-60" />
      <div className="absolute -top-24 left-1/4 h-64 w-96 rounded-full bg-[#1E40AF]/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <div className="inline-block rounded-2xl bg-white p-3 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.5)]">
              <LogoMark height={92} />
            </div>
            <p className="mt-4 rounded-2xl bg-white/5 p-4 text-[13px] italic leading-relaxed text-blue-200 ring-1 ring-white/10">
              “{COMPANY.motto}” — trusted Nigerian partner in real estate, construction, infrastructure & project support.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => {
                const Icon = BrandIcons[s.key] || BrandIcons.google;
                return (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="transition-all hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-white">Quick Links</h4>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-gradient-to-r from-sky-400 to-transparent" />
            <ul className="mt-4 space-y-2.5 text-[13.5px] font-medium">
              {([["home", "Home"], ["about", "About Us"], ["services", "Our Services"], ["projects", "Projects"], ["on-sales", "On Sales"], ["contact", "Contact"]] as [PageKey, string][]).map(([k, label]) => (
                <li key={k}>
                  <button onClick={() => onNavigate(k)} className="group flex items-center gap-2 transition hover:text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 transition group-hover:scale-150" /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-white">Our Services</h4>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-gradient-to-r from-sky-400 to-transparent" />
            <ul className="mt-4 space-y-2.5 text-[13px] font-medium">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <button onClick={() => onNavigate("services")} className="group/svc flex items-start gap-2 text-left leading-snug transition hover:text-white">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400 transition group-hover/svc:scale-150" />{s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-white">Contact Info</h4>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-gradient-to-r from-sky-400 to-transparent" />
            <ul className="mt-4 space-y-4 text-[13px] leading-relaxed">
              <li className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-sky-300" /> {COMPANY.address}</li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex gap-3 break-all transition hover:text-white"><Mail size={17} className="mt-0.5 shrink-0 text-sky-300" /> {COMPANY.email}</a>
              </li>
              <li className="flex gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-sky-300" />
                <span>
                  <a href={`tel:${COMPANY.phones[0]}`} className="font-bold text-white hover:underline">{COMPANY.phones[0]}</a>
                  {", "}
                  <a href={`tel:${COMPANY.phones[1]}`} className="font-bold text-white hover:underline">{COMPANY.phones[1]}</a>
                </span>
              </li>
              <li className="flex gap-3"><Clock size={17} className="mt-0.5 shrink-0 text-sky-300" /> Mon – Sat: 8:00am – 6:00pm</li>
            </ul>
            <a href="https://wa.me/2348060473796" target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]">
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-[12px] md:flex-row md:text-left">
          <p className="text-blue-200/80">© 2026 ALBARKA PROPERTIES - Bauchi, Nigeria. All Rights Reserved.</p>
          <div className="flex items-center gap-3 font-semibold text-blue-200/70">
            <span>RC: 7062863</span>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20">
            <ArrowUp size={14} /> Back to top
          </button>
        </div>

        {/* Developer Credit centered at the very end of the footer with border */}
        <div className="mt-6 flex justify-center pb-2">
          <a
            href="tel:+2349068865057"
            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-sky-300 shadow-sm transition hover:border-sky-300 hover:bg-white/10 hover:text-white"
          >
            <span>Powered by Dikko Devs +2349068865057</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
