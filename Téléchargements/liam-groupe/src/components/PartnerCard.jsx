import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

export default function PartnerCard({ partner }) {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full hover:lift transition-all duration-300">
      <div className="p-8 pb-6">
        {partner.logo ? (
          <div className="w-20 h-20 flex items-center justify-center mb-4">
            <img
              src={partner.logo}
              alt={partner.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-heading font-bold text-2xl mb-4"
            style={{ backgroundColor: partner.color }}
          >
            {partner.initial}
          </div>
        )}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-gray-600 tracking-wide uppercase">
          {partner.category}
        </span>
      </div>
      <div className="px-8 pb-8 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-xl">{partner.name}</h3>
        <p className="text-gray-400 italic text-sm mt-1 mb-4">{partner.subtitle}</p>
        <p className="text-gray-500 leading-relaxed flex-1">{partner.description}</p>
        <div className="mt-5 pt-5 border-t border-gray-200">
          <p className="text-xs font-bold tracking-wide uppercase text-gray-700 mb-1.5">
            {t("partnerCard.collaboration")}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">{partner.collaboration}</p>
        </div>
        {partner.website && (
          <a
            href={partner.website}
            className="mt-4 inline-flex items-center gap-1.5 text-brand-600 font-semibold text-sm"
          >
            {t("partnerCard.visitWebsite")} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
