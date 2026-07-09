import { useState, useMemo } from "react";
import { Layers, Image as ImageIcon, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SectionHeading from "../../components/SectionHeading";
import EventCard from "../../components/EventCard";
import HeroSlider from "../../components/HeroSlider";
import { ActCTA } from "../../components/CTASection";
import { DomainIcon } from "../../components/DomainIcon";
import useScrollReveal from "../../hooks/useScrollReveal";
import GalleryLightbox from "../../components/GalleryLightbox";

/**
 * GenericDomain — template neutre utilisé par tous les domaines qui n'ont
 * pas de page dédiée sur-mesure (voir RestaurantDomain.jsx et FitnessDomain.jsx
 * pour O'GAB et G-Fitness).
 */
export default function GenericDomain({ domain, events }) {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const programsRef = useScrollReveal();
  const weekRef = useScrollReveal();
  const galleryRef = useScrollReveal();

  const SLIDE_TEXTS = [
    { desc: "Découvrez nos programmes et actions pour la jeunesse et les femmes de Centrafrique." },
    { desc: "Des initiatives concrètes pour l'éducation, la formation et l'entrepreneuriat." },
    { desc: "Ensemble, construisons une Centrafrique plus forte et plus unie." },
    { desc: "Rejoignez notre mission et participez au changement." },
    { desc: "Des résultats tangibles grâce à l'engagement de notre communauté." },
    { desc: "Cultivons les talents et créons des opportunités durables." },
    { desc: "L'avenir de la Centrafrique passe par sa jeunesse et ses femmes." },
  ];

  const domainSlides = useMemo(() => {
    // Inclut l'heroImage + toutes les images de la galerie pour maximiser
    // le nombre de slides dans le carousel hero
    const allImages = domain.gallery.length > 0
      ? [domain.heroImage, ...domain.gallery]
      : [domain.heroImage];

    return allImages.map((img, i) => ({
      image: img,
      width: 1920,
      height: 700,
      eyebrow: t(`domains.data.${domain.slug}.category`, domain.category),
      title: t(`domains.data.${domain.slug}.name`, domain.name),
      description: SLIDE_TEXTS[i % SLIDE_TEXTS.length].desc,
    }));
  }, [domain, t]);

  const domainEvents = events.filter(
    (e) => e.category?.toLowerCase() === domain.name?.toLowerCase()
  );

  return (
    <div className="font-body">
      <Navbar />

      <HeroSlider
        slides={domainSlides}
        heightClass="h-screen"
        defaultBg={{ type: "gradient", value: "from-ink-900 via-ink to-ink-900" }}
      />

      {/* PROGRAMMES */}
      <section className="py-24 px-6 bg-gray-50" ref={programsRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal"><SectionHeading icon={Layers} eyebrow={t('domain.programs.eyebrow')} title={t('domain.programs.title')} /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
            {domain.programs.map((p, idx) => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-card p-7 reveal hover:lift transition-all duration-300">
                <span className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                  <DomainIcon icon={domain.icon} className="w-6 h-6" />
                </span>
                <h3 className="font-heading font-bold text-lg mb-2">{t(`domains.data.${domain.slug}.programs.${idx}.title`, p.title)}</h3>
                <p className="text-gray-500 leading-relaxed">{t(`domains.data.${domain.slug}.programs.${idx}.description`, p.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CETTE SEMAINE — Événements uniquement */}
      {domainEvents.length > 0 && (
        <section className="py-24 px-6 bg-brand-50/30" ref={weekRef}>
          <div className="max-w-6xl mx-auto">
            <div className="reveal">
              <SectionHeading
                icon={Calendar}
                eyebrow={t('domain.week.eyebrow')}
                title={t('domain.week.title', { domain: domain.name })}
              />
            </div>
            <div className="flex items-center gap-2 mb-5 reveal">
              <Calendar className="w-5 h-5 text-brand-500" />
              <h3 className="font-heading font-bold text-lg text-ink">{t('events.title')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {domainEvents.slice(0, 3).map((e) => (
                <div key={e.slug} className="reveal"><EventCard event={e} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALERIE */}
      <section className="py-24 px-6" ref={galleryRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal"><SectionHeading icon={ImageIcon} eyebrow={t('domain.gallery.eyebrow')} title={t('domain.gallery.title')} /></div>
          {domain.gallery.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {domain.gallery.map((src, i) => (
                <div key={i} className="reveal group cursor-pointer" onClick={() => setLightboxIndex(i)}>
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={src}
                      alt={`${domain.name} ${i + 1}`}
                      width={700}
                      height={500}
                      className="object-cover w-full h-[380px] transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center gap-2 bg-white/90 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                          <ImageIcon className="w-4 h-4" />
                          {t('domain.gallery.enlarge')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {domain.gallery.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-gray-500 font-medium">{t('domain.gallery.empty')}</p>
              <p className="text-sm mt-1">{t('domain.gallery.emptySub')}</p>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={domain.gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <ActCTA title={`${t('domain.cta.support')} ${t(`domains.data.${domain.slug}.name`, domain.name)}`} />

      <Footer />
    </div>
  );
}
