import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, Link } from "lucide-react";
import { useTranslation } from "react-i18next";

const CLOUD_NAME = "dwmrzp61c";
const UPLOAD_PRESET = "liam-groupe";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function AdminImageUpload({ value, onChange }) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const fileInputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "liam-groupe");

      const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (data.secure_url) {
        const url = data.secure_url;
        setPreview(url);
        onChange(url);
      } else {
        setToast({ message: t('admin.imageUpload.uploadError') + (data.error?.message || t('common.unknown')), type: "error" });
      }
    } catch (err) {
      setToast({ message: t('admin.imageUpload.networkError') + err.message, type: "error" });
    }

    setUploading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  const handlePaste = () => {
    const url = prompt(t('admin.imageUpload.pasteUrl'));
    if (url) {
      setPreview(url);
      onChange(url);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-up ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Preview */}
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
          <img
            src={preview}
            alt={t('admin.imageUpload.preview')}
            className="w-full h-40 object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              title={t('admin.imageUpload.remove')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-brand-500 bg-brand-50"
              : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              <p className="text-sm text-gray-500">{t('admin.imageUpload.uploading')}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">
                {t('admin.imageUpload.dropHere')}
              </p>
              <p className="text-xs text-gray-400">{t('admin.imageUpload.dropHint')}</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* URL input (caché mais utile pour copier l'URL) */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="url"
            value={preview}
            onChange={(e) => {
              setPreview(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={t('admin.imageUpload.urlPlaceholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handlePaste}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
          title={t('admin.imageUpload.pasteTitle')}
        >
          {t('admin.imageUpload.pasteBtn')}
        </button>
      </div>
    </div>
  );
}
