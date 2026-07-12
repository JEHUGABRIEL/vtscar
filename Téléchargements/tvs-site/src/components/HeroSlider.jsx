import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mouse } from 'lucide-react'
import useHeaderHeight from '../hooks/useHeaderHeight.js'

/**
 * @typedef {{image:string,title:string,titleAccent?:string,subtitle?:string,description?:string,cta?:{text:string,to:string}}} HeroSlide
 *
 * @param {{slides:HeroSlide[],interval?:number,className?:string}} props
 */
export default function HeroSlider({ slides, interval = 5000, className = '', fullHeight }) {
  const headerHeight = useHeaderHeight()

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)
  const len = slides.length

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % len)
  }, [len])

  // Auto-play
  useEffect(() => {
    if (paused || len <= 1) return
    timerRef.current = setInterval(next, interval)
    return () => clearInterval(timerRef.current)
  }, [paused, len, interval, next])

  if (len === 0) return null

  return (
    <section
      className={`relative overflow-hidden bg-paper-raised text-ink ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Contenu mis en avant"
    >
      {slides.map((slide, i) => {
        const isActive = i === current

        return (
          <div
            key={i}
            aria-hidden={!isActive}
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} sur ${len}`}
            className={`transition-all duration-700 ease-in-out ${
              isActive
                ? 'relative z-20'
                : 'pointer-events-none absolute inset-0 z-0'
            }`}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt=""
                className={`h-full w-full object-cover transition-opacity duration-700 ${
                  isActive ? 'opacity-50' : 'opacity-0'
                }`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              {/* Dark overlay pour la lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-r from-ink/85 to-ink/30" />
            </div>

            {/* Text content */}
            <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
              <div
                  className={`flex w-full items-center ${fullHeight ? '' : 'min-h-[60vh] py-20 lg:min-h-[70vh]'}`}
                  style={fullHeight && headerHeight > 0 ? { minHeight: `calc(100dvh - ${headerHeight}px)` } : undefined}
                >
                <div className="max-w-2xl">
                  {slide.subtitle && (
                    <p
                      className={`font-mono text-[11px] uppercase tracking-[0.25em] text-tvs-red sm:text-xs sm:tracking-[0.3em] truncate max-w-full ${
                        isActive ? 'animate-hero-subtitle' : 'opacity-0'
                      }`}
                      style={isActive ? { animationDelay: '0ms' } : undefined}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  <h1
                    className={`mt-4 font-display text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl text-tvs-blue ${
                      isActive ? 'animate-hero-title' : 'opacity-0'
                    }`}
                    style={isActive ? { animationDelay: '120ms' } : undefined}
                  >
                    {slide.title}
                    {slide.titleAccent && (
                      <>
                        <br />
                        <span className="text-tvs-red">{slide.titleAccent}</span>
                      </>
                    )}
                  </h1>
                  {slide.description && (
                    <p
                      className={`mt-5 max-w-lg text-base leading-relaxed text-white/80 ${
                        isActive ? 'animate-hero-desc' : 'opacity-0'
                      }`}
                      style={isActive ? { animationDelay: '240ms' } : undefined}
                    >
                      {slide.description}
                    </p>
                  )}
                  {slide.cta && (
                    <div
                      className={`mt-8 flex flex-wrap gap-4 ${
                        isActive ? 'animate-hero-cta' : 'opacity-0'
                      }`}
                      style={isActive ? { animationDelay: '360ms' } : undefined}
                    >
                      <Link
                        to={slide.cta.to}
                        className="hero-cta-btn flex items-center gap-2 rounded-full bg-tvs-red px-6 py-3 font-display text-lg font-semibold tracking-wide text-white transition-all hover:scale-[1.06]"
                      >
                        {slide.cta.text}
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Scroll indicator — souris animée, seulement sur les héros plein écran */}
      {fullHeight && (
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 animate-hero-scroll" style={{ animationDelay: '500ms' }}>
          <div className="flex animate-bounce flex-col items-center gap-1.5 text-white/60">
            <Mouse size={22} strokeWidth={1.5} />
            <span className="h-6 w-[1px] rounded-full bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      )}

    </section>
  )
}
