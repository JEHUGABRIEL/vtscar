import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { PRODUCTS, formatFCFA } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import SpecGauge from '../components/SpecGauge.jsx'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = PRODUCTS.find((p) => p.slug === slug)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  if (!product) return <Navigate to="/produits" replace />

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.images[0],
      kind: 'product',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <Link to="/produits" className="flex items-center gap-1.5 font-medium text-tvs-blue hover:underline">
        <ChevronLeft size={18} />
        Retour aux produits
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-tvs-blue-tint">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold text-ink">{product.name}</h1>
          <p className="mt-1 text-lg text-steel">{product.tagline}</p>
          <p className="mt-5 font-display text-3xl font-bold text-tvs-red">
            {formatFCFA(product.price)}
          </p>

          <p className="mt-6 leading-relaxed text-ink/85">{product.description}</p>

          <div className="mt-8 flex gap-6 rounded-xl border border-line bg-paper-raised p-6">
            <SpecGauge value={product.specs.vitesseMax} max={140} unit="km/h" label="Vitesse max" />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 font-mono text-sm">
            {Object.entries(product.specs)
              .filter(([key]) => key !== 'vitesseMax')
              .map(([key, val]) => (
                <div key={key} className="rounded-lg border border-line px-3 py-2.5">
                  <dt className="uppercase tracking-wide text-steel">{specLabel(key)}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{val}</dd>
                </div>
              ))}
          </dl>

          <button
            onClick={handleAdd}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-tvs-blue px-6 py-4 font-display text-lg font-semibold text-white transition-colors hover:bg-tvs-blue-dark sm:w-auto"
          >
            {added ? <Check size={20} /> : <ShoppingCart size={20} />}
            {added ? 'Ajouté au panier' : 'Ajouter au panier'}
          </button>
          <p className="mt-3 font-mono text-xs text-steel">
            {product.stock} unité(s) disponible(s) en showroom — paiement à la livraison ou au retrait.
          </p>
        </div>
      </div>
    </div>
  )
}

function specLabel(key) {
  const labels = {
    cylindree: 'Cylindrée',
    puissance: 'Puissance',
    poids: 'Poids',
    reservoir: 'Réservoir',
    capacite: 'Capacité',
  }
  return labels[key] || key
}
