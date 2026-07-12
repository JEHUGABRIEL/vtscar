import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { sql } from './db.js'
import { chatReply } from './chatbot.js'
import adminRouter from './admin.js'

const app = express()
app.use(cors())
app.use(express.json())

function generateReference() {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `TVS-${Date.now().toString().slice(-6)}-${rand}`
}

// --- Produits ---
app.get('/api/products', async (req, res) => {
  try {
    const rows = await sql`select * from products order by featured desc, name asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors du chargement du catalogue' })
  }
})

app.get('/api/products/:slug', async (req, res) => {
  try {
    const rows = await sql`select * from products where slug = ${req.params.slug} limit 1`
    if (rows.length === 0) return res.status(404).json({ error: 'Produit introuvable' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// --- Pièces détachées ---
app.get('/api/parts', async (req, res) => {
  try {
    const rows = await sql`select * from parts order by name asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors du chargement des pièces' })
  }
})

// --- Événements ---
app.get('/api/events', async (req, res) => {
  try {
    const rows = await sql`select * from events order by event_date asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors du chargement des événements' })
  }
})

// --- Commandes (pas de paiement en ligne : statut initial "en_attente") ---
app.post('/api/orders', async (req, res) => {
  const { customer, fulfillment, items, total } = req.body

  if (!customer?.nom || !customer?.telephone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Informations de commande incomplètes' })
  }

  try {
    const [createdCustomer] = await sql`
      insert into customers (nom, telephone, quartier)
      values (${customer.nom}, ${customer.telephone}, ${customer.quartier || null})
      returning id
    `

    const reference = generateReference()

    const [order] = await sql`
      insert into orders (reference, customer_id, fulfillment, notes, total)
      values (${reference}, ${createdCustomer.id}, ${fulfillment}, ${customer.notes || null}, ${total})
      returning id, reference
    `

    for (const item of items) {
      await sql`
        insert into order_items (order_id, item_id, item_name, price, qty)
        values (${order.id}, ${item.id}, ${item.name}, ${item.price}, ${item.qty})
      `
    }

    res.status(201).json({ reference: order.reference })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la commande" })
  }
})

// --- Tombola (inscription gratuite) ---
app.post('/api/raffle', async (req, res) => {
  const { nom, telephone, email, quartier, acceptTerms } = req.body

  if (!nom?.trim() || !telephone?.trim()) {
    return res.status(400).json({ error: 'Nom et téléphone requis' })
  }

  if (!acceptTerms) {
    return res.status(400).json({ error: 'Vous devez accepter les conditions de participation' })
  }

  try {
    await sql`
      insert into raffle_entries (nom, telephone, email, quartier, accept_terms)
      values (${nom.trim()}, ${telephone.trim()}, ${email || null}, ${quartier || null}, ${acceptTerms})
    `
    res.status(201).json({ success: true, message: 'Inscription à la tombola réussie !' })
  } catch (err) {
    console.error(err)
    // Violation de l'index unique sur telephone → déjà inscrit
    if (err?.code === '23505') {
      return res.status(409).json({ error: 'Ce numéro de téléphone est déjà inscrit à la tombola. Un seul tirage par personne.' })
    }
    res.status(500).json({ error: "Erreur lors de l'inscription à la tombola" })
  }
})

// --- Chatbot intelligent ---
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages requis' })
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || null
    const result = await chatReply(messages, apiKey)
    res.json(result)
  } catch (err) {
    console.error('[chat] Erreur :', err)
    res.status(500).json({ reply: "Désolé, une erreur s'est produite. Veuillez réessayer ou nous contacter au +236 70 00 00 00." })
  }
})

// Routes admin
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`[server] API TVS Bangui démarrée sur http://localhost:${PORT}`)
})
