import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ChatBot from "./components/ChatBot";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Events = lazy(() => import("./pages/Events"));
const DomainsIndex = lazy(() => import("./pages/DomainsIndex"));
const Domain = lazy(() => import("./pages/Domain"));
const Admin = lazy(() => import("./pages/Admin"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm text-gray-400">{t("common.loading")}</p>
      </div>
    </div>
  );
}

function Layout() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  // Synchronise i18n avec le préfixe de langue dans l'URL
  useEffect(() => {
    if (lang && lang !== i18n.language?.split("-")[0]) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Synchronise le <title> et l'attribut lang="..." avec la langue active
  useEffect(() => {
    document.title = t("meta.siteTitle");
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      {!isAdmin && <ChatBot />}
    </ErrorBoundary>
  );
}

/** Redirige / vers /{lang} selon la détection i18n */
function RedirectToLang() {
  const { i18n } = useTranslation();
  const detected = i18n.language?.startsWith("en") ? "en" : "fr";
  return <Navigate to={`/${detected}`} replace />;
}

const router = createBrowserRouter([
  // Routes avec préfixe de langue
  {
    path: "/:lang",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "a-propos", element: <About /> },
      { path: "actualites", element: <News /> },
      { path: "actualites/:slug", element: <NewsArticle /> },
      { path: "evenements", element: <Events /> },
      { path: "domaines", element: <DomainsIndex /> },
      { path: "domaines/:slug", element: <Domain /> },
      { path: "mentions-legales", element: <MentionsLegales /> },
      { path: "politique-de-confidentialite", element: <PolitiqueConfidentialite /> },
      { path: "admin", element: <Admin /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  // Redirection depuis / vers la langue détectée
  {
    path: "/",
    element: <RedirectToLang />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
