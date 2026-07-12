// Client API — pointe vers le backend Express connecté à Neon (voir /server).
// En dev, Vite proxy /api vers http://localhost:4000 (voir vite.config.js si besoin d'ajouter le proxy).

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function submitOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  if (!res.ok) {
    throw new Error("Impossible d'enregistrer la commande")
  }
  return res.json()
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) throw new Error('Impossible de charger le catalogue')
  return res.json()
}

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/events`)
  if (!res.ok) throw new Error('Impossible de charger les événements')
  return res.json()
}
