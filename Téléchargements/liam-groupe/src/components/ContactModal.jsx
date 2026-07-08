import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase.js";
import { useFormConfig } from "../hooks/useFormConfig.js";
import DynamicForm from "./ui/DynamicForm.jsx";

/**
 * ContactModal — Modal de formulaire dynamique animé.
 */
export default function ContactModal({
  open,
  onClose,
  title,
  description,
  initialSubject = "",
  initialMessage = "",
  successMessageKey = "home.contact.successText",
  onSubmit,
}) {
  const { t } = useTranslation();
  const overlayRef = useRef(null);
  const { config, loading } = useFormConfig("contact");
  const [submitted, setSubmitted] = useState(false);
  const [lastValues, setLastValues] = useState({});

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubmitted(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const [submitError, setSubmitError] = useState(null);

  const handleFormSubmit = async (values) => {
    setSubmitError(null);
    try {
      const nameParts = (values.name || values.firstname || "").trim().split(/\s+/);
      const { error: msgError } = await supabase.from("messages").insert({
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        email: values.email || "",
        phone: values.phone || "",
        subject: values.subject || "",
        message: values.message || "",
        page: "contact-modal",
        data: values,
      });
      if (msgError) throw msgError;

      if (onSubmit) {
        await onSubmit(values);
      }

      setLastValues(values);
      setSubmitted(true);
    } catch (err) {
      console.error("ContactModal — Erreur d'envoi :", err);
      setSubmitError(err.message || "Une erreur est survenue lors de l'envoi.");
    }
  };

  // Auto-close after 6s on success
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => onClose(), 6000);
    return () => clearTimeout(timer);
  }, [submitted, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
              aria-label={t("gallery.close")}
            >
              <X className="w-4 h-4" />
            </button>

            <AnimatePresence mode="wait">
              {submitted ? (
                /* ----- SUCCESS STATE ----- */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="px-8 py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
                    className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-50 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.35, type: "spring", stiffness: 250, damping: 10 }}
                    >
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="absolute top-[104px] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-green-300 pointer-events-none"
                  />
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="font-heading font-bold text-2xl text-ink mb-3"
                  >
                    {t("home.contact.successTitle")}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.4 }}
                    className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-8"
                  >
                    {t(successMessageKey, { name: lastValues?.name || lastValues?.firstname || "" })}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    onClick={onClose}
                    className="px-7 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                  >
                    {t("home.contact.successAction")}
                  </motion.button>
                </motion.div>
              ) : (
                /* ----- FORM STATE ----- */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="pt-8 pb-2 px-8">
                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-brand-500" />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-ink">
                      {title || t("home.contact.title")}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1.5">
                      {description || t("home.contact.description")}
                    </p>
                  </div>

                  <div className="px-8 pb-8 pt-4">
                    {submitError && (
                      <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                        <span>⚠️</span>
                        <span>{submitError}</span>
                      </div>
                    )}
                    <DynamicForm
                      fields={config}
                      loading={loading}
                      initialValues={
                        initialSubject || initialMessage
                          ? { subject: initialSubject ? t("home.contact.formSubjectEventOption") : "", message: initialMessage || "" }
                          : {}
                      }
                      onSubmit={handleFormSubmit}
                      submitLabel={t("home.contact.formSubmit")}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
