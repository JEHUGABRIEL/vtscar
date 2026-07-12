import { ShoppingCart, Clock, Package, Settings, Gift, Users, DollarSign } from 'lucide-react'
import { formatFCFA } from './helpers'

export default function Overview({ stats }) {
  const cards = [
    { label: 'Commandes totales', value: stats.orders.total, icon: ShoppingCart, color: 'text-blue-400' },
    { label: 'En attente', value: stats.orders.pending, icon: Clock, color: 'text-amber-400' },
    { label: 'Produits', value: stats.products.total, icon: Package, color: 'text-emerald-400' },
    { label: 'Pièces', value: stats.parts.total, icon: Settings, color: 'text-violet-400' },
    { label: 'Tombola', value: stats.raffleEntries, icon: Gift, color: 'text-pink-400' },
    { label: 'Clients', value: stats.customers.total, icon: Users, color: 'text-cyan-400' },
    { label: 'Revenu', value: formatFCFA(stats.revenue), icon: DollarSign, color: 'text-green-400', big: true },
  ]

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div key={c.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">{c.label}</p>
                <p className={`mt-1 font-display font-bold ${c.big ? 'text-lg' : 'text-2xl'} text-white`}>
                  {c.value}
                </p>
              </div>
              <Icon size={22} className={`${c.color} opacity-60`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
