import { useEffect, useRef } from 'react'
import { AlertCircle, X, Loader2 } from 'lucide-react'

export default function ConfirmModal({
  open,
  title = 'Confirmer',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null)

  // Focus le bouton de confirmation à l'ouverture
  useEffect(() => {
    if (open && confirmRef.current) {
      confirmRef.current.focus()
    }
  }, [open])

  // Fermer avec Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  // Bloquer le scroll du body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const isDanger = variant === 'danger'
  const confirmBg = isDanger
    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500/40'
    : 'bg-tvs-red hover:bg-tvs-red-dark focus:ring-tvs-red/40'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-sm animate-[fadeIn_0.2s_ease-out,slideUp_0.25s_ease-out] rounded-2xl border border-white/10 bg-ink-soft p-6 shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-lg p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            isDanger ? 'bg-red-500/15 text-red-400' : 'bg-tvs-red/15 text-tvs-red'
          }`}
        >
          {isDanger ? (
            <AlertCircle size={24} />
          ) : (
            <AlertCircle size={24} />
          )}
        </div>

        {/* Title */}
        <h2
          id="confirm-title"
          className="text-center font-display text-lg font-bold text-white"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 text-center text-sm leading-relaxed text-white/60">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 ${confirmBg} ${
              loading ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Suppression…
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
