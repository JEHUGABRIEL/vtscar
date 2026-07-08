/**
 * cn — Merge class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Mois en français et en anglais pour le parsing des dates d'événements.
 */
const FRENCH_MONTHS = {
  janvier: 0, f\u00e9vrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, ao\u00fbt: 7, septembre: 8, octobre: 9, novembre: 10, d\u00e9cembre: 11,
};

const ENGLISH_MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/**
 * Parse une date d'événement au format textuel français ou anglais.
 *
 * Formats supportés :
 *   - "15 Août 2026"       (français)
 *   - "August 15, 2026"    (anglais)
 *   - "2026-08-15"         (ISO)
 *
 * @param {string} dateStr
 * @returns {Date|null}
 */
export function parseEventDate(dateStr) {
  if (!dateStr) return null;

  const trimmed = dateStr.trim();

  // ISO "2026-08-15"
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    const d = new Date(+iso[1], +iso[2] - 1, +iso[3]);
    return isNaN(d.getTime()) ? null : d;
  }

  // Français : "15 Août 2026"
  const fr = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(trimmed);
  if (fr) {
    const monthIndex = FRENCH_MONTHS[fr[2].toLowerCase()];
    if (monthIndex !== undefined) {
      const d = new Date(+fr[3], monthIndex, +fr[1]);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  // Anglais : "August 15, 2026" ou "August 15 2026"
  const en = /^(\S+)\s+(\d{1,2}),?\s+(\d{4})$/.exec(trimmed);
  if (en) {
    const monthIndex = ENGLISH_MONTHS[en[1].toLowerCase()];
    if (monthIndex !== undefined) {
      const d = new Date(+en[3], monthIndex, +en[2]);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  return null;
}

/**
 * Calcule le statut correct d'un événement en fonction de sa date.
 * Si endDateStr est fournie, elle est utilisée comme référence
 * (l'événement ne devient "passe" qu'après la date de fin).
 *
 * @param {string} dateStr    - Date textuelle de l'événement (début)
 * @param {string} [currentStatus="a_venir"] - Statut actuel
 * @param {string} [endDateStr] - Date de fin optionnelle (événements multi-jours)
 * @returns {string} "a_venir" | "passe"
 */
export function computeEventStatus(dateStr, currentStatus, endDateStr) {
  // Utiliser la date de fin si fournie, sinon la date de début
  const refDate = endDateStr || dateStr;
  const parsed = parseEventDate(refDate);
  if (!parsed) return currentStatus || "a_venir";

  // Comparer le début du jour : si la date est strictement dans le passé
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());

  if (eventDay < today) return "passe";
  return "a_venir";
}

