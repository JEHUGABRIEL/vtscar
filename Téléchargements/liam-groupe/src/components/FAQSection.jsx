import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import useScrollReveal from "../hooks/useScrollReveal";

/**
 * FAQSection — accordéon de questions fréquentes.
 * Rassure les visiteurs (bénéficiaires, partenaires, sponsors) et
 * réduit la charge de support / questions répétées par email ou WhatsApp.
 */
export default function FAQSection() {
  const { t } = useTranslation();
  const sectionRef = useScrollReveal();
  const items = t("home.faq.items", { returnObjects: true });
  const list = Array.isArray(items) ? items : [];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 px-6 bg-gray-50" ref={sectionRef}>
      <div className="max-w-4xl mx-auto">
        <div className="reveal">
          <SectionHeading
            icon={HelpCircle}
            eyebrow={t("home.faq.eyebrow")}
            variant="blue"
            title={t("home.faq.title")}
            description={t("home.faq.description")}
          />
        </div>
        <div className="space-y-4 stagger-children">
          {list.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="reveal bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-ink">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-gray-500 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
