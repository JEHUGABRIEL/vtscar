import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../lib/langPath";
import { Home, ArrowLeft, Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  const { t } = useTranslation();
  const p = useLangPath();

  return (
    <div className="font-body">
      <Navbar transparentOnTop={false} />

      <section className="min-h-[70vh] flex items-center justify-center px-6 pt-[88px]">
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center">
            <Compass className="w-10 h-10" />
          </div>
          <p className="font-heading font-extrabold text-7xl text-brand-500 mb-3">404</p>
          <h1 className="font-heading font-bold text-2xl md:text-3xl mb-4">{t("notFound.title")}</h1>
          <p className="text-gray-500 leading-relaxed mb-9">{t("notFound.text")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={p("/")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
            >
              <Home className="w-4 h-4" /> {t("notFound.home")}
            </Link>
            <Link
              to={p("/evenements")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gray-200 hover:border-gray-300 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {t("notFound.events")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
