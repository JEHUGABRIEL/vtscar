import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase.js";
import { useFormConfig } from "../hooks/useFormConfig.js";
import DynamicForm from "./ui/DynamicForm.jsx";

/**
 * ContactForm — Formulaire de contact réutilisable et dynamique.
 *
 * Props :
 *   page       : string    — nom de la page d'origine (ex: "home", "about")
 *   onDirty    : (dirty: boolean) => void
 *   formId     : string    — préfixe pour les ids des champs
 */
export default function ContactForm({ page = "home", onDirty }) {
  const { t } = useTranslation();
  const { config, loading } = useFormConfig("contact");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const tm = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(tm);
    }
  }, [toast]);

  const handleSubmit = async (values) => {
    // Construit l'objet avec les colonnes fixes + data JSONB
    const data = {
      first_name: values.firstname || values.name?.split(/\s+/)[0] || "",
      last_name: values.lastname || values.name?.split(/\s+/).slice(1).join(" ") || "",
      email: values.email || "",
      phone: values.phone || "",
      subject: values.subject || "",
      message: values.message || "",
      page,
      data: values, // stocke tous les champs bruts
    };
    const { error } = await supabase.from("messages").insert(data);
    if (error) {
      console.error("ContactForm — Erreur d'envoi :", error);
      setToast({ message: "Erreur lors de l'envoi : " + error.message, type: "error" });
    } else {
      onDirty?.(false);
      setToast({ message: "Merci ! Votre message a été envoyé.", type: "success" });
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-card rounded-2xl p-8 h-fit">
      <h3 className="font-heading font-bold text-lg mb-5">{t("contact.formTitle")}</h3>

      <DynamicForm
        fields={config}
        loading={loading}
        onSubmit={handleSubmit}
        submitLabel={t("contact.formSubmit")}
        onChange={() => onDirty?.(true)}
      />

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
    </div>
  );
}
