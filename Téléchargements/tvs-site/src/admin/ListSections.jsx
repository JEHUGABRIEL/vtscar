import { useState, useEffect } from 'react'
import { Gift, Users } from 'lucide-react'
import { adminFetch, formatDate } from './helpers'

export function RaffleSection() {
  const [entries, setEntries] = useState([])
  useEffect(() => { adminFetch('/raffle-entries').then(setEntries) }, [])

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl font-bold text-white">Inscriptions Tombola</h2>
      <p className="mt-1 font-mono text-xs text-white/40">{entries.length} inscription(s)</p>
      <div className="mt-4 space-y-1">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center gap-4 rounded-lg border border-white/10 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{e.nom}</p>
              <p className="font-mono text-[11px] text-white/40">{e.telephone} \u00b7 {e.email || '-'} \u00b7 {e.quartier || '-'}</p>
            </div>
            <span className="font-mono text-[10px] text-white/30">{formatDate(e.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CustomersSection() {
  const [customers, setCustomers] = useState([])
  useEffect(() => { adminFetch('/customers').then(setCustomers) }, [])

  return (
    <div className="mt-8">
      <h2 className="font-display text-xl font-bold text-white">Clients</h2>
      <p className="mt-1 font-mono text-xs text-white/40">{customers.length} client(s)</p>
      <div className="mt-4 space-y-1">
        {customers.map((c) => (
          <div key={c.id} className="flex items-center gap-4 rounded-lg border border-white/10 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{c.nom}</p>
              <p className="font-mono text-[11px] text-white/40">{c.telephone} \u00b7 {c.quartier || '-'}</p>
            </div>
            <span className="font-mono text-xs text-white/40">{c.total_orders} commande(s)</span>
            <span className="font-mono text-[10px] text-white/30">{formatDate(c.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
