/**
 * Générateur d'URL d'images — utilise les images locales disponibles
 * dans public/images/ ou génère des placeholders via picsum.photos.
 */

// ─── Mapping : slug → image(s) locale(s) ──────────────────────────────
// Les images doivent être placées dans public/images/
// La valeur peut être un string (image unique) ou un tableau (plusieurs)

const LOCAL_IMAGES = {

  // ── Motos ─────────────────────────────────────────────────────────
  'apache-rtr-160': '/images/motos/apache-rtr-160.jpg',
  'raider-125': '/images/motos/raider-125.jpg',
  'ntorq-125': '/images/motos/ntorq-125.jpg',
  'jupiter-125': '/images/motos/jupiter-125.jpg',
  'star-city-plus': [
    '/images/motos/HJ110/Haojue__HJ110-6.png',
    '/images/motos/HJ110/images.jpeg',
  ],

  // ── Tricycles ─────────────────────────────────────────────────────
  'king-cargo-3-roues': [
    '/images/motos/king_kargo.jpeg',
    '/images/motos/king_kargo_1.jpeg',
    '/images/motos/king_kargo_2.jpeg',
    '/images/motos/TVS-Kargo-Box-Van-black-right.jpg',
    '/images/motos/motocarro_tvs_king_kargo_lt.jpg',
    '/images/motos/tvs-king-kargo-hd-ev.avif',
  ],
  'king-cargo': '/images/motos/king_kargo.jpeg',

  'king-passenger-3-roues': [
    '/images/motos/king_kargo_1.jpeg',
    '/images/motos/TVS-Kargo-Box-Van-black-right.jpg',
  ],
  'king-passenger': '/images/motos/king_kargo_1.jpeg',

  // ── Catégories ────────────────────────────────────────────────────
  motos: '/images/motos/HJ110/Haojue__HJ110-6.png',
  tricycles: '/images/motos/TVS-Kargo-Box-Van-black-right.jpg',
}

// ─── Mapping placeholder (fallback picsum) ────────────────────────────
const SEEDS = {
  'apache-rtr-160': 'sport-motorcycle-1',
  'raider-125': 'sport-motorcycle-2',
  'star-city-plus': 'commuter-motorcycle',
  'ntorq-125': 'scooter-modern',
  'jupiter-125': 'scooter-family',
  'king-cargo': 'cargo-three-wheeler',
  'king-passenger': 'passenger-three-wheeler',
  'plaquettes-frein': 'brake-pads',
  'kit-chaine': 'motorcycle-chain',
  'filtre-air': 'air-filter',
  batterie: 'motorcycle-battery',
  'pneu-arriere': 'motorcycle-tire',
  'kit-embrayage': 'clutch-kit',
  'essai-libre': 'test-ride-event',
  'lancement-king-cargo': 'product-launch',
  'tournee-regionale': 'motorcycle-tour',
  'coupe-du-monde': 'world-cup-screening',
  tombola: 'raffle-event',
  moteurs: 'engine-category',
  marque: 'tvs-brand',
  qualite: 'motorcycle-quality',
  livraison: 'delivery-service',
}

/**
 * Retourne l'URL d'une image locale si disponible,
 * sinon génère une URL placeholder via picsum.photos.
 * @param {string} slug  - Slug du produit / événement / pièce
 * @param {number} [w=800]
 * @param {number} [h=600]
 * @returns {string}
 */
export function placeholderImg(slug, w = 800, h = 600) {
  const local = LOCAL_IMAGES[slug]
  if (local) return Array.isArray(local) ? local[0] : local

  const seed = SEEDS[slug] || slug.replace(/[^a-z0-9-]/g, '-')
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

/**
 * Version carrée. Retourne une image locale si disponible,
 * sinon un placeholder picsum carré.
 * @param {string} slug
 * @param {number} [size=400]
 * @returns {string}
 */
export function placeholderSquare(slug, size = 400) {
  return placeholderImg(slug, size, size)
}


