import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send, User, Mail, Phone, MessageSquare } from "lucide-react";

/**
 * DynamicForm — Rendu de formulaire à partir d'une configuration de champs.
 *
 * Props :
 *   fields        : array   — [{ name, label, type, required, placeholder, options? }]
 *   initialValues : object  — valeurs initiales des champs
 *   onSubmit      : (values: Record<string,string>) => Promise<void>
 *   submitLabel   : string  — texte du bouton submit
 *   loading       : boolean
 *   onChange      : (values: Record<string,string>) => void — appelée à chaque modification
 */
const ICON_MAP = {
  firstname: User,
  lastname: User,
  name: User,
  email: Mail,
  phone: Phone,
  message: MessageSquare,
  subject: MessageSquare,
};

const FIELD_IDS = new Set([
  "firstname","lastname","name","email","phone","subject","message",
]);

export default function DynamicForm({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel,
  loading,
  onChange,
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    for (const f of fields) {
      if (f.required) {
        const v = (values[f.name] || "").trim();
        if (!v) {
          errs[f.name] = t("common.required", "Ce champ est requis");
        } else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          errs[f.name] = t("contact.formEmailError", "Email invalide");
        }
      }
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
      // Reset après soumission réussie
      setValues(initialValues);
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (name) => (e) => {
    const v = e.target.value;
    const next = { ...values, [name]: v };
    setValues(next);
    onChange?.(next);
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const busy = submitting || loading;
  const id = (name) => `df-${name}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {fields.map((f) => {
        const Icon = ICON_MAP[f.name] || null;
        const hasIcon = Icon && FIELD_IDS.has(f.name);

        return (
          <div key={f.name}>
            {f.label && (
              <label htmlFor={id(f.name)} className="block text-sm font-medium text-gray-700 mb-1.5">
                {t(f.label)} {f.required && <span className="text-red-400">*</span>}
              </label>
            )}
            <div className="relative">
              {hasIcon && (
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              )}

              {f.type === "textarea" ? (
                <textarea
                  id={id(f.name)}
                  name={f.name}
                  rows={4}
                  value={values[f.name] || ""}
                  onChange={handleChange(f.name)}
                  placeholder={f.placeholder ? t(f.placeholder) : ""}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors ${
                    errors[f.name]
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-brand-400"
                  }`}
                />
              ) : f.type === "select" && f.options ? (
                <select
                  id={id(f.name)}
                  name={f.name}
                  value={values[f.name] || ""}
                  onChange={handleChange(f.name)}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm outline-none bg-white appearance-none transition-colors ${
                    errors[f.name]
                      ? "border-red-300 focus:border-red-400 text-red-600"
                      : "border-gray-200 focus:border-brand-400 text-gray-600"
                  }`}
                >
                  <option value="">{f.placeholder ? t(f.placeholder) : ""}</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={t(opt)}>{t(opt)}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={id(f.name)}
                  name={f.name}
                  type={f.type || "text"}
                  value={values[f.name] || ""}
                  onChange={handleChange(f.name)}
                  placeholder={f.placeholder ? t(f.placeholder) : ""}
                  className={`w-full border rounded-xl py-3 text-sm outline-none transition-colors ${
                    hasIcon ? "pl-10 pr-4" : "px-4"
                  } ${
                    errors[f.name]
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-brand-400"
                  }`}
                />
              )}
            </div>
            {errors[f.name] && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors[f.name]}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={busy}
        className="w-full py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98]"
      >
        {submitLabel || t("common.submit", "Envoyer")}
        {!busy && <Send className="w-4 h-4" />}
      </button>
    </form>
  );
}
