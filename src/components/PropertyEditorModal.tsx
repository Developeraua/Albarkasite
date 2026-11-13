import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Upload, Loader2, Home, CheckCircle2, Plus, Trash2, Images } from "lucide-react";
import { supabase } from "../supabaseClient.js";
import { PropertyItem } from "../utils/useRealtimeCatalogues";

interface PropertyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PropertyItem> & { id?: string }) => Promise<void>;
  initialData?: PropertyItem | null;
}

const TAGS = ["For Sale", "For Lease", "Land", "Featured", "Sold"];

export function PropertyEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PropertyEditorModalProps) {
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || "");
  const [location, setLocation] = useState(initialData?.location || "Bauchi, Bauchi State");
  const [price, setPrice] = useState(initialData?.price || "₦");
  const [tag, setTag] = useState(initialData?.tag || "For Sale");
  const [beds, setBeds] = useState(String(initialData?.beds ?? 4));
  const [baths, setBaths] = useState(String(initialData?.baths ?? 4));
  const [area, setArea] = useState(initialData?.area || "400 sqm");
  
  // Multiple pictures list (slides)
  const [imageList, setImageList] = useState<string[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images;
    }
    if (initialData?.image) {
      return [initialData.image];
    }
    return [];
  });
  const [directUrlInput, setDirectUrlInput] = useState("");

  const [features, setFeatures] = useState(
    initialData?.features ? initialData.features.join(", ") : "C of O, Fenced & Gated, Borehole, Solar"
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg("");

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `prop-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        let finalUrl = "";
        // Attempt upload to 'public-assets' or 'product-images' bucket
        const { error: err1 } = await supabase.storage.from("public-assets").upload(filePath, file, {
          upsert: false,
        });

        if (!err1) {
          const { data } = supabase.storage.from("public-assets").getPublicUrl(filePath);
          finalUrl = data.publicUrl;
        } else {
          const { error: err2 } = await supabase.storage.from("product-images").upload(filePath, file, {
            upsert: false,
          });
          if (!err2) {
            const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
            finalUrl = data.publicUrl;
          } else {
            // As resilient fallback, read as data URL
            finalUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          }
        }

        if (finalUrl) {
          uploadedUrls.push(finalUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setImageList((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Error uploading one or more images");
    } finally {
      setUploading(false);
      // Reset input value so same files can be re-selected if desired
      e.target.value = "";
    }
  };

  const handleAddDirectUrl = () => {
    if (!directUrlInput.trim()) return;
    setImageList((prev) => [...prev, directUrlInput.trim()]);
    setDirectUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Property title is required");
      return;
    }
    if (!price.trim()) {
      setErrorMsg("Price is required");
      return;
    }
    if (imageList.length === 0) {
      setErrorMsg("Please upload at least one picture for this property slide showcase");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const featureList = features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload: Partial<PropertyItem> & { id?: string } = {
        title: title.trim(),
        location: location.trim(),
        price: price.trim(),
        tag: tag,
        beds: Number(beds) || 0,
        baths: Number(baths) || 0,
        area: area.trim(),
        image: imageList[0],
        images: imageList,
        features: featureList,
      };

      if (isEditing && initialData?.id) {
        payload.id = initialData.id;
      }

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-50 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F0FF] text-[#1E40AF]">
                <Home size={20} />
              </span>
              <div>
                <h3 className="font-display text-lg font-black text-[#0F172A]">
                  {isEditing ? "Edit On-Sale Property" : "Add New On-Sale Property"}
                </h3>
                <p className="text-[11px] font-semibold text-[#1E40AF]">
                  SUPER_ADMIN Direct Supabase Real-Time Sync
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 ring-1 ring-red-200">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5-Bedroom Fully Detached Duplex"
                className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. GRA, Bauchi"
                  className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Price in Naira (₦) *
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. ₦85,000,000"
                  className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tag
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E40AF] focus:bg-white"
                >
                  {TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E40AF] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E40AF] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Area
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. 450 sqm"
                  className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E40AF] focus:bg-white"
                />
              </div>
            </div>

            {/* MULTIPLE PICTURES UPLOAD & SLIDE CATALOGUE */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#1E40AF] flex items-center gap-1.5">
                  <Images size={14} />
                  <span>Property Pictures (Multi-Picture Slide Catalogue) *</span>
                </label>
                <span className="text-[11px] font-bold text-slate-500">
                  {imageList.length} photo{imageList.length === 1 ? "" : "s"} added
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Upload multiple pictures together to create an interactive photo slide for this property. You can select multiple files at once.
              </p>

              {/* Upload control buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-5 py-2.5 text-xs font-bold text-white shadow hover:brightness-110 transition">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{uploading ? "Uploading pictures..." : "Upload Multiple Photos"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={handleMultipleFilesUpload}
                  />
                </label>

                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    value={directUrlInput}
                    onChange={(e) => setDirectUrlInput(e.target.value)}
                    placeholder="Or add picture URL..."
                    className="flex-1 rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs text-[#0F172A] outline-none focus:border-[#1E40AF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDirectUrl}
                    className="rounded-xl bg-white border border-blue-200 px-3 py-2 text-xs font-bold text-[#1E40AF] hover:bg-blue-50 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Thumbnails grid with slide sequence & delete controls */}
              {imageList.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2">
                  {imageList.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="group relative h-20 rounded-xl overflow-hidden border-2 border-blue-200 bg-slate-900 shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Slide ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove this photo from slide"
                        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-md bg-red-600/90 text-white hover:bg-red-700 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Features (comma-separated)
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. BQ, Smart Wiring, Borehole, 24/7 Security"
                className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E40AF] focus:bg-white"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-blue-50">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>{isEditing ? "Save & Update Real-Time" : "Publish to Supabase"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
