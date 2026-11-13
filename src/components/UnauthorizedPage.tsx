import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export function UnauthorizedPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 pt-44 md:pt-48 pb-20 bg-gradient-to-br from-[#E6F0FF] via-[#BFDBFE] to-[#1E3A8A]">
      <div className="hero-pattern absolute inset-0 opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-md w-full bg-white/95 border border-white/60 rounded-[2rem] p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>

        <span className="inline-block px-3 py-1 text-[11px] font-black uppercase tracking-widest text-red-700 bg-red-100 rounded-full mb-3">
          Access Prohibited (403)
        </span>

        <h1 className="text-2xl font-display font-extrabold text-[#0F172A] mb-2">
          Unauthorized Access
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          This portal is strictly restricted to verified <strong className="text-[#1E40AF]">SUPER_ADMIN</strong> accounts.
          Your current account role does not possess administrative authorization to view or manage this section.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate("home")}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition hover:brightness-110"
          >
            <Home size={15} /> Return Home
          </button>
          <button
            onClick={() => onNavigate("signin")}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-[#0F172A] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-200 transition"
          >
            <ArrowLeft size={15} /> Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
