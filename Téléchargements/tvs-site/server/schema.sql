-- Schéma Neon/Postgres pour le site TVS Bangui
-- Exécuter via : psql $DATABASE_URL -f schema.sql   (ou node migrate.js)

create table if not exists categories (
  id text primary key,
  label text not null
);

create table if not exists products (
  id text primary key,
  slug text unique not null,
  category text references categories(id),
  name text not null,
  tagline text,
  price integer not null,
  currency text default 'FCFA',
  stock integer default 0,
  featured boolean default false,
  images text[] default '{}',
  specs jsonb default '{}',
  description text,
  created_at timestamptz default now()
);

create table if not exists parts (
  id text primary key,
  slug text unique not null,
  name text not null,
  compatible_models text[] default '{}',
  category text,
  price integer not null,
  currency text default 'FCFA',
  stock integer default 0,
  image text,
  created_at timestamptz default now()
);

create table if not exists events (
  id text primary key,
  slug text unique not null,
  title text not null,
  event_date date not null,
  location text,
  excerpt text,
  description text,
  image text,
  created_at timestamptz default now()
);

create table if not exists customers (
  id serial primary key,
  nom text not null,
  telephone text not null unique,
  quartier text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id serial primary key,
  reference text unique not null,
  customer_id integer references customers(id),
  fulfillment text not null check (fulfillment in ('livraison', 'retrait')),
  notes text,
  total integer not null,
  status text default 'en_attente' check (status in ('en_attente', 'confirmee', 'livree', 'annulee')),
  created_at timestamptz default now()
);

create table if not exists order_items (
  id serial primary key,
  order_id integer references orders(id) on delete cascade,
  item_id text not null,
  item_name text not null,
  price integer not null,
  qty integer not null
);

create table if not exists raffle_entries (
  id serial primary key,
  nom text not null,
  telephone text not null unique,
  email text,
  quartier text,
  accept_terms boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_orders_reference on orders(reference);
