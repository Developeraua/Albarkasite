import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
  ShieldCheck,
  Search,
  AlertTriangle,
  RefreshCw,
  Tag,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient.js";
import { LogoMark } from "./ui";

export interface PropertyAdminItem {
  id: string;
  title?: string;
  name?: string;
  price: number | string;
  price_display?: string;
  location?: string;
  category?: string;
  type?: string;
  description?: string;
  status?: string;
  stock?: number;
  image_url?: string;
  image?: string;
  created_at?: string;
  [key: string]: any;
}

const PROPERTY_TYPES = [
  "Plot for Sale",
  "Residential Land",
  "Commercial Land",
  "Detached House",
  "Terrace Duplex",
  "Bungalow",
  "Commercial Plaza",
  "Apartment for Lease",
];

export function AdminPage({ onNavigate: _onNavigate }: { onNavigate?: (page: any) => void }) {
  const [properties, setProperties] = useState<PropertyAdminItem[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PropertyAdminItem | null>(null);

  // Form Fields
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [priceInNaira, setPriceInNaira] = useState<string>("");
  const [location, setLocation] = useState<string>("GRA, Bauchi");
  const [propertyType, setPropertyType] = useState<string>(PROPERTY_TYPES[0]);
  const [status, setStatus] = useState<string>("Available");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  // Notification Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch stats & properties from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch properties from Supabase 'properties' or fallback 'products' table
      const { data: propsData, error: propsErr } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (propsErr) {
        // Fallback check to products table if properties table is not yet migrated
        const { data: prodsData } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        setProperties(prodsData || []);
      } else {
        setProperties(propsData || []);
      }

      // 2. Fetch users count from 'profiles'
      try {
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        setTotalUsers(usersCount || 0);
      } catch {
        setTotalUsers(0);
      }

      // 3. Fetch projects count
      try {
        const { count: projCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true });
        setTotalProjects(projCount || 0);
      } catch {
        setTotalProjects(0);
      }
    } catch (err: any) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setPropertyTitle("");
    setPriceInNaira("");
    setLocation("GRA, Bauchi");
    setPropertyType(PROPERTY_TYPES[0]);
    setStatus("Available");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (p: PropertyAdminItem) => {
    setEditingItem(p);
    setPropertyTitle(p.title || p.name || "");
    const cleanPrice = String(p.price || "").replace(/[^0-9.]/g, "");
    setPriceInNaira(cleanPrice || String(p.price || ""));
    setLocation(p.location || "Bauchi, Bauchi State");
    setPropertyType(p.type || p.category || PROPERTY_TYPES[0]);
    setStatus(p.status || "Available");
    setDescription(p.description || "");
    setImageFile(null);
    setImagePreview(p.image_url || p.image || "");
    setFormError("");
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // Upload image to Supabase Storage
  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("public-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
      if (data?.publicUrl) return data.publicUrl;
      throw new Error(`Storage upload note: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("public-assets")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  // Save (Create or Update)
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!propertyTitle.trim()) {
      setFormError("Please enter the Property Title.");
      return;
    }
    if (!priceInNaira || Number(priceInNaira) < 0) {
      setFormError("Please enter a valid price in Naira.");
      return;
    }

    setActionLoading(true);

    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        finalImageUrl = await uploadImageToStorage(imageFile);
      }

      if (!finalImageUrl) {
        finalImageUrl = "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/5%20bedrooms/facee4.jpeg";
      }

      const numericPrice = Number(priceInNaira);
      const formattedPrice = `₦${numericPrice.toLocaleString()}`;

      const payload = {
        title: propertyTitle.trim(),
        name: propertyTitle.trim(),
        price: numericPrice,
        price_display: formattedPrice,
        location: location.trim(),
        type: propertyType,
        category: propertyType,
        status: status,
        description: description.trim(),
        image_url: finalImageUrl,
        image: finalImageUrl,
        updated_at: new Date().toISOString(),
      };

      if (editingItem?.id) {
        const { error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editingItem.id);

        if (error) {
          // If properties table update fails, sync to products table
          await supabase.from("products").update(payload).eq("id", editingItem.id);
        }
        showToast("Property updated successfully in Supabase!");
      } else {
        const { error } = await supabase
          .from("properties")
          .insert([payload]);

        if (error) {
          await supabase.from("products").insert([payload]);
        }
        showToast("New property added successfully to Supabase!");
      }

      setModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error("Error saving property:", err);
      setFormError(err.message || "Failed to save property in Supabase.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete property with confirmation
  const handleDeleteProperty = async (p: PropertyAdminItem) => {
    const displayName = p.title || p.name || "this property";
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${displayName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", p.id);

      if (error) {
        await supabase.from("products").delete().eq("id", p.id);
      }

      showToast(`"${displayName}" deleted successfully!`);
      await fetchData();
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(`Error deleting: ${err.message || "Could not delete property"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const nameMatch = (p.title || p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = typeFilter === "All" || p.type === typeFilter || p.category === typeFilter;
    return nameMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-[#F4F7FE] pb-24 pt-44 md:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Toast Alert */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-4 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 shadow-2xl text-sm font-bold text-white ${
                toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
              }`}
            >
              <CheckCircle2 size={18} />
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0F172A] via-[#1E40AF] to-[#0EA5E9] p-8 text-white shadow-2xl">
          <div className="hero-pattern absolute inset-0 opacity-40" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white p-2.5 shadow-xl">
                <LogoMark height={52} />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-200 ring-1 ring-white/20">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Super Admin Management Portal
                </div>
                <h1 className="mt-2 font-display text-2xl sm:text-3xl font-black">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-blue-100">
                  Full control over verified plots, land, houses, and projects in Bauchi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold text-white ring-1 ring-white/25 hover:bg-white/20 transition disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh Data
              </button>
              
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-[#1E40AF] px-5 py-3 text-xs font-black uppercase tracking-wider shadow-xl transition hover:bg-blue-50 active:scale-95"
              >
                <Plus size={16} className="text-[#1E40AF]" />
                Add New Property
              </button>
            </div>
          </div>

          {/* Top Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Total Properties
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/30 text-white">
                  <Building2 size={18} />
                </span>
              </div>
              <p className="mt-2 font-display text-3xl font-black text-white">
                {properties.length}
              </p>
              <p className="mt-1 text-[11px] text-blue-200">
                Verified listings in database
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Total Users
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/30 text-emerald-300">
                  <Users size={18} />
                </span>
              </div>
              <p className="mt-2 font-display text-3xl font-black text-white">
                {totalUsers}
              </p>
              <p className="mt-1 text-[11px] text-blue-200">
                Registered profiles in system
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Total Projects
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/30 text-amber-300">
                  <FolderKanban size={18} />
                </span>
              </div>
              <p className="mt-2 font-display text-3xl font-black text-white">
                {totalProjects}
              </p>
              <p className="mt-1 text-[11px] text-blue-200">
                Civil, building &amp; water works
              </p>
            </div>
          </div>
        </div>

        {/* Properties Table Section */}
        <div className="mt-8 rounded-[2rem] border border-blue-100 bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 pb-6">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#0F172A]">
                Properties &amp; Land Listings
              </h2>
              <p className="text-xs text-slate-500">
                Manage all listed properties and plots with direct Supabase synchronization.
              </p>
            </div>

            {/* Search and Type Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="w-48 sm:w-60 rounded-xl border border-blue-100 bg-[#F4F7FE] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#1E40AF] focus:bg-white"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-blue-100 bg-[#F4F7FE] py-2 px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#1E40AF]"
              >
                <option value="All">All Types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 size={32} className="animate-spin text-[#1E40AF]" />
                <p className="mt-3 text-xs font-semibold">Loading Supabase properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-16 text-center">
                <Building2 size={40} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-700">No properties found</p>
                <p className="mt-1 text-xs text-slate-400">
                  {searchQuery ? "Try a different search term" : "Click 'Add New Property' to create your first listing"}
                </p>
                <button
                  onClick={openAddModal}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-4 py-2 text-xs font-bold text-white shadow"
                >
                  <Plus size={14} /> Add Property
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-blue-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-2">Property</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Price (₦)</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {filteredProperties.map((p) => {
                    const displayName = p.title || p.name || "Untitled Property";
                    const displayImage = p.image_url || p.image || "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/5%20bedrooms/facee4.jpeg";
                    const numPrice = Number(p.price);
                    const formattedPrice = !isNaN(numPrice)
                      ? `₦${numPrice.toLocaleString()}`
                      : String(p.price || "₦0");

                    return (
                      <tr key={p.id} className="hover:bg-blue-50/50 transition">
                        <td className="py-3 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-slate-100">
                              <img
                                src={displayImage}
                                alt={displayName}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/5%20bedrooms/facee4.jpeg";
                                }}
                              />
                            </div>
                            <div className="max-w-xs truncate">
                              <p className="font-display font-bold text-slate-900 truncate">
                                {displayName}
                              </p>
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {p.description || "No description provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <MapPin size={12} className="text-[#1E40AF]" />
                            {p.location || "Bauchi"}
                          </span>
                        </td>

                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F0FF] px-2.5 py-0.5 text-[10px] font-bold text-[#1E40AF]">
                            <Tag size={10} />
                            {p.type || p.category || "Plot"}
                          </span>
                        </td>

                        <td className="py-3 font-display font-bold text-[#1E40AF] text-sm">
                          {formattedPrice}
                        </td>

                        <td className="py-3">
                          <span
                            className={`inline-block rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                              p.status === "Sold"
                                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            }`}
                          >
                            {p.status || "Available"}
                          </span>
                        </td>

                        <td className="py-3 text-right pr-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              title="Edit property"
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white transition"
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(p)}
                              title="Delete property"
                              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-600 hover:text-white transition"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Property Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-blue-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F0FF] text-[#1E40AF]">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black text-[#0F172A]">
                      {editingItem ? "Edit Property" : "Add New Property"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Syncs immediately with Supabase database
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProperty} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    placeholder="e.g. 5-Bedroom Fully Detached Duplex"
                    className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Price in Naira (₦) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">
                        ₦
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={priceInNaira}
                        onChange={(e) => setPriceInNaira(e.target.value)}
                        placeholder="e.g. 85000000"
                        className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] py-2.5 pl-8 pr-3 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Location (e.g. Yelwa, Bauchi) *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Yelwa, Bauchi"
                      className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Type (Plot / House / Land)
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details about title document, location, gate, road, water..."
                    className="w-full rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs font-medium text-[#0F172A] outline-none transition focus:border-[#1E40AF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Upload Image
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#E6F0FF] px-4 py-2.5 text-xs font-bold text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white transition"
                    >
                      <Upload size={14} />
                      {imageFile ? "Change Image" : "Choose Image File"}
                    </button>

                    {imageFile && (
                      <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {imageFile.name}
                      </span>
                    )}
                  </div>

                  {imagePreview && (
                    <div className="mt-3 relative h-28 w-28 overflow-hidden rounded-xl border border-blue-100 bg-slate-100">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-blue-50">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                  >
                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                    {editingItem ? "Update Property" : "Save Property"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
