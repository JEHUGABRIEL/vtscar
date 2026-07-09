-- Schema pour LIAM Groupe Supabase

-- Domaines d'intervention
CREATE TABLE domains (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  short_description TEXT,
  description TEXT,
  icon TEXT,
  hero_image TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  objectives JSONB DEFAULT '[]',
  programs JSONB DEFAULT '[]',
  gallery JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Événements
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  end_date TEXT,
  location TEXT,
  image TEXT,
  gallery JSONB DEFAULT '[]',
  status TEXT DEFAULT 'a_venir',
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Actualités
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  gallery JSONB DEFAULT '[]',
  date TEXT,
  tags JSONB DEFAULT '[]',
  author TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Équipe
CREATE TABLE team (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  image TEXT,
  social JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partenaires
CREATE TABLE partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  logo TEXT,
  initial TEXT,
  color TEXT,
  category TEXT,
  collaboration TEXT,
  website TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Témoignages
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Paramètres du site (siteInfo, navLinks, footerLinks, stats, hero images)
-- Inscriptions aux événements
CREATE TABLE registrations (
  id BIGSERIAL PRIMARY KEY,
  event_slug TEXT,
  event_title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'en_attente', -- en_attente | confirme | annule
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_registrations_event_slug ON registrations(event_slug);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);

CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages des formulaires de contact
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  page TEXT DEFAULT 'home',
  is_read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Index
CREATE INDEX idx_domains_slug ON domains(slug);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Administrateurs
CREATE TABLE admins (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_admins_email ON admins(email);

-- Row Level Security (lecture publique pour tous, écriture restreinte)
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Lecture publique (pour le site public)
CREATE POLICY "Lecture publique domains" ON domains FOR SELECT USING (true);
CREATE POLICY "Lecture publique events" ON events FOR SELECT USING (true);
CREATE POLICY "Lecture publique news" ON news FOR SELECT USING (true);
CREATE POLICY "Lecture publique team" ON team FOR SELECT USING (true);
CREATE POLICY "Lecture publique partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Lecture publique testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Lecture publique registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Lecture publique messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Lecture publique site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Lecture publique admins" ON admins FOR SELECT USING (true);

-- Écriture publique (pour le panneau admin — utilise la clé anon)
CREATE POLICY "Écriture publique domains" ON domains FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique domains" ON domains FOR UPDATE USING (true);
CREATE POLICY "Suppression publique domains" ON domains FOR DELETE USING (true);

CREATE POLICY "Écriture publique events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique events" ON events FOR UPDATE USING (true);
CREATE POLICY "Suppression publique events" ON events FOR DELETE USING (true);

CREATE POLICY "Écriture publique news" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique news" ON news FOR UPDATE USING (true);
CREATE POLICY "Suppression publique news" ON news FOR DELETE USING (true);

CREATE POLICY "Écriture publique team" ON team FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique team" ON team FOR UPDATE USING (true);
CREATE POLICY "Suppression publique team" ON team FOR DELETE USING (true);

CREATE POLICY "Écriture publique partners" ON partners FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique partners" ON partners FOR UPDATE USING (true);
CREATE POLICY "Suppression publique partners" ON partners FOR DELETE USING (true);

CREATE POLICY "Écriture publique testimonials" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique testimonials" ON testimonials FOR UPDATE USING (true);
CREATE POLICY "Suppression publique testimonials" ON testimonials FOR DELETE USING (true);

CREATE POLICY "Écriture publique site_settings" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique site_settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Suppression publique site_settings" ON site_settings FOR DELETE USING (true);

CREATE POLICY "Écriture publique messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Suppression publique messages" ON messages FOR DELETE USING (true);

CREATE POLICY "Écriture publique registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique registrations" ON registrations FOR UPDATE USING (true);
CREATE POLICY "Suppression publique registrations" ON registrations FOR DELETE USING (true);

-- Administrateurs (pour le script create-admin.js)
CREATE POLICY "Écriture publique admins" ON admins FOR INSERT WITH CHECK (true);
CREATE POLICY "Modification publique admins" ON admins FOR UPDATE USING (true);
