import { getAdminToken, clearAdminToken } from '../pages/AdminLogin'
import { ShoppingCart, Package, Settings, CalendarDays, Users, Gift, BarChart3 } from 'lucide-react'

const API = '/api/admin'

export async function adminFetch(path, options = {}) {
  const token = getAdminToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
  if (res.status === 401) {
    clearAdminToken()
    window.location.href = '/admin/login'
    throw new Error('Session expirée')
  }
  return res.json()
}

export const formatFCFA = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
export const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { dateStyle: 'short' })
export const formatDateTime = (d) => new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })

export const STATUS_LABELS = { en_attente: 'En attente', confirmee: 'Confirmée', livree: 'Livrée', annulee: 'Annulée' }
export const STATUS_COLORS = { en_attente: 'bg-amber-500/20 text-amber-400', confirmee: 'bg-blue-500/20 text-blue-400', livree: 'bg-green-500/20 text-green-400', annulee: 'bg-red-500/20 text-red-400' }

export const TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
  { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'parts', label: 'Pièces', icon: Settings },
  { id: 'events', label: 'Événements', icon: CalendarDays },
  { id: 'raffle', label: 'Tombola', icon: Gift },
  { id: 'customers', label: 'Clients', icon: Users },
]
