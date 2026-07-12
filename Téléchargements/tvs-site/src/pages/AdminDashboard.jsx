import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, LogOut } from 'lucide-react'
import { clearAdminToken } from './AdminLogin'
import { adminFetch, TABS } from '../admin/helpers'
import { ToastProvider } from '../context/ToastContext'
import ConfirmModal from '../components/ConfirmModal'
import AdminNavbar from '../components/AdminNavbar'
import Overview from '../admin/Overview'
import OrdersSection from '../admin/OrdersSection'
import ProductsSection from '../admin/ProductsSection'
import PartsSection from '../admin/PartsSection'
import EventsSection from '../admin/EventsSection'
import { RaffleSection, CustomersSection } from '../admin/ListSections'

// ═══════════════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL — Layout Sidebar
// ═══════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    adminFetch('/stats').then(setStats).catch(() => {})
  }, [])

  const handleLogout = () => {
    setConfirm({
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      confirmLabel: 'Se déconnecter',
      variant: 'danger',
      onConfirm: () => {
        clearAdminToken()
        navigate('/admin/login')
      },
    })
  }

  const switchTab = (id) => {
    setTab(id)
    setSidebarOpen(false)
  }

  return (
    <ToastProvider>
    <div className="flex min-h-screen bg-ink text-white">
      {/* Overlay mobile pour la sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-ink-soft transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo + titre */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tvs-red/20">
            <BarChart3 size={20} className="text-tvs-red" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">Dashboard</h1>
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/35">TVS Bangui</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-display text-sm font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-tvs-red text-white shadow-lg shadow-tvs-red/25'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-white/40'} />
                {t.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bouton déconnexion */}
        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/50 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ─── CONTENU PRINCIPAL ─── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar activeTab={tab} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-8">
          {tab === 'overview' && stats && <Overview stats={stats} />}
          {tab === 'orders' && <OrdersSection />}
          {tab === 'products' && <ProductsSection />}
          {tab === 'parts' && <PartsSection />}
          {tab === 'events' && <EventsSection />}
          {tab === 'raffle' && <RaffleSection />}
          {tab === 'customers' && <CustomersSection />}
        </main>

        <ConfirmModal
          open={!!confirm}
          title={confirm?.title}
          message={confirm?.message}
          confirmLabel={confirm?.confirmLabel || 'Confirmer'}
          cancelLabel="Annuler"
          variant={confirm?.variant || 'danger'}
          onConfirm={() => {
            confirm?.onConfirm()
            setConfirm(null)
          }}
          onCancel={() => setConfirm(null)}
        />
      </div>
    </div>
    </ToastProvider>
  )
}
