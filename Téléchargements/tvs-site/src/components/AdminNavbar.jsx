import { BarChart3, LogOut, ChevronRight, Menu } from 'lucide-react'

const TAB_NAMES = {
  overview: 'Vue d\'ensemble',
  orders: 'Commandes',
  products: 'Produits',
  parts: 'Pièces détachées',
  events: 'Événements',
  raffle: 'Tombola',
  customers: 'Clients',
}

export default function AdminNavbar({ activeTab, onLogout, onToggleSidebar }) {
  const title = TAB_NAMES[activeTab] || 'Dashboard'

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/90 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center justify-between px-5 py-3 lg:px-8">
        {/* Left: Brand + Page title */}
        <div className="flex items-center gap-3">
          {/* Burger menu (mobile only) */}
          <button
            onClick={onToggleSidebar}
            className="rounded-lg border border-white/15 p-2 text-white/60 hover:bg-white/5 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={18} />
          </button>

          {/* Logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-tvs-red to-tvs-red-dark shadow-sm shadow-tvs-red/20">
            <BarChart3 size={15} className="text-white" />
          </div>

          {/* Breadcrumb-style title */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-white/35">
              Admin
            </span>
            <ChevronRight size={12} className="text-white/20" />
            <h1 className="font-display text-base font-bold tracking-tight text-white">
              {title}
            </h1>
          </div>

          {/* Mobile title */}
          <h1 className="font-display text-base font-bold tracking-tight text-white sm:hidden">
            {title}
          </h1>
        </div>

        {/* Right: badge + logout */}
        <div className="flex items-center gap-4">
          {/* TVS badge */}
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-white/40">
              TVS Bangui
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/50 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}
