import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import { CTABand, StatsBand, TrustMarquee } from "./components/HomeExtras";
import Leadership from "./components/Leadership";
import Navbar, { type PageKey } from "./components/Navbar";
import { OnSalesPreview, PropertyGrid } from "./components/OnSales";
import { LoginModal, StickyCTA, WhatsAppFloat } from "./components/Overlays";
import { AboutPage, PageHero, ServicesPage } from "./components/Pages";
import { AuthPage } from "./components/AuthPage";
import { DashboardPage } from "./components/DashboardPage";
import { AdminPage } from "./components/AdminPage";
import { UnauthorizedPage } from "./components/UnauthorizedPage";
import { ProjectsGrid, ProjectsPreview } from "./components/Projects";
import { ServicesPreview } from "./components/Services";
import VisionMission from "./components/VisionMission";
import WhoWeServe from "./components/WhoWeServe";
import { supabase } from "./supabaseClient.js";
import { checkUserRole } from "./utils/useUserRole";

// List of pages that require an active Supabase session
const PROTECTED_PAGES: PageKey[] = ["dashboard", "admin"];

export default function App() {
  const [page, setPage] = useState<PageKey>("home");
  const [loginOpen, setLoginOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  // Check initial session & subscribe to auth state changes
  useEffect(() => {
    let mounted = true;

    // Check active session using supabase.auth.getSession()
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (!mounted) return;
      setSessionUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!mounted) return;
      setSessionUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // Protect private pages with supabase.auth.getSession() & role verification
  // If role is 'USER' attempting to visit 'admin', redirect to 'unauthorized'
  const navigate = useCallback(async (targetPage: PageKey) => {
    if (PROTECTED_PAGES.includes(targetPage)) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // If no session, redirect to /login
          setPage("signin");
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          return;
        }
        setSessionUser(session.user);

        // Strict Super Admin Check for /admin
        if (targetPage === "admin") {
          const roleResult = await checkUserRole();
          if (!roleResult.isSuperAdmin) {
            // User role is 'USER' or unauthorized -> redirect to /unauthorized
            setPage("unauthorized");
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
            return;
          }
        }
      } catch (err) {
        setPage("signin");
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        return;
      }
    }

    setPage(targetPage);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Also enforce protection on current page if session changes or on direct load
  useEffect(() => {
    if (PROTECTED_PAGES.includes(page)) {
      supabase.auth.getSession().then(async ({ data: { session } }: any) => {
        if (!session) {
          setPage("signin");
          return;
        }
        if (page === "admin") {
          const roleResult = await checkUserRole();
          if (!roleResult.isSuperAdmin) {
            setPage("unauthorized");
          }
        }
      });
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-[#F4F7FE]">
      <Navbar page={page} onNavigate={navigate} onLogin={() => setLoginOpen(true)} />

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="pb-16 md:pb-0"
        >
          {page === "home" && (
            <>
              <Hero onNavigate={navigate} />
              <TrustMarquee />
              <Gallery />
              <Leadership />
              <VisionMission />
              <WhoWeServe onContact={() => navigate("contact")} />
              <ServicesPreview onNavigate={navigate} />
              <StatsBand />
              <ProjectsPreview onNavigate={navigate} />
              <OnSalesPreview onNavigate={navigate} />
              <CTABand onNavigate={navigate} />
              <Contact />
            </>
          )}

          {page === "about" && (
            <>
              <AboutPage onNavigate={navigate} />
              <Leadership />
              <CTABand onNavigate={navigate} />
            </>
          )}

          {page === "services" && (
            <>
              <ServicesPage />
              <StatsBand />
              <CTABand onNavigate={navigate} />
            </>
          )}

          {page === "projects" && (
            <div className="bg-[#F4F7FE] pb-4">
              <PageHero
                eyebrow="Our Portfolio"
                title={<>Projects — Ongoing &amp; Completed Works</>}
                desc="Estates, buildings, water, solar and security — delivered with professionalism and respect for standards."
              />
              <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                <ProjectsGrid onNavigate={navigate} />
              </section>
              <CTABand onNavigate={navigate} />
            </div>
          )}

          {page === "on-sales" && (
            <div className="bg-[#F4F7FE] pb-4">
              <PageHero
                eyebrow="Hot Listings"
                title={<>Properties On Sales — Homes, Lands &amp; Leases</>}
                desc="Verified listings around Bauchi. Tap Enquire to chat instantly on WhatsApp or Call to book an inspection."
              />
              <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                <PropertyGrid onNavigate={navigate} />
                <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E40AF] p-6 text-center text-white md:p-8">
                  <h3 className="font-display text-lg font-extrabold md:text-xl">Can't find what you're looking for?</h3>
                  <p className="mx-auto mt-2 max-w-xl text-sm text-blue-200">Tell us your budget, location and spec — we source off-market homes and lands across Bauchi State.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <a href="https://wa.me/2348060473796?text=Hello%20Albarka!%20Help%20me%20find%20a%20property." target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-6 py-3 text-sm font-bold shadow-lg">Request Sourcing on WhatsApp</a>
                    <button onClick={() => navigate("contact")} className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#1E40AF]">Contact Sales Team</button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {page === "contact" && (
            <div className="bg-[#F4F7FE]">
              <PageHero
                eyebrow="Contact Albarka"
                title={<>We'd Love to Hear From You</>}
                desc="Headquarters: Block A, No. 7, Nasara Shopping Complex, Opposite Old Dass Park Junction, Bauchi."
              />
              <div className="-mt-6">
                <Contact />
              </div>
            </div>
          )}

          {page === "signin" && (
            <AuthPage
              initialMode="signin"
              onNavigateHome={() => navigate("home")}
              onNavigateDashboard={() => navigate("dashboard")}
            />
          )}

          {page === "signup" && (
            <AuthPage
              initialMode="signup"
              onNavigateHome={() => navigate("home")}
              onNavigateDashboard={() => navigate("dashboard")}
            />
          )}

          {page === "dashboard" && (
            <DashboardPage
              user={sessionUser}
              onLogout={() => {
                setSessionUser(null);
                navigate("home");
              }}
            />
          )}

          {/* ADMIN DASHBOARD - Strictly SUPER_ADMIN only */}
          {page === "admin" && (
            <AdminPage onNavigate={navigate} />
          )}

          {/* UNAUTHORIZED PAGE (403) */}
          {page === "unauthorized" && (
            <UnauthorizedPage onNavigate={navigate} />
          )}
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={navigate} />
      <WhatsAppFloat />
      <StickyCTA onQuote={() => navigate("contact")} />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccessRedirect={() => navigate("dashboard")}
      />
    </div>
  );
}
