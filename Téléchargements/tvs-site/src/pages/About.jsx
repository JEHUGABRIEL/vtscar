import { MapPin, Phone, Clock, Wrench, ShieldCheck, Truck } from 'lucide-react'
import HeroSlider from '../components/HeroSlider.jsx'
import TVSMap from '../components/TVSMap.jsx'
import { placeholderImg } from '../lib/placeholders.js'

const POINTS = [
  { icon: ShieldCheck, title: 'Distributeur officiel', text: 'Véhicules TVS neufs avec garantie constructeur.' },
  { icon: Wrench, title: 'Pièces & entretien', text: 'Pièces détachées en stock et service après-vente sur place.' },
  { icon: Truck, title: 'Livraison à Bangui', text: 'Livraison dans les principaux quartiers, retrait showroom possible.' },
]

const ABOUT_SLIDES = [
  {
    image: placeholderImg('marque'),
    title: 'TVS Motor',
    titleAccent: 'à Bangui',
    subtitle: 'À propos · Distributeur officiel',
    description: 'Nouveau distributeur TVS Motor à Bangui, proposant motos, scooters et tricycles utilitaires adaptés aux besoins de mobilité en RCA.',
    cta: { text: 'Nous contacter', to: '/a-propos' },
  },
  {
    image: placeholderImg('qualite'),
    title: 'Qualité &',
    titleAccent: 'fiabilité',
    subtitle: 'Notre engagement',
    description: 'Des véhicules TVS neufs avec garantie constructeur et un service après-vente sur place pour votre tranquillité.',
    cta: { text: 'Découvrir la gamme', to: '/produits' },
  },
  {
    image: placeholderImg('livraison'),
    title: 'Livraison &',
    titleAccent: 'retrait',
    subtitle: 'Service client',
    description: 'Livraison dans les principaux quartiers de Bangui ou retrait gratuit dans notre showroom sur l\'Avenue de l\'Indépendance.',
    cta: { text: 'Nous trouver', to: '/a-propos' },
  },
]

export default function About() {
  return (
    <div>
      <HeroSlider slides={ABOUT_SLIDES} interval={5000} />

      <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">À propos</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          TVS à Bangui
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-steel">
          Nouveau distributeur TVS Motor à Bangui, proposant motos, scooters et tricycles utilitaires
          adaptés aux besoins de mobilité et de transport en République Centrafricaine.
        </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {POINTS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-line bg-paper-raised p-6">
            <Icon size={22} className="text-tvs-red" />
            <h3 className="mt-3 font-display text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-steel">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-line bg-paper-raised p-8">
          <h2 className="font-display text-2xl font-bold text-ink">Contact & showroom</h2>
          <ul className="mt-4 space-y-3 text-ink/85">
            <li className="flex items-center gap-2.5"><MapPin size={18} className="text-tvs-red shrink-0" /> Avenue de l'Indépendance, PK0, Bangui</li>
            <li className="flex items-center gap-2.5"><Phone size={18} className="text-tvs-red shrink-0" /> +236 70 00 00 00</li>
            <li className="flex items-center gap-2.5"><Clock size={18} className="text-tvs-red shrink-0" /> Lundi–Samedi, 8h–18h</li>
          </ul>
        </div>

        {/* Carte Leaflet TVS */}
        <div className="group relative overflow-hidden rounded-xl border border-line shadow-sm transition-shadow hover:shadow-lg">
          <div className="aspect-[4/3] w-full lg:aspect-auto lg:h-full">
            <TVSMap />
          </div>
          {/* Lien ouvrir dans Google Maps */}
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Avenue+de+l%27Ind%C3%A9pendance+PK0+Bangui"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-0 left-0 right-0 z-[1000] flex items-center justify-center gap-2 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-4 pt-10 text-sm font-medium text-white opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <MapPin size={16} className="text-tvs-red" />
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
      </div>
    </div>
  )
}
