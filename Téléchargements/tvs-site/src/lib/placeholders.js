/**
 * Générateur d'URL d'images placeholder via picsum.photos.
 * Utilise des seeds thématiques pour garantir des images stables
 * qui changent de look à chaque rafraîchissement de build, mais restent
 * cohérentes pour le même produit.
 *
 * À remplacer plus tard par les vraies images produits / événements.
 */

const SEEDS = {
  // Motos
  'apache-rtr-160': 'sport-motorcycle-1',
  'raider-125': 'sport-motorcycle-2',
  'star-city-plus': 'commuter-motorcycle',
  // Scooters
  'ntorq-125': 'scooter-modern',
  'jupiter-125': 'scooter-family',
  // Tricycles
  'king-cargo': 'cargo-three-wheeler',
  'king-passenger': 'passenger-three-wheeler',

  // Pièces détachées
  'plaquettes-frein': 'brake-pads',
  'kit-chaine': 'motorcycle-chain',
  'filtre-air': 'air-filter',
  'batterie': 'motorcycle-battery',
  'pneu-arriere': 'motorcycle-tire',
  'kit-embrayage': 'clutch-kit',

  // Événements
  'essai-libre': 'test-ride-event',
  'lancement-king-cargo': 'product-launch',
  'tournee-regionale': 'motorcycle-tour',
  'coupe-du-monde': 'world-cup-screening',
  'tombola': 'raffle-event',

  // Catégories
  motos: 'motorcycle-category',
  moteurs: 'engine-category',
  tricycles: 'three-wheeler-category',

  // Génériques
  marque: 'tvs-brand',
  qualite: 'motorcycle-quality',
  livraison: 'delivery-service',
}

/**
 * Retourne une URL placeholder pour une image produit.
 * @param {string} slug - Slug unique du produit / événement / pièce
 * @param {number} [w=800] - Largeur souhaitée
 * @param {number} [h=600] - Hauteur souhaitée
 * @returns {string}
 */
export function placeholderImg(slug, w = 800, h = 600) {
  const seed = SEEDS[slug] || slug.replace(/[^a-z0-9-]/g, '-')
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

/**
 * Version carrée (utile pour les cartes produit / pièce).
 * @param {string} slug
 * @param {number} [size=400]
 * @returns {string}
 */
export function placeholderSquare(slug, size = 400) {
  return placeholderImg(slug, size, size)
}


