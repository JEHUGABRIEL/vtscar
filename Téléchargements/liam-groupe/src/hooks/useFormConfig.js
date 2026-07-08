import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

/**
 * Chargement / création de la configuration des formulaires dynamiques.
 * La config est stockée dans `site_settings` sous la clé `form_configs`.
 *
 * Structure :
 * {
 *   contact: [{ name, label, type, required, placeholder, options? }],
 *   chatbot: [{ name, label, type, required, placeholder }],
 * }
 */
const DEFAULTS = {
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
};

function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
}

export function useFormConfig(formType = "contact") {
  const [config, setConfig] = useState(DEFAULTS[formType] || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "form_configs")
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data?.value) {
          const parsed = safeParse(data.value, {});
          const fields = parsed[formType];
          if (Array.isArray(fields) && fields.length > 0) {
            setConfig(fields);
          }
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [formType]);

  return { config, loading, defaults: DEFAULTS[formType] || [] };
}
