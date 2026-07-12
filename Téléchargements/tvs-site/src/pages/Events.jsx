import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import { EVENTS, formatEventDate } from '../data/events.js'
import HeroSlider from '../components/HeroSlider.jsx'

const EVENTS_SLIDES = EVENTS.map((e) => ({
  image: e.image,
  title: e.title.split('—')[0]?.trim() || e.title,
  titleAccent: e.title.includes('—') ? '— ' + e.title.split('—')[1]?.trim() : '',
  subtitle: formatEventDate(e.date) + ' · ' + e.location,
  description: e.excerpt,
  cta: { text: "Voir l'événement", to: `/evenements/${e.slug}` },
}))

export default function Events() {
  return (
    <div>
      <HeroSlider slides={EVENTS_SLIDES} interval={5000} />

      <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">Événements</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
          Essais, lancements & tournées TVS
        </h1>
        <p className="mt-3 max-w-xl text-steel">
          Retrouvez l'équipe TVS lors des essais gratuits, lancements de nouveaux modèles et tournées
          régionales autour de Bangui.
        </p>

      <div className="mt-10 space-y-5">
        {EVENTS.map((event) => (
          <Link
            key={event.id}
            to={`/evenements/${event.slug}`}
            className="group flex flex-col gap-4 rounded-xl border border-line bg-paper-raised p-6 transition-shadow hover:shadow-lg hover:shadow-ink/5 sm:flex-row sm:items-center"
          >
            <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-tvs-blue-tint sm:w-56">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-semibold text-ink group-hover:text-tvs-blue">
                {event.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wide text-steel">
                <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatEventDate(event.date)}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
              </div>
              <p className="mt-2 text-sm text-steel">{event.excerpt}</p>
            </div>
            <ArrowRight size={20} className="hidden shrink-0 text-tvs-blue sm:block" />
          </Link>
        ))}
      </div>
      </div>
    </div>
  )
}
