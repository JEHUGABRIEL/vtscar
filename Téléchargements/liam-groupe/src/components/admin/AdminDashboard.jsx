import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase.js";
import useRealtimeCounts from "../../hooks/useRealtimeCounts.js";
import { useDomains, useEvents, useNews, useTeam, usePartners, useTestimonials } from "../../hooks/useSiteData";
import { LayoutGrid, CalendarDays, Newspaper, Users, Handshake, MessageSquareQuote, Mail, ArrowUpRight } from "lucide-react";

const STAT_CONFIGS = [
  { labelKey: "admin.sidebar.domains", hook: useDomains, icon: LayoutGrid, color: "bg-blue-50 text-blue-600", section: "domains" },
  { labelKey: "admin.sidebar.events", hook: useEvents, icon: CalendarDays, color: "bg-amber-50 text-amber-600", section: "events" },
  { labelKey: "admin.sidebar.news", hook: useNews, icon: Newspaper, color: "bg-green-50 text-green-600", section: "news" },
  { labelKey: "admin.dashboard.teamMembers", hook: useTeam, icon: Users, color: "bg-purple-50 text-purple-600", section: "team" },
  { labelKey: "admin.sidebar.partners", hook: usePartners, icon: Handshake, color: "bg-rose-50 text-rose-600", section: "partners" },
  { labelKey: "admin.sidebar.testimonials", hook: useTestimonials, icon: MessageSquareQuote, color: "bg-teal-50 text-teal-600", section: "testimonials" },
];


export default function AdminDashboard({ onNavigate }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { pendingCount: pendingRegistrations, unreadCount, connected } = useRealtimeCounts({
    channelName: "admin-dashboard-counts",
  });
  const [contentConnected, setContentConnected] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("admin-dashboard-content")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "domains" },
        () => queryClient.invalidateQueries({ queryKey: ["domains"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => queryClient.invalidateQueries({ queryKey: ["events"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news" },
        () => queryClient.invalidateQueries({ queryKey: ["news"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team" },
        () => queryClient.invalidateQueries({ queryKey: ["team"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "partners" },
        () => queryClient.invalidateQueries({ queryKey: ["partners"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        () => queryClient.invalidateQueries({ queryKey: ["testimonials"] })
      )
      .subscribe((status) => {
        setContentConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const statCards = [
    ...STAT_CONFIGS.map((cfg) => ({ ...cfg, label: t(cfg.labelKey) })),
    {
      labelKey: "admin.sidebar.messages",
      label: t("admin.sidebar.messages"),
      count: unreadCount,
      icon: Mail,
      color: "bg-pink-50 text-pink-600",
      section: "messages",
      badge: unreadCount,
    },
    {
      labelKey: "admin.sidebar.registrations",
      label: t("admin.sidebar.registrations"),
      count: pendingRegistrations,
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-600",
      section: "registrations",
      badge: pendingRegistrations,
    },
  ];

  const sectionNames = [t("admin.sidebar.domains"), t("admin.sidebar.events"), t("admin.sidebar.news"), t("admin.sidebar.team"), t("admin.sidebar.partners"), t("admin.sidebar.testimonials"), t("admin.sidebar.messages"), t("admin.sidebar.registrations")];
  const slugs = ["domains", "events", "news", "team", "partners", "testimonials", "messages", "registrations"];

  const allConnected = connected && contentConnected;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900">
            {t("admin.dashboard.title")}
          </h1>
          <p className="text-gray-500 mt-1">
            {t("admin.dashboard.description")}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 mt-1 shrink-0"
          title={allConnected ? "Temps réel actif" : "Temps réel déconnecté"}
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              allConnected ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span className="text-[11px] text-gray-400 font-medium">
            {allConnected ? "Live" : "Hors ligne"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <StatCard key={card.section} {...card} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="mt-10 bg-brand-50/40 rounded-2xl p-7">
        <h2 className="font-heading font-bold text-lg mb-2">
          {t("admin.dashboard.manageTitle")}
        </h2>
        <p className="text-gray-500 mb-5">
          {t("admin.dashboard.manageText")}
        </p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
          {sectionNames.map((name, i) => (
            <button
              key={name}
              onClick={() => onNavigate(slugs[i])}
              className="px-3 sm:px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium hover:border-brand-300 hover:text-brand-600 transition-colors truncate"
            >
              {name}
            </button>
          ))}
        </div>
      </div>


    </div>
  );
}

function StatCard({ label, hook: useHook, icon: Icon, color, onNavigate, section, count, badge }) {
  const { data = [] } = useHook?.() || {};
  const cnt = count ?? (Array.isArray(data) ? data.length : 0);

  return (
    <button
      onClick={() => onNavigate(section)}
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all group relative"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </span>
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
      </div>
      <p className="font-heading font-bold text-3xl text-gray-900">{cnt}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
      {badge > 0 && (
        <span className="absolute top-3 right-12 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}
