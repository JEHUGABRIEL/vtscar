import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

/**
 * Détermine le nombre d'éléments par slide selon la largeur de la fenêtre.
 */
function useItemsPerSlide() {
  const [items, setItems] = useState(3)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItems(1)
      else if (window.innerWidth < 1024) setItems(2)
      else setItems(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return items
}

/**
 * @typedef {{id:string,name:string,role:string,product:string,avatar:string,rating:number,text:string}} Testimonial
 *
 * @param {{testimonials:Testimonial[],interval?:number}} props
 */
export default function TestimonialSlider({ testimonials, interval = 5000 }) {
  const itemsPerSlide = useItemsPerSlide()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide)
  const atStart = current === 0
  const atEnd = current >= totalSlides - 1

  // Découper les témoignages en groupes
  const chunks = []
  for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
    chunks.push(testimonials.slice(i, i + itemsPerSlide))
  }

  const goTo = useCallback((index) => {
    setCurrent(Math.max(0, Math.min(index, totalSlides - 1)))
  }, [totalSlides])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % totalSlides)
  }, [totalSlides])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  // Clamper current quand totalSlides diminue (ex: redimensionnement)
  useEffect(() => {
    setCurrent((c) => Math.min(c, totalSlides - 1))
  }, [totalSlides])

  // Auto-play
  useEffect(() => {
    if (paused || totalSlides <= 1) return
    timerRef.current = setInterval(next, interval)
    return () => clearInterval(timerRef.current)
  }, [paused, totalSlides, interval, next])

  // Keyboard support
  useEffect(() => {
    if (totalSlides <= 1) return
    const handler = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [totalSlides, next, prev])

  if (testimonials.length === 0) return null

  return (
    <section
      className="bg-paper-raised py-16 lg:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-tvs-red">
              Ils nous font confiance
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Ce que disent nos
              <br />
              <span className="text-tvs-red">clients</span>
            </h2>
          </div>
          <div className="hidden gap-1 sm:flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} className="fill-tvs-red text-tvs-red" />
            ))}
            <span className="ml-2 font-mono text-xs text-steel-light">4.7/5</span>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mx-auto mt-10 max-w-7xl px-5 lg:px-8">
        {/* Slides container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {chunks.map((group, slideIndex) => (
              <div
                key={slideIndex}
                className={`flex w-full shrink-0 gap-6 transition-opacity duration-500 ease-in-out ${
                  slideIndex === current ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {group.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex min-w-0 flex-1 flex-col rounded-2xl border border-line bg-white p-6 shadow-sm"
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={16}
                          className={
                            s < testimonial.rating
                              ? 'fill-tvs-red text-tvs-red'
                              : 'text-ink/15'
                          }
                        />
                      ))}
                    </div>

                    {/* Quote mark */}
                    <Quote size={20} className="mt-3 text-tvs-red/25" />

                    {/* Testimonial text */}
                    <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink/80">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-tvs-red/20 bg-ink/10">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-ink">
                          {testimonial.name}
                        </p>
                        <p className="font-mono text-[11px] text-steel-light">
                          {testimonial.product} · {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Placeholders individuels pour les emplacements vides du dernier slide */}
                {Array.from({ length: itemsPerSlide - group.length }).map((_, i) => (
                  <div key={`ph-${slideIndex}-${i}`} className="flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        {totalSlides > 1 && (
          <>
            {/* Arrows */}
            <button
              onClick={() => goTo(current - 1)}
              disabled={atStart}
              aria-label="Slide précédent"
              className={`absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-ink/20 bg-white p-2 text-ink shadow-sm backdrop-blur-sm transition-all hover:border-ink/40 hover:bg-ink/5 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 lg:-left-5 ${
                atStart ? 'opacity-0 lg:opacity-0' : ''
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => goTo(current + 1)}
              disabled={atEnd}
              aria-label="Slide suivant"
              className={`absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-ink/20 bg-white p-2 text-ink shadow-sm backdrop-blur-sm transition-all hover:border-ink/40 hover:bg-ink/5 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 lg:-right-5 ${
                atEnd ? 'opacity-0 lg:opacity-0' : ''
              }`}
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots — cachés sur mobile */}
            <div className="mt-8 hidden items-center justify-center gap-2 sm:flex">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Aller au slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'h-3 w-8 bg-tvs-red shadow-lg shadow-tvs-red/40'
                      : 'h-3 w-3 bg-ink/30 hover:bg-ink/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
