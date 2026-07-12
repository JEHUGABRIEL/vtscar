import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, Wrench, Phone, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import ContactFormModal from './ContactFormModal.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Accueil', end: true },
  {
    label: 'Produits',
    dropdown: true,
    items: [
      { to: '/produits/motos', label: 'Motos' },
      { to: '/produits/moteurs', label: 'Moteurs' },
      { to: '/produits/tricycles', label: 'Tricycles' },
    ],
  },
  { to: '/quincaillerie', label: 'Quincaillerie' },
  { to: '/evenements', label: 'Événements' },
  { to: '/a-propos', label: 'À propos' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [bannerClosing, setBannerClosing] = useState(false)
  const bannerTimerRef = useRef(null)
  const { totalItems } = useCart()
  const location = useLocation()

  const handleCloseContact = useCallback(() => setContactOpen(false), [])

  // Ferme la modale au changement de page
  useEffect(() => {
    setContactOpen(false)
  }, [location.pathname])

  const closeBanner = () => {
    setBannerClosing(true)
    bannerTimerRef.current = setTimeout(() => {
      setBannerVisible(false)
      setBannerClosing(false)
    }, 400)
  }

  // Cleanup du timer si le composant est démonté
  useEffect(() => {
    return () => clearTimeout(bannerTimerRef.current)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-paper-raised text-ink border-b border-line">
      {/* Bandeau au-dessus de la navbar — fermable */}
      {bannerVisible && (
        <div
          className={`flex items-center gap-2 bg-tvs-red px-5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-white/95 transition-all duration-300 ease-in-out lg:px-8 ${
            bannerClosing ? 'max-h-0 -translate-y-full overflow-hidden py-0 opacity-0' : 'max-h-12 opacity-100'
          }`}
        >
          <Wrench size={12} className="shrink-0" />
          {/* Texte qui défile sur mobile, statique sur desktop */}
          <span className="flex-1 overflow-hidden lg:truncate">
            <span className="inline-flex animate-[marquee_12s_linear_infinite] gap-8 whitespace-nowrap lg:animate-none lg:gap-0 lg:whitespace-normal">
              <span>
                Pièces détachées disponibles en boutique —{' '}
                <Link
                  to="/quincaillerie"
                  className="animate-[pulse-soft_2s_ease-in-out_infinite,bounce-soft_2s_ease-in-out_infinite] font-semibold underline underline-offset-2 hover:no-underline hover:animate-none"
                >
                  Voir les pièces
                </Link>
              </span>
              {/* Duplicate pour effet de défilement continu */}
              <span aria-hidden="true">
                Pièces détachées disponibles en boutique —{' '}
                <Link
                  to="/quincaillerie"
                  tabIndex={-1}
                  className="font-semibold underline underline-offset-2"
                >
                  Voir les pièces
                </Link>
              </span>
            </span>
          </span>
          <button
            onClick={closeBanner}
            className="ml-1 shrink-0 rounded p-0.5 transition-colors hover:bg-white/20"
            aria-label="Fermer le bandeau"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-3xl font-bold tracking-tight">
            TVS<span className="text-tvs-red">.</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-steel sm:block">
            Bangui
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="group relative">
                <button
                  className={`flex items-center gap-1 font-display text-lg font-medium tracking-wide transition-colors ${
                    location.pathname.startsWith('/produits')
                      ? 'text-tvs-red'
                      : 'text-ink/75 hover:text-ink'
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </button>
                <div className="absolute left-0 top-full z-50 mt-1 w-48 origin-top-left scale-95 rounded-xl border border-line bg-paper-raised p-1.5 opacity-0 shadow-xl shadow-ink/5 transition-all duration-200 ease-out group-hover:scale-100 group-hover:opacity-100">
                  {link.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block rounded-lg px-3.5 py-2.5 font-display text-base font-medium tracking-wide transition-colors ${
                          isActive
                            ? 'bg-tvs-red/10 text-tvs-red'
                            : 'text-ink/75 hover:bg-ink/5 hover:text-ink'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `font-display text-lg font-medium tracking-wide transition-colors ${
                    isActive ? 'text-tvs-red' : 'text-ink/75 hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setContactOpen(true)}
            className="hidden items-center gap-1.5 rounded-full bg-tvs-red px-3 py-1.5 font-display text-xs font-semibold tracking-wide text-white transition-all hover:scale-[1.04] hover:shadow-lg hover:shadow-tvs-red/30 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm lg:flex"
          >
            <Phone size={14} className="sm:size-4" />
            <span>Nous contacter</span>
          </button>
          <Link
            to="/panier"
            className="relative flex items-center gap-2 rounded-full border border-line px-3 py-2 transition-colors hover:border-tvs-red"
            aria-label="Voir le panier"
          >
            <ShoppingCart size={18} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-tvs-red font-mono text-[11px] font-semibold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="rounded-full border border-line p-2 transition-colors hover:border-ink/30 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex h-screen flex-col gap-1 overflow-y-auto border-t border-line bg-paper-raised px-5 pb-8 pt-2">
          {/* Bouton Nous contacter dans le menu mobile */}
          <button
            onClick={() => {
              setContactOpen(true)
              setOpen(false)
            }}
            className="flex w-full items-center gap-2.5 rounded-md bg-tvs-red px-3 py-2.5 font-display text-base font-semibold tracking-wide text-white transition-colors hover:bg-tvs-red-dark"
          >
            <Phone size={16} />
            Nous contacter
          </button>

          <div className="my-1 border-t border-line" />

          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.label}>
                <button
                  onClick={() => setMobileSubmenuOpen(link.label === mobileSubmenuOpen ? null : link.label)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 font-display text-lg tracking-wide ${
                    location.pathname.startsWith('/produits')
                      ? 'bg-ink/5 text-tvs-red'
                      : 'text-ink/80'
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      mobileSubmenuOpen === link.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    mobileSubmenuOpen === link.label ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {link.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-md px-6 py-2 font-display text-base tracking-wide ${
                          isActive ? 'bg-ink/5 text-tvs-red' : 'text-ink/70'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 font-display text-lg tracking-wide ${
                    isActive ? 'bg-ink/5 text-tvs-red' : 'text-ink/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {/* Modal formulaire de contact */}
      <ContactFormModal
        open={contactOpen}
        onClose={handleCloseContact}
      />
    </header>
  )
}
