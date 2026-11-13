import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, Calendar, LogOut, FileText, CheckCircle2 } from "lucide-react";
import { LogoMark } from "./ui";
import { supabase } from "../supabaseClient.js";

export function DashboardPage({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error", err);
    }
    onLogout();
  };

  const userEmail = user?.email || "user@albarka.com";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Active Member";

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-br from-[#E6F0FF] via-[#BFDBFE] to-[#1E3A8A] pb-20 pt-48 md:pt-52">
      <div className="hero-pattern absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#0EA5E9] p-6 text-white sm:p-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white p-2 shadow-lg">
                <LogoMark height={52} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
                  <ShieldCheck size={13} className="text-emerald-300" /> Private Dashboard
                </span>
                <h1 className="mt-1 font-display text-2xl font-black">Client &amp; Staff Portal</h1>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Account Card */}
            <div className="rounded-2xl border border-blue-100 bg-[#F4F7FE] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Authenticated Session</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#1E40AF] to-[#0EA5E9] text-white shadow">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-[#0F172A]">{userEmail}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail size={12} className="text-[#1E40AF]" /> Verified via Supabase
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <CheckCircle2 size={13} className="text-emerald-600" /> Active Session
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-blue-200/50 pt-3 text-xs text-slate-500">
                <Calendar size={13} className="text-[#1E40AF]" />
                <span>Member since {createdAt}</span>
              </div>
            </div>

            {/* Quick Actions / Services Access */}
            <div className="mt-6">
              <h2 className="font-display text-base font-extrabold text-[#0F172A]">Protected Services &amp; Requests</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F0FF] text-[#1E40AF]">
                    <FileText size={18} />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-[#0F172A]">Property Filing</h3>
                  <p className="mt-1 text-xs text-slate-500">Direct portal submission for valuation and deed verification.</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F0FF] text-[#1E40AF]">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-[#0F172A]">Contract Tracking</h3>
                  <p className="mt-1 text-xs text-slate-500">Track milestones for your building &amp; supply contracts.</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F0FF] text-[#1E40AF]">
                    <Mail size={18} />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-[#0F172A]">Direct Helpline</h3>
                  <p className="mt-1 text-xs text-slate-500">Priority contact with Albarka executive officers.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E40AF] p-5 text-white">
              <h3 className="font-display text-sm font-bold">Albarka Properties Consultant Ltd — RC: 7062863</h3>
              <p className="mt-1 text-xs text-blue-200">
                “Our Client’s Success is Our Success.” Block A, No. 7, Nasara Shopping Complex, Bauchi.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
