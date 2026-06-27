import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export default function NewsCard({ item }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col h-full hover:lift transition-all duration-300 group">
      <div className="h-56 overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-600">
            {item.tag}
          </span>
          <span className="text-gray-400 text-sm">{item.date}</span>
        </div>
        <h3 className="font-heading font-bold text-lg leading-snug">{item.title}</h3>
        <p className="text-gray-500 mt-2 leading-relaxed flex-1">{item.excerpt}</p>
        <a
          href="#"
          className="mt-4 inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:gap-2.5 transition-all"
        >
          {t("common.readMore")} <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
