import { Router } from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import { sql } from './db.js'
import cloudinary from './cloudinary.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

const router = Router()

// ─── Helper : vérifier le token admin ───────────────────────────────
const expectedToken = process.env.ADMIN_PASSWORD
  ? crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest('hex')
  : null

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !expectedToken || token !== expectedToken) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  next()
}

// ─── Login ──────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD non configuré sur le serveur' })
  }

  if (!password || password !== expected) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  // Générer un token simple (hash du mot de passe)
  const token = crypto.createHash('sha256').update(password).digest('hex')
  res.json({ token, message: 'Connexion réussie' })
})

// ─── Commandes ──────────────────────────────────────────────────────
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query
    const rows = status
      ? await sql`select o.*, c.nom, c.telephone, c.quartier
                   from orders o join customers c on o.customer_id = c.id
                   where o.status = ${status}
                   order by o.created_at desc`
      : await sql`select o.*, c.nom, c.telephone, c.quartier
                   from orders o join customers c on o.customer_id = c.id
                   order by o.created_at desc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement commandes' })
  }
})

router.put('/orders/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body
  const valid = ['en_attente', 'confirmee', 'livree', 'annulee']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' })
  }
  try {
    await sql`update orders set status = ${status} where id = ${req.params.id}`
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur mise à jour statut' })
  }
})

router.get('/orders/:id/items', requireAdmin, async (req, res) => {
  try {
    const rows = await sql`select * from order_items where order_id = ${req.params.id}`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement articles' })
  }
})

// ─── Produits (CRUD) ────────────────────────────────────────────────
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const rows = await sql`select * from products order by featured desc, name asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement produits' })
  }
})

router.post('/products', requireAdmin, async (req, res) => {
  const { id, slug, category, name, tagline, price, stock, featured, description, images, specs } = req.body
  if (!id || !slug || !name || !price) {
    return res.status(400).json({ error: 'Champs requis manquants (id, slug, name, price)' })
  }
  try {
    await sql`
      insert into products (id, slug, category, name, tagline, price, currency, stock, featured, description, images, specs)
      values (${id}, ${slug}, ${category || null}, ${name}, ${tagline || null}, ${price}, 'FCFA', ${stock || 0}, ${!!featured}, ${description || null}, ${images || []}, ${specs ? JSON.stringify(specs) : '{}'})
      on conflict (id) do update set
        slug = excluded.slug, category = excluded.category, name = excluded.name,
        tagline = excluded.tagline, price = excluded.price, stock = excluded.stock,
        featured = excluded.featured, description = excluded.description,
        images = excluded.images, specs = excluded.specs
    `
    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur sauvegarde produit' })
  }
})

router.delete('/products/:id', requireAdmin, async (req, res) => {
  try {
    await sql`delete from products where id = ${req.params.id}`
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur suppression produit' })
  }
})

// ─── Pièces détachées (CRUD) ────────────────────────────────────────
router.get('/parts', requireAdmin, async (req, res) => {
  try {
    const rows = await sql`select * from parts order by name asc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement pièces' })
  }
})

router.post('/parts', requireAdmin, async (req, res) => {
  const { id, slug, name, compatibleModels, category, price, stock, image } = req.body
  if (!id || !slug || !name || !price) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }
  try {
    await sql`
      insert into parts (id, slug, name, compatible_models, category, price, currency, stock, image)
      values (${id}, ${slug}, ${name}, ${compatibleModels || []}, ${category || null}, ${price}, 'FCFA', ${stock || 0}, ${image || null})
      on conflict (id) do update set
        slug = excluded.slug, name = excluded.name,
        compatible_models = excluded.compatible_models, category = excluded.category,
        price = excluded.price, stock = excluded.stock, image = excluded.image
    `
    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur sauvegarde pièce' })
  }
})

router.delete('/parts/:id', requireAdmin, async (req, res) => {
  try {
    await sql`delete from parts where id = ${req.params.id}`
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur suppression pièce' })
  }
})

// ─── Événements (CRUD) ──────────────────────────────────────────────
router.get('/events', requireAdmin, async (req, res) => {
  try {
    const rows = await sql`select * from events order by event_date desc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement événements' })
  }
})

router.post('/events', requireAdmin, async (req, res) => {
  const { id, slug, title, eventDate, location, excerpt, description, image } = req.body
  if (!id || !slug || !title || !eventDate) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }
  try {
    await sql`
      insert into events (id, slug, title, event_date, location, excerpt, description, image)
      values (${id}, ${slug}, ${title}, ${eventDate}, ${location || null}, ${excerpt || null}, ${description || null}, ${image || null})
      on conflict (id) do update set
        slug = excluded.slug, title = excluded.title, event_date = excluded.event_date,
        location = excluded.location, excerpt = excluded.excerpt,
        description = excluded.description, image = excluded.image
    `
    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur sauvegarde événement' })
  }
})

router.delete('/events/:id', requireAdmin, async (req, res) => {
  try {
    await sql`delete from events where id = ${req.params.id}`
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur suppression événement' })
  }
})

// ─── Inscriptions tombola ───────────────────────────────────────────
router.get('/raffle-entries', requireAdmin, async (req, res) => {
  try {
    const rows = await sql`select * from raffle_entries order by created_at desc`
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement inscriptions tombola' })
  }
})

router.delete('/raffle-entries/:id', requireAdmin, async (req, res) => {
  try {
    await sql`delete from raffle_entries where id = ${req.params.id}`
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur suppression inscription' })
  }
})

// ─── Clients ────────────────────────────────────────────────────────
router.get('/customers', requireAdmin, async (req, res) => {
  try {
    const rows = await sql`
      select c.*, count(o.id) as total_orders
      from customers c
      left join orders o on o.customer_id = c.id
      group by c.id
      order by c.created_at desc
    `
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement clients' })
  }
})

// ─── Stats ──────────────────────────────────────────────────────────
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [orderStats] = await sql`
      select count(*)::int as total, count(*) filter (where status = 'en_attente')::int as pending
      from orders
    `
    const [productCount] = await sql`select count(*)::int as total from products`
    const [partsCount] = await sql`select count(*)::int as total from parts`
    const [raffleCount] = await sql`select count(*)::int as total from raffle_entries`
    const [customerCount] = await sql`select count(*)::int as total from customers`

    // Revenu total (commandes confirmées + livrées)
    const [revenue] = await sql`
      select coalesce(sum(total), 0)::int as total
      from orders where status in ('confirmee', 'livree')
    `

    res.json({
      orders: orderStats,
      products: productCount,
      parts: partsCount,
      raffleEntries: raffleCount,
      customers: customerCount,
      revenue: revenue.total,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur chargement statistiques' })
  }
})

// ─── Upload d'image vers Cloudinary ───────────────────────────────────
router.post('/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' })
  }
  try {
    const b64 = req.file.buffer.toString('base64')
    const dataUri = `data:${req.file.mimetype};base64,${b64}`
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'tvs-bangui',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })
    res.json({ url: result.secure_url })
  } catch (err) {
    console.error('[upload] Erreur Cloudinary:', err)
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" })
  }
})

export default router
