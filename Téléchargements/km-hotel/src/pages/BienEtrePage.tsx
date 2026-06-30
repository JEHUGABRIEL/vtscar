import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Waves,
  Sparkles,
  Sun,
  Phone,
  Wind,
  Flower2,
  Star
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDataBuilder } from '../hooks/useDataBuilder';
import { useContactModal } from '../context/ContactModalContext';

const heroSlides = [
  {
    image:
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80',
    alt: 'Piscine KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f1?auto=format&fit=crop&q=80',
    alt: 'Spa KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?auto=format&fit=crop&q=80',
    alt: 'Détente KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80',
    alt: 'Espace bien-être KM Hotel'
  },
  {
    image: '/images/salles/716591280_4344848619067165_3858479590092394858_n.jpeg',
    alt: 'Massage bien-être KM Hotel'
  }
];

const poolIcons = [<Sun className="w-6 h-6" />, <Waves className="w-6 h-6" />];
const relaxationIcons = [<Sparkles className="w-6 h-6" />, <Wind className="w-6 h-6" />, <Flower2 className="w-6 h-6" />];
const poolImages = [
  'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f1?auto=format&fit=crop&q=80'
];

const relaxationImages = [
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80'
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

function buildPoolFeatures(t: (key: string) => string) {
  // corresponds to the 2 pools in translation.json
  return [0, 1].map((i) => ({
    title: t(`bienEtre.pools.items.${i}.title`),
    desc: t(`bienEtre.pools.items.${i}.desc`),
    icon: poolIcons[i],
    image: poolImages[i],
    details: [0, 1, 2, 3, 4, 5].map((d) => t(`bienEtre.pools.items.${i}.details.${d}`))
  }));
}

function buildRelaxationSpaces(t: (key: string) => string) {
  // corresponds to the 3 relaxation items in translation.json
  return [0, 1, 2].map((i) => ({
    title: t(`bienEtre.relaxation.items.${i}.title`),
    desc: t(`bienEtre.relaxation.items.${i}.desc`),
    icon: relaxationIcons[i],
    image: relaxationImages[i],
    treatments: [0, 1, 2, 3, 4].map((d) => t(`bienEtre.relaxation.items.${i}.treatments.${d}`))
  }));
}

const sectionIds = ['piscines', 'detente'];

export function BienEtrePage() {
  const { t } = useTranslation();
  const { openModal } = useContactModal();
  const [current, setCurrent] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const heroSlidesData = t('bienEtre.hero.slides', { returnObjects: true }) as { badge: string; title: string }[];
  const currentSlide = heroSlidesData?.[current] ?? { badge: '', title: '' };

  const poolFeatures = useDataBuilder(buildPoolFeatures, t);
  const relaxationSpaces = useDataBuilder(buildRelaxationSpaces, t);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((best, curr) =>
            curr.boundingClientRect.top < best.boundingClientRect.top ? curr : best
          );
          setActiveSection(topmost.target.id);
        }
      },
      { threshold: 0.2, rootMargin: '-72px 0px -10% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url("${slide.image}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              opacity: index === current ? 1 : 0
            }}
          >
            <div className="absolute inset-0 bg-slate-900/55 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/20 to-slate-900/80" />
          </div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="text-brand-300 font-medium tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
                {currentSlide.badge}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight">
                {currentSlide.title}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* ===== INTRODUCTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <h2 className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3">
              {t('bienEtre.intro.badge')}
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 mb-6">
              {t('bienEtre.intro.title')}
            </h3>
            <p className="text-slate-600 font-light leading-relaxed">
              {t('bienEtre.intro.text')}
            </p>
          </motion.div>


        </div>
      </section>

      {/* ===== ANCHOR NAVIGATION ===== */}
      <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 py-3">
            <a
              href="#piscines"
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium uppercase tracking-wider rounded-sm transition-all duration-200 ${
                activeSection === 'piscines'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Waves className="w-4 h-4" />
              {t('bienEtre.pools.badge')}
            </a>
            <div className="w-px h-5 bg-slate-300" />
            <a
              href="#detente"
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium uppercase tracking-wider rounded-sm transition-all duration-200 ${
                activeSection === 'detente'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t('bienEtre.relaxation.badge')}
            </a>
          </div>
        </div>
      </div>

      {/* ===== PISCINES ===== */}
      <section id="piscines" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-brand-600 mb-3">
              <Waves className="w-5 h-5" />
              <span className="font-medium tracking-widest uppercase text-sm">
                {t('bienEtre.pools.badge')}
              </span>
            </div>
            <h3 className="text-4xl font-serif text-slate-900 mb-4">
              {t('bienEtre.pools.title')}
            </h3>
            <p className="text-slate-600 font-light">
              {t('bienEtre.pools.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-16">
            {poolFeatures.map((pool, index) => (
              <motion.div
                key={pool.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center ${
                  index % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
                    <img
                      src={pool.image}
                      alt={pool.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1 lg:text-right' : 'lg:order-2'}`}>
                  <div className={`flex items-center gap-3 mb-4 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                      {pool.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif text-slate-900 mb-4">{pool.title}</h3>
                  <p className="text-slate-600 font-light leading-relaxed mb-6">{pool.desc}</p>
                  <ul className={`space-y-2.5 ${index % 2 === 1 ? 'lg:flex lg:flex-col lg:items-end' : ''}`}>
                    {pool.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        <span className="font-light">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ESPACES DE DÉTENTE ===== */}
      <section id="detente" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-brand-600 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium tracking-widest uppercase text-sm">
                {t('bienEtre.relaxation.badge')}
              </span>
            </div>
            <h3 className="text-4xl font-serif text-slate-900 mb-4">
              {t('bienEtre.relaxation.title')}
            </h3>
            <p className="text-slate-600 font-light">
              {t('bienEtre.relaxation.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relaxationSpaces.map((space, index) => (
              <motion.div
                key={space.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white border border-slate-100 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-500"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm text-brand-600 rounded-full flex items-center justify-center shadow-sm">
                    {space.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-serif text-slate-900 mb-2 group-hover:text-brand-600 transition-colors duration-300">
                    {space.title}
                  </h4>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mb-4">
                    {space.desc}
                  </p>
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                      {t('bienEtre.relaxation.servicesLabel')}
                    </span>
                    <ul className="space-y-1.5">
                      {space.treatments.map((treatment) => (
                        <li key={treatment} className="flex items-center gap-2 text-xs text-slate-600">
                          <Star className="w-3 h-3 text-brand-400 shrink-0" />
                          <span className="font-light">{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPENING HOURS ===== */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-sm border border-white/10">
              <Waves className="w-8 h-8 text-brand-400 mx-auto mb-3" />
              <h4 className="text-lg font-serif mb-2">{t('bienEtre.hours.pools.title')}</h4>
              <p className="text-sm text-slate-400">{t('bienEtre.hours.pools.hours')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('bienEtre.hours.pools.note')}</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-sm border border-white/10">
              <Sparkles className="w-8 h-8 text-brand-400 mx-auto mb-3" />
              <h4 className="text-lg font-serif mb-2">{t('bienEtre.hours.spa.title')}</h4>
              <p className="text-sm text-slate-400">{t('bienEtre.hours.spa.hours')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('bienEtre.hours.spa.note')}</p>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-sm border border-white/10">
              <Wind className="w-8 h-8 text-brand-400 mx-auto mb-3" />
              <h4 className="text-lg font-serif mb-2">{t('bienEtre.hours.sauna.title')}</h4>
              <p className="text-sm text-slate-400">{t('bienEtre.hours.sauna.hours')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('bienEtre.hours.sauna.note')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
              {t('bienEtre.cta.title')}
            </h2>
            <p className="text-slate-600 font-light text-lg mb-10 max-w-2xl mx-auto">
              {t('bienEtre.cta.text')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openModal}
                className="px-8 py-4 bg-brand-600 text-white font-medium tracking-wide hover:bg-brand-700 transition-colors"
              >
                {t('bienEtre.cta.button')}
              </button>
              <a
                href="tel:+23675494969"
                className="flex items-center gap-2 px-8 py-4 border border-brand-600 text-brand-600 hover:bg-brand-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                +236 75 49 49 69
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
