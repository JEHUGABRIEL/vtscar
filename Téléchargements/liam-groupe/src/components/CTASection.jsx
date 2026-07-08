import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../lib/langPath";
import useScrollReveal from "../hooks/useScrollReveal";

export function ActCTA({ title }) {
  const { t } = useTranslation();
  const p = useLangPath();
  const sectionRef = useScrollReveal();
  return (
    <section className="bg-brand-50/40 py-20 px-6" ref={sectionRef}>
      <div className="max-w-3xl mx-auto text-center reveal">
        <div className="flex items-center justify-center gap-3 text-brand-500 font-semibold tracking-[0.2em] text-xs uppercase mb-4">
          <span className="h-px w-10 bg-brand-500/40" />
          {t('domain.cta.eyebrow')}
          <span className="h-px w-10 bg-brand-500/40" />
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 reveal">{title}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed reveal" dangerouslySetInnerHTML={{ __html: t('domain.cta.description') }} />
        <div className="flex flex-wrap items-center justify-center gap-4 reveal">
          <Link
            to={p("/a-propos")}
            className="px-7 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
          >
            {t('domain.cta.contact')}
          </Link>
          <Link
            to={p("/evenements")}
            className="px-7 py-3 rounded-full border border-gray-300 hover:border-gray-400 font-semibold transition-colors"
          >
            {t('domain.cta.viewEvents')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function JoinCTA() {
  const { t } = useTranslation();
  const sectionRef = useScrollReveal();

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative bg-ink py-24 px-6 overflow-hidden" ref={sectionRef}>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(226,27,34,0.25), transparent 60%), radial-gradient(circle at 70% 70%, rgba(156,5,250,0.2), transparent 55%)",
        }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-white leading-tight reveal">
          {t('home.joinCTA.title1')}
          <br />
          <span className="text-brand-500">{t('home.joinCTA.title2')}</span>
        </h2>
        <p className="text-white/60 mt-6 mb-9 leading-relaxed max-w-xl mx-auto reveal">
          {t('home.joinCTA.description')}
        </p>
        <a
          href="#contact"
          onClick={scrollToContact}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors reveal cursor-pointer no-underline"
        >
          <Mail className="w-5 h-5" />
          {t('home.joinCTA.cta')}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
