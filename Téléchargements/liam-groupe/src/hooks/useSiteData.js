import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase.js'
import { useTranslation } from 'react-i18next'
import { computeEventStatus } from '../lib/utils.js'
import {
  siteInfo as fallbackSiteInfoFr,
  navLinks as fallbackNavLinksFr,
  domains as fallbackDomainsFr,
  homeHeroImages as fallbackHomeHeroImages,
  events as fallbackEventsFr,
  news as fallbackNewsFr,
  team as fallbackTeamFr,
  partners as fallbackPartnersFr,
  testimonials as fallbackTestimonialsFr,
  footerLinks as fallbackFooterLinksFr,
  img,
} from '../data/siteData.js'
import {
  siteInfo as fallbackSiteInfoEn,
  navLinks as fallbackNavLinksEn,
  domains as fallbackDomainsEn,
  events as fallbackEventsEn,
  news as fallbackNewsEn,
  team as fallbackTeamEn,
  partners as fallbackPartnersEn,
  testimonials as fallbackTestimonialsEn,
  footerLinks as fallbackFooterLinksEn,
} from '../data/siteData.en.js'

const STALE_TIME = 5 * 60 * 1000

function useFallback(frData, enData) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  return { data: lang === 'en' ? enData : frData, lang }
}

async function fetchSetting(key, fallback) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  return error ? fallback : data.value
}

async function fetchAll(table, fallback) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('order_index')
  if (error || !data || data.length === 0) return fallback
  return data
}

export function useSiteInfo() {
  const { data: fallback, lang } = useFallback(fallbackSiteInfoFr, fallbackSiteInfoEn)
  return useQuery({
    queryKey: ['siteInfo', lang],
    queryFn: async () => {
      const data = await fetchSetting('siteInfo', fallback)
      // Surcharger les emails avec la bonne adresse
      if (data) {
        return {
          ...data,
          emails: ['liamgroupe236@gmail.com'],
          contactPage: data.contactPage ? {
            ...data.contactPage,
            emails: ['liamgroupe236@gmail.com'],
          } : undefined,
        }
      }
      return data
    },
    staleTime: STALE_TIME,
  })
}

export function useNavLinks() {
  const { data: fallback, lang } = useFallback(fallbackNavLinksFr, fallbackNavLinksEn)
  return useQuery({
    queryKey: ['navLinks', lang],
    queryFn: () => fetchSetting('navLinks', fallback),
    staleTime: STALE_TIME,
  })
}

export function useDomains() {
  const { data: fallback, lang } = useFallback(fallbackDomainsFr, fallbackDomainsEn)
  return useQuery({
    queryKey: ['domains', lang],
    queryFn: () => fetchAll('domains', fallback),
    staleTime: STALE_TIME,
  })
}

export function useDomain(slug) {
  const { data: fallback, lang } = useFallback(fallbackDomainsFr, fallbackDomainsEn)
  return useQuery({
    queryKey: ['domain', slug, lang],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) return fallback.find((d) => d.slug === slug) || null
      // Fusion : on complète les données Supabase avec le fallback local
      // car certains champs (restaurantInfo, menu, cardImage, pricing,
      // trainers, schedule) n'ont pas de colonne dédiée dans la DB et
      // ne sont disponibles que dans les données statiques locales.
      const local = fallback.find((d) => d.slug === slug) || {}
      return {
        ...data,
        shortDescription: data.short_description ?? local.shortDescription,
        heroImage: data.hero_image ?? local.heroImage,
        // Champs spécifiques aux domaines personnalisés (O'GAB, G-Fitness, …)
        // qui ne sont pas encore dans le schéma de la table `domains`.
        cardImage: local.cardImage,
        restaurantInfo: local.restaurantInfo,
        menu: local.menu,
        pricing: local.pricing,
        trainers: local.trainers,
        schedule: local.schedule,
      }
    },
    staleTime: STALE_TIME,
  })
}

export function useHomeHeroImages() {
  return useQuery({
    queryKey: ['homeHeroImages'],
    queryFn: () => fetchSetting('homeHeroImages', fallbackHomeHeroImages),
    staleTime: STALE_TIME,
  })
}

export function useEvents() {
  const { data: fallback, lang } = useFallback(fallbackEventsFr, fallbackEventsEn)
  return useQuery({
    queryKey: ['events', lang],
    queryFn: async () => {
      const data = await fetchAll('events', fallback);
      if (!Array.isArray(data)) return data;
      // Corrige automatiquement le statut des événements dont la date est passée
      return data.map((evt) => {
        const correctStatus = computeEventStatus(evt.date, evt.status, evt.end_date);
        if (correctStatus !== evt.status && evt.id) {
          // Mise à jour en base de façon silencieuse (fire-and-forget)
          supabase.from('events').update({ status: correctStatus }).eq('id', evt.id).then().catch((err) => console.error('useSiteData — Erreur mise à jour statut événement:', err));
        }
        return { ...evt, status: correctStatus };
      });
    },
    staleTime: STALE_TIME,
  })
}

export function useNews() {
  const { data: fallback, lang } = useFallback(fallbackNewsFr, fallbackNewsEn)
  return useQuery({
    queryKey: ['news', lang],
    queryFn: () => fetchAll('news', fallback),
    staleTime: STALE_TIME,
  })
}

export function useTeam() {
  const { data: fallback, lang } = useFallback(fallbackTeamFr, fallbackTeamEn)
  return useQuery({
    queryKey: ['team', lang],
    queryFn: () => fetchAll('team', fallback),
    staleTime: STALE_TIME,
  })
}

export function usePartners() {
  const { data: fallback, lang } = useFallback(fallbackPartnersFr, fallbackPartnersEn)
  return useQuery({
    queryKey: ['partners', lang],
    queryFn: () => fetchAll('partners', fallback),
    staleTime: STALE_TIME,
  })
}

export function useTestimonials() {
  const { data: fallback, lang } = useFallback(fallbackTestimonialsFr, fallbackTestimonialsEn)
  return useQuery({
    queryKey: ['testimonials', lang],
    queryFn: () => fetchAll('testimonials', fallback),
    staleTime: STALE_TIME,
  })
}

export function useFooterLinks() {
  const { data: fallback, lang } = useFallback(fallbackFooterLinksFr, fallbackFooterLinksEn)
  return useQuery({
    queryKey: ['footerLinks', lang],
    queryFn: () => fetchSetting('footerLinks', fallback),
    staleTime: STALE_TIME,
  })
}

export { img }
