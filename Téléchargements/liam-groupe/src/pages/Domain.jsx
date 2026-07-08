import { useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Layers, Image as ImageIcon, Calendar, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang, langPath } from "../lib/langPath";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import EventCard from "../components/EventCard";
import NewsCard from "../components/NewsCard";
import HeroSlider from "../components/HeroSlider";
import { ActCTA } from "../components/CTASection";
import { DomainIcon } from "../components/DomainIcon";
import { useDomain, useEvents, useNews } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";
import GalleryLightbox from "../components/GalleryLightbox";

export default function Domain() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const lang = useLang();
  const { data: domain } = useDomain(slug);
  const { data: events = [] } = useEvents();
  const { data: news = [] } = useNews();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const programsRef = useScrollReveal();
  const weekRef = useScrollReveal();
  const galleryRef = useScrollReveal();

  // Générer les slides du hero à partir des données du domaine
  const domainSlides = useMemo(() => {
    if (!domain) return [];
    const slides = [
      {
        image: domain.heroImage,
        width: 1920,
        height: 700,
        eyebrow: t(`domains.data.${domain.slug}.category`, domain.category),
        title: t(`domains.data.${domain.slug}.name`, domain.name),
      },
      ...(domain.programs || []).slice(0, 3).map((p, i) => ({
        image: domain.heroImage,
        width: 1920,
        height: 700,
        eyebrow: `${t('domain.programs.eyebrow')} ${i + 1}`,
        title: t(`domains.data.${domain.slug}.programs.${i}.title`, p.title),
        description: t(`domains.data.${domain.slug}.programs.${i}.description`, p.description),
      })),
    ];
    return slides;
  }, [domain, t]);

  if (!domain) return <Navigate to={langPath(lang, "/domaines")} replace />;

  return (
    <div className="font-body">
      <Navbar />

      {/* HERO SLIDER */}
      <HeroSlider
        slides={domainSlides}
        heightClass="h-[560px]"
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

      {/* CETTE SEMAINE — Événements et actualités liés à ce domaine */}
      {(() => {
        const domainEvents = events.filter(
          (e) => e.category?.toLowerCase() === domain.name?.toLowerCase()
        );
        const domainNews = news.filter(
          (n) => n.tag?.toLowerCase() === domain.name?.toLowerCase()
        );
        if (domainEvents.length === 0 && domainNews.length === 0) return null;
        return (
          <section className="py-24 px-6 bg-brand-50/30" ref={weekRef}>
            <div className="max-w-6xl mx-auto">
              <div className="reveal">
                <SectionHeading
                  icon={Calendar}
                  eyebrow={t('domain.week.eyebrow')}
                  title={t('domain.week.title', { domain: domain.name })}
                />
              </div>
              <div className="space-y-10">
                {domainEvents.length > 0 && (
                  <div>
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
                )}
                {domainNews.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-5 reveal">
                      <Newspaper className="w-5 h-5 text-brand-500" />
                      <h3 className="font-heading font-bold text-lg text-ink">{t('news.title')}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
                      {domainNews.slice(0, 3).map((n) => (
                        <div key={n.slug} className="reveal"><NewsCard item={n} /></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

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
                    {/* Hover overlay */}
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

      {/* Lightbox */}
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
