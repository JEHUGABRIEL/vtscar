import { useState, useRef } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { getAdminToken } from '../pages/AdminLogin'

export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Afficher un aperçu local immédiat
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = getAdminToken()
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erreur upload')
      }

      const data = await res.json()
      setPreview(data.url)
      onChange?.(data.url)
    } catch (err) {
      console.error('[ImageUpload]', err)
      // En cas d'erreur, remettre l'aperçu précédent
      setPreview(value || null)
    } finally {
      setUploading(false)
      // Reset l'input file pour permettre de re-sélectionner le même fichier
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange?.('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </p>

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <img
            src={preview}
            alt="Aperçu"
            className="h-32 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white/80 transition-colors hover:bg-white/25 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Upload size={12} />
              )}
              {uploading ? 'Upload...' : 'Changer'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="rounded-lg bg-red-500/20 p-1 text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50"
              aria-label="Supprimer l'image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/15 bg-white/5 text-white/40 transition-colors hover:border-white/30 hover:text-white/60 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-xs">Upload en cours...</span>
            </>
          ) : (
            <>
              <ImageIcon size={24} />
              <span className="text-xs">Cliquez pour uploader une image</span>
              <span className="font-mono text-[9px] text-white/25">PNG, JPG • max 5 Mo</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
