import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import {
  siteInfo, navLinks, domains, homeHeroImages,
  events, news, team,
  partners, testimonials, footerLinks,
} from '../src/data/siteData.js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
)

async function seed() {
  console.log('Seeding Supabase...')

  // Domains
  for (const d of domains) {
    const { slug, name, category, icon, shortDescription, heroImage, programs, gallery } = d
    await supabase.from('domains').upsert({
      slug, name, category, icon,
      short_description: shortDescription,
      hero_image: heroImage,
      programs: JSON.parse(JSON.stringify(programs)),
      gallery: JSON.parse(JSON.stringify(gallery)),
      order_index: domains.indexOf(d),
    }, { onConflict: 'slug' })
  }
  console.log(`  ✓ ${domains.length} domains`)

  // Events
  for (const e of events) {
    const { slug, title, description, date, location, image, status, category } = e
    await supabase.from('events').upsert({
      slug, title, description, date, location, image, status, category,
      order_index: events.indexOf(e),
    }, { onConflict: 'slug' })
  }
  console.log(`  ✓ ${events.length} events`)

  // News
  for (const n of news) {
    const { slug, title, excerpt, image, date, tag } = n
    await supabase.from('news').upsert({
      slug, title, excerpt, image, date,
      tags: JSON.parse(JSON.stringify([tag])),
      order_index: news.indexOf(n),
    }, { onConflict: 'slug' })
  }
  console.log(`  ✓ ${news.length} news`)

  // Team
  for (const m of team) {
    const { name, role, image, description, social } = m
    await supabase.from('team').upsert({
      name, role, image, description,
      social: social || {},
      order_index: team.indexOf(m),
    }, { onConflict: 'name' })
  }
  console.log(`  ✓ ${team.length} team members`)

  // Partners
  for (const p of partners) {
    const { name, subtitle, description, logo, initial, color, category, collaboration, website } = p
    await supabase.from('partners').upsert({
      name, subtitle, description, logo, initial, color, category, collaboration, website,
      order_index: partners.indexOf(p),
    }, { onConflict: 'name' })
  }
  console.log(`  ✓ ${partners.length} partners`)

  // Testimonials
  for (const t of testimonials) {
    const { name, role, quote, image } = t
    await supabase.from('testimonials').upsert({
      name, role, quote, image,
      order_index: testimonials.indexOf(t),
    })
  }
  console.log(`  ✓ ${testimonials.length} testimonials`)

  // Configuration des formulaires dynamiques
  const formConfigs = {
    contact: [
      { name: 'firstname', label: 'contact.formFirstName', type: 'text', required: true, placeholder: 'contact.formFirstNamePlaceholder' },
      { name: 'lastname', label: 'contact.formLastName', type: 'text', required: true, placeholder: 'contact.formLastNamePlaceholder' },
      { name: 'email', label: 'contact.formEmail', type: 'email', required: true, placeholder: 'contact.formEmailPlaceholder' },
      { name: 'phone', label: 'contact.formPhone', type: 'tel', required: false, placeholder: 'contact.formPhonePlaceholder' },
      { name: 'subject', label: 'contact.formSubject', type: 'select', required: false, placeholder: 'contact.formSubjectPlaceholder',
        options: ['contact.formSubjectOption1','contact.formSubjectOption2','contact.formSubjectOption3','contact.formSubjectOption4'] },
      { name: 'message', label: 'contact.formMessage', type: 'textarea', required: true, placeholder: 'contact.formMessagePlaceholder' },
    ],
    chatbot: [
      { name: 'firstname', label: 'chatbot.formName', type: 'text', required: true, placeholder: 'chatbot.formName' },
      { name: 'email', label: 'chatbot.formEmail', type: 'email', required: true, placeholder: 'chatbot.formEmail' },
      { name: 'phone', label: 'chatbot.formPhone', type: 'tel', required: false, placeholder: 'chatbot.formPhone' },
      { name: 'message', label: 'chatbot.formMessage', type: 'textarea', required: true, placeholder: 'chatbot.formMessage' },
    ],
  };

  // Site settings
  const settings = [
    { key: 'siteInfo', value: siteInfo },
    { key: 'navLinks', value: navLinks },
    { key: 'homeHeroImages', value: homeHeroImages },
    { key: 'footerLinks', value: footerLinks },
    { key: 'form_configs', value: formConfigs },
  ]
  for (const s of settings) {
    await supabase.from('site_settings').upsert({
      key: s.key,
      value: s.value,
    }, { onConflict: 'key' })
  }
  console.log(`  ✓ ${settings.length} site settings`)

  console.log('Done!')
}

seed().catch(console.error)
