import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  HeartHandshake,
  MessageSquare,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../lib/langPath";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import DomainCard from "../components/DomainCard";
import EventCard from "../components/EventCard";
import NewsCard from "../components/NewsCard";
import TestimonialCarousel from "../components/TestimonialCarousel";
import PartnersCarousel from "../components/PartnersCarousel";
import StatsSection from "../components/StatsSection";
import FAQSection from "../components/FAQSection";
import { JoinCTA } from "../components/CTASection";
import HeroSlider from "../components/HeroSlider";
import { imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import ContactForm from "../components/ContactForm";
import { useDomains, useEvents, useNews, useSiteInfo, useHomeHeroImages } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";
import useUnsavedChanges from "../hooks/useUnsavedChanges";

export default function Home() {
  const { t } = useTranslation();
  const p = useLangPath();
  const { data: domains = [] } = useDomains();
  const { data: events = [] } = useEvents();
  const { data: news = [] } = useNews();
  const { data: siteInfo = {} } = useSiteInfo();
  const upcomingAndRecent = events.slice(0, 3);
  const domainsRef = useScrollReveal();
  const eventsRef = useScrollReveal();
  const newsRef = useScrollReveal({ animation: "animate-reveal-strong", rootMargin: "0px 0px -60px 0px" });
  const partnersRef = useScrollReveal();
  const testimonialRef = useScrollReveal();
  const contactRef = useScrollReveal();

  // Unsaved changes — formulaire de contact
  const [contactDirty, setContactDirty] = useState(false);
  const { blocker } = useUnsavedChanges(contactDirty);
  const { data: homeHeroImages = [] } = useHomeHeroImages();

  return (
    <div className="font-body">
      <Navbar />

      {/* HERO SLIDER avec images multiples */}
      <HeroSlider
        slides={(() => {
          const raw = t('hero.slides', { returnObjects: true });
          const images = homeHeroImages.length > 0 ? homeHeroImages : [imgHero("home-hero")];
          return Array.isArray(raw) ? raw.map((s, i) => ({
            image: images[i % images.length],
            imageBlur: imgBlur("home-hero"),
            imageSrcSet: imgSrcSet("home-hero", [480, 768, 1024, 1280, 1600], 900, 'fill'),
            sizes: imgSizes('full'),
            cta: (
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={p("/domaines")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                >
                  {t('home.domains.eyebrow', 'Nos domaines')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={p("/evenements")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 font-semibold transition-colors backdrop-blur-sm"
                >
                  {t('hero.ctaEvents')}
                </Link>
              </div>
            ),
            ...s,
          })) : [];
        })()}
        heightClass="min-h-[600px]"
        preloadSeed="home-hero"
        showcaseMode
        defaultBg={{ type: "gradient", value: "from-brand-800/60 via-ink/80 to-ink" }}
      />

      {/* CHIFFRES CLES */}
      <StatsSection />

      {/* DOMAINES */}
      <section className="py-24 px-6" ref={domainsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={LayoutGrid}
              eyebrow={t('home.domains.eyebrow')}
              variant="brand"
              title={t('home.domains.title')}
              description={t('home.domains.description')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {domains.map((d) => (
              <div key={d.slug} className="reveal">
                <DomainCard domain={d} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENEMENTS */}
      <section className="py-24 px-6 bg-gray-50" ref={eventsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal">
            <div>
              <p className="text-brand-500 italic font-medium mb-2">
                {t('home.events.eyebrow')}
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">{t('home.events.title')}</h2>
            </div>
            <Link
              to={p("/evenements")}
              className="text-brand-600 font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              {t('home.events.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
            {upcomingAndRecent.map((e) => (
              <div key={e.slug} className="reveal">
                <EventCard event={e} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="py-24 px-6" ref={newsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal">
            <div>
              <p className="text-brand-500 italic font-medium mb-2">
                {t('home.news.eyebrow')}
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">{t('home.news.title')}</h2>
            </div>
            <Link
              to={p("/actualites")}
              className="text-brand-600 font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              {t('home.news.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {news.slice(0, 3).map((n) => (
                <div key={n.slug} className="reveal">
                  <NewsCard item={n} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 reveal">
              <p className="text-gray-500 font-medium">{t('news.noNews')}</p>
              <p className="text-sm mt-1">{t('news.noNewsText')}</p>
            </div>
          )}
        </div>
      </section>

      {/* CONFIANCE / PARTENAIRES — Défilement infini */}
      <section className="py-24 px-6 overflow-hidden" ref={partnersRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={HeartHandshake}
              eyebrow={t('home.partners.eyebrow')}
              title={t('home.partners.title')}
              description={t('home.partners.description')}
            />
          </div>

          <div className="reveal">
            <PartnersCarousel />
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-24 px-6 bg-gray-50" ref={testimonialRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={MessageSquare}
              eyebrow={t('home.testimonials.eyebrow')}
              variant="blue"
              title={t('home.testimonials.title')}
              description={t('home.testimonials.description')}
            />
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      <JoinCTA />

      {/* FAQ */}
      <FAQSection />

      {/* CONTACT */}
      <section className="py-24 px-6" id="contact" ref={contactRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Mail}
              eyebrow={t('home.contact.eyebrow')}
              variant="brand"
              title={t('home.contact.title')}
              description={t('home.contact.description')}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start reveal">
            <div className="space-y-7 stagger-children">
              <div className="reveal"><ContactItem icon={MapPin} label={t('home.contact.address')} lines={siteInfo.address} /></div>
              <div className="reveal"><ContactItem icon={Phone} label={t('home.contact.phone')} lines={siteInfo.phones} /></div>
              <div className="reveal"><ContactItem icon={Mail} label={t('home.contact.email')} lines={siteInfo.emails} /></div>
              <div className="reveal"><ContactItem icon={Clock} label={t('home.contact.hours')} lines={siteInfo.hours} /></div>
            </div>
            <ContactForm page="home" onDirty={setContactDirty} formId="home" />

            {/* Blocker modal — changements non sauvegardés */}
            {blocker.state === "blocked" && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="fixed inset-0 bg-black/50" onClick={() => blocker.reset()} />
                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <Send className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {t('home.contact.blockerTitle')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('home.contact.blockerText')}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => blocker.reset()}
                      className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      {t('home.contact.blockerStay')}
                    </button>
                    <button
                      onClick={() => blocker.proceed()}
                      className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                    >
                      {t('home.contact.blockerLeave')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactItem({ icon: Icon, label, lines = [] }) {
  return (
    <div className="flex gap-4">
      <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="font-heading font-bold">{label}</p>
        {(lines ?? []).map((l) => (
          <p key={l} className="text-gray-500">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}


