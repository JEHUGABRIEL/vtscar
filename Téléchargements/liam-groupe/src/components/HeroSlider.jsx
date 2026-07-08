import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


/**
 * HeroSlider — Hero section animé avec slides changeants.
 *
 * Props :
 *   slides        : [{ image, imageBlur?, ..., transition?, zoom?, bg? }]
 *   heightClass   : string Tailwind (ex: "h-[480px]", "h-screen")
 *   preloadSeed   : string seed pour les preload links
 *   autoPlayInterval : ms entre chaque slide (défaut 6000)
 *   onSlideChange : (index) => void
 *   defaultTransition : "fade" | "slide" | "zoom-in" | "zoom-out" | { type, direction?, ... }
 *   defaultZoom   : { enterScale?, exitScale?, duration?, ease? }
 *   defaultBg     : { type, value }
 *   showcaseMode  : boolean — si true, les images ne sont plus en fond mais
 *                   affichées dans un carrousel encadré à côté du texte
 */
const DEFAULT_EASE = [0.16, 1, 0.3, 1];

/* ========== PRESETS ========== */

const ZOOM_PRESETS = [
  { enterScale: 1.08, exitScale: 0.94, duration: 0.8 },
  { enterScale: 1.12, exitScale: 0.92, duration: 1.0 },
  { enterScale: 1.05, exitScale: 0.96, duration: 0.7 },
  { enterScale: 1.15, exitScale: 0.90, duration: 1.1 },
  { enterScale: 1.10, exitScale: 0.93, duration: 0.9 },
];

const BG_PRESETS = [
  { type: "gradient", value: "from-brand-800/60 via-ink/80 to-ink" },
  { type: "gradient", value: "from-coral-600/50 via-ink/70 to-ink" },
  { type: "pattern", value: "dots" },
  { type: "gradient", value: "from-brand-700/50 via-violet-900/70 to-ink" },
  { type: "pattern", value: "grid" },
];

/**
 * Presets de transition — chaque slide sans transition explicite
 * reçoit un style différent pour varier les sensations.
 */
const TRANSITION_PRESETS = [
  { type: "zoom-in", direction: "up" },
  { type: "fade" },
  { type: "slide", direction: "left" },
  { type: "zoom-out" },
  { type: "slide", direction: "up" },
];

/* ========== RESOLVEURS ========== */

function resolveTransition(slide, index, defaultTransition) {
  const raw = slide?.transition || defaultTransition || TRANSITION_PRESETS[index % TRANSITION_PRESETS.length];
  if (typeof raw === "string") {
    const dirMap = { left: "left", right: "right", up: "up", down: "down" };
    const parts = raw.split("-");
    if (parts.length === 2 && dirMap[parts[1]]) {
      return { type: parts[0], direction: parts[1] };
    }
    return { type: raw };
  }
  return raw;
}

function resolveBg(slide, index, defaultBg) {
  if (slide?.bg) return slide.bg;
  if (defaultBg) return defaultBg;
  return BG_PRESETS[index % BG_PRESETS.length];
}

function resolveZoom(slide, index, defaultZoom) {
  const base = { enterScale: 1.05, exitScale: 0.95, duration: 0.7, ease: DEFAULT_EASE };
  if (slide?.zoom) return { ...base, ...defaultZoom, ...slide.zoom };
  if (defaultZoom) return { ...base, ...defaultZoom };
  return { ...base, ...ZOOM_PRESETS[index % ZOOM_PRESETS.length] };
}

/* ========== GÉNÉRATEURS DE VARIANTS ========== */

function buildImageVariants(transition, zoom, dir = 1) {
  const t = transition?.type || "zoom-in";
  const d = transition?.direction || "up";
  const shared = { opacity: 0 };

  const enter = {};
  const exit = {};

  switch (t) {
    case "fade":
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
    case "slide":
      if (d === "left" || d === "right") {
        const sign = d === "left" ? 1 : -1;
        enter.x = 80 * sign * dir;
        exit.x = -80 * sign * dir;
      } else {
        const sign = d === "up" ? 1 : -1;
        enter.y = 80 * sign * dir;
        exit.y = -80 * sign * dir;
      }
      return {
        enter: { ...shared, ...enter },
        center: { opacity: 1, x: 0, y: 0 },
        exit: { ...shared, ...exit },
      };
    case "zoom-out":
      return {
        enter: { opacity: 0, scale: 1.18 },
        center: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.88 },
      };
    case "zoom-in":
    default:
      return {
        enter: { opacity: 0, scale: zoom.enterScale },
        center: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: zoom.exitScale },
      };
  }
}

function buildTextVariants(transition, dir = 1) {
  const t = transition?.type || "zoom-in";
  const d = transition?.direction || "up";
  const base = { opacity: 0 };

  if (t === "slide" && (d === "left" || d === "right")) {
    const sign = d === "left" ? 1 : -1;
    return {
      initial: { ...base, x: 30 * sign * dir },
      animate: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, x: -20 * sign * dir },
    };
  }

  return {
    initial: { ...base, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };
}

/* ========== BgLayer ========== */

const patternAnimations = {
  dots: { rotate: [0, 360], duration: 120, ease: "linear" },
  grid: { rotate: [0, 360], duration: 180, ease: "linear" },
  waves: { y: [0, -4, 0, 4, 0], duration: 12, ease: "easeInOut", repeat: Infinity },
  crosshatch: { rotate: [0, 360], y: [0, -3, 0], duration: 90, ease: "linear" },
};

function PatternSvg({ bg, base }) {
  const anim = patternAnimations[bg.value] || {};
  return (
    <div className={`${base} bg-ink overflow-hidden`}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: anim.rotate ? anim.rotate : 0, y: anim.y ? anim.y : 0 }}
        transition={{
          rotate: anim.duration ? { duration: anim.duration, ease: anim.ease, repeat: Infinity } : undefined,
          y: anim.y ? { duration: anim.duration, ease: anim.ease, repeat: Infinity } : undefined,
        }}
      >
        <svg className="w-full h-full opacity-[0.07]">
          <defs>
            {bg.value === "dots" && (
              <pattern id="hero-dots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="16" cy="16" r="2" fill="white" />
              </pattern>
            )}
            {bg.value === "grid" && (
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            )}
            {bg.value === "waves" && (
              <pattern id="hero-waves" width="60" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q15 0 30 10 Q45 20 60 10" fill="none" stroke="white" strokeWidth="1.5" />
              </pattern>
            )}
            {bg.value === "crosshatch" && (
              <pattern id="hero-crosshatch" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 0 L20 20 M20 0 L0 20" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
            )}
          </defs>
          <rect width="100%" height="100%" fill={`url(#hero-${bg.value})`} />
        </svg>
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-coral-500/10"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}

function BgLayer({ bg, className }) {
  if (!bg) return null;
  const base = `absolute inset-0 ${className || ""}`;
  if (bg.type === "solid") return <div className={`${base} ${bg.value}`} />;
  if (bg.type === "gradient") return <div className={`${base} bg-gradient-to-br ${bg.value}`} />;
  if (bg.type === "pattern") return <PatternSvg bg={bg} base={base} />;
  return null;
}

/* ========== COMPOSANT PRINCIPAL ========== */

export default function HeroSlider({
  slides = [],
  heightClass = "h-[480px]",
  preloadSeed,
  autoPlayInterval = 6000,
  onSlideChange,
  defaultTransition,
  defaultZoom,
  defaultBg,
  showcaseMode = false,
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const timerRef = useRef(null);
  const len = slides.length;

  const goTo = useCallback(
    (index, dir) => {
      setDirection(dir ?? (index > current ? 1 : -1));
      setCurrent(index);
      onSlideChange?.(index);
    },
    [current, onSlideChange]
  );

  const next = useCallback(() => {
    if (len <= 1) return;
    const idx = (current + 1) % len;
    goTo(idx, 1);
  }, [current, len, goTo]);

  const prev = useCallback(() => {
    if (len <= 1) return;
    const idx = (current - 1 + len) % len;
    goTo(idx, -1);
  }, [current, len, goTo]);

  useEffect(() => {
    if (len <= 1 || paused) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => clearInterval(timerRef.current);
  }, [next, autoPlayInterval, len, paused]);

  useEffect(() => {
    if (len <= 1) return;
    const onKeyDown = (e) => {
      if (!paused) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, len, paused]);

  if (len === 0) return null;

  const slide = slides[current];
  const transition = resolveTransition(slide, current, defaultTransition);
  const zoom = resolveZoom(slide, current, defaultZoom);
  const bg = resolveBg(slide, current, defaultBg);
  const imageLoaded = imagesLoaded[current];
  const imageVariants = buildImageVariants(transition, zoom, direction);
  const textVariants = buildTextVariants(transition, direction);

  const animDuration = transition.duration ?? zoom.duration ?? 0.7;
  const animEase = transition.ease ?? zoom.ease ?? DEFAULT_EASE;

  /* ========== SHOWCASE MODE ========== */
  if (showcaseMode) {
    return (
      <section
        className={`relative ${heightClass} overflow-hidden`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background décoratif (gradient/pattern) */}
        <BgLayer bg={bg} className="z-0" />

        {/* Overlay subtil — dégradé de profondeur et halo lumineux */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-ink/90 z-[1]" />
        <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-brand-500/5 via-brand-500/3 to-transparent z-[1] pointer-events-none" />

        {/* Espace pour la navbar fixe (84px) */}
        <div className="absolute top-0 left-0 right-0 h-[84px] bg-gradient-to-b from-ink/60 via-transparent to-transparent z-[1]" />

        {/* Contenu — texte uniquement */}          <div className="relative z-10 h-full flex items-center pt-[120px] pb-16 md:pb-20">
          <div className="w-full max-w-4xl mx-auto px-6 text-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`text-${current}`}
                custom={direction}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: Math.min(animDuration * 0.85, 0.6),
                  ease: animEase,
                  delay: 0.08,
                }}
              >
                {slide.eyebrow && (                      <p className="text-white/90 font-semibold tracking-[0.2em] text-xs uppercase mt-6 mb-6">
                        {slide.eyebrow}
                  </p>
                )}
                {slide.title && (
                  <h1 className="font-heading font-semibold text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-sm leading-[1.08]">
                    {slide.title}
                    {slide.titleAccent && (
                      <span className="block text-brand-500">{slide.titleAccent}</span>
                    )}
                  </h1>
                )}
                {slide.description && (
                  <p className="text-white/70 text-sm md:text-base mt-5 max-w-2xl mx-auto leading-relaxed">
                    {slide.description}
                  </p>
                )}
                {slide.cta && <div className="mt-10 flex justify-center">{slide.cta}</div>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    );
  }

  /* ========== MODE CLASSIQUE (plein écran) ========== */
  return (
    <section
      className={`group relative ${heightClass} overflow-hidden`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Preload links */}
      {preloadSeed && (
        <>
          <link rel="preload" as="image" href={slide.image} fetchPriority="high" />
          {slide.imageBlur && <link rel="preload" as="image" href={slide.imageBlur} />}
        </>
      )}

      {/* Slides animés */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: animDuration, ease: animEase }}
          className="absolute inset-0"
        >
          <BgLayer bg={bg} className="z-0" />

          {slide.imageBlur && (
            <img
              src={slide.imageBlur}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-80 transition-opacity duration-500 ${
                imageLoaded === false ? "opacity-100" : "opacity-80"
              }`}
            />
          )}

          <img
            src={slide.image}
            alt={slide.alt || ""}
            width={slide.width || 1600}
            height={slide.height || 480}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded === false ? "opacity-0" : "opacity-100"
            }`}
            fetchPriority="high"
            decoding="async"
            imageSrcSet={slide.imageSrcSet || undefined}
            sizes={slide.sizes || undefined}
            onLoad={() => setImagesLoaded((prev) => ({ ...prev, [current]: true }))}
            onError={() => setImagesLoaded((prev) => ({ ...prev, [current]: false }))}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />

      {/* Texte hero */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${current}`}
              custom={direction}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: Math.min(animDuration * 0.85, 0.6),
                ease: animEase,
                delay: 0.08,
              }}
            >
              {slide.eyebrow && (
                <p className="text-white/90 font-semibold tracking-[0.2em] text-xs uppercase mt-6 mb-6">
                  {slide.eyebrow}
                </p>
              )}
              {slide.title && (
                <h1 className="font-heading font-semibold text-4xl md:text-6xl text-white drop-shadow-sm max-w-3xl leading-[1.08]">
                  {slide.title}
                  {slide.titleAccent && (
                    <span className="block text-brand-500">{slide.titleAccent}</span>
                  )}
                </h1>
              )}
              {slide.description && (
                <p className="text-white/70 text-sm md:text-base mt-5 max-w-xl leading-relaxed">
                  {slide.description}
                </p>
              )}
              {slide.cta && <div className="mt-10">{slide.cta}</div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}
