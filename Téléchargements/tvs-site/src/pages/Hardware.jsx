import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PARTS, PART_CATEGORIES } from '../data/products.js'
import PartCard from '../components/PartCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import { placeholderImg, placeholderSquare } from '../lib/placeholders.js'

const HARDWARE_SLIDES = [
  {
    image: PARTS[0]?.image || placeholderSquare('plaquettes-frein'),
    title: 'Pièces',
    titleAccent: 'détachées',
    subtitle: 'Quincaillerie · Stock permanent',
    description: 'Freinage, transmission, moteur, électrique, pneumatiques : toutes les pièces TVS disponibles en showroom.',
    cta: { text: 'Trouver ma pièce', to: '/quincaillerie' },
  },
  {
    image: PARTS[3]?.image || placeholderSquare('batterie'),
    title: 'Entretien &',
    titleAccent: 'réparations',
    subtitle: 'Service après-vente',
    description: 'Notre atelier assure l\'entretien courant et les réparations sur tous les modèles TVS avec des pièces d\'origine.',
    cta: { text: 'Voir les pièces', to: '/quincaillerie' },
  },
  {
    image: PARTS[4]?.image || placeholderSquare('pneu-arriere'),
    title: 'Pneus &',
    titleAccent: 'accessoires',
    subtitle: 'Équipement moto',
    description: 'Pneus renforcés, batteries, kits chaîne : tout pour garder votre TVS en parfait état de fonctionnement.',
    cta: { text: 'Explorer', to: '/quincaillerie' },
  },
]

export default function Hardware() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return PARTS.filter((part) => {
      const matchesCategory = category === 'all' || part.category === category
      const matchesQuery =
        query.trim() === '' ||
        part.name.toLowerCase().includes(query.toLowerCase()) ||
        part.compatibleModels.some((m) => m.toLowerCase().includes(query.toLowerCase()))
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div>
      <HeroSlider slides={HARDWARE_SLIDES} interval={5000} />

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">Quincaillerie</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
            Pièces détachées
          </h1>
          <p className="mt-3 text-steel">
            Trouvez la pièce compatible avec votre modèle TVS. Recherchez par nom de pièce ou par modèle de moto.
          </p>
        </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-line bg-paper-raised px-4 py-2.5">
          <Search size={18} className="text-steel" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une pièce ou un modèle (ex : Raider 125)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-steel"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('all')}
          className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
            category === 'all' ? 'bg-tvs-blue text-white' : 'bg-line text-ink hover:bg-steel-light/40'
          }`}
        >
          Toutes les pièces
        </button>
        {PART_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`rounded-full px-4 py-2 font-display text-base font-medium tracking-wide transition-colors ${
              category === cat.id ? 'bg-tvs-blue text-white' : 'bg-line text-ink hover:bg-steel-light/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-steel">
          Aucune pièce trouvée. Contactez le showroom, la référence peut être disponible sur commande.
        </p>
      )}
      </div>
    </div>
  )
}
