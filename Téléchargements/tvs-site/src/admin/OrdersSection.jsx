import { useState, useEffect } from 'react'
import {
  CheckCircle, XCircle, Truck, ChevronDown, Loader2,
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { adminFetch, formatFCFA, formatDate, formatDateTime, STATUS_LABELS, STATUS_COLORS } from './helpers'
import AdminFormModal from './AdminFormModal'

export default function OrdersSection() {
  const addToast = useToast()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [items, setItems] = useState({})
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => { loadOrders() }, [filter])
  const loadOrders = async () => {
    const q = filter ? `?status=${filter}` : ''
    const data = await adminFetch(`/orders${q}`)
    setOrders(data)
  }

  const updateStatus = async (id, status) => {
    setProcessingId(id)
    try {
      await adminFetch(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      const label = STATUS_LABELS[status] || status
      addToast({ type: 'success', message: `Commande ${id} marquée « ${label} »` })
      loadOrders()
    } catch {
      addToast({ type: 'error', message: `Erreur lors du changement de statut` })
    } finally {
      setProcessingId(null)
    }
  }

  const openDetail = async (id) => {
    setExpanded(id)
    if (!items[id]) {
      const data = await adminFetch(`/orders/${id}/items`)
      setItems((prev) => ({ ...prev, [id]: data }))
    }
  }

  const closeDetail = () => setExpanded(null)

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl font-bold text-white">Commandes</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-mono text-xs text-white/70 outline-none"
        >
          <option value="">Toutes</option>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {orders.length === 0 && (
          <p className="py-8 text-center text-sm text-white/40">Aucune commande trouvée</p>
        )}
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-white/10 bg-white/5">
            <button
              onClick={() => openDetail(o.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/40">{o.reference}</span>
                <span className="hidden text-sm font-medium text-white sm:block">{o.nom}</span>
                <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${STATUS_COLORS[o.status] || 'bg-white/10 text-white/60'}`}>
                  {STATUS_LABELS[o.status] || o.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-semibold text-white">{formatFCFA(o.total)}</span>
                <span className="font-mono text-[10px] text-white/30">{formatDate(o.created_at)}</span>
                <ChevronDown size={16} className="text-white/40" />
              </div>
            </button>

            <AdminFormModal open={expanded === o.id} onClose={closeDetail} title={`Commande ${o.reference}`}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${STATUS_COLORS[o.status] || 'bg-white/10 text-white/60'}`}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                  <span className="font-display text-sm font-bold text-white">{formatFCFA(o.total)}</span>
                </div>

                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Client</p>
                    <p className="text-white">{o.nom}</p>
                    <p className="text-white/60">{o.telephone}</p>
                    {o.quartier && <p className="text-white/60">{o.quartier}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Infos</p>
                    <p className="text-white/60">Mode : {o.fulfillment === 'livraison' ? 'Livraison' : 'Retrait showroom'}</p>
                    <p className="text-white/60">Passée le : {formatDateTime(o.created_at)}</p>
                    {o.notes && <p className="text-white/60">Notes : {o.notes}</p>}
                  </div>
                </div>

                {items[o.id] && items[o.id].length > 0 && (
                  <div className="rounded-lg border border-white/10 bg-zinc-800/80 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Articles</p>
                    <div className="mt-2 divide-y divide-white/5">
                      {items[o.id].map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1.5 text-sm">
                          <span className="text-white/80">{item.qty}× {item.item_name}</span>
                          <span className="font-mono text-white/60">{formatFCFA(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {o.status === 'en_attente' && (
                    <button
                      onClick={() => updateStatus(o.id, 'confirmee')}
                      disabled={processingId === o.id}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        processingId === o.id
                          ? 'cursor-not-allowed bg-blue-500/10 text-blue-400/60'
                          : 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25'
                      }`}
                    >
                      {processingId === o.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      {processingId === o.id ? 'Mis à jour…' : 'Confirmer'}
                    </button>
                  )}
                  {o.status === 'confirmee' && (
                    <button
                      onClick={() => updateStatus(o.id, 'livree')}
                      disabled={processingId === o.id}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        processingId === o.id
                          ? 'cursor-not-allowed bg-green-500/10 text-green-400/60'
                          : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                      }`}
                    >
                      {processingId === o.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Truck size={14} />
                      )}
                      {processingId === o.id ? 'Mis à jour…' : 'Marquer livrée'}
                    </button>
                  )}
                  {!['livree', 'annulee'].includes(o.status) && (
                    <button
                      onClick={() => updateStatus(o.id, 'annulee')}
                      disabled={processingId === o.id}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        processingId === o.id
                          ? 'cursor-not-allowed bg-red-500/10 text-red-400/60'
                          : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                      }`}
                    >
                      {processingId === o.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {processingId === o.id ? 'Mis à jour…' : 'Annuler'}
                    </button>
                  )}
                </div>
              </div>
            </AdminFormModal>
          </div>
        ))}
      </div>
    </div>
  )
}
