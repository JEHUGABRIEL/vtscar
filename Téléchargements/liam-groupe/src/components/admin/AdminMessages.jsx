import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabase.js";
import {
  Mail, Trash2, Search, ChevronLeft, ChevronRight,
  Loader2, Eye, EyeOff, X, MessageSquare, User, Calendar, Phone,
  Send, MessageCircle,
} from "lucide-react";

// Numéro WhatsApp de l'organisation (au format international, sans +)
const WHATSAPP_NUMBER = "23676000000";

export default function AdminMessages() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "unread") query = query.eq("is_read", false);
    if (filter === "read") query = query.eq("is_read", true);

    const { data, error } = await query;
    if (!error) setMessages(data || []);
    setLoading(false);
  }, [filter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Reset page on filter/search change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(0); }, [search, filter]);

  const toggleRead = async (msg) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: !msg.is_read })
      .eq("id", msg.id);
    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
      );
      if (selected?.id === msg.id) setSelected({ ...selected, is_read: !selected.is_read });
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) {
      setDeleting(null);
      setSelected(null);
      load();
    }
  };

  const filtered = messages.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (m.first_name || "").toLowerCase().includes(q) ||
      (m.last_name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q) ||
      (m.phone || "").toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      (m.message || "").toLowerCase().includes(q)
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

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-50 pt-0 pb-3 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 border-b border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900">
              {t("admin.messages.title")}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {t("admin.messages.total", { count: messages.length })}
              {messages.filter((m) => !m.is_read).length > 0 && (
                <span className="ml-2 text-brand-500 font-semibold">
                  · {t("admin.messages.unreadCount", { count: messages.filter((m) => !m.is_read).length })}
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
              placeholder={t("admin.messages.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "unread", "read"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-brand-500 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t(`admin.messages.filter.${f}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-gray-500">{t("admin.messages.empty")}</p>
          <p className="text-sm mt-1">{t("admin.messages.emptyText")}</p>
        </div>
      ) : (
        <>
          {/* List */}
          <div className="space-y-3 mt-4">
            {paginated.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`w-full text-left bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
                  selected?.id === msg.id
                    ? "border-brand-300 shadow-sm"
                    : "border-gray-100"
                } ${!msg.is_read ? "border-l-4 border-l-brand-500" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      !msg.is_read ? "bg-brand-50 text-brand-600" : "bg-gray-50 text-gray-400"
                    }`}>
                      <User className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${!msg.is_read ? "text-gray-900" : "text-gray-600"}`}>
                        {msg.first_name} {msg.last_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {msg.subject && (
                      <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {msg.subject}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(msg.created_at)}</span>
                  </div>
                </div>
                <p className={`mt-2 text-sm line-clamp-2 ${!msg.is_read ? "text-gray-700" : "text-gray-500"}`}>
                  {msg.message}
                </p>
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

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-500" />
                {t("admin.messages.detailTitle")}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRead(selected)}
                  className={`p-2 rounded-lg transition-colors ${
                    selected.is_read
                      ? "text-gray-400 hover:text-brand-600 hover:bg-brand-50"
                      : "text-brand-600 bg-brand-50 hover:bg-brand-100"
                  }`}
                  title={selected.is_read ? t("admin.messages.markUnread") : t("admin.messages.markRead")}
                >
                  {selected.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("contact.formSubject")}</p>
                <p className="text-gray-900">{selected.subject || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t("contact.formMessage")}</p>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
              {/* Boutons de réponse */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    "Re: " + (selected.subject || "")
                  )}&body=${encodeURIComponent(
                    "\n\n--- Message original ---\n" + selected.message
                  )}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {t("admin.messages.replyEmail")}
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Bonjour " + (selected.first_name || "") + ", je vous réponds suite à votre message concernant « " + (selected.subject || "votre demande") + " »."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("admin.messages.replyWhatsApp")}
                </a>
              </div>

              {/* Champs dynamiques supplémentaires (data JSONB) */}
              {selected.data && typeof selected.data === "object" && Object.keys(selected.data).length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {t("admin.messages.additionalFields")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(selected.data)
                      .filter(([key]) => !["firstname","lastname","name","email","phone","subject","message"].includes(key))
                      .map(([key, val]) => (
                        <div key={key}>
                          <p className="text-xs font-medium text-gray-400 capitalize mb-0.5">{key}</p>
                          <p className="text-gray-900 text-sm">{String(val) || "—"}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(selected.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t("admin.messages.fromPage")} : {selected.page}
                </span>
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
            <h3 className="font-heading font-bold text-lg mb-2">{t("admin.messages.confirmDelete")}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{t("admin.messages.confirmDeleteText")}</p>
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
