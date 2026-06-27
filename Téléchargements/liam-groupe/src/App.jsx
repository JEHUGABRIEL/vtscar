import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));
const DomainsIndex = lazy(() => import("./pages/DomainsIndex"));
const Domain = lazy(() => import("./pages/Domain"));
const Partners = lazy(() => import("./pages/Partners"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm text-gray-400">Chargement…</p>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/a-propos", element: <About /> },
      { path: "/actualites", element: <News /> },
      { path: "/evenements", element: <Events /> },
      { path: "/domaines", element: <DomainsIndex /> },
      { path: "/domaines/:slug", element: <Domain /> },
      { path: "/partenaires", element: <Partners /> },
      { path: "/contact", element: <Contact /> },
      { path: "/admin", element: <Admin /> },
      { path: "*", element: <Home /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
