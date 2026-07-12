import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Loader2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { adminFetch, formatDate } from './helpers'
import ConfirmModal from '../components/ConfirmModal'
import ImageUpload from '../components/ImageUpload'

export default function EventsSection() {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ id: '', slug: '', title: '', eventDate: '', location: '', excerpt: '', description: '', image: '' })

  useEffect(() => { adminFetch('/events').then(setEvents) }, [])

  const openNew = () => {
    setEdit(null)
    setForm({ id: '', slug: '', title: '', eventDate: '', location: '', excerpt: '', description: '', image: '' })
    setShowForm(true)
  }

  const openEdit = (e) => {
    setEdit(e)
    setForm({
      id: e.id, slug: e.slug, title: e.title,
      eventDate: e.event_date?.slice(0, 10) || '',
      location: e.location || '', excerpt: e.excerpt || '',
      description: e.description || '', image: e.image || '',
    })
    setShowForm(true)
  }

  const addToast = useToast()
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.id || !form.slug || !form.title || !form.eventDate) return
    setSaving(true)
    try {
      await adminFetch('/events', { method: 'POST', body: JSON.stringify(form) })
      setShowForm(false)
      addToast({ type: 'success', message: edit ? ('\u00c9v\u00e9nement \u00ab ' + form.title + ' \u00bb mis \u00e0 jour') : ('\u00c9v\u00e9nement \u00ab ' + form.title + ' \u00bb cr\u00e9\u00e9') })
      adminFetch('/events').then(setEvents)
    } catch {
      addToast({ type: 'error', message: "Erreur lors de l'enregistrement de l'\u00e9v\u00e9nement" })
    } finally {
      setSaving(false)
    }
  }

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const remove = async (id) => {
    setConfirmDelete({ id, title: "Supprimer l'\u00e9v\u00e9nement", message: '\u00cates-vous s\u00fbr de vouloir supprimer cet \u00e9v\u00e9nement ? Cette action est irr\u00e9versible.', confirmLabel: 'Supprimer', variant: 'danger' })
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl font-bold text-white">\u00c9v\u00e9nements</h2>
        <button onClick={openNew} className="ml-auto flex items-center gap-1.5 rounded-lg bg-tvs-red px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-tvs-red-dark"><Plus size={14} /> Ajouter</button>
      </div>

      {showForm && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="ID (ex: mon-event)" className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30" disabled={!!edit} />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (ex: mon-event)" className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30" />
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre de l'\u00e9v\u00e9nement" className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30" />
            <input value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} type="date" className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lieu" className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30" />
            <div className="sm:col-span-1">
              <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="Image de l'\u00e9v\u00e9nement" />
            </div>
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Extrait (court)" rows={2} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 sm:col-span-3" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description compl\u00e8te" rows={3} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/30 sm:col-span-3" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={save} disabled={saving} className={'rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-tvs-red/40 ' + (saving ? 'cursor-not-allowed bg-tvs-red/60' : 'bg-tvs-red hover:bg-tvs-red-dark')}>
              {saving ? (
                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />{edit ? 'Mise \u00e0 jour\u2026' : 'Cr\u00e9ation\u2026'}</span>
              ) : (edit ? 'Mettre \u00e0 jour' : 'Cr\u00e9er')}
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/60 hover:bg-white/10">Annuler</button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-1">
        {events.length === 0 && <p className="py-8 text-center text-sm text-white/40">Aucun \u00e9v\u00e9nement</p>}
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-4 rounded-lg border border-white/10 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{e.title}</p>
              <p className="font-mono text-[11px] text-white/40">{formatDate(e.event_date)} \u00b7 {e.location || '-'}</p>
            </div>
            <button onClick={() => openEdit(e)} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"><Edit3 size={14} /></button>
            <button onClick={() => remove(e.id)} className="rounded p-1.5 text-white/40 transition-colors hover:bg-red-500/20 hover:text-tvs-red"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!confirmDelete}
        title={confirmDelete?.title}
        message={confirmDelete?.message}
        confirmLabel={confirmDelete?.confirmLabel || 'Supprimer'}
        variant={confirmDelete?.variant || 'danger'}
        loading={deleting}
        onConfirm={async () => {
          if (!confirmDelete?.id) return
          setDeleting(true)
          try {
            await adminFetch('/events/' + confirmDelete.id, { method: 'DELETE' })
            setConfirmDelete(null)
            addToast({ type: 'success', message: '\u00c9v\u00e9nement supprim\u00e9 avec succ\u00e8s' })
            adminFetch('/events').then(setEvents)
          } catch {
            addToast({ type: 'error', message: "Erreur lors de la suppression de l'\u00e9v\u00e9nement" })
          } finally {
            setDeleting(false)
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
