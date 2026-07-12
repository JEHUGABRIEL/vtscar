import { useState, useEffect, useRef } from 'react'
import { X, Gift, Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function TombolaForm({ open, onClose }) {
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', quartier: '', acceptTerms: false })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [closing, setClosing] = useState(false)
  const overlayRef = useRef(null)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 300)
  }

  useEffect(() => {
    if (open) {
      setStatus('idle')
      setErrorMsg('')
      setForm({ nom: '', telephone: '', email: '', quartier: '', acceptTerms: false })
    }
  }, [open])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose()
  }

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/raffle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription")
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || "Une erreur s'est produite. Veuillez réessayer.")
    }
  }

  if (!open && !closing) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm transition-all duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Inscription à la tombola"
    >
      <div
        className={`w-full max-w-lg rounded-2xl bg-paper-raised shadow-2xl transition-all duration-300 ${
          closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-ink px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Gift size={18} className="text-tvs-red" />
            <h2 className="font-display text-xl font-semibold">Tombola TVS</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 transition-colors hover:bg-white/10"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {status === 'success' ? (
            /* Succès */
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 size={56} className="text-tvs-red" />
              <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                Inscription réussie !
              </h3>
              <p className="mt-2 max-w-sm text-sm text-steel">
                Merci {form.nom} ! Vous êtes inscrit(e) à la tombola TVS. Le tirage au sort aura
                lieu le 13 septembre 2026 au showroom PK0. Bonne chance !
              </p>
              <button
                onClick={handleClose}
                className="mt-6 rounded-full bg-tvs-red px-6 py-2.5 font-display text-base font-semibold text-white transition-colors hover:bg-tvs-red-dark"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prize highlight */}
              <div className="rounded-xl border border-tvs-red/20 bg-tvs-red-tint p-4 text-center">
                <p className="font-display text-lg font-bold text-tvs-red">
                  🎁 1er lot : TVS Jupiter 125
                </p>
                <p className="mt-1 text-sm text-steel">
                  + casques, bons d'achat et accessoires à gagner
                </p>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={16} className="shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="raffle-nom" className="block text-sm font-medium text-ink">
                  Nom complet <span className="text-tvs-red">*</span>
                </label>
                <input
                  id="raffle-nom"
                  name="nom"
                  required
                  value={form.nom}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-red"
                  placeholder="Ex : Jean-Paul Ngaïssona"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="raffle-telephone" className="block text-sm font-medium text-ink">
                    Téléphone <span className="text-tvs-red">*</span>
                  </label>
                  <input
                    id="raffle-telephone"
                    name="telephone"
                    required
                    value={form.telephone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-red"
                    placeholder="70 00 00 00"
                  />
                </div>
                <div>
                  <label htmlFor="raffle-email" className="block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    id="raffle-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-red"
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="raffle-quartier" className="block text-sm font-medium text-ink">
                  Quartier / Secteur
                </label>
                <input
                  id="raffle-quartier"
                  name="quartier"
                  value={form.quartier}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-red"
                  placeholder="Ex : PK0, Sica, Boy-Rabe…"
                />
              </div>

              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  required
                  className="mt-0.5 shrink-0 accent-tvs-red"
                />
                <span className="text-sm text-ink/80">
                  J'accepte de participer à la tombola TVS et autorise l'utilisation de mes
                  informations pour le tirage au sort et la communication des résultats.{' '}
                  <span className="text-tvs-red">*</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-tvs-red px-6 py-3 font-display text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-tvs-red/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Inscription en cours…
                  </>
                ) : (
                  <>
                    <Gift size={16} />
                    Participer à la tombola
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
