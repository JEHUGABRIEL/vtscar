import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTestimonials } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function TestimonialCarousel() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const { data: testimonials = [] } = useTestimonials();
  const pages = [testimonials, [...testimonials.slice(1), testimonials[0]]];
  const sectionRef = useScrollReveal();

  return (
    <div ref={sectionRef}>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {pages[page].map((t, i) => (
            <div
              key={t.name + i}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-7 reveal hover:lift transition-all duration-300"
            >
              <div className="flex gap-1 text-amber-400 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPage((p) => (p === 0 ? pages.length - 1 : p - 1))}
          aria-label={t("carousel.previous")}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPage((p) => (p + 1) % pages.length)}
          aria-label={t("carousel.next")}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={t("carousel.page", { page: i + 1 })}
            className={`h-2 rounded-full transition-all ${
              i === page ? "w-7 bg-brand-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
