import { PlusCircle } from 'lucide-react'
import { formatFCFA } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

export default function PartCard({ part }) {
  const { addItem } = useCart()

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper-raised p-5">
      <div className="aspect-square overflow-hidden rounded-lg bg-tvs-blue-tint">
        <img
          src={part.image}
          alt={part.name}
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold leading-tight text-ink">{part.name}</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-steel">
          Compatible : {part.compatibleModels.join(', ')}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="font-display text-base font-bold text-ink">{formatFCFA(part.price)}</span>
        <button
          onClick={() => addItem({
            id: part.id,
            name: part.name,
            price: part.price,
            currency: part.currency,
            image: part.image,
            kind: 'part',
          })}
          className="flex items-center gap-1.5 rounded-full border border-tvs-blue px-3 py-1.5 text-sm font-medium text-tvs-blue transition-colors hover:bg-tvs-blue hover:text-white"
        >
          <PlusCircle size={15} />
          Ajouter
        </button>
      </div>
    </div>
  )
}
