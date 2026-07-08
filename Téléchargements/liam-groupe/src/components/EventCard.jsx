import { CalendarDays, MapPin, ImageOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import SafeImg from "./SafeImg";

export default function EventCard({ event, compact = false, onRegister }) {
  const { t } = useTranslation();
  const isUpcoming = event.status === "a_venir";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col h-full hover:lift transition-all duration-300 group">
      <div className="relative h-56 overflow-hidden">
        <SafeImg src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" icon={ImageOff} />
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
            isUpcoming ? "bg-brand-500 text-white" : "bg-ink/80 text-white"
          }`}
        >
          {isUpcoming ? t('events.upcoming') : t('events.past')}
        </span>
        {!compact && (
          <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-gray-700">
            {event.category}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" /> {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {event.location}
          </span>
        </div>
        <h3 className="font-heading font-bold text-lg leading-snug">{event.title}</h3>
        <p className="text-gray-500 mt-2 leading-relaxed flex-1">{event.description}</p>
        {compact ? (
          <span className="mt-4 inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
            {event.category}
          </span>
        ) : isUpcoming ? (
          <button
            onClick={() => onRegister?.(event)}
            className="mt-5 w-full py-3 rounded-full border border-brand-100 text-brand-600 font-semibold hover:bg-brand-50 transition-colors"
          >
            {t('events.register')} →
          </button>
        ) : null}
      </div>
    </div>
  );
}
