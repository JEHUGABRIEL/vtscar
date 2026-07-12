# TVS Bangui — Site web

Site vitrine + boutique en ligne + quincaillerie pièces détachées + événements
pour le distributeur TVS à Bangui.

## Stack

- **Frontend** : React 19 + Vite + Tailwind CSS v4, React Router, lucide-react
- **Backend** : Express + Neon (Postgres serverless) via `@neondatabase/serverless`
- Aucun paiement en ligne : le tunnel de commande collecte les infos client et
  crée une commande en base avec le statut `en_attente` (paiement à la livraison
  ou au retrait en showroom).

## Démarrage — Frontend

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:5173. Les appels `/api/*` sont automatiquement
redirigés vers le backend local (voir `vite.config.js`).

Le frontend utilise pour l'instant les données de démonstration dans
`src/data/products.js` et `src/data/events.js`. Pour brancher le vrai catalogue,
remplacer ces imports par des appels à `fetchProducts()` / `fetchEvents()`
(déjà prêts dans `src/lib/api.js`).

## Démarrage — Backend (Neon)

```bash
cd server
npm install
cp .env.example .env
# Renseigner DATABASE_URL avec la chaîne de connexion Neon (Dashboard Neon > Connection string)
npm run migrate   # crée les tables (voir schema.sql)
npm run dev       # démarre l'API sur http://localhost:4000
```

## Structure

```
src/
  components/   Header, Footer, ProductCard, PartCard, SpecGauge (cadran signature)
  pages/        Home, Shop, ProductDetail, Hardware, Cart, Checkout, Events, EventDetail, About
  context/      CartContext (panier en mémoire, useReducer)
  data/         Données de démonstration (à remplacer par l'API Neon)
  lib/api.js    Client API (submitOrder, fetchProducts, fetchEvents)
server/
  index.js      API Express (produits, pièces, événements, commandes)
  schema.sql    Schéma Postgres (products, parts, events, customers, orders, order_items)
  migrate.js    Exécute schema.sql sur la base Neon
```

## Prochaines étapes suggérées

1. Remplacer les données de démo par de vraies photos produit (dossier `public/products`, `public/parts`, `public/events`).
2. Brancher `Shop.jsx` / `Hardware.jsx` / `Events.jsx` sur `fetchProducts()` / `fetchEvents()` au lieu des imports statiques.
3. Ajouter une notification (WhatsApp Business API ou email) déclenchée dans `POST /api/orders` pour alerter le commerçant à chaque nouvelle commande.
4. Dupliquer cette structure pour le site Haojin (gamme, palette rouge/blanc, mêmes modules boutique + quincaillerie).
