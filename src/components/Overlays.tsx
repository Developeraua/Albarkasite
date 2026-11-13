import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, MessageCircle, Phone, X, AlertCircle, User } from "lucide-react";
import { useState } from "react";
import { COMPANY } from "../data/content";
import { LogoMark } from "./ui";
import { supabase } from "../supabaseClient.js";
import { saveUserPhoneToDatabase } from "../utils/saveUserPhone";

export function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/2348060473796?text=Hello%20Albarka%20Properties!%20I%27d%20like%20to%20make%20an%20enquiry."
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.5, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      className="group fixed bottom-24 right-4 z-[60] flex items-center gap-0 md:bottom-8 md:right-6"
      aria-label="Chat on WhatsApp"
    >
      <span className="mr-0 max-w-0 overflow-hidden whitespace-nowrap rounded-l-full bg-[#0F172A] text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[160px] group-hover:px-3 group-hover:py-2 group-hover:opacity-100 md:group-hover:max-w-[200px]">
        Chat with us now
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#22C55E] to-[#15803D] text-white shadow-[0_15px_40px_-8px_rgba(34,197,94,0.7)]">
        <span className="absolute inset-0 rounded-full bg-green-400" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="relative">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5L9.8 9c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.2-.7.7-.2.5-.9 2.1-.9 4.4 0 1.4.7 2.7 1.2 3.5.7 1 1.7 1.7 3 2.2.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3z" />
        </svg>
      </span>
    </motion.a>
  );
}

export function StickyCTA({ onQuote }: { onQuote: () => void }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] md:hidden">
      <div className="glass-dark flex items-center gap-2 rounded-2xl p-2 shadow-2xl">
        <a href={`tel:${COMPANY.phones[0]}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/15 px-3 py-3 text-[13px] font-bold text-white">
          <Phone size={15} /> Call Now
        </a>
        <button onClick={onQuote} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-3 py-3 text-[13px] font-bold text-white shadow">
          <MessageCircle size={15} /> Get a Quote
        </button>
      </div>
    </div>
  );
}

export function AuthModal({
  open,
  onClose,
  initialMode = "signin",
  onSuccessRedirect,
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onSuccessRedirect?: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [show, setShow] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setErrorMsg("");
    setSuccessMsg("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const cleanName = fullName.trim();
        const cleanPhone = phoneNumber.trim();
        const cleanEmail = email.trim();

        if (!cleanName) {
          setErrorMsg("Please enter your full name.");
          setLoading(false);
          return;
        }

        if (!cleanPhone) {
          setErrorMsg("Please enter your phone number.");
          setLoading(false);
          return;
        }

        // Sign up with Supabase Auth including name & phone metadata
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              name: cleanName,
              full_name: cleanName,
              phone: cleanPhone,
              phone_number: cleanPhone,
            },
          },
        });

        if (error) {
          const msg = error.message || "";
          if (
            msg.toLowerCase().includes("rate limit") ||
            msg.toLowerCase().includes("over_email_send_rate_limit") ||
            (error as any).status === 429
          ) {
            setErrorMsg(
              "Supabase email rate limit reached (default is ~3–4 emails/hr on free tier). Please wait a few minutes, or in your Supabase Dashboard go to Project Settings → Authentication → Rate Limits to increase this limit or configure custom SMTP."
            );
          } else {
            setErrorMsg(msg || "Failed to sign up. Please try again.");
          }
          setLoading(false);
          return;
        }

        // Link phone and user details to the database row
        try {
          if (data?.user?.id) {
            await saveUserPhoneToDatabase({
              userId: data.user.id,
              name: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
            });
          }
        } catch {
          // Metadata safely retains the phone row info in user_metadata.phone
        }

        // Do NOT auto-login. If a session was automatically returned, sign out
        if (data?.session) {
          try {
            await supabase.auth.signOut();
          } catch {
            // ignore
          }
        }

        // 1. Do NOT auto-login.
        // 2. Redirect the user to the Sign In page.
        // 3. Keep the email filled so the user doesn't have to retype it.
        // 4. Show a clear success message.
        setMode("signin");
        setPassword("");
        setFullName("");
        setPhoneNumber("");
        // Keep email intact!
        setSuccessMsg(
          !data?.session
            ? "Account created successfully! Please check your email to confirm before signing in."
            : "Account created successfully! Please sign in with your password."
        );
        setLoading(false);
      } else {
        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setErrorMsg(error.message || "Invalid email or password.");
          setLoading(false);
          return;
        }

        // Only redirect when a REAL session exists after login
        if (data?.session) {
          setSuccessMsg("Welcome back! Redirecting...");
          setTimeout(() => {
            setPassword("");
            onClose();
            if (onSuccessRedirect) {
              onSuccessRedirect();
            } else {
              window.location.replace("/");
            }
          }, 900);
        } else {
          setErrorMsg("Login could not establish an active session. Please verify your credentials or email confirmation.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred. Please check your network connection.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0F172A]/75 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[1.75rem] bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-br from-[#E6F0FF] via-[#3B82F6] to-[#0F172A] p-7 pb-16 text-center">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35"
                aria-label="Close"
              >
                <X size={17} />
              </button>
              <div className="mx-auto w-fit shadow-2xl">
                <LogoMark height={76} />
              </div>
              <h2 className="mt-4 font-display text-xl font-extrabold text-white">
                {mode === "signin" ? "Sign In to Albarka" : "Create an Account"}
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">
                {mode === "signin" ? "Client & Staff Portal" : "Join Albarka Properties"}
              </p>
            </div>

            <div className="mx-5 -mt-10 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-blue-50">
              {/* Tab Switcher: Sign In vs Sign Up */}
              <div className="mb-5 grid grid-cols-2 rounded-xl bg-[#F4F7FE] p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`rounded-lg py-2.5 transition ${
                    mode === "signin"
                      ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow-md"
                      : "text-slate-600 hover:text-[#1E40AF]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`rounded-lg py-2.5 transition ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow-md"
                      : "text-slate-600 hover:text-[#1E40AF]"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Success Message Banner */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3.5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left text-xs font-semibold text-emerald-800 shadow-sm"
                >
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* 1. Name (Sign Up only) */}
                {mode === "signup" && (
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <User size={12} className="text-[#1E40AF]" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ibrahim Musa"
                      className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                    />
                  </div>
                )}

                {/* 2. Email */}
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <Mail size={12} className="text-[#1E40AF]" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                  />
                </div>

                {/* 3. Phone Number (Sign Up only) */}
                {mode === "signup" && (
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <Phone size={12} className="text-[#1E40AF]" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 08060473796"
                      className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                    />
                  </div>
                )}

                {/* 4. Password */}
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <Lock size={12} className="text-[#1E40AF]" /> Password *
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 pr-11 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E40AF]"
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === "signup" && (
                    <p className="mt-1 text-[10px] text-slate-400">Minimum 6 characters</p>
                  )}
                </div>

                {mode === "signin" && (
                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
                    <label className="flex items-center gap-1.5 text-slate-500">
                      <input type="checkbox" className="accent-[#1E40AF]" /> Remember me
                    </label>
                    <span className="cursor-pointer text-[#1E40AF] hover:underline">Forgot password?</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {mode === "signin" ? "Signing in..." : "Creating account..."}
                    </>
                  ) : mode === "signin" ? (
                    "Sign In Securely"
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Error message */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs font-medium text-red-700"
                  >
                    <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <p className="mt-3 text-center text-[10px] text-slate-400">
                  Secured with Supabase Auth • RC 7062863 • Bauchi, Nigeria
                </p>
              </form>
            </div>
            <div className="h-6" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Backward-compatible alias
export const LoginModal = AuthModal;
