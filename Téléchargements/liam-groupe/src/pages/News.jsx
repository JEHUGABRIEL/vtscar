import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import HeroSlider from "../components/HeroSlider";
import { useNews } from "../hooks/useSiteData";
import { imgHero, imgBlur, imgSrcSet, imgSizes } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function News_() {
  const { t } = useTranslation();
  const { data: news = [] } = useNews();
  const sectionRef = useScrollReveal();

  return (
    <div className="font-body">
      <Navbar />

      {/* HERO SLIDER */}
      <HeroSlider
        slides={(() => {
          const raw = t('news.hero.slides', { returnObjects: true });
          return Array.isArray(raw) ? raw.map((s) => ({
            image: imgHero("actualites-hero"),
            imageBlur: imgBlur("actualites-hero"),
            imageSrcSet: imgSrcSet("actualites-hero", [480, 768, 1024, 1280, 1600], 480, 'fill'),
            sizes: imgSizes('full'),
            alt: t('news.heroAlt'),
            ...s,
          })) : [];
        })()}
        preloadSeed="actualites-hero"
        defaultBg={{ type: "gradient", value: "from-ink-900 via-ink to-ink-900" }}
      />

      <section className="py-24 px-6" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {news.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {news.map((n) => (
                <div key={n.slug} className="reveal">
                  <NewsCard item={n} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-gray-500 font-medium">{t('news.noNews')}</p>
              <p className="text-sm mt-1">{t('news.noNewsText')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
