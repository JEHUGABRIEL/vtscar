import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ImageOff } from "lucide-react";
import { useLangPath } from "../lib/langPath";
import SafeImg from "./SafeImg";

export default function NewsCard({ item }) {
  const { t } = useTranslation();
  const p = useLangPath();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col h-full hover:lift transition-all duration-300 group">
      <Link to={p(`/actualites/${item.slug}`)} className="h-56 overflow-hidden block">
        <SafeImg src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" icon={ImageOff} />
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-600">
            {item.tag}
          </span>
          <span className="text-gray-400 text-sm">{item.date}</span>
        </div>
        <h3 className="font-heading font-bold text-lg leading-snug">
          <Link to={p(`/actualites/${item.slug}`)} className="hover:text-brand-600 transition-colors">
            {item.title}
          </Link>
        </h3>
        <p className="text-gray-500 mt-2 leading-relaxed flex-1">{item.excerpt}</p>
        <Link
          to={p(`/actualites/${item.slug}`)}
          className="mt-4 inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:gap-2.5 transition-all"
        >
          {t("common.readMore")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
