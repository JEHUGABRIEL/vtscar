import { useState, useEffect, useCallback, useRef, startTransition } from "react";
import { Menu, LogOut, X, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdminLogin from "../components/admin/AdminLogin";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminContentManager from "../components/admin/AdminContentManager";
import AdminSiteSettings from "../components/admin/AdminSiteSettings";
import AdminMessages from "../components/admin/AdminMessages";
import AdminRegistrations from "../components/admin/AdminRegistrations";
import useFocusTrap from "../hooks/useFocusTrap";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE = 60 * 1000; // 1 minute avant la déconnexion, on prévient

export default function Admin() {
  const { t } = useTranslation();
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const [settingsSection, setSettingsSection] = useState("siteInfo");
  const inactivityRef = useRef(null);
  const warningRef = useRef(null);

  const doLogout = useCallback(() => {
    localStorage.removeItem("liam-admin-authenticated");
    setAuthenticated(false);
    setShowLogoutModal(false);
    setShowInactivityModal(false);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    setShowInactivityModal(false);

    // Avertir 1 min avant la déconnexion
    warningRef.current = setTimeout(() => {
      setShowInactivityModal(true);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    // Déconnexion effective
    inactivityRef.current = setTimeout(() => {
      doLogout();
    }, INACTIVITY_TIMEOUT);
  }, [doLogout]);

  useEffect(() => {
    const stored = localStorage.getItem("liam-admin-authenticated");
    if (stored === "true") {
      startTransition(() => {
        setAuthenticated(true);
      });
    }
  }, []);

  // Lance le timer d'inactivité quand l'admin est connecté
  useEffect(() => {
    if (!authenticated) return;

    const events = ["mousemove", "mousedown", "keydown", "click", "scroll", "touchstart", "wheel"];

    const onActivity = () => resetInactivityTimer();

    // Timer initial
    startTransition(() => {
      resetInactivityTimer();
    });

    // Écouteurs d'activité
    events.forEach((evt) => document.addEventListener(evt, onActivity, { passive: true }));

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, onActivity));
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [authenticated, resetInactivityTimer]);

  const startCloseAnimation = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      setClosing(false);
    }, 300);
  }, [closing]);

  const cancelLogout = useCallback(() => {
    if (closing) return;
    startCloseAnimation();
  }, [closing, startCloseAnimation]);

  // Close modal on Escape key & lock body scroll
  useEffect(() => {
    if (!showLogoutModal) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") cancelLogout();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showLogoutModal, cancelLogout]);

  const logoutModalRef = useFocusTrap(showLogoutModal);

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const handleLogout = () => {
    setShowLogoutModal(true);
    setClosing(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("liam-admin-authenticated");
    setAuthenticated(false);
    setShowLogoutModal(false);
  };

  const handleNavigate = (s) => {
    setSection(s);
    if (s === "settings") {
      setSettingsSection("siteInfo");
    }
    setMobileOpen(false);
  };

  const handleSettingsNavigate = (sub) => {
    setSection("settings");
    setSettingsSection(sub);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={section}
        activeSettingsSection={settingsSection}
        onNavigate={handleNavigate}
        onSettingsNavigate={handleSettingsNavigate}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-bold text-lg">
            LIAM<span className="text-brand-500">.</span>
            <span className="text-gray-400 text-xs font-medium ml-1.5">Admin</span>
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 p-4 sm:p-6 lg:p-10">
          {section === "dashboard" && <AdminDashboard onNavigate={handleNavigate} />}
          {["domains", "events", "news", "team", "partners", "testimonials"].includes(section) && (
            <AdminContentManager table={section} />
          )}
          {section === "registrations" && <AdminRegistrations />}
          {section === "messages" && <AdminMessages />}
          {section === "settings" && <AdminSiteSettings section={settingsSection} />}
        </main>
      </div>

      {/* Logout confirmation modal */}
      {/* Modal d'inactivité */}
      {showInactivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" />
          <div className="relative bg-gradient-to-b from-[#1a0a2e] to-[#0f001d] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-500/20">
              <Timer className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {t('admin.inactivityModal.title')}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-[280px] mx-auto">
              {t('admin.inactivityModal.text')}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowInactivityModal(false);
                  resetInactivityTimer();
                }}
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 transition-all active:scale-[0.98]"
              >
                {t('admin.inactivityModal.stay')}
              </button>
              <button
                onClick={doLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] transition-all active:scale-[0.98]"
              >
                {t('admin.inactivityModal.logout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop avec animation d'apparition / disparition */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-md ${closing ? "animate-fade-out" : "animate-fade-in"}`}
            onClick={cancelLogout}
          />
          <div
            ref={logoutModalRef}
            className={`relative bg-gradient-to-b from-[#1a0a2e] to-[#0f001d] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 ${closing ? "animate-scale-out" : "animate-scale-in"}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            {/* Close button */}
            <button
              onClick={cancelLogout}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
              aria-label={t('gallery.close')}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon & text */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mb-4 ring-1 ring-red-500/20">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>
              <h3
                id="logout-modal-title"
                className="text-lg font-bold text-white"
              >
                {t('admin.logoutModal.title')}
              </h3>
              <p className="text-white/50 text-sm mt-1.5 max-w-[250px] leading-relaxed">
                {t('admin.logoutModal.text')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] hover:border-white/[0.12] transition-all active:scale-[0.98]"
              >
                {t('admin.logoutModal.cancel')}
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all active:scale-[0.98]"
              >
                {t('admin.logoutModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


