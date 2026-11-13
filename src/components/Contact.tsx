import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { COMPANY, SERVICES } from "../data/content";
import { SectionHeading } from "./ui";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Property Enquiry", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "Property Enquiry", message: "" });
      setTimeout(() => setSent(false), 5000);
    }, 1200);
  };

  const info = [
    { icon: MapPin, title: "Visit Our Office", lines: [COMPANY.address] },
    { icon: Mail, title: "Email Us", lines: [COMPANY.email], href: `mailto:${COMPANY.email}` },
    { icon: Phone, title: "Call Us", lines: [COMPANY.phones[0] + ", " + COMPANY.phones[1]], href: `tel:${COMPANY.phones[0]}` },
    { icon: Clock, title: "Office Hours", lines: ["Mon – Sat: 8:00am – 6:00pm", "Sundays: By appointment"] },
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E3A8A] to-[#0F172A] py-20 md:py-28">
      <div className="grid-pattern-dark absolute inset-0" />
      <div className="absolute left-1/2 top-0 h-56 w-[50rem] -translate-x-1/2 rounded-full bg-[#3B82F6]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Get In Touch"
          title={<>Let's Discuss Your <span className="bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent">Next Project</span></>}
          desc="Call, chat or send a message — our team in Bauchi responds fast, typically within a few hours."
        />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Info */}
          <div className="space-y-4">
            {info.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: -26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-dark flex gap-4 rounded-2xl p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#0EA5E9] text-white shadow"><c.icon size={19} /></span>
                <div className="min-w-0">
                  <h3 className="font-display text-[15px] font-extrabold text-white">{c.title}</h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1 break-words text-[13px] leading-relaxed text-blue-100/90">{l}</p>
                  ))}
                  {c.href && <a href={c.href} className="mt-2 inline-block text-[12px] font-bold text-sky-300 hover:text-white">Contact now →</a>}
                </div>
              </motion.div>
            ))}
            <div className="overflow-hidden rounded-2xl border border-white/15 shadow-xl">
              <iframe
                title="Bauchi Map"
                src="https://www.google.com/maps?q=Bauchi,Bauchi+State,Nigeria&output=embed"
                className="h-52 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[1.75rem] border border-white/40 bg-white/95 p-6 shadow-2xl backdrop-blur-xl md:p-9"
          >
            <h3 className="font-display text-xl font-extrabold text-[#0F172A]">Send us a message</h3>
            <p className="mt-1 text-[13px] text-slate-500">Fields marked * are required. We reply via email, call or WhatsApp.</p>
            <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Full Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Musa Ibrahim" className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Phone *</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0803..." className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Subject</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white">
                  <option>Property Enquiry</option>
                  <option>Land / Estate</option>
                  {SERVICES.map((s) => <option key={s.id}>{s.title}</option>)}
                  <option>Partnership / Collaboration</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Message *</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your property, land, building or project need…" className="w-full resize-none rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15" />
              </div>
              <div className="sm:col-span-2">
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#0EA5E9] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/30 transition disabled:opacity-70">
                  {sending ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…</>) : (<><Send size={16} /> Send Message</>)}
                </motion.button>
                <p className="mt-3 text-center text-[11px] text-slate-400">Prefer instant chat? <a href="https://wa.me/2348060473796" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 hover:underline">WhatsApp us now</a></p>
              </div>
            </form>
            <AnimatePresence>
              {sent && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                  <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
                  <p className="text-[13px] font-semibold text-emerald-800">Message received! Our team will contact you shortly. Thank you for choosing Albarka.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
