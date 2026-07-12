import { placeholderImg } from '../lib/placeholders.js'

export const EVENTS = [
  {
    id: 'coupe-du-monde-2026',
    slug: 'coupe-du-monde-2026',
    title: 'Projection Coupe du Monde — Showroom TVS',
    date: '2026-07-14',
    location: 'Showroom TVS, PK0, Bangui',
    excerpt: 'Venez vivre les matchs de la Coupe du Monde 2026 sur grand écran au showroom TVS.',
    description:
      "TVS vous invite à suivre les matchs de la Coupe du Monde 2026 dans son showroom climatisé. Écran géant, rafraîchissements offerts et ambiance conviviale. Places limitées, venez nombreux ! Profitez-en pour découvrir les derniers modèles TVS exposés.",
    image: placeholderImg('coupe-du-monde'),
  },
  {
    id: 'essai-libre-pk0',
    slug: 'essai-libre-pk0',
    title: 'Journée d\'essai libre — Avenue de l\'Indépendance',
    date: '2026-07-26',
    location: 'Showroom TVS, PK0, Bangui',
    excerpt: "Venez essayer toute la gamme Apache et Raider sur un circuit fermé, sans engagement.",
    description:
      "Une journée portes ouvertes pour essayer gratuitement la gamme TVS Apache et Raider. Nos techniciens répondent à toutes vos questions sur l'entretien et le financement. Casques fournis sur place.",
    image: placeholderImg('essai-libre'),
  },
  {
    id: 'lancement-king-cargo',
    slug: 'lancement-king-cargo',
    title: 'Lancement TVS King Cargo — Édition commerçants',
    date: '2026-08-09',
    location: 'Marché Central, Bangui',
    excerpt: 'Présentation du tricycle utilitaire King Cargo aux commerçants et transporteurs.',
    description:
      "TVS présente son tricycle utilitaire King Cargo directement sur le Marché Central. Offres spéciales de lancement pour les commerçants et transporteurs, avec facilités de paiement échelonné.",
    image: placeholderImg('lancement-king-cargo'),
  },
  {
    id: 'tournee-regionale',
    slug: 'tournee-regionale-bimbo-bego',
    title: 'Tournée régionale TVS — Bimbo & Bégoua',
    date: '2026-08-23',
    location: 'Bimbo puis Bégoua',
    excerpt: "L'équipe TVS se déplace en périphérie pour présenter la gamme et le service après-vente.",
    description:
      "Dans le cadre de son expansion, TVS organise une tournée à Bimbo et Bégoua pour présenter sa gamme complète et son réseau de pièces détachées aux populations en périphérie de Bangui.",
    image: placeholderImg('tournee-regionale'),
  },
  {
    id: 'tombola-tvs',
    slug: 'tombola-tvs-2026',
    title: 'Tombola TVS — Gagnez un scooter Jupiter 125',
    date: '2026-09-13',
    location: 'Showroom TVS, PK0, Bangui',
    excerpt: 'Participez à la grande tombola TVS et tentez de remporter un Jupiter 125 flambant neuf.',
    description:
      "À l'occasion de la rentrée, TVS organise une grande tombola ouverte à tous. Le premier lot est un scooter TVS Jupiter 125, suivi de nombreux lots : casques, bons d'achat et accessoires. Chaque ticket est valable pour un passage au showroom. Le tirage au sort aura lieu le jour de l'événement.",
    image: placeholderImg('tombola'),
  },
]

export function formatEventDate(dateStr) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateStr)
  )
}
