import { useState } from "react";
import { Target, Compass, Flag, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import TeamCard from "../components/TeamCard";
import HeroSlider from "../components/HeroSlider";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "../components/SocialIcons";
import ContactForm from "../components/ContactForm";
import { useSiteInfo, useTeam } from "../hooks/useSiteData";
import { img, imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";
import useUnsavedChanges from "../hooks/useUnsavedChanges";

export default function About() {
  const { t } = useTranslation();
  const { data: team = [] } = useTeam();
  const { data: siteInfo = {} } = useSiteInfo();
  const info = siteInfo?.contactPage ?? {};
  const missionRef = useScrollReveal();
  const teamRef = useScrollReveal();
  const contactRef = useScrollReveal();
  const mapRef = useScrollReveal();
  const [contactDirty, setContactDirty] = useState(false);
  const { blocker } = useUnsavedChanges(contactDirty);

  return (
    <div className="font-body">
      <Navbar />

      {/* HERO SLIDER */}
      <HeroSlider
        slides={(() => {
          const raw = t('about.hero.slides', { returnObjects: true });
          return Array.isArray(raw) ? raw.map((s) => ({
            image: imgHero("apropos-hero"),
            imageBlur: imgBlur("apropos-hero"),
            imageSrcSet: imgSrcSet("apropos-hero", [480, 768, 1024, 1280, 1600], 480, 'fill'),
            sizes: imgSizes('full'),
            alt: t('about.heroAlt'),
            ...s,
          })) : [];
        })()}
        preloadSeed="apropos-hero"
        defaultBg={{ type: "gradient", value: "from-ink-900 via-ink to-ink-900" }}
      />

      {/* MISSION */}
      <section className="py-24 px-6" ref={missionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Target}
              eyebrow={t('about.mission.eyebrow')}
              title={t('about.mission.title')}
              align="left"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <p className="text-gray-500 leading-relaxed mb-5">
                {t('about.intro1')}
              </p>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 mb-3">
                {t('about.acronym.eyebrow')}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {(t('about.acronym.items', { returnObjects: true }) || []).map((item, i) => {
                  const tileColors = ["bg-coral-500", "bg-violet-500", "bg-green-500", "bg-brand-500"];
                  return (
                    <div key={item.letter} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
                      <span className={`w-8 h-8 shrink-0 rounded-full ${tileColors[i % 4]} text-white flex items-center justify-center font-heading font-bold text-sm`}>
                        {item.letter}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-sm text-ink">{item.word}</p>
                        <p className="text-gray-500 text-xs leading-snug mt-0.5">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6 stagger-children">
                <div className="flex gap-4 reveal">
                  <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold mb-1">{t('about.vision.title')}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {t('about.vision.text')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 reveal">
                  <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold mb-1">{t('about.missionBlock.title')}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {t('about.missionBlock.text')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 reveal">
              <img
                src={img("apropos-1", 600, 700)}
                alt={t('about.images.alt1')}
                width={600}
                height={700}
                className="rounded-2xl object-cover w-full h-[340px] mt-8"
                loading="lazy"
                decoding="async"
              />
              <img
                src={img("apropos-2", 600, 700)}
                alt={t('about.images.alt2')}
                width={600}
                height={700}
                className="rounded-2xl object-cover w-full h-[340px]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="py-24 px-6" ref={teamRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Flag}
              eyebrow={t('about.team.eyebrow')}
              title={t('about.team.title')}
              description={t('about.team.description')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {team.map((m) => (
              <div key={m.name} className="reveal">
                <TeamCard member={m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT — coordonnées + formulaire */}
      <section className="py-24 px-6 bg-gray-50" ref={contactRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <SectionHeading icon={MapPin} eyebrow={t('contact.eyebrow')} title={t('contact.title')} align="left" />
          </div>
          <div className="grid grid-cols-1 gap-12">
            <div className="reveal">
              <p className="text-gray-500 leading-relaxed mb-8 -mt-4">
                {t('contact.intro')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-children">
                <div className="space-y-6">
                  <div className="reveal"><ContactItem icon={MapPin} label={t('contact.address')} lines={info.address} /></div>
                  <div className="reveal"><ContactItem icon={Clock} label={t('contact.hours')} lines={info.hours} /></div>
                </div>
                <div className="space-y-6">
                  <div className="reveal"><ContactItem icon={Phone} label={t('contact.phone')} lines={info.phones} /></div>
                  <div className="reveal"><ContactItem icon={Mail} label={t('contact.email')} lines={info.emails} /></div>
                </div>
                <div className="reveal bg-brand-50/60 rounded-2xl p-7">
                  <h3 className="font-heading font-bold mb-1">{t('contact.socialTitle')}</h3>
                  <p className="text-gray-500 mb-5">{t('contact.socialText')}</p>
                  <div className="flex items-center gap-3">
                    {[
                      { Icon: FacebookIcon, href: siteInfo.social?.facebook },
                      { Icon: InstagramIcon, href: siteInfo.social?.instagram },
                      { Icon: XIcon, href: siteInfo.social?.x },
                      { Icon: YoutubeIcon, href: siteInfo.social?.youtube },
                    ].map(({ Icon, href }, i) => (
                      <a
                        key={i}
                        href={href || '#'}
                        target={href ? '_blank' : undefined}
                        rel={href ? 'noopener noreferrer' : undefined}
                        aria-label="social"
                        className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ContactForm page="about" onDirty={setContactDirty} formId="about" />

            {/* Blocker modal — changements non sauvegardés */}
            {blocker.state === "blocked" && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="fixed inset-0 bg-black/50" onClick={() => blocker.reset()} />
                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <Send className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {t('contact.blockerTitle')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('contact.blockerText')}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => blocker.reset()}
                      className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      {t('contact.blockerStay')}
                    </button>
                    <button
                      onClick={() => blocker.proceed()}
                      className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                    >
                      {t('contact.blockerLeave')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="px-6 pb-24" ref={mapRef}>
        <div className="max-w-6xl mx-auto reveal">
          <div className="rounded-2xl overflow-hidden border border-gray-100 h-[420px]">
            <iframe
              title="Localisation Bangui"
              className="w-full h-full"
              loading="lazy"
              decoding="async"
              src="https://www.openstreetmap.org/export/embed.html?bbox=18.50%2C4.30%2C18.65%2C4.42&layer=mapnik&marker=4.3614%2C18.5550"
            />
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
      <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
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


