import { useState, useCallback } from "react";

const INITIAL_ERRORS = { name: "", email: "", phone: "" };
const INITIAL_TOUCHED = { name: false, email: false, phone: false };

/**
 * useFormValidation — Hook de validation de formulaire.
 * Gère les états errors / touched et fournit les fonctions de validation
 * pour les champs name, email et phone.
 *
 * @returns {{
 *   errors:         { name: string, email: string, phone: string },
 *   touched:        { name: boolean, email: boolean, phone: boolean },
 *   hasErrors:      boolean,
 *   validateField:  (field: string, value: string) => string,
 *   handleBlur:     (field: string, formValues: Object) => void,
 *   validateAll:    (formValues: Object) => Object,
 *   resetValidation: () => void,
 * }}
 */
export default function useFormValidation() {
  const [errors, setErrors] = useState({ ...INITIAL_ERRORS });
  const [touched, setTouched] = useState({ ...INITIAL_TOUCHED });

  /** Valide un champ et retourne un message d'erreur (vide si valide) */
  const validateField = useCallback((field, value) => {
    switch (field) {
      case "name":
        return value.trim().length < 2
          ? "Le nom doit contenir au moins 2 caractères"
          : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Adresse email invalide"
          : "";
      case "phone":
        if (value && !/^[\d\s+\-()]{6,20}$/.test(value))
          return "Numéro de téléphone invalide";
        return "";
      default:
        return "";
    }
  }, []);

  /** Marque un champ comme touché et le valide (appelé au blur) */
  const handleBlur = useCallback(
    (field, formValues) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, formValues[field]),
      }));
    },
    [validateField]
  );

  /** Valide tous les champs, marque tout comme touché, retourne les erreurs */
  const validateAll = useCallback(
    (formValues) => {
      const allErrors = {
        name: validateField("name", formValues.name),
        email: validateField("email", formValues.email),
        phone: validateField("phone", formValues.phone),
      };
      setErrors(allErrors);
      setTouched({ name: true, email: true, phone: true });
      return allErrors;
    },
    [validateField]
  );

  /** Remet errors et touched à leur état initial */
  const resetValidation = useCallback(() => {
    setErrors({ ...INITIAL_ERRORS });
    setTouched({ ...INITIAL_TOUCHED });
  }, []);

  /** Valide et met à jour l'erreur d'un seul champ (utilisé dans updateAndSave) */
  const setFieldError = useCallback(
    (field, value) => {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    },
    [validateField]
  );

  const hasErrors = !!(errors.name || errors.email);

  return {
    errors,
    touched,
    hasErrors,
    validateField,
    handleBlur,
    validateAll,
    resetValidation,
    setFieldError,
  };
}
