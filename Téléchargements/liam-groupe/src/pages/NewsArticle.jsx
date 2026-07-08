import { Link, useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang, langPath } from "../lib/langPath";
import { ArrowLeft, CalendarDays, User, ImageOff } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import SafeImg from "../components/SafeImg";
import { FacebookIcon, XIcon } from "../components/SocialIcons";
import { useNews } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function NewsArticle() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const lang = useLang();
  const { data: news = [], isLoading } = useNews();
  const article = news.find((n) => n.slug === slug);
  const related = news.filter((n) => n.slug !== slug).slice(0, 3);
  const contentRef = useScrollReveal();
  const relatedRef = useScrollReveal();

  if (!isLoading && news.length > 0 && !article) {
    return <Navigate to={langPath(lang, "/actualites")} replace />;
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const paragraphs =
    Array.isArray(article?.content) && article.content.length > 0
      ? article.content
      : article?.excerpt
      ? [article.excerpt]
      : [];

  return (
    <div className="font-body">
      <Navbar transparentOnTop={false} />

      <div className="pt-[120px] pb-6 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to={langPath(lang, "/actualites")}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-brand-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("newsArticle.back")}
          </Link>
        </div>
      </div>

      {article && (
        <>
          <section className="px-6">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-600 mb-4">
                {article.tag}
              </span>
              <h1 className="font-heading font-extrabold text-3xl md:text-5xl leading-tight mb-5">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm mb-8">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> {article.date}
                </span>
                {article.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" /> {article.author}
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className="px-6 mb-10">
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden h-[280px] md:h-[440px]">
              <SafeImg src={article.image} alt={article.title} className="w-full h-full object-cover" icon={ImageOff} />
            </div>
          </section>

          <section className="px-6 pb-20 bg-white" ref={contentRef}>
            <div className="max-w-3xl mx-auto reveal">
              <div className="prose-none space-y-5 text-gray-700 leading-relaxed text-lg">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                <p className="font-heading font-bold text-ink">{t("newsArticle.shareTitle")}</p>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${article.title} — ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor">
                      <path d="M16.004 3C9.373 3 4 8.373 4 15.004c0 2.478.727 4.79 1.984 6.73L4.5 28.5l6.938-1.822a11.94 11.94 0 0 0 4.566.907h.005c6.63 0 12.004-5.373 12.004-12.004C28.013 8.373 22.64 3 16.004 3Z" />
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {related.length > 0 && (
        <section className="px-6 pb-24 bg-gray-50 pt-16" ref={relatedRef}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-10 reveal">
              {t("newsArticle.relatedTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {related.map((n) => (
                <div key={n.slug} className="reveal">
                  <NewsCard item={n} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
