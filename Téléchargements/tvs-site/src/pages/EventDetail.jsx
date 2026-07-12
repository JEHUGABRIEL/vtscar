import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, CalendarDays, MapPin, Gift } from 'lucide-react'
import { EVENTS, formatEventDate } from '../data/events.js'
import TombolaForm from '../components/TombolaForm.jsx'

export default function EventDetail() {
  const { slug } = useParams()
  const [tombolaOpen, setTombolaOpen] = useState(false)
  const event = EVENTS.find((e) => e.slug === slug)
  const isTombola = event?.id === 'tombola-tvs'

  if (!event) return <Navigate to="/evenements" replace />

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <Link to="/evenements" className="flex items-center gap-1.5 font-medium text-tvs-blue hover:underline">
        <ChevronLeft size={18} />
        Tous les événements
      </Link>

      <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-tvs-blue-tint">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      <h1 className="mt-8 font-display text-4xl font-bold text-ink">{event.title}</h1>
      <div className="mt-4 flex flex-wrap gap-5 font-mono text-sm text-steel">
        <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {formatEventDate(event.date)}</span>
        <span className="flex items-center gap-1.5"><MapPin size={16} /> {event.location}</span>
      </div>
      <p className="mt-6 max-w-2xl leading-relaxed text-ink/85">{event.description}</p>

      {isTombola && (
        <div className="mt-8 rounded-2xl border border-tvs-red/20 bg-tvs-red-tint p-6 text-center sm:p-8">
          <Gift size={40} className="mx-auto text-tvs-red" />
          <h2 className="mt-3 font-display text-2xl font-bold text-ink">
            🎁 1er lot : TVS Jupiter 125
          </h2>
          <p className="mt-2 text-sm text-steel">
            + casques, bons d'achat et accessoires TVS
          </p>
          <p className="mt-4 text-sm text-ink/80">
            L'inscription est gratuite. Le tirage au sort aura lieu le jour de l'événement au showroom
            PK0. Venez nombreux et tentez votre chance !
          </p>
          <button
            onClick={() => setTombolaOpen(true)}
            className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-tvs-red px-8 py-3 font-display text-lg font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-tvs-red/30"
          >
            <Gift size={18} />
            Participer à la tombola
          </button>
        </div>
      )}

      <TombolaForm open={tombolaOpen} onClose={() => setTombolaOpen(false)} />
    </div>
  )
}
