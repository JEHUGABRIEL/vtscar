import { LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import DomainCard from "../components/DomainCard";
import HeroSlider from "../components/HeroSlider";
import { useDomains } from "../hooks/useSiteData";
import { imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function DomainsIndex() {
  const { t } = useTranslation();
  const { data: domains = [] } = useDomains();
  const sectionRef = useScrollReveal();

  return (
    <div className="font-body">
      <Navbar />

      {/* HERO SLIDER */}
      <HeroSlider
        slides={(() => {
          const raw = t('domainsIndex.hero.slides', { returnObjects: true });
          return Array.isArray(raw) ? raw.map((s) => ({
            image: imgHero("domaines-hero"),
            imageBlur: imgBlur("domaines-hero"),
            imageSrcSet: imgSrcSet("domaines-hero", [480, 768, 1024, 1280, 1600], 480, 'fill'),
            sizes: imgSizes('full'),
            alt: t('domainsIndex.heroAlt'),
            ...s,
          })) : [];
        })()}
        preloadSeed="domaines-hero"
        defaultBg={{ type: "gradient", value: "from-ink-900 via-ink to-ink-900" }}
      />

      <section className="py-24 px-6" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={LayoutGrid}
              eyebrow={t('domainsIndex.eyebrow')}
              variant="brand"
              title={t('domainsIndex.title')}
              description={t('domainsIndex.description')}
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
      <Footer />
    </div>
  );
}
