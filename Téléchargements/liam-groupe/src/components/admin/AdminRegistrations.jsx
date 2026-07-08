import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabase.js";
import {
  CalendarDays, Trash2, Search, ChevronLeft, ChevronRight,
  Loader2, X, User, Calendar, CheckCircle, XCircle, Clock, Mail, Phone,
  MessageSquare,
} from "lucide-react";

export default function AdminRegistrations() {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [relatedMessages, setRelatedMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (!error) setRegistrations(data || []);
    setLoading(false);
  }, [statusFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Reset page on filter/search change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(0); }, [search, statusFilter]);

  // Charge les messages liés (même email) quand on sélectionne une inscription
  useEffect(() => {
    if (!selected?.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRelatedMessages([]);
      return;
    }
    setLoadingMessages(true);
    supabase
      .from("messages")
      .select("*")
      .eq("email", selected.email)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRelatedMessages(data || []))
      .finally(() => setLoadingMessages(false));
  }, [selected?.email]);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("registrations")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selected?.id === id) setSelected({ ...selected, status: newStatus });
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (!error) {
      setDeleting(null);
      setSelected(null);
      load();
    }
  };

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (r.first_name || "").toLowerCase().includes(q) ||
      (r.last_name || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      (r.event_title || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const statusBadge = (status) => {
    const styles = {
      en_attente: "bg-amber-50 text-amber-700 border-amber-200",
      confirme: "bg-green-50 text-green-700 border-green-200",
      annule: "bg-red-50 text-red-700 border-red-200",
    };
    const labels = {
      en_attente: t("admin.registrations.statusPending"),
      confirme: t("admin.registrations.statusConfirmed"),
      annule: t("admin.registrations.statusCancelled"),
    };
    const icons = {
      en_attente: Clock,
      confirme: CheckCircle,
      annule: XCircle,
    };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.en_attente}`}>
        <Icon className="w-3 h-3" />
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-50 pt-0 pb-3 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 border-b border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900">
              {t("admin.registrations.title")}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {t("admin.registrations.total", { count: registrations.length })}
              {registrations.filter((r) => r.status === "en_attente").length > 0 && (
                <span className="ml-2 text-amber-500 font-semibold">
                  · {t("admin.registrations.pendingCount", { count: registrations.filter((r) => r.status === "en_attente").length })}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px] w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("admin.registrations.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "en_attente", "confirme", "annule"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f
                    ? "bg-brand-500 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t(`admin.registrations.filter.${f}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-gray-500">{t("admin.registrations.empty")}</p>
          <p className="text-sm mt-1">{t("admin.registrations.emptyText")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mt-4">
            {paginated.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelected(reg)}
                className={`w-full text-left bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
                  selected?.id === reg.id
                    ? "border-brand-300 shadow-sm"
                    : "border-gray-100"
                } ${reg.status === "en_attente" ? "border-l-4 border-l-amber-400" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      reg.status === "en_attente" ? "bg-amber-50 text-amber-600" :
                      reg.status === "confirme" ? "bg-green-50 text-green-600" :
                      "bg-gray-50 text-gray-400"
                    }`}>
                      <User className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {reg.first_name} {reg.last_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{reg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {reg.event_title && (
                      <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 max-w-[160px] truncate">
                        {reg.event_title}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(reg.created_at)}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {statusBadge(reg.status)}
                  {reg.event_title && (
                    <span className="text-xs text-gray-400 sm:hidden truncate max-w-[120px]">
                      {reg.event_title}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-sm text-gray-500">
                {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, filtered.length)} / {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = totalPages <= 5
                    ? i
                    : (() => {
                        if (currentPage < 2) return i;
                        if (currentPage > totalPages - 3) return totalPages - 5 + i;
                        return currentPage - 2 + i;
                      })();
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === currentPage ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-brand-500" />
                {t("admin.registrations.detailTitle")}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleting(selected)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title={t("admin.contentManager.delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                {statusBadge(selected.status)}
                {selected.event_title && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-600">
                    {selected.event_title}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("contact.formFirstName")}</p>
                  <p className="text-gray-900 font-medium">{selected.first_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("contact.formLastName")}</p>
                  <p className="text-gray-900 font-medium">{selected.last_name || "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("contact.formEmail")}</p>
                <a href={`mailto:${selected.email}`} className="text-brand-600 hover:underline font-medium inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {selected.email}
                </a>
              </div>

              {selected.phone && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("contact.formPhone")}</p>
                  <a href={`tel:${selected.phone}`} className="text-gray-900 font-medium inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {selected.phone}
                  </a>
                </div>
              )}

              {selected.event_slug && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("admin.registrations.eventSlug")}</p>
                  <p className="text-gray-900 text-sm font-mono text-gray-500">{selected.event_slug}</p>
                </div>
              )}

              {selected.message && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("contact.formMessage")}</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                    {selected.message}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(selected.created_at)}
              </div>

              {/* Messages liés (historique de la personne via email) */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-brand-500" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t("admin.registrations.messageHistory", { count: relatedMessages.length })}
                  </p>
                </div>

                {loadingMessages ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                  </div>
                ) : relatedMessages.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">{t("admin.registrations.messageHistoryEmpty")}</p>
                ) : (
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {relatedMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-600">
                            {msg.subject || t("contact.formSubject")}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                            msg.is_read ? "bg-gray-300" : "bg-brand-500"
                          }`} />
                          <span className="text-[10px] text-gray-400">
                            {msg.is_read
                              ? t("admin.messages.filter.read")
                              : t("admin.messages.filter.unread")}
                          </span>
                          {msg.page && (
                            <span className="text-[10px] text-gray-400">
                              · {t("admin.messages.fromPage")} : {msg.page}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status actions */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {t("admin.registrations.changeStatus")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["en_attente", "confirme", "annule"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={selected.status === s}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] ${
                        selected.status === s
                          ? "ring-2 ring-brand-500 bg-brand-50 text-brand-600"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {s === "en_attente" && <Clock className="w-3.5 h-3.5" />}
                      {s === "confirme" && <CheckCircle className="w-3.5 h-3.5" />}
                      {s === "annule" && <XCircle className="w-3.5 h-3.5" />}
                      {{ 
                        en_attente: t("admin.registrations.statusPending"),
                        confirme: t("admin.registrations.statusConfirmed"),
                        annule: t("admin.registrations.statusCancelled"),
                      }[s] || s }
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleting(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-scale-in">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ring-1 ring-red-200">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">{t("admin.registrations.confirmDelete")}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{t("admin.registrations.confirmDeleteText")}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleting(null)}
                autoFocus
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all"
              >
                {t("admin.contentManager.cancel")}
              </button>
              <button
                onClick={() => handleDelete(deleting.id)}
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/25 transition-all"
              >
                {t("admin.contentManager.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
