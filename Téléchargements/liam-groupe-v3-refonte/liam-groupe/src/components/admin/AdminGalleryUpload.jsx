import { useState, useEffect, useRef, startTransition } from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const CLOUD_NAME = "dwmrzp61c";
const UPLOAD_PRESET = "liam-groupe";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * AdminGalleryUpload — Upload multiple d'images vers Cloudinary.
 * Gère un tableau d'URLs avec previews, glisser-déposer multiple,
 * suppression individuelle et barre de progression.
 *
 * @param {string[]} value  Tableau d'URLs d'images
 * @param {(urls: string[]) => void} onChange
 */
export default function AdminGalleryUpload({ value = [], onChange }) {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sync interne quand la prop value change (édition d'un autre enregistrement)
  useEffect(() => {
    startTransition(() => {
      setImages(Array.isArray(value) ? value.filter(Boolean) : []);
    });
  }, [value]);

  const syncImages = (updated) => {
    setImages(updated);
    onChange(updated);
  };

  const uploadFiles = async (files) => {
    const valid = Array.from(files).filter((f) =>
      ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(f.type)
    );
    if (valid.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadTotal(valid.length);

    const uploaded = [];

    for (let i = 0; i < valid.length; i++) {
      try {
        const formData = new FormData();
        formData.append("file", valid[i]);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "liam-groupe");

        const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });
        const data = await res.json();

        if (data.secure_url) {
          uploaded.push(data.secure_url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
      setUploadProgress(i + 1);
    }

    setUploading(false);
    syncImages([...images, ...uploaded]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      uploadFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    syncImages(updated);
  };

  return (
    <div className="space-y-3">
      {/* Grille de previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
            >
              <img
                src={url}
                alt={`Image ${idx + 1}`}
                className="w-full h-24 sm:h-28 object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.classList.add("bg-red-50");
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title={t('admin.galleryUpload.remove')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/50 text-white">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Zone d'upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-brand-500 bg-brand-50"
            : "border-gray-200 hover:border-brand-300 hover:bg-gray-50"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            <p className="text-sm text-gray-500">
              {t('admin.galleryUpload.uploading')} {uploadProgress}/{uploadTotal}
            </p>
            <div className="w-full max-w-xs h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress / uploadTotal) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            {images.length > 0 ? (
              <>
                <Plus className="w-6 h-6 text-gray-300" />
                <p className="text-sm text-gray-500">{t('admin.galleryUpload.addMore')}</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">
                  {t('admin.galleryUpload.dropHere')}
                </p>
                <p className="text-xs text-gray-400">
                  {t('admin.galleryUpload.dropHint')}
                </p>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Compteur */}
      <p className="text-xs text-gray-400 text-right">
        {t('admin.galleryUpload.imageCount', { count: images.length })}
      </p>
    </div>
  );
}
