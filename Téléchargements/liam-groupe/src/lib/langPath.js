/**
 * Utilities pour la gestion des préfixes de langue dans les URLs.
 * Utilisé conjointement avec le routeur qui a des routes /:lang/...
 */

import { useParams } from "react-router-dom";

/**
 * Hook qui retourne la langue depuis le paramètre d'URL `:lang`.
 * Utilise `useParams` de react-router-dom.
 */
export function useLang() {
  const { lang } = useParams();
  return lang || "fr";
}

/**
 * Ajoute le préfixe de langue à un chemin.
 * Exemple : langPath("en", "/a-propos") → "/en/a-propos"
 *           langPath("fr", "/")       → "/fr"
 */
export function langPath(lang, path) {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}

/**
 * Hook qui retourne une fonction pour générer des chemins préfixés
 * avec la langue courante.
 * Usage : const p = useLangPath(); <Link to={p("/a-propos")}>…
 */
export function useLangPath() {
  const lang = useLang();
  return (path) => langPath(lang, path);
}
