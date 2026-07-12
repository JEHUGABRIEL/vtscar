import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, MapPin, ChevronLeft, ChevronRight, Star, Gauge, Sparkles } from 'lucide-react'
import { PRODUCTS, PARTS, formatFCFA } from '../data/products.js'
import { EVENTS, formatEventDate } from '../data/events.js'
import { TESTIMONIALS } from '../data/testimonials.js'
import ProductCard from '../components/ProductCard.jsx'
import PartCard from '../components/PartCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import TestimonialSlider from '../components/TestimonialSlider.jsx'
import TombolaForm from '../components/TombolaForm.jsx'

const featured = PRODUCTS.filter((p) => p.featured)
const newArrivals = PRODUCTS.filter((p) => p.isNew)
const featuredParts = PARTS.filter((p) => p.featured)

const HERO_SLIDES = PRODUCTS.filter((p) => p.featured).map((p) => {
  const subtitles = {
    'tvs-apache-rtr-160': 'Sportive · Freinage ABS',
    'tvs-raider-125': 'Populaire · 125 cc',
    'tvs-ntorq-125': 'Scooter · Connecté',
    'tvs-king-cargo': 'Utilitaire · 3 roues',
  }
  return {
    image: p.images[0],
    title: p.name.split(' ').slice(2).join(' ') || p.name,
    titleAccent: p.name.includes('Apache') ? 'RTR 160' : p.name.includes('Raider') ? '125' : p.name.includes('Ntorq') ? '125' : '',
    subtitle: subtitles[p.id] || 'Distributeur officiel · Bangui',
    description: p.tagline + '. ' + (p.description ? p.description.split('.')[0] + '.' : ''),
    cta: { text: 'Voir les produits', to: '/produits' },
  }
})

// Les 3 événements phares du moment
const HIGHLIGHT_EVENTS = [
  EVENTS.find((e) => e.id === 'coupe-du-monde-2026'),
  EVENTS.find((e) => e.id === 'essai-libre-pk0'),
  EVENTS.find((e) => e.id === 'tombola-tvs'),
].filter(Boolean)

export default function Home() {
  const [eventSlide, setEventSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tombolaOpen, setTombolaOpen] = useState(false)
  const [newSlide, setNewSlide] = useState(0)
  const timerRef = useRef(null)
  const newTimerRef = useRef(null)
  const len = HIGHLIGHT_EVENTS.length
  const newLen = newArrivals.length

  const next = useCallback(() => {
    setEventSlide((c) => (c + 1) % len)
  }, [len])

  // Auto-play events
  useEffect(() => {
    if (paused || len <= 1) return
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [paused, len, next])

  // Auto-play new arrivals
  useEffect(() => {
    if (newLen <= 1) return
    newTimerRef.current = setInterval(() => {
      setNewSlide((c) => (c + 1) % newLen)
    }, 4000)
    return () => clearInterval(newTimerRef.current)
  }, [newLen])

  return (
    <div>
      {/* HERO — Carrousel de la gamme vedette */}
      <HeroSlider slides={HERO_SLIDES} interval={5000} fullHeight />

      {/* NOUVEAUTÉS — Derniers arrivages */}
      {newLen > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-12 lg:px-8">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tvs-red/10">
                <Sparkles size={20} className="text-tvs-red" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">
                  Nouveautés
                </p>
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  Derniers arrivages
                </h2>
              </div>
            </div>
            <Link
              to="/produits"
              className="hidden items-center gap-1.5 text-sm font-medium text-tvs-blue hover:underline sm:flex"
            >
              Tout voir <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative mt-8">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${newSlide * 100}%)` }}
              >
                {newArrivals.map((product) => (
                  <div key={product.id} className="flex w-full shrink-0 gap-6">
                    <Link
                      to={`/produits/${product.slug}`}
                      className="group relative flex w-full items-center overflow-hidden rounded-xl bg-gradient-to-br from-tvs-blue-tint to-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
                    >
                      {/* Badge Nouveau */}
                      <span className="absolute left-4 top-4 z-10 rounded-full bg-tvs-red px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                        Nouveau
                      </span>

                      {/* Image */}
                      <div className="relative z-10 w-32 shrink-0 sm:w-40">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      </div>

                      {/* Infos */}
                      <div className="relative z-10 ml-4 flex-1 sm:ml-6">
                        <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-steel">{product.tagline}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="font-display text-lg font-bold text-tvs-red">
                            {formatFCFA(product.price)}
                          </span>
                          {product.specs?.vitesseMax && (
                            <span className="flex items-center gap-1 text-xs text-steel">
                              <Gauge size={13} />
                              {product.specs.vitesseMax} km/h
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-steel">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            {product.stock} en stock
                          </span>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-tvs-blue opacity-0 transition-opacity group-hover:opacity-100">
                          Découvrir <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {newLen > 1 && (
              <div className="mt-5 flex items-center justify-center gap-1.5">
                {newArrivals.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Aller au produit ${i + 1}`}
                    onClick={() => setNewSlide(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === newSlide
                        ? 'h-2 w-6 bg-tvs-red'
                        : 'h-2 w-2 bg-ink/20 hover:bg-ink/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* GAMME EN VEDETTE */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Gamme en vedette</h2>
          <Link to="/produits" className="hidden items-center gap-1.5 font-medium text-tvs-blue hover:underline sm:flex">
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* QUINCAILLERIE EN VEDETTE */}
      {featuredParts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">
                Quincaillerie
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                Pièces détachées
                <br />
                <span className="text-tvs-red">en vedette</span>
              </h2>
            </div>
            <Link
              to="/quincaillerie"
              className="hidden items-center gap-1.5 font-medium text-tvs-blue hover:underline sm:flex"
            >
              Tout voir <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredParts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIAUX CLIENTS — CARROUSEL */}
      <TestimonialSlider testimonials={TESTIMONIALS} interval={5000} />

      {/* ÉVÉNEMENTS À LA UNE — CARROUSEL */}
      {len > 0 && (
        <section
          className="mx-auto max-w-7xl px-5 pb-20 lg:px-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">
                À la une
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                Événements
                <br />
                <span className="text-tvs-red">TVS</span>
              </h2>
            </div>
            <Link
              to="/evenements"
              className="hidden items-center gap-1.5 font-medium text-tvs-blue hover:underline sm:flex"
            >
              Tout voir <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative mt-10">
            {/* Slides */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${eventSlide * 100}%)` }}
              >
                {HIGHLIGHT_EVENTS.map((event) => (
                  <div key={event.id} className="flex w-full shrink-0">
                    <div className="relative grid w-full overflow-hidden rounded-2xl bg-tvs-blue-tint md:grid-cols-[1fr_auto]">
                      {/* Image */}
                      <div className="absolute inset-0 md:relative md:order-last md:w-72 lg:w-96">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover opacity-20 md:opacity-100"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                        {/* Overlay sur mobile */}
                        <div className="absolute inset-0 bg-gradient-to-r from-tvs-blue-tint/90 to-tvs-blue-tint/10 md:hidden" />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-8 md:p-10 lg:p-12">
                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-blue">
                          {formatEventDate(event.date)}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                          {event.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-steel">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={15} /> {formatEventDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={15} /> {event.location}
                          </span>
                        </div>
                        <p className="mt-4 max-w-xl text-steel">{event.excerpt}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            to={`/evenements/${event.slug}`}
                            className="flex items-center gap-2 rounded-full bg-tvs-blue px-6 py-3 font-display text-lg font-semibold text-white transition-colors hover:bg-tvs-blue-dark"
                          >
                            Détails
                            <ArrowRight size={18} />
                          </Link>
                          {event.id === 'tombola-tvs' && (
                            <button
                              onClick={() => setTombolaOpen(true)}
                              className="flex items-center gap-2 rounded-full border-2 border-tvs-red bg-tvs-red px-6 py-3 font-display text-lg font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-tvs-red/30"
                            >
                              Participer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {len > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                  {HIGHLIGHT_EVENTS.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Aller à l'événement ${i + 1}`}
                      onClick={() => setEventSlide(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === eventSlide
                          ? 'h-3 w-8 bg-tvs-red shadow-lg shadow-tvs-red/40'
                          : 'h-3 w-3 bg-ink/30 hover:bg-ink/60'
                      }`}
                    />                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal d'inscription à la tombola */}
      <TombolaForm open={tombolaOpen} onClose={() => setTombolaOpen(false)} />
    </div>
  )
}
