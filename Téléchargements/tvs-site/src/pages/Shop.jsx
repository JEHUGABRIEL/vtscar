import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import { placeholderImg } from '../lib/placeholders.js'

const SHOP_SLIDES = [
  {
    image: PRODUCTS.find((p) => p.category === 'motos')?.images[0] || placeholderImg('motos'),
    title: 'Motos & scooters',
    titleAccent: 'TVS',
    subtitle: 'Motos & scooters · En stock',
    description: 'Des motos sportives aux scooters urbains, trouve la TVS qui correspond à ton style et à ton budget.',
    cta: { text: 'Voir les motos', to: '/produits/motos' },
  },
  {
    image: placeholderImg('moteurs'),
    title: 'Moteurs',
    titleAccent: '& pièces',
    subtitle: 'Moteurs & pièces · Détachées',
    description: 'Moteurs neufs et pièces détachées d\'origine TVS pour l\'entretien et la réparation de votre véhicule.',
    cta: { text: 'Voir les moteurs', to: '/produits/moteurs' },
  },
  {
    image: PRODUCTS.find((p) => p.category === 'tricycles')?.images[0] || placeholderImg('tricycles'),
    title: 'Tricycles',
    titleAccent: 'Utilitaires',
    subtitle: 'Tricycles · Transport utilitaire',
    description: 'King Cargo et King Passenger : robustesse et capacité de charge pour le transport de marchandises et de passagers.',
    cta: { text: 'Voir les tricycles', to: '/produits/tricycles' },
  },
]

const CATEGORY_LABELS = {
  motos: 'Motos & scooters',
  moteurs: 'Moteurs & pièces',
  tricycles: 'Tricycles utilitaires',
}

export default function Shop() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/')
  const subcategory = pathSegments[2] || null // 'motos', 'moteurs', 'tricycles', or null

  const activeCategory = subcategory || 'all'

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS
    return PRODUCTS.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  // Hero slides spécifiques à la sous-catégorie
  const heroSlides = subcategory
    ? SHOP_SLIDES.filter((s) => {
        const slideCat = s.cta.to.split('/').pop()
        return slideCat === subcategory
      })
    : SHOP_SLIDES

  return (
    <div>
      <HeroSlider slides={heroSlides} interval={5000} />

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">
            {subcategory ? (CATEGORY_LABELS[subcategory] || 'Produits') : 'Produits'}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
            {subcategory
              ? (CATEGORY_LABELS[subcategory] || 'Produits')
              : 'Toute la gamme TVS'
            }
          </h1>
          <p className="mt-3 text-steel">
            {subcategory
              ? `Découvrez notre sélection de ${CATEGORY_LABELS[subcategory]?.toLowerCase() || 'produits'} TVS.`
              : 'Motos, moteurs et tricycles utilitaires. Prix affichés hors frais de livraison.'
            }
          </p>
        </div>

        {!subcategory && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to="/produits"
              className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
                !activeCategory || activeCategory === 'all' ? 'bg-tvs-blue text-white' : 'bg-line text-ink hover:bg-steel-light/40'
              }`}
            >
              Toute la gamme
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/produits/${cat.id}`}
                className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
                  activeCategory === cat.id ? 'bg-tvs-blue text-white' : 'bg-line text-ink hover:bg-steel-light/40'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-steel">Aucun produit dans cette catégorie pour le moment.</p>
        )}
      </div>
    </div>
  )
}
