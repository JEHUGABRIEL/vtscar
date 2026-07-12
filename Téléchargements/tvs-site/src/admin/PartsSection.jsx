import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Search, Loader2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { adminFetch, formatFCFA } from './helpers'
import ConfirmModal from '../components/ConfirmModal'
import ImageUpload from '../components/ImageUpload'
import AdminFormModal from './AdminFormModal'

export default function PartsSection() {
  const [parts, setParts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ id: '', slug: '', name: '', category: '', price: '', stock: '0', compatibleModels: '', image: '' })
  const [search, setSearch] = useState('')

  useEffect(() => { adminFetch('/parts').then(setParts) }, [])
  const filtered = parts.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  const openNew = () => {
    setEdit(null)
    setForm({ id: '', slug: '', name: '', category: '', price: '', stock: '0', compatibleModels: '', image: '' })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEdit(p)
    setForm({
      id: p.id, slug: p.slug, name: p.name, category: p.category || '',
      price: String(p.price), stock: String(p.stock || 0),
      compatibleModels: p.compatible_models?.join(', ') || '', image: p.image || '',
    })
    setShowForm(true)
  }

  const addToast = useToast()
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.id || !form.slug || !form.name || !form.price) return
    setSaving(true)
    try {
      await adminFetch('/parts', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          price: Number(form.price), stock: Number(form.stock),
          compatibleModels: form.compatibleModels.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })
      setShowForm(false)
      addToast({ type: 'success', message: edit ? ('Pi\u00e8ce \u00ab ' + form.name + ' \u00bb mise \u00e0 jour') : ('Pi\u00e8ce \u00ab ' + form.name + ' \u00bb cr\u00e9\u00e9e') })
      adminFetch('/parts').then(setParts)
    } catch {
      addToast({ type: 'error', message: "Erreur lors de l'enregistrement de la pi\u00e8ce" })
    } finally {
      setSaving(false)
    }
  }

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const remove = async (id) => {
    setConfirmDelete({ id, title: 'Supprimer la pi\u00e8ce', message: '\u00cates-vous s\u00fbr de vouloir supprimer cette pi\u00e8ce d\u00e9tach\u00e9e ? Cette action est irr\u00e9versible.', confirmLabel: 'Supprimer', variant: 'danger' })
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl font-bold text-white">Pi\u00e8ces d\u00e9tach\u00e9es</h2>
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-40 rounded-lg border border-white/15 bg-white/10 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-white/30" />
        </div>
        <button onClick={openNew} className="flex items-center gap-1.5 rounded-lg bg-tvs-red px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-tvs-red-dark"><Plus size={14} /> Ajouter</button>
      </div>

      <AdminFormModal open={showForm} onClose={() => setShowForm(false)} title={edit ? 'Modifier la pi\u00e8ce' : 'Nouvelle pi\u00e8ce'}>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="ID (ex: piece-frein)" className="rounded-lg border border-white/15 bg-zinc-800/80 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/30" disabled={!!edit} />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (ex: piece-frein)" className="rounded-lg border border-white/15 bg-zinc-800/80 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/30" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom de la pi\u00e8ce" className="rounded-lg border border-white/15 bg-zinc-800/80 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/30" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Cat\u00e9gorie" className="rounded-lg border border-white/15 bg-zinc-800/80 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/30" />
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Prix (FCFA)" type="number" className="rounded-lg border border-white/15 bg-zinc-800/80 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/30" />
            <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className="rounded-lg border border-white/15 bg-zinc-800/80 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/30" />
            <div className="sm:col-span-2">
              <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="Image de la pi\u00e8ce" />
            </div>
            <input value={form.compatibleModels} onChange={(e) => setForm({ ...form, compatibleModels: e.target.value })} placeholder="Mod\u00e8les compatibles (s\u00e9par\u00e9s par des virgules)" className="rounded-lg border border-white/15 bg-zinc-800/80 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/30 sm:col-span-2" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving} className={'rounded-lg px-5 py-2.5 text-xs font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-tvs-red/40 ' + (saving ? 'cursor-not-allowed bg-tvs-red/60' : 'bg-tvs-red hover:bg-tvs-red-dark')}>
              {saving ? (
                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />{edit ? 'Mise \u00e0 jour\u2026' : 'Cr\u00e9ation\u2026'}</span>
              ) : (edit ? 'Mettre \u00e0 jour' : 'Cr\u00e9er')}
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-white/15 px-5 py-2.5 text-xs text-white/60 hover:bg-white/10">Annuler</button>
          </div>
        </div>
      </AdminFormModal>

      <div className="mt-4 space-y-1">
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-lg border border-white/10 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{p.name}</p>
              <p className="font-mono text-[11px] text-white/40">{p.category} \u00b7 Compatible: {p.compatible_models?.join(', ') || '-'}</p>
            </div>
            <span className="font-display text-sm text-white">{formatFCFA(p.price)}</span>
            <span className="font-mono text-xs text-white/40">Stock: {p.stock}</span>
            <button onClick={() => openEdit(p)} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"><Edit3 size={14} /></button>
            <button onClick={() => remove(p.id)} className="rounded p-1.5 text-white/40 transition-colors hover:bg-red-500/20 hover:text-tvs-red"><Trash2 size={14} /></button>
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
            await adminFetch('/parts/' + confirmDelete.id, { method: 'DELETE' })
            setConfirmDelete(null)
            addToast({ type: 'success', message: 'Pi\u00e8ce supprim\u00e9e avec succ\u00e8s' })
            adminFetch('/parts').then(setParts)
          } catch {
            addToast({ type: 'error', message: 'Erreur lors de la suppression de la pi\u00e8ce' })
          } finally {
            setDeleting(false)
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
