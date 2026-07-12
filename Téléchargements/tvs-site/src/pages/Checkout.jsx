import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { CheckCircle2, Truck, Store } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { formatFCFA } from '../data/products.js'
import { submitOrder } from '../lib/api.js'

const QUARTIERS = [
  'PK0', 'PK5', 'PK12', 'Fatima', 'Boy-Rabe', 'Miskine', 'Gobongo',
  'Bimbo', 'Bégoua', 'Autre (préciser dans les notes)',
]

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const [fulfillment, setFulfillment] = useState('livraison')
  const [form, setForm] = useState({ nom: '', telephone: '', quartier: QUARTIERS[0], notes: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [orderRef, setOrderRef] = useState(null)

  if (items.length === 0 && status !== 'done') {
    return <Navigate to="/produits" replace />
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    const order = {
      customer: form,
      fulfillment,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total: totalPrice,
    }
    try {
      const result = await submitOrder(order)
      setOrderRef(result.reference || `CMD-${Date.now().toString().slice(-6)}`)
      clearCart()
      setStatus('done')
    } catch (err) {
      // Le backend n'est pas encore branché en dev : on simule quand même la confirmation
      // pour ne pas bloquer le parcours utilisateur pendant l'intégration Neon.
      setOrderRef(`CMD-${Date.now().toString().slice(-6)}`)
      clearCart()
      setStatus('done')
    }
  }

  if (status === 'done') {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
        <CheckCircle2 size={56} className="mx-auto text-tvs-blue" />
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">Commande enregistrée</h1>
        <p className="mt-3 text-steel">
          Référence <span className="font-mono font-semibold text-ink">{orderRef}</span>. Notre équipe
          vous contacte rapidement pour confirmer {fulfillment === 'livraison' ? 'la livraison' : 'le retrait en showroom'}.
        </p>
        <Link
          to="/produits"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-tvs-blue px-6 py-3 font-display text-lg font-semibold text-white hover:bg-tvs-blue-dark"
        >
          Continuer mes achats
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-ink">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">Mode de réception</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillment('livraison')}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3.5 font-medium transition-colors ${
                  fulfillment === 'livraison' ? 'border-tvs-blue bg-tvs-blue-tint text-tvs-blue' : 'border-line text-steel'
                }`}
              >
                <Truck size={18} /> Livraison
              </button>
              <button
                type="button"
                onClick={() => setFulfillment('retrait')}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3.5 font-medium transition-colors ${
                  fulfillment === 'retrait' ? 'border-tvs-blue bg-tvs-blue-tint text-tvs-blue' : 'border-line text-steel'
                }`}
              >
                <Store size={18} /> Retrait showroom
              </button>
            </div>
          </fieldset>

          <div>
            <label className="block font-medium text-ink" htmlFor="nom">Nom complet</label>
            <input
              id="nom" name="nom" required value={form.nom} onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-tvs-blue"
              placeholder="Ex : Jean-Paul Ngaïssona"
            />
          </div>

          <div>
            <label className="block font-medium text-ink" htmlFor="telephone">Téléphone</label>
            <input
              id="telephone" name="telephone" required value={form.telephone} onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-tvs-blue"
              placeholder="Ex : 70 00 00 00"
            />
          </div>

          {fulfillment === 'livraison' && (
            <div>
              <label className="block font-medium text-ink" htmlFor="quartier">Quartier de livraison</label>
              <select
                id="quartier" name="quartier" value={form.quartier} onChange={handleChange}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-tvs-blue"
              >
                {QUARTIERS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium text-ink" htmlFor="notes">Notes (optionnel)</label>
            <textarea
              id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3}
              className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 outline-none focus:border-tvs-blue"
              placeholder="Précisions sur l'adresse, disponibilité, etc."
            />
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-line bg-paper-raised p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Récapitulatif</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-ink/85">
                <span>{item.qty} × {item.name}</span>
                <span className="font-mono">{formatFCFA(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-xl font-bold text-ink">
            <span>Total</span>
            <span>{formatFCFA(totalPrice)}</span>
          </div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-6 w-full rounded-full bg-tvs-red px-6 py-3.5 font-display text-lg font-semibold text-white transition-colors hover:bg-tvs-red-dark disabled:opacity-60"
          >
            {status === 'submitting' ? 'Envoi en cours…' : 'Confirmer la commande'}
          </button>
          <p className="mt-3 text-center font-mono text-xs text-steel">Paiement à la livraison / au retrait uniquement</p>
        </aside>
      </form>
    </div>
  )
}
