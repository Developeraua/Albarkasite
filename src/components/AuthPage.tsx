import { motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck, User, Phone } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "./ui";
import { supabase } from "../supabaseClient.js";
import { saveUserPhoneToDatabase } from "../utils/saveUserPhone";

export function AuthPage({
  initialMode = "signin",
  onNavigateHome,
  onNavigateDashboard,
}: {
  initialMode?: "signin" | "signup";
  onNavigateHome: () => void;
  onNavigateDashboard?: () => void;
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
            setErrorMsg(msg || "Failed to create account. Please try again.");
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

        // Do NOT auto-login. If a session was created automatically, sign out to prevent auto-login
        if (data?.session) {
          try {
            await supabase.auth.signOut();
          } catch {
            // Ignore signout error
          }
        }

        // Behavior:
        // 1. Do NOT auto-login.
        // 2. Redirect the user to the Sign In page.
        // 3. Keep the email filled so the user can easily log in.
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
            if (onNavigateDashboard) {
              onNavigateDashboard();
            } else {
              onNavigateHome();
            }
          }, 900);
        } else {
          setErrorMsg("Login could not establish an active session. Please verify your credentials or email confirmation.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-br from-[#E6F0FF] via-[#BFDBFE] to-[#1E3A8A] pb-16 pt-44 md:pt-48">
      <div className="hero-pattern absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-md px-4">
        {/* Back to Home Button */}
        <button
          onClick={onNavigateHome}
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-xs font-bold text-[#1E40AF] shadow-md backdrop-blur transition hover:bg-white"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#0EA5E9] p-8 pb-10 text-center text-white">
            <div className="mx-auto w-fit rounded-2xl bg-white p-2 shadow-xl">
              <LogoMark height={64} />
            </div>
            <h1 className="mt-4 font-display text-2xl font-black">
              {mode === "signin" ? "Sign In to Your Account" : "Create New Account"}
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
              Albarka Properties Consultant Ltd
            </p>
          </div>

          <div className="p-7">
            {/* Mode Switcher */}
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#F4F7FE] p-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`rounded-lg py-2.5 transition ${
                  mode === "signin"
                    ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow"
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
                    ? "bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] text-white shadow"
                    : "text-slate-600 hover:text-[#1E40AF]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Success Message Banner (e.g., after sign up redirected to sign in) */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-left text-xs font-semibold text-emerald-800 shadow-sm"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Name (Sign Up only) */}
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                    <User size={13} className="text-[#1E40AF]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ibrahim Musa"
                    className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3.5 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                  />
                </div>
              )}

              {/* 2. Email (Both Sign In and Sign Up) */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                  <Mail size={13} className="text-[#1E40AF]" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3.5 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                />
              </div>

              {/* 3. Phone Number (Sign Up only) */}
              {mode === "signup" && (
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                    <Phone size={13} className="text-[#1E40AF]" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 08060473796"
                    className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3.5 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                  />
                </div>
              )}

              {/* 4. Password */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                  <Lock size={13} className="text-[#1E40AF]" /> Password *
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-4 py-3.5 pr-11 text-sm outline-none transition focus:border-[#1E40AF] focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1E40AF]"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="mt-1 text-[11px] text-slate-400">Minimum 6 characters</p>
                )}
              </div>

              {mode === "signin" && (
                <div className="flex items-center justify-between text-[12px] font-semibold">
                  <label className="flex items-center gap-1.5 text-slate-500">
                    <input type="checkbox" className="accent-[#1E40AF]" /> Remember me
                  </label>
                  <span className="cursor-pointer text-[#1E40AF] hover:underline">Forgot password?</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#0EA5E9] py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {mode === "signin" ? "Signing in..." : "Creating account..."}
                  </>
                ) : mode === "signin" ? (
                  "Sign In Securely"
                ) : (
                  "Create Free Account"
                )}
              </button>

              {/* Error Message */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-left text-xs font-medium text-red-700"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              <div className="pt-2 text-center text-xs text-slate-500">
                {mode === "signin" ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-bold text-[#1E40AF] hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="font-bold text-[#1E40AF] hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Protected with Supabase Authentication</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
