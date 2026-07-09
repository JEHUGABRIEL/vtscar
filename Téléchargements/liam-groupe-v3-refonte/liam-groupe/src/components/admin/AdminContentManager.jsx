import { useState, useEffect, useCallback, useMemo, startTransition } from "react";
import { useTranslation, Trans } from "react-i18next";
import { supabase } from "../../lib/supabase.js";
import { computeEventStatus } from "../../lib/utils.js";
import AdminImageUpload from "./AdminImageUpload";
import AdminGalleryUpload from "./AdminGalleryUpload";
import {
  Plus, Pencil, Trash2, Search, ArrowUpDown,
  ChevronLeft, ChevronRight,
  X, Save, Loader2, Image as ImageIcon,
  ExternalLink, ArrowLeftRight,
} from "lucide-react";

// ─── Field definitions per table (translated in component) ─────────────────
function getTableConfig(t) {
  const fl = (key) => t("admin.contentManager.fieldLabels." + key);
  const tn = (key) => t("admin.contentManager.tableNames." + key);
  const ph = (key) => t("admin.contentManager." + key + "Placeholder");

  return {
    domains: {
      name: tn("domains"),
      labelKey: "name",
      orderField: "order_index",
      fields: [
        { key: "slug", label: fl("slug"), type: "text", required: true, placeholder: ph("slug") },
        { key: "name", label: fl("name"), type: "text", required: true },
        { key: "category", label: fl("category"), type: "text" },
        { key: "icon", label: fl("icon"), type: "text", placeholder: ph("icon") },
        { key: "short_description", label: fl("short_description"), type: "textarea" },
        { key: "hero_image", label: fl("hero_image"), type: "image" },
        { key: "programs", label: fl("programs"), type: "json" },
        { key: "gallery", label: fl("gallery"), type: "gallery" },
      ],
    },
    events: {
      name: tn("events"),
      labelKey: "title",
      orderField: "order_index",
      fields: [
        { key: "slug", label: fl("slug"), type: "text", required: true },
        { key: "title", label: fl("title"), type: "text", required: true },
        { key: "description", label: fl("description"), type: "textarea" },
        { key: "date", label: fl("date"), type: "text", placeholder: ph("date") },
        { key: "end_date", label: fl("end_date"), type: "text", placeholder: ph("end_date") },
        { key: "location", label: fl("location"), type: "text" },
        { key: "image", label: fl("image"), type: "image" },
        { key: "gallery", label: fl("gallery"), type: "gallery" },
        { key: "status", label: fl("status"), type: "select", options: ["a_venir", "passe"] },
        { key: "category", label: fl("category"), type: "text" },
      ],
    },
    news: {
      name: tn("news"),
      labelKey: "title",
      orderField: "order_index",
      fields: [
        { key: "slug", label: fl("slug"), type: "text", required: true },
        { key: "title", label: fl("title"), type: "text", required: true },
        { key: "excerpt", label: fl("excerpt"), type: "textarea" },
        { key: "image", label: fl("image"), type: "image" },
        { key: "gallery", label: fl("gallery"), type: "gallery" },
        { key: "date", label: fl("date"), type: "text", placeholder: ph("date") },
        { key: "tag", label: fl("tag"), type: "text", placeholder: ph("tag") },
      ],
    },
    team: {
      name: tn("team"),
      labelKey: "name",
      orderField: "order_index",
      fields: [
        { key: "name", label: fl("name"), type: "text", required: true },
        { key: "role", label: fl("role"), type: "text" },
        { key: "description", label: fl("description"), type: "textarea" },
        { key: "image", label: fl("photo"), type: "image" },
        { key: "social", label: fl("social"), type: "social" },
      ],
    },
    partners: {
      name: tn("partners"),
      labelKey: "name",
      orderField: "order_index",
      fields: [
        { key: "name", label: fl("name"), type: "text", required: true },
        { key: "subtitle", label: fl("subtitle"), type: "text" },
        { key: "description", label: fl("description"), type: "textarea" },
        { key: "logo", label: fl("logo"), type: "image" },
        { key: "initial", label: fl("initial"), type: "text", placeholder: ph("initial") },
        { key: "color", label: fl("color"), type: "text", placeholder: ph("color") },
        { key: "category", label: fl("category"), type: "text" },
        { key: "collaboration", label: fl("collaboration"), type: "textarea" },
        { key: "website", label: fl("website"), type: "url" },
      ],
    },
    testimonials: {
      name: tn("testimonials"),
      labelKey: "name",
      orderField: "order_index",
      fields: [
        { key: "name", label: fl("name"), type: "text", required: true },
        { key: "role", label: fl("role"), type: "text" },
        { key: "quote", label: fl("quote"), type: "textarea", required: true },
        { key: "image", label: fl("photo"), type: "image" },
      ],
    },
  };
}

// ─── Column display config ─────────────────────────────────────────────────
const TABLE_COLS = {
  domains: ["slug", "name", "category"],
  events: ["title", "date", "end_date", "status", "category", "gallery"],
  news: ["title", "date", "tag", "gallery"],
  team: ["name", "role"],
  partners: ["name", "category"],
  testimonials: ["name", "role"],
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminContentManager({ table }) {
  const { t } = useTranslation();
  const TABLES = getTableConfig(t);
  const config = TABLES[table];
  const columns = TABLE_COLS[table] || [];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  // Valeur spéciale Infinity signifie "Tout"
  const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, Infinity];
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formDirty, setFormDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("order_index", { ascending: true });
    if (!error) {
      let corrected = data || [];
      // Mise à jour automatique des statuts des événements dont la date est passée
      if (table === "events") {
        corrected = corrected.map((evt) => {
          const correctStatus = computeEventStatus(evt.date, evt.status, evt.end_date);
          if (correctStatus !== evt.status && evt.id) {
            supabase.from("events").update({ status: correctStatus }).eq("id", evt.id).then().catch((err) => console.error('AdminContentManager — Erreur mise à jour statut événement:', err));
          }
          return { ...evt, status: correctStatus };
        });
      }
      setRows(corrected);
    }
    setLoading(false);
  }, [table]);

  useEffect(() => {
    startTransition(() => {
      load();
    });
  }, [load]);

  // config.fields est dérivé de TABLES[table], stable entre les changements de table
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fields = useMemo(() => config.fields, [table]);

  // Reset form values when editing changes
  useEffect(() => {
    if (editing) {
      const vals = {};
      const isNew = editing === "new";
      for (const f of fields) {
        if (f.type === "gallery") {
          vals[f.key] = isNew ? [] : (Array.isArray(editing[f.key]) ? [...editing[f.key]] : []);
        } else if (isNew) {
          vals[f.key] = "";
        } else {
          vals[f.key] = editing[f.key] ?? "";
        }
      }
      startTransition(() => {
        setFormValues(vals);
        setFormDirty(false);
      });
    }
  }, [editing, fields]);

  // Reset page quand la recherche, le tri ou le nombre d'éléments par page change
  useEffect(() => {
    startTransition(() => {
      setPage(0);
    });
  }, [search, sortDir, itemsPerPage]);

  const updateFormValue = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormDirty(true);
  };

  // Filter & sort
  const filtered = rows
    .filter((r) => {
      if (!search) return true;
      const val = config.labelKey ? r[config.labelKey] : "";
      return String(val || "").toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const va = a[config.orderField] ?? 0;
      const vb = b[config.orderField] ?? 0;
      return sortDir === "asc" ? va - vb : vb - va;
    });

  // Pagination — Infinity = pas de pagination (tout afficher)
  const isAll = itemsPerPage === Infinity;
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages - 1);
  const paginated = isAll ? filtered : filtered.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // ── Save ──
  const handleSave = async () => {
    setSaving(true);
    const payload = { ...formValues };
    // Parse JSON fields (string -> array/object)
    for (const f of config.fields) {
      if (f.type === "json" && typeof payload[f.key] === "string") {
        try { payload[f.key] = JSON.parse(payload[f.key]); } catch { payload[f.key] = []; }
      }
    }
    // Gallery fields are already arrays (handled by AdminGalleryUpload)
    for (const f of config.fields) {
      if (f.type === "gallery" && !Array.isArray(payload[f.key])) {
        payload[f.key] = [];
      }
    }
    if (editing === "new") {
      payload.order_index = rows.length;
    }

    const { error } = editing === "new"
      ? await supabase.from(table).insert(payload)
      : await supabase.from(table).update(payload).eq("id", editing.id);

    setSaving(false);
    if (error) {
      console.error("AdminContentManager — Erreur de sauvegarde :", error);
      setToast({ message: t("admin.contentManager.error") + " : " + error.message, type: "error" });
    } else {
      setEditing(null);
      setFormDirty(false);
      load();
    }
  };

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ── Toggle event status (quick action sans ouvrir le modal) ──
  const handleToggleStatus = async (row) => {
    const newStatus = row.status === "a_venir" ? "passe" : "a_venir";
    const { error } = await supabase.from(table).update({ status: newStatus }).eq("id", row.id);
    if (!error) {
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: newStatus } : r))
      );
      setToast({ message: t("admin.contentManager.statusChanged", { status: t(newStatus === "a_venir" ? "admin.contentManager.upcoming" : "admin.contentManager.past") }), type: "success" });
    } else {
      console.error("AdminContentManager — Erreur changement de statut :", error);
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) {
      setDeleting(null);
      setToast({ message: t("admin.contentManager.deleted") + " ✅", type: "success" });
      load();
    } else {
      console.error("AdminContentManager — Erreur suppression :", error);
    }
  };

  // ── Render field input ──
  const renderField = (field) => {
    const val = formValues[field.key] ?? "";
    const baseClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-400 transition-colors text-sm";

    // Single image upload
    if (field.type === "image") {
      return <AdminImageUpload value={val} onChange={(url) => updateFormValue(field.key, url)} />;
    }

    // Gallery — multiple images upload
    if (field.type === "gallery") {
      const galleryVal = Array.isArray(val) ? val : [];
      return (
        <AdminGalleryUpload
          value={galleryVal}
          onChange={(urls) => updateFormValue(field.key, urls)}
        />
      );
    }

    // Social links — JSON object with linkedin, facebook, instagram, x
    if (field.type === "social") {
      const social = (typeof val === "object" && val !== null) ? val : {};
      const platforms = [
        { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
        { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
        { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
        { key: "x", label: "X (Twitter)", placeholder: "https://x.com/..." },
      ];
      return (
        <div className="space-y-2">
          {platforms.map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 w-24 shrink-0">{label}</span>
              <input
                type="url"
                value={social[key] || ""}
                onChange={(e) => {
                  const updated = { ...social, [key]: e.target.value };
                  updateFormValue(field.key, updated);
                }}
                placeholder={placeholder}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
              />
            </div>
          ))}
        </div>
      );
    }

    const displayVal =
      field.type === "json"
        ? typeof val === "string" ? val : JSON.stringify(val, null, 2)
        : val;

    if (field.type === "textarea") {
      return (
        <textarea
          value={displayVal}
          onChange={(e) => updateFormValue(field.key, e.target.value)}
          className={`${baseClass} resize-y min-h-[80px]`}
          placeholder={field.placeholder || ""}
          rows={3}
        />
      );
    }
    if (field.type === "select") {
      return (
        <select value={displayVal} onChange={(e) => updateFormValue(field.key, e.target.value)} className={baseClass}>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (field.type === "json") {
      return (
        <textarea
          value={displayVal}
          onChange={(e) => updateFormValue(field.key, e.target.value)}
          className={`${baseClass} font-mono text-xs resize-y min-h-[80px]`}
          rows={4}
        />
      );
    }
    return (
      <input
        type={field.type || "text"}
        className={baseClass}
        value={displayVal}
        onChange={(e) => updateFormValue(field.key, e.target.value)}
        placeholder={field.placeholder || ""}
        required={field.required}
      />
    );
  };

  return (
    <div>
      {/* Sticky header: titre + compteur + bouton Ajouter */}
      <div className="sticky top-0 z-20 bg-gray-50 pt-0 pb-3 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 border-b border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900">
              {config.name}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{t("admin.contentManager.elementCount", { count: rows.length })}</p>
          </div>
          <button
            onClick={() => setEditing("new")}
            className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("admin.contentManager.add")}
          </button>
        </div>

      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[160px] w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("admin.contentManager.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-brand-400 transition-colors text-sm"
          />
        </div>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowUpDown className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">{sortDir === "asc" ? t("admin.contentManager.orderAsc") : t("admin.contentManager.orderDesc")}</span>
        </button>
      </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-semibold text-gray-500">{t("admin.contentManager.empty")}</p>
          <p className="text-sm mt-1">{t("admin.contentManager.emptyText")}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-6 sm:mx-0 rounded-none sm:rounded-2xl border-0 sm:border border-gray-100 bg-white">
            <table className="w-full text-sm min-w-[600px] sm:min-w-0">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {columns.map((col) => (
                    <th key={col} className="text-left px-5 py-3.5 font-semibold text-gray-600 whitespace-nowrap">
                      {config.fields.find((f) => f.key === col)?.label || col}
                    </th>
                  ))}
                  <th className="sticky right-0 z-10 bg-gray-50/50 text-right px-5 py-3.5 font-semibold text-gray-600 w-24 shadow-[inset_4px_0_8px_-4px_rgba(0,0,0,0.08)]">{t("admin.contentManager.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col} className="px-5 py-3.5 text-gray-700 max-w-[250px] truncate">
                        {renderCell(row, col, t)}
                      </td>
                    ))}
                    <td className="sticky right-0 z-10 bg-white text-right px-5 py-3.5 shadow-[inset_4px_0_8px_-4px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center justify-end gap-1">
                        {table === "events" && (
                          <button
                            onClick={() => handleToggleStatus(row)}
                            className={`p-2 rounded-lg transition-colors ${
                              row.status === "a_venir"
                                ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            }`}
                            title={t("admin.contentManager.toggleStatus")}
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditing(row)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-brand-600 transition-colors"
                          title={t("admin.contentManager.edit")}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(row)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                          title={t("admin.contentManager.delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sélecteur d'éléments par page (toujours visible) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
            <div className="flex items-center gap-3">
              {!isAll && (
                <p className="text-sm text-gray-500">
                  {currentPage * itemsPerPage + 1}–{Math.min((currentPage + 1) * itemsPerPage, filtered.length)} / {filtered.length}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <span className="hidden sm:inline">{t('admin.contentManager.perPage')}</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-brand-400 transition-colors bg-white"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n === Infinity ? 'Tout' : n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pagination — cachée quand tout est affiché ou qu'il n'y a qu'une page */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Page précédente"
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
                        pageNum === currentPage
                          ? "bg-brand-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Page suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-up ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => {
            if (formDirty) { setConfirmClose(true); return; }
            setEditing(null);
            setFormDirty(false);
          }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="font-heading font-bold text-lg">
                {editing === "new" ? t("admin.contentManager.newItem") + " " + config.name : t("admin.contentManager.modify")}
              </h2>
              <button onClick={() => {
                if (formDirty) { setConfirmClose(true); return; }
                setEditing(null);
                setFormDirty(false);
              }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSave(); }}
              className="p-6 space-y-4"
            >
              {config.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}

              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (formDirty) { setConfirmClose(true); return; }
                    setEditing(null);
                    setFormDirty(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {t("admin.contentManager.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t("admin.contentManager.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unsaved changes confirmation modal */}
      {confirmClose && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmClose(false)}
          />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-scale-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-close-title"
          >
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center ring-1 ring-amber-200">
              <Save className="w-6 h-6 text-amber-500" />
            </div>
            <h3 id="confirm-close-title" className="font-heading font-bold text-lg mb-2">
              {t("admin.contentManager.confirmClose")}
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {t("admin.contentManager.confirmCloseText")}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmClose(false)}
                autoFocus
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
              >
                {t("admin.contentManager.confirmCloseStay")}
              </button>
              <button
                onClick={() => { setConfirmClose(false); setEditing(null); setFormDirty(false); }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all active:scale-[0.98]"
              >
                {t("admin.contentManager.confirmCloseLeave")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleting(null)}
          />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-scale-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ring-1 ring-red-200">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 id="delete-modal-title" className="font-heading font-bold text-lg mb-2">
              {t("admin.contentManager.confirmDelete")}
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              <Trans i18nKey="admin.contentManager.confirmDeleteText" values={{ name: deleting[config.labelKey] }}>
                Êtes-vous sûr de vouloir supprimer <strong>{deleting[config.labelKey]}</strong> ? Cette action est irréversible.
              </Trans>
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleting(null)}
                autoFocus
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
              >
                {t("admin.contentManager.cancel")}
              </button>
              <button
                onClick={() => handleDelete(deleting.id)}
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all active:scale-[0.98]"
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

function renderCell(row, col, t) {
  const val = row[col];
  if (!val) return <span className="text-gray-300">—</span>;
  if (col === "image" || col === "logo" || col === "hero_image") {
    return (
      <a href={val} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:underline">
        <ImageIcon className="w-4 h-4 shrink-0" />
        <span className="truncate max-w-[160px]">{t("admin.contentManager.viewImage")}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }
  if (col === "gallery") {
    const count = Array.isArray(val) ? val.length : 0;
    if (count === 0) return <span className="text-gray-300">—</span>;
    return (
      <span className="inline-flex items-center gap-1.5 text-brand-600">
        <ImageIcon className="w-4 h-4" />
        <span>{t("admin.contentManager.imageCount", { count })}</span>
      </span>
    );
  }
  if (col === "status") {
    const isUpcoming = val === "a_venir";
    return (
      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
        isUpcoming ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
      }`}>
        {isUpcoming ? t("admin.contentManager.upcoming") : t("admin.contentManager.past")}
      </span>
    );
  }
  return String(val);
}
