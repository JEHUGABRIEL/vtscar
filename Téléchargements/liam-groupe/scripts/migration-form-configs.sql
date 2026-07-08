-- Migration : Ajout de la colonne `data` à la table `messages`
-- et insertion de la configuration par défaut des formulaires dynamiques.

-- 1. Ajouter la colonne data si elle n'existe pas déjà
ALTER TABLE messages ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}';

-- 2. Insérer (ou mettre à jour) la configuration des formulaires
INSERT INTO site_settings (key, value)
VALUES ('form_configs', '{
  "contact": [
    {"name": "firstname", "label": "contact.formFirstName", "type": "text", "required": true, "placeholder": "contact.formFirstNamePlaceholder"},
    {"name": "lastname", "label": "contact.formLastName", "type": "text", "required": true, "placeholder": "contact.formLastNamePlaceholder"},
    {"name": "email", "label": "contact.formEmail", "type": "email", "required": true, "placeholder": "contact.formEmailPlaceholder"},
    {"name": "phone", "label": "contact.formPhone", "type": "tel", "required": false, "placeholder": "contact.formPhonePlaceholder"},
    {"name": "subject", "label": "contact.formSubject", "type": "select", "required": false, "placeholder": "contact.formSubjectPlaceholder", "options": ["contact.formSubjectOption1", "contact.formSubjectOption2", "contact.formSubjectOption3", "contact.formSubjectOption4"]},
    {"name": "message", "label": "contact.formMessage", "type": "textarea", "required": true, "placeholder": "contact.formMessagePlaceholder"}
  ],
  "chatbot": [
    {"name": "firstname", "label": "chatbot.formName", "type": "text", "required": true, "placeholder": "chatbot.formName"},
    {"name": "email", "label": "chatbot.formEmail", "type": "email", "required": true, "placeholder": "chatbot.formEmail"},
    {"name": "phone", "label": "chatbot.formPhone", "type": "tel", "required": false, "placeholder": "chatbot.formPhone"},
    {"name": "message", "label": "chatbot.formMessage", "type": "textarea", "required": true, "placeholder": "chatbot.formMessage"}
  ]
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. Vérification
SELECT key, value->>'contact' AS contact_exists, value->>'chatbot' AS chatbot_exists
FROM site_settings
WHERE key = 'form_configs';
