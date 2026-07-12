import { useState, useEffect, useRef } from 'react'
import { X, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react'

export default function ContactFormModal({ open, onClose }) {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [closing, setClosing] = useState(false)
  const overlayRef = useRef(null)

  // Fermeture avec animation
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 300)
  }

  // Reset du formulaire à l'ouverture
  useEffect(() => {
    if (open) {
      setSubmitted(false)
      setForm({ nom: '', email: '', telephone: '', message: '' })
    }
  }, [open])

  // Fermeture au clic sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose()
  }

  // Fermeture avec Échap
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulation envoi — à connecter à une API plus tard
    setSubmitted(true)
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
      aria-label="Formulaire de contact"
    >
      <div
        className={`w-full max-w-lg rounded-2xl bg-paper-raised shadow-2xl transition-all duration-300 ${
          closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-ink px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <Phone size={18} className="text-tvs-red" />
            <h2 className="font-display text-xl font-semibold">Nous contacter</h2>
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
          {submitted ? (
            /* Succès */
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 size={56} className="text-tvs-blue" />
              <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                Message envoyé !
              </h3>
              <p className="mt-2 max-w-sm text-sm text-steel">
                Merci {form.nom} ! Notre équipe vous recontactera dans les plus brefs délais.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 rounded-full bg-tvs-blue px-6 py-2.5 font-display text-base font-semibold text-white transition-colors hover:bg-tvs-blue-dark"
              >
                Fermer
              </button>
            </div>
          ) : (
            /* Formulaire */
            <>
              {/* Infos showroom */}
              <div className="mb-6 grid gap-2 rounded-xl bg-tvs-blue-tint p-4 text-sm text-ink/85">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="shrink-0 text-tvs-blue" />
                  Avenue de l'Indépendance, PK0, Bangui
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={15} className="shrink-0 text-tvs-blue" />
                  +236 70 00 00 00
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={15} className="shrink-0 text-tvs-blue" />
                  contact@tvs-bangui.cf
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-nom" className="block text-sm font-medium text-ink">
                    Nom complet <span className="text-tvs-red">*</span>
                  </label>
                  <input
                    id="contact-nom"
                    name="nom"
                    required
                    value={form.nom}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-blue"
                    placeholder="Ex : Jean-Paul Ngaïssona"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-ink">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-blue"
                      placeholder="exemple@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-telephone" className="block text-sm font-medium text-ink">
                      Téléphone <span className="text-tvs-red">*</span>
                    </label>
                    <input
                      id="contact-telephone"
                      name="telephone"
                      required
                      value={form.telephone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-blue"
                      placeholder="70 00 00 00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-ink">
                    Message <span className="text-tvs-red">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none transition-colors focus:border-tvs-blue"
                    placeholder="Bonjour, je souhaite avoir plus d'informations sur..."
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-tvs-red px-6 py-3 font-display text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-tvs-red/30"
                >
                  <Send size={16} />
                  Envoyer le message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
