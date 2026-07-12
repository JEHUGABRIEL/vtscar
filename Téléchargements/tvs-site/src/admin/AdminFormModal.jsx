import { useEffect, useCallback, useRef } from 'react'
import { X } from 'lucide-react'

const FOCUSABLE_SELECTOR =
  'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'

export default function AdminFormModal({ open, onClose, title, children }) {
  const modalRef = useRef(null)

  const trapFocus = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const modal = modalRef.current
      if (!modal) return

      const focusable = modal.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return

    document.addEventListener('keydown', trapFocus)
    document.body.style.overflow = 'hidden'

    // Auto-focus the first focusable element
    const raf = requestAnimationFrame(() => {
      const modal = modalRef.current
      if (modal) {
        const first = modal.querySelector(FOCUSABLE_SELECTOR)
        if (first) first.focus()
      }
    })

    return () => {
      document.removeEventListener('keydown', trapFocus)
      document.body.style.overflow = ''
      cancelAnimationFrame(raf)
    }
  }, [open, trapFocus])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-modal-overlay" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-xl animate-modal-content overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-display text-base font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modal-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-content-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-overlay {
          animation: modal-overlay-in 0.15s ease-out;
        }
        .animate-modal-content {
          animation: modal-content-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
