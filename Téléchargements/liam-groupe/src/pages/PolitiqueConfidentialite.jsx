import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import { useSiteInfo } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function PolitiqueConfidentialite() {
  const { t } = useTranslation();
  const { data: siteInfo = {} } = useSiteInfo();
  const sectionRef = useScrollReveal();
  const sections = t("legal.privacy.sections", { returnObjects: true });
  const list = Array.isArray(sections) ? sections : [];

  return (
    <div className="font-body">
      <Navbar transparentOnTop={false} />

      <section className="pt-[140px] pb-24 px-6" ref={sectionRef}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={ShieldCheck}
              eyebrow={t("legal.privacy.eyebrow")}
              title={t("legal.privacy.title")}
              align="left"
            />
          </div>
          <div className="space-y-8 stagger-children">
            {list.map((s, i) => (
              <div key={i} className="reveal">
                <h2 className="font-heading font-bold text-xl mb-2">{s.heading}</h2>
                <p className="text-gray-500 leading-relaxed">
                  {s.text?.replace("{{email}}", siteInfo.emails?.[0] || "")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
