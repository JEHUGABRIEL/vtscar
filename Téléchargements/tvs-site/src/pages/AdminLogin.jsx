import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, LogIn, Eye, EyeOff } from 'lucide-react'

const ADMIN_TOKEN_KEY = 'tvs-admin-token'

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion')
        return
      }

      localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      navigate('/admin')
    } catch {
      setError('Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ink to-ink-soft px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tvs-red/20">
              <ShieldAlert size={28} className="text-tvs-red" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-white">
              Admin TVS
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Accès réservé — connectez-vous
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe administrateur"
                autoFocus
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 pr-11 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-tvs-red focus:ring-1 focus:ring-tvs-red/40"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
                aria-label={showPwd ? 'Masquer' : 'Afficher'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="rounded-lg bg-tvs-red/15 px-3 py-2 text-xs text-tvs-red">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!password || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-tvs-red py-3 font-display text-base font-semibold text-white transition-all hover:bg-tvs-red-dark disabled:opacity-40"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Se connecter
                </span>
              )}
            </button>
          </form>

          {/* Lien retour au site */}
          <a
            href="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Retour sur le site
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          Dashboard d'administration TVS Bangui
        </p>
      </div>
    </div>
  )
}
