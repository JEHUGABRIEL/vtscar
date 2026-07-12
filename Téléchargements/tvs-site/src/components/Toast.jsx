import { useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const COLORS = {
  success: {
    bg: 'bg-emerald-500/15 border-emerald-500/30',
    icon: 'text-emerald-400',
    text: 'text-emerald-200',
  },
  error: {
    bg: 'bg-red-500/15 border-red-500/30',
    icon: 'text-red-400',
    text: 'text-red-200',
  },
  info: {
    bg: 'bg-blue-500/15 border-blue-500/30',
    icon: 'text-blue-400',
    text: 'text-blue-200',
  },
}

export default function Toast({ id, type = 'info', message, onDismiss, duration = 4000 }) {
  const Icon = ICONS[type] || Info
  const colors = COLORS[type] || COLORS.info

  const dismiss = useCallback(() => onDismiss?.(id), [id, onDismiss])

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(dismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, dismiss])

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-lg animate-[toastIn_0.35s_cubic-bezier(0.16,1,0.3,1)_both] ${colors.bg}`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${colors.icon}`} />
      <p className={`flex-1 text-sm font-medium leading-snug ${colors.text}`}>{message}</p>
      <button
        onClick={dismiss}
        className="shrink-0 rounded-lg p-0.5 opacity-50 transition-opacity hover:opacity-100"
        aria-label="Fermer"
      >
        <X size={14} className="text-white/70" />
      </button>
    </div>
  )
}
