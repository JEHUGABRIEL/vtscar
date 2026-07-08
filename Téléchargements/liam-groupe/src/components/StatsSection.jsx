import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useScrollReveal from "../hooks/useScrollReveal";

/**
 * StatsSection — bandeau de chiffres clés avec compteur animé.
 * Élément de crédibilité incontournable sur les sites d'organisations
 * événementielles / associatives professionnelles.
 */
export default function StatsSection() {
  const { t } = useTranslation();
  const sectionRef = useScrollReveal();
  const stats = t("home.stats.items", { returnObjects: true });
  const list = Array.isArray(stats) ? stats : [];

  return (
    <section className="relative bg-ink py-20 px-6 overflow-hidden" ref={sectionRef}>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(226,27,34,0.25), transparent 55%), radial-gradient(circle at 85% 75%, rgba(226,27,34,0.15), transparent 55%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
          {list.map((item, i) => (
            <div key={i} className="reveal text-center">
              <Counter value={item.value} suffix={item.suffix} />
              <p className="text-white/60 mt-2 text-sm md:text-base font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix = "" }) {
  const target = parseInt(String(value).replace(/\D/g, ""), 10) || 0;
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <p ref={ref} className="font-heading font-extrabold text-4xl md:text-5xl text-white">
      {display.toLocaleString("fr-FR")}
      <span className="text-brand-500">{suffix}</span>
    </p>
  );
}
