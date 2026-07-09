import { Link, NavLink } from "react-router-dom";
import { Send, MessageSquare, Phone, MapPin, Mail, Clock, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../lib/langPath";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "./SocialIcons";
import { useSiteInfo, useFooterLinks } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Footer() {
  const { t } = useTranslation();
  const p = useLangPath();
  const { data: siteInfo = {} } = useSiteInfo();
  const { data: footerLinks = {} } = useFooterLinks();
  const fLinks = { liamGroupe: [], domaines: [], agir: [], ...footerLinks };
  const ctaRef = useScrollReveal();

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <>
      {/* CTA Section — Fond rouge avec motif SVG au-dessus du footer */}
      <section className="relative bg-brand-500 py-16 px-6 overflow-hidden" ref={ctaRef}>
        {/* Pattern overlay — étoiles et formes géométriques */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="stars-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                {/* Étoile 4 branches */}
                <path d="M12 0L14.25 9.75L24 12L14.25 14.25L12 24L9.75 14.25L0 12L9.75 9.75Z" fill="white" opacity="0.6" />
                {/* Petit cercle */}
                <circle cx="60" cy="30" r="2" fill="white" opacity="0.4" />
                {/* Triangle */}
                <polygon points="100,10 110,28 90,28" fill="white" opacity="0.3" />
                {/* Losange */}
                <polygon points="40,80 55,90 40,100 25,90" fill="white" opacity="0.5" />
                {/* Petite étoile */}
                <path d="M80 70L82 77L89 77L83 81.5L85.5 89L80 84L74.5 89L77 81.5L71 77L78 77Z" fill="white" opacity="0.35" />
                {/* Points de grille */}
                <circle cx="100" cy="100" r="1.5" fill="white" opacity="0.25" />
                <circle cx="20" cy="50" r="1.5" fill="white" opacity="0.25" />
                <circle cx="70" cy="110" r="1" fill="white" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars-pattern)" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="grid gap-1.5 reveal">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
              {t('footer.ctaSection.title')}
            </h2>
            <p className="text-white/80 leading-relaxed max-w-lg mx-auto">
              {t('footer.ctaSection.text')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 reveal">
            <a
              href="/#contact"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-brand-600 font-semibold hover:bg-white/90 transition-all hover:shadow-lg active:scale-[0.97] no-underline"
            >
              <MessageSquare className="w-4 h-4" />
              {t('footer.ctaSection.write')}
            </a>
            <a
              href={`tel:${String(siteInfo.phones?.[0] || '').replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all active:scale-[0.97] no-underline"
            >
              <Phone className="w-4 h-4" />
              {t('footer.ctaSection.call')}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-10">
          <div>
            <Link to={p("/")} className="flex items-center gap-2.5 no-underline">
              <span className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl leading-none tracking-tight text-white">
                LIAM<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="mt-4 text-white/60 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex max-w-sm rounded-full overflow-hidden bg-white/10 border border-white/15"
            >
              <label htmlFor="footer-newsletter" className="sr-only">{t('footer.newsletterPlaceholder')}</label>
              <input
                id="footer-newsletter"
                name="email"
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="flex-1 bg-transparent px-5 py-3 text-sm placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                aria-label={t('footer.newsletterButton')}
                className="px-4 bg-brand-500 hover:bg-brand-600 transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t('footer.liamGroupe')}</h4>
            <ul className="space-y-3 text-white/60">
              {fLinks.liamGroupe.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={p(l.to)}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `transition-colors block ${
                        isActive
                          ? "text-brand-400 font-semibold border-l-4 border-brand-500 -ml-1 pl-4"
                          : "text-white/60 hover:text-white pl-4"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t('footer.domains')}</h4>
            <ul className="space-y-3 text-white/60">
              {fLinks.domaines.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={p(l.to)}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `transition-colors block ${
                        isActive
                          ? "text-brand-400 font-semibold border-l-4 border-brand-500 -ml-1 pl-4"
                          : "text-white/60 hover:text-white pl-4"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t('footer.act')}</h4>
            <ul className="space-y-3 text-white/60">
              {fLinks.agir.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={p(l.to)}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `transition-colors block ${
                        isActive
                          ? "text-brand-400 font-semibold border-l-4 border-brand-500 -ml-1 pl-4"
                          : "text-white/60 hover:text-white pl-4"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">{t('footer.findUs')}</h4>
            <div className="space-y-3 text-white/60 text-sm">
              {siteInfo.address?.length > 0 && (
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-brand-500 shrink-0" />
                  <span>{siteInfo.address.join(", ")}</span>
                </p>
              )}
              {siteInfo.address?.length > 0 && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteInfo.address.join(", "))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors text-sm ml-7 -mt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t('footer.openInMaps')}</span>
                </a>
              )}
              {siteInfo.phones?.[0] && (
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                  <a href={`tel:${siteInfo.phones[0].replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                    {siteInfo.phones[0]}
                  </a>
                </p>
              )}
              {siteInfo.emails?.[0] && (
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                  <a href={`mailto:${siteInfo.emails[0]}`} className="hover:text-white transition-colors">
                    {siteInfo.emails[0]}
                  </a>
                </p>
              )}
              {siteInfo.hours?.[0] && (
                <p className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>{siteInfo.hours[0]}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center sm:text-left">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
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
                className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <NavLink to={p("/mentions-legales")} className={({ isActive }) => `transition-colors ${isActive ? "text-brand-400 font-semibold" : "text-white/50 hover:text-white"}`}>
              {t('footer.legal')}
            </NavLink>
            <NavLink to={p("/politique-de-confidentialite")} className={({ isActive }) => `transition-colors ${isActive ? "text-brand-400 font-semibold" : "text-white/50 hover:text-white"}`}>
              {t('footer.privacy')}
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
