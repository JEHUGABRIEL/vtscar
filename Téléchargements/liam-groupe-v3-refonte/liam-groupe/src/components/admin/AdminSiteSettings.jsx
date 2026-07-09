import { useState, useEffect, useCallback, useMemo, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabase.js";
import {
  Save, Loader2, Plus, Trash2,
  ImageIcon, RotateCcw,
} from "lucide-react";

// ─── Default values ────────────────────────────────────────────────────────
const DEFAULTS = {
  siteInfo: {
    name: "LIAM",
    fullName: "LIAM Groupe",
    tagline: "Construisons ensemble la Centrafrique de demain",
    description: "",
    address: [""],
    phones: [""],
    emails: [""],
    hours: [""],
    contactPage: {
      address: [""],
      phones: [""],
      emails: [""],
      hours: [""],
    },
  },
  navLinks: [],
  footerLinks: { liamGroupe: [], domaines: [], agir: [] },
  homeHeroImages: [],
  form_configs: {
    contact: [
      { name: "firstname", label: "contact.formFirstName", type: "text", required: true, placeholder: "contact.formFirstNamePlaceholder" },
      { name: "lastname", label: "contact.formLastName", type: "text", required: true, placeholder: "contact.formLastNamePlaceholder" },
      { name: "email", label: "contact.formEmail", type: "email", required: true, placeholder: "contact.formEmailPlaceholder" },
      { name: "phone", label: "contact.formPhone", type: "tel", required: false, placeholder: "contact.formPhonePlaceholder" },
      { name: "subject", label: "contact.formSubject", type: "select", required: false, placeholder: "contact.formSubjectPlaceholder",
        options: ["contact.formSubjectOption1","contact.formSubjectOption2","contact.formSubjectOption3","contact.formSubjectOption4"] },
      { name: "message", label: "contact.formMessage", type: "textarea", required: true, placeholder: "contact.formMessagePlaceholder" },
    ],
    chatbot: [
      { name: "firstname", label: "chatbot.formName", type: "text", required: true, placeholder: "chatbot.formName" },
      { name: "email", label: "chatbot.formEmail", type: "email", required: true, placeholder: "chatbot.formEmail" },
      { name: "phone", label: "chatbot.formPhone", type: "tel", required: false, placeholder: "chatbot.formPhone" },
      { name: "message", label: "chatbot.formMessage", type: "textarea", required: true, placeholder: "chatbot.formMessage" },
    ],
  },
};

const SETTING_ICONS = {
  siteInfo: "🏠",
  navLinks: "🧭",
  footerLinks: "📄",
  homeHeroImages: "🖼️",
  form_configs: "📋",
};

// ─── Utility to safely parse JSONB value ───────────────────────────────────
function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminSiteSettings({ section: currentSection }) {
  const { t } = useTranslation();

  const SETTING_LABELS = useMemo(() => ({
    siteInfo: t("admin.settings.siteInfo"),
    navLinks: t("admin.settings.navLinks"),
    footerLinks: t("admin.settings.footerLinks"),
    homeHeroImages: t("admin.settings.homeHeroImages"),
    form_configs: t("admin.settings.formConfigs"),
  }), [t]);

  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(currentSection || "siteInfo");
  const [dirty, setDirty] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const keys = useMemo(() => Object.keys(SETTING_LABELS), [SETTING_LABELS]);

  // Synchroniser activeTab avec la prop reçue
  useEffect(() => {
    if (currentSection && currentSection !== activeTab) {
      startTransition(() => {
        setActiveTab(currentSection);
      });
    }
  }, [currentSection, activeTab]);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const result = {};
    for (const key of keys) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .single();
      result[key] = error ? DEFAULTS[key] : safeParse(data?.value, DEFAULTS[key]);
    }
    setSettings(result);
    setLoading(false);
  }, [keys]);

  useEffect(() => {
    startTransition(() => {
      loadSettings();
    });
  }, [loadSettings]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateValue = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty((prev) => ({ ...prev, [key]: true }));
  };

  const saveSetting = async (key) => {
    setSaving(true);
    const value = settings[key];
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });
    setSaving(false);
    if (error) {
      showToast(t("admin.settings.errorToast", { message: error.message }), "error");
    } else {
      setDirty((prev) => ({ ...prev, [key]: false }));
      showToast(t("admin.settings.savedToast", { label: SETTING_LABELS[key] }));
    }
  };

  const saveAll = async () => {
    setSaving(true);
    for (const key of keys) {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value: settings[key] }, { onConflict: "key" });
      if (error) {
        showToast(t("admin.settings.errorToast", { message: `${key}: ${error.message}` }), "error");
        setSaving(false);
        return;
      }
    }
    setDirty({});
    setSaving(false);
    showToast(t("admin.settings.allSavedToast"));
  };

  // ── Render helpers ──

  const renderText = (key, field, labelKey, opts = {}) => (
    <div key={field}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t(labelKey)}</label>
      {opts.multiline ? (
        <textarea
          value={settings[key]?.[field] ?? ""}
          onChange={(e) => updateValue(key, { ...settings[key], [field]: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-400 transition-colors text-sm resize-y min-h-[80px]"
          rows={opts.rows || 3}
        />
      ) : (
        <input
          type="text"
          value={settings[key]?.[field] ?? ""}
          onChange={(e) => updateValue(key, { ...settings[key], [field]: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-400 transition-colors text-sm"
        />
      )}
    </div>
  );

  const renderArrayField = (key, arrayKey, labelKey, itemLabel, itemPlaceholder = "") => {
    const arr = settings[key]?.[arrayKey] ?? [];
    return (
      <div key={arrayKey}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t(labelKey)}</label>
        <div className="space-y-2">
          {arr.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...arr];
                  next[i] = e.target.value;
                  updateValue(key, { ...settings[key], [arrayKey]: next });
                }}
                placeholder={itemPlaceholder}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
              />
              <button
                onClick={() => setDeleteConfirm({
                  action: () => {
                    const next = arr.filter((_, j) => j !== i);
                    updateValue(key, { ...settings[key], [arrayKey]: next });
                  },
                  label: `${arrayKey} #${i + 1}`,
                })}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const next = [...arr, ""];
            updateValue(key, { ...settings[key], [arrayKey]: next });
          }}
          className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> {t("admin.settings.add")}
        </button>
      </div>
    );
  };

  // ── Tab editors ──

  const renderSiteInfo = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderText("siteInfo", "name", "admin.settings.shortName")}
          {renderText("siteInfo", "fullName", "admin.settings.fullName")}
        </div>
        {renderText("siteInfo", "tagline", "admin.settings.tagline")}
        {renderText("siteInfo", "description", "admin.settings.description", { multiline: true, rows: 3 })}

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{t("admin.settings.address")}</h4>
          {renderArrayField("siteInfo", "address", "admin.settings.address", "", t("admin.settings.addressPlaceholder"))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderArrayField("siteInfo", "phones", "admin.settings.phones", "", t("admin.settings.phonePlaceholder"))}
          {renderArrayField("siteInfo", "emails", "admin.settings.emails", "", t("admin.settings.emailPlaceholder"))}
        </div>

        {renderArrayField("siteInfo", "hours", "admin.settings.hours", "", t("admin.settings.hoursPlaceholder"))}

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">{t("admin.settings.contactPage")}</h4>
          {renderContactPageFields()}
        </div>
      </div>
    );
  };

  const renderContactPageFields = () => {
    const value = settings.siteInfo?.contactPage ?? DEFAULTS.siteInfo.contactPage;
    const updateNested = (field, newVal) => {
      updateValue("siteInfo", {
        ...settings.siteInfo,
        contactPage: { ...value, [field]: newVal },
      });
    };
    const renderNestedArray = (field, labelKey, placeholder) => {
      const arr = value[field] ?? [];
      return (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">{t(labelKey)}</label>
          <div className="space-y-2">
            {arr.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...arr];
                    next[i] = e.target.value;
                    updateNested(field, next);
                  }}
                  placeholder={placeholder}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
                />
                <button
                  onClick={() => setDeleteConfirm({
                    action: () => updateNested(field, arr.filter((_, j) => j !== i)),
                    label: `${field} #${i + 1}`,
                  })}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => updateNested(field, [...arr, ""])}
            className="mt-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> {t("admin.settings.add")}
          </button>
        </div>
      );
    };
    return (
      <div className="pl-4 border-l-2 border-brand-100 space-y-2">
        {renderNestedArray("address", "admin.settings.address", t("admin.settings.addressPlaceholder"))}
        {renderNestedArray("phones", "admin.settings.phones", t("admin.settings.phonePlaceholder"))}
        {renderNestedArray("emails", "admin.settings.emails", t("admin.settings.emailPlaceholder"))}
        {renderNestedArray("hours", "admin.settings.hours", t("admin.settings.hoursPlaceholder"))}
      </div>
    );
  };

  const renderNavLinks = () => {
    const links = settings.navLinks ?? [];
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500">{t("admin.settings.navLinksDesc")}</p>
        {links.map((link, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase">Lien #{i + 1}</span>                <button
                onClick={() => setDeleteConfirm({
                  action: () => updateValue("navLinks", links.filter((_, j) => j !== i)),
                  label: `Lien de navigation #${i + 1}`,
                })}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin.settings.linkLabel")}</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...next[i], label: e.target.value };
                    updateValue("navLinks", next);
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
                  placeholder={t("nav.home")}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin.settings.linkTo")}</label>
                <input
                  type="text"
                  value={link.to}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...next[i], to: e.target.value };
                    updateValue("navLinks", next);
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
                  placeholder="/"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!link.dropdown}
                    onChange={(e) => {
                      const next = [...links];
                      next[i] = { ...next[i], dropdown: e.target.checked };
                      updateValue("navLinks", next);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-xs font-medium text-gray-500">{t("admin.settings.linkDD")}</span>
                </label>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => updateValue("navLinks", [...links, { label: "", to: "/", dropdown: false }])}
          className="px-4 py-2 rounded-full border border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {t("admin.settings.addLink")}
        </button>
      </div>
    );
  };

  const renderFooterLinks = () => {
    const data = settings.footerLinks ?? DEFAULTS.footerLinks;
    const sections = [
      { key: "liamGroupe", label: t("footer.liamGroupe") },
      { key: "domaines", label: t("footer.domains") },
      { key: "agir", label: t("footer.act") },
    ];

    const updateSection = (sectionKey, items) => {
      updateValue("footerLinks", { ...data, [sectionKey]: items });
    };

    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-500">{t("admin.settings.footerLinksDesc")}</p>
        {sections.map(({ key: sectionKey, label }) => {
          const items = data[sectionKey] ?? [];
          return (
            <div key={sectionKey}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...next[i], label: e.target.value };
                        updateSection(sectionKey, next);
                      }}
                      placeholder="Label"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
                    />
                    <input
                      type="text"
                      value={item.to}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...next[i], to: e.target.value };
                        updateSection(sectionKey, next);
                      }}
                      placeholder="/lien"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
                    />
                    <button
                      onClick={() => setDeleteConfirm({
                        action: () => updateSection(sectionKey, items.filter((_, j) => j !== i)),
                        label: `Lien footer #${i + 1}`,
                      })}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateSection(sectionKey, [...items, { label: "", to: "/" }])}
                className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> {t("admin.settings.addLink")}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderHeroImages = () => {
    const images = settings.homeHeroImages ?? [];
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500">{t("admin.settings.heroImagesDesc")}</p>
        {images.map((url, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-400">#{i + 1}</span>                <button
                onClick={() => setDeleteConfirm({
                  action: () => updateValue("homeHeroImages", images.filter((_, j) => j !== i)),
                  label: `Image hero #${i + 1}`,
                })}
                className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-10 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {url ? (
                  <img src={url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const next = [...images];
                  next[i] = e.target.value;
                  updateValue("homeHeroImages", next);
                }}
                placeholder={t("admin.settings.heroImagePlaceholder")}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm font-mono text-xs"
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => updateValue("homeHeroImages", [...images, ""])}
          className="px-4 py-2 rounded-full border border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {t("admin.settings.addImage")}
        </button>
      </div>
    );
  };

  const renderFormConfigs = () => {
    const configs = settings.form_configs ?? DEFAULTS.form_configs;
    const formTypes = ["contact", "chatbot"];

    const updateFormType = (formType, fields) => {
      updateValue("form_configs", { ...configs, [formType]: fields });
    };

    const FIELD_TYPES = ["text", "email", "tel", "textarea", "select"];

    const renderFieldEditor = (formType, field, idx, fields) => {
      const update = (key, val) => {
        const next = fields.map((f, i) => i === idx ? { ...f, [key]: val } : f);
        updateFormType(formType, next);
      };

      return (
        <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">#{idx + 1}</span>
            <button
              onClick={() => setDeleteConfirm({
                action: () => updateFormType(formType, fields.filter((_, j) => j !== idx)),
                label: `Champ formulaire #${idx + 1}`,
              })}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin.settings.fieldName")}</label>
              <input
                type="text"
                value={field.name || ""}
                onChange={(e) => update("name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin.settings.fieldLabel")}</label>
              <input
                type="text"
                value={field.label || ""}
                onChange={(e) => update("label", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm font-mono"
                placeholder="contact.formFirstName"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin.settings.fieldType")}</label>
              <select
                value={field.type || "text"}
                onChange={(e) => update("type", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm"
              >
                {FIELD_TYPES.map((ft) => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!field.required}
                  onChange={(e) => update("required", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-xs font-medium text-gray-500">{t("admin.settings.fieldRequired")}</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin.settings.fieldPlaceholder")}</label>
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => update("placeholder", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-400 transition-colors text-sm font-mono"
                placeholder="contact.formFirstNamePlaceholder"
              />
            </div>
            {field.type === "select" && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("admin.settings.fieldOptions")}</label>
                <div className="space-y-1.5">
                  {(field.options || []).map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...(field.options || [])];
                          next[oi] = e.target.value;
                          update("options", next);
                        }}
                        className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-400 transition-colors text-xs font-mono"
                      />
                      <button
                        onClick={() => setDeleteConfirm({
                          action: () => update("options", (field.options || []).filter((_, j) => j !== oi)),
                          label: `Option #${oi + 1}`,
                        })}
                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => update("options", [...(field.options || []), ""])}
                  className="mt-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> {t("admin.settings.add")}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {formTypes.map((formType) => {
          const fields = configs[formType] ?? [];
          return (
            <div key={formType}>
              <h4 className="text-sm font-semibold text-gray-700 capitalize mb-2">
                {formType === "contact" ? t("admin.settings.formContact") : t("admin.settings.formChatbot")}
              </h4>
              <div className="space-y-3">
                {fields.map((field, idx) => renderFieldEditor(formType, field, idx, fields))}
              </div>
              <button
                onClick={() => updateFormType(formType, [...fields, { name: "", label: "", type: "text", required: false, placeholder: "" }])}
                className="mt-3 px-4 py-2 rounded-full border border-dashed border-gray-300 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> {t("admin.settings.addField")}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderEditor = () => {
    switch (activeTab) {
      case "siteInfo": return renderSiteInfo();
      case "navLinks": return renderNavLinks();
      case "footerLinks": return renderFooterLinks();
      case "homeHeroImages": return renderHeroImages();
      case "form_configs": return renderFormConfigs();
      default: return null;
    }
  };

  // ── Main render ──

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900">
            {t("admin.settings.title")}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {t("admin.settings.description")}
          </p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving || Object.keys(dirty).length === 0}
          className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t("admin.settings.saveAll")}
        </button>
      </div>

      {/* Tabs — cachés quand on est dans une sous-page spécifique */}
      {!currentSection && (
        <div className="flex flex-wrap gap-2 mb-6">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-brand-500 text-white shadow-sm"
                  : `bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 ${
                      dirty[key] ? "ring-2 ring-amber-300" : ""
                    }`
              }`}
            >
              <span className="mr-1.5">{SETTING_ICONS[key]}</span>
              {SETTING_LABELS[key]}
              {dirty[key] && <span className="ml-1.5 w-2 h-2 bg-amber-400 rounded-full inline-block" />}
            </button>
          ))}
        </div>
      )}

      {/* Editor card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-bold text-lg">
            {SETTING_LABELS[activeTab]}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                updateValue(activeTab, JSON.parse(JSON.stringify(DEFAULTS[activeTab])));
                showToast(t("admin.settings.resetToast", { label: SETTING_LABELS[activeTab] }));
              }}
              className="px-3 py-2 rounded-full border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-medium inline-flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t("admin.settings.reset")}
            </button>
            <button
              onClick={() => saveSetting(activeTab)}
              disabled={saving || !dirty[activeTab]}
              className="px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {t("admin.settings.save")}
            </button>
          </div>
        </div>
        <div className="p-6">
          {renderEditor()}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium transition-all animate-fade-up ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-scale-in">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ring-1 ring-red-200">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">{t("admin.contentManager.confirmDelete")}</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer <strong>{deleteConfirm.label}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                autoFocus
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all"
              >
                {t("admin.contentManager.cancel")}
              </button>
              <button
                onClick={() => {
                  deleteConfirm.action();
                  showToast(t("admin.contentManager.deleted") + " ✅");
                  setDeleteConfirm(null);
                }}
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
