/**
 * routePrefetch — Préchargement des chunks de pages au survol des liens.
 *
 * Chaque import() correspond à un React.lazy(() => import("...")) dans App.jsx.
 * Appeler l'import() avant la navigation déclenche le téléchargement du chunk
 * pour que la page soit déjà disponible au moment du clic.
 */

const routeImporters = {
  "/a-propos": () => import("../pages/About"),
  "/actualites": () => import("../pages/News"),
  "/evenements": () => import("../pages/Events"),
  "/domaines": () => import("../pages/DomainsIndex"),
  "/admin": () => import("../pages/Admin"),
};

const prefetched = new Set();

/**
 * Déclenche le préchargement du chunk correspondant à un chemin.
 * Ne fait rien si déjà préchargé.
 */
export function prefetchRoute(path) {
  if (!path || prefetched.has(path)) return;

  const importer = routeImporters[path];
  if (importer) {
    prefetched.add(path);
    importer().catch(() => {});
    return;
  }

  // Pages dynamiques : /domaines/:slug → toutes partagent le même chunk Domain
  if (path.startsWith("/domaines/") && !prefetched.has("__domain")) {
    prefetched.add("__domain");
    import("../pages/Domain").catch(() => {});
  }
}
