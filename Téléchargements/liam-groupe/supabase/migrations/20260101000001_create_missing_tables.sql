-- Migration: Création des tables manquantes (registrations, messages)
-- Utilise IF NOT EXISTS pour éviter les conflits avec les tables existantes

-- Inscriptions aux événements
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  event_slug TEXT,
  event_title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'en_attente',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_slug ON registrations(event_slug);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- Messages des formulaires de contact
CREATE TABLE IF NOT EXISTS messages (
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

CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Activer RLS si pas déjà activé
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registrations') THEN
    ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Lecture publique registrations" ON registrations FOR SELECT USING (true);
    CREATE POLICY "Ecriture publique registrations" ON registrations FOR INSERT WITH CHECK (true);
    CREATE POLICY "Modification publique registrations" ON registrations FOR UPDATE USING (true);
    CREATE POLICY "Suppression publique registrations" ON registrations FOR DELETE USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages') THEN
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Lecture publique messages" ON messages FOR SELECT USING (true);
    CREATE POLICY "Ecriture publique messages" ON messages FOR INSERT WITH CHECK (true);
    CREATE POLICY "Modification publique messages" ON messages FOR UPDATE USING (true);
    CREATE POLICY "Suppression publique messages" ON messages FOR DELETE USING (true);
  END IF;
END
$$;
