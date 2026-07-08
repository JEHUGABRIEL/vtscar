import { useTranslation } from "react-i18next";
import useRealtimeCounts from "../../hooks/useRealtimeCounts.js";
import {
  LayoutDashboard,
  LayoutGrid,
  CalendarDays,
  Newspaper,
  Users,
  Handshake,
  MessageSquareQuote,
  Settings,
  LogOut,
  X,
  Info,
  Navigation,
  FileText,
  Image,
  ClipboardList,
} from "lucide-react";

export default function AdminSidebar({ activeSection, activeSettingsSection, onNavigate, onSettingsNavigate, onLogout, mobileOpen, onCloseMobile }) {
  const { t } = useTranslation();
  const { pendingCount, unreadCount, connected } = useRealtimeCounts({
    channelName: "admin-sidebar-counts",
    enableSound: true,
  });

  const menu = [
    { label: t("admin.sidebar.dashboard"), section: "dashboard", icon: LayoutDashboard },
    { label: t("admin.sidebar.messages"), section: "messages", icon: MessageSquareQuote },
    { label: t("admin.sidebar.registrations"), section: "registrations", icon: CalendarDays },
    { label: t("admin.sidebar.domains"), section: "domains", icon: LayoutGrid },
    { label: t("admin.sidebar.events"), section: "events", icon: CalendarDays },
    { label: t("admin.sidebar.news"), section: "news", icon: Newspaper },
    { label: t("admin.sidebar.team"), section: "team", icon: Users },
    { label: t("admin.sidebar.partners"), section: "partners", icon: Handshake },
    { label: t("admin.sidebar.testimonials"), section: "testimonials", icon: MessageSquareQuote },
    { label: t("admin.sidebar.settings"), section: "settings", icon: Settings },
  ];

  const settingsSubItems = [
    { label: t("admin.settings.siteInfo"), sub: "siteInfo", icon: Info },
    { label: t("admin.settings.navLinks"), sub: "navLinks", icon: Navigation },
    { label: t("admin.settings.footerLinks"), sub: "footerLinks", icon: FileText },
    { label: t("admin.settings.homeHeroImages"), sub: "homeHeroImages", icon: Image },
    { label: t("admin.settings.formConfigs"), sub: "form_configs", icon: ClipboardList },
  ];

  const linkClass = (section) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      activeSection === section
        ? "bg-brand-500/10 text-brand-500 font-semibold"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`;

  const subLinkClass = (sub) =>
    `flex items-center gap-3 pl-10 pr-4 py-2 rounded-xl text-sm font-medium transition-all ${
      activeSettingsSection === sub
        ? "bg-brand-500/10 text-brand-500 font-semibold"
        : "text-white/50 hover:text-white hover:bg-white/5"
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 self-start shrink-0 bg-[#130025]">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-white">
              LIAM<span className="text-brand-500">.</span>
            </h2>
            <div
              className="flex items-center gap-1.5"
              title={connected ? "Realtime connecté" : "Realtime déconnecté"}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  connected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
                {connected ? "Live" : "Off"}
              </span>
            </div>
          </div>
          <p className="text-white/40 text-sm mt-1">{t("admin.sidebar.admin")}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menu.map((item) => (
            <div key={item.section}>
              <button
                onClick={() => onNavigate(item.section)}
                className={`w-full ${linkClass(item.section)}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.section === "registrations" && pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-900 min-w-[18px] text-center leading-tight">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
                {item.section === "messages" && unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-400 text-white min-w-[18px] text-center leading-tight">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              {/* Sous-éléments pour Paramètres */}
              {item.section === "settings" && activeSection === "settings" && (
                <div className="mt-1 space-y-0.5">
                  {settingsSubItems.map((sub) => (
                    <button
                      key={sub.sub}
                      onClick={() => onSettingsNavigate(sub.sub)}
                      className={`w-full ${subLinkClass(sub.sub)}`}
                    >
                      <sub.icon className="w-4 h-4 shrink-0" />
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            {t("admin.sidebar.logout")}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
          <aside className="relative w-72 h-full bg-[#130025] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-heading font-bold text-xl text-white">
                LIAM<span className="text-brand-500">.</span>
              </h2>
              <button onClick={onCloseMobile} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menu.map((item) => (
                <div key={item.section}>
                  <button
                    onClick={() => {
                      onNavigate(item.section);
                      onCloseMobile();
                    }}
                    className={`w-full ${linkClass(item.section)}`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.section === "registrations" && pendingCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-900 min-w-[18px] text-center leading-tight">
                        {pendingCount > 99 ? "99+" : pendingCount}
                      </span>
                    )}
                    {item.section === "messages" && unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-400 text-white min-w-[18px] text-center leading-tight">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {/* Sous-éléments pour Paramètres */}
                  {item.section === "settings" && activeSection === "settings" && (
                    <div className="mt-1 space-y-0.5">
                      {settingsSubItems.map((sub) => (
                        <button
                          key={sub.sub}
                          onClick={() => {
                            onSettingsNavigate(sub.sub);
                            onCloseMobile();
                          }}
                          className={`w-full ${subLinkClass(sub.sub)}`}
                        >
                          <sub.icon className="w-4 h-4 shrink-0" />
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                {t("admin.sidebar.logout")}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
