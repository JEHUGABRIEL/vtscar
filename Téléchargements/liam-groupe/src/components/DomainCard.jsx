import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DomainIcon } from "./DomainIcon";

export default function DomainCard({ domain }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col hover:lift transition-all duration-300 group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={domain.cardImage}
          alt={domain.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-600 shadow">
          <DomainIcon icon={domain.icon} className="w-5 h-5" />
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-xl">{domain.name}</h3>
        <p className="text-brand-500 text-sm font-semibold tracking-wide uppercase mt-1 mb-3">
          {domain.category}
        </p>
        <p className="text-gray-500 leading-relaxed flex-1">{domain.shortDescription}</p>
        <Link
          to={`/domaines/${domain.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:gap-2.5 transition-all"
        >
          {t("common.discover")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
