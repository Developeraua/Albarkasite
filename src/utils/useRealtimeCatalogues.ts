import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import { ON_SALES, PROJECTS } from "../data/content";

export interface PropertyItem {
  id: string;
  title: string;
  location: string;
  price: string;
  tag: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  images?: string[];
  features: string[];
  created_at?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  location: string;
  status: string;
  category: string;
  image: string;
  images?: string[];
  progress: number;
  desc: string;
  created_at?: string;
}

const LOCAL_PROPERTIES_KEY = "albarka_realtime_properties_v1";
const LOCAL_PROJECTS_KEY = "albarka_realtime_projects_v1";

// Helper to seed initial properties from static data if storage is empty
function getInitialProperties(): PropertyItem[] {
  try {
    const cached = localStorage.getItem(LOCAL_PROPERTIES_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  // Format initial items with guaranteed stable IDs
  return ON_SALES.map((p, idx) => ({
    id: `prop-seed-${idx + 1}`,
    title: p.title,
    location: p.location,
    price: p.price,
    tag: p.tag,
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    image: p.image,
    images: (p as any).images || [p.image],
    features: p.features || [],
  }));
}

// Helper to seed initial projects from static data if storage is empty
function getInitialProjects(): ProjectItem[] {
  try {
    const cached = localStorage.getItem(LOCAL_PROJECTS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return PROJECTS.map((p, idx) => ({
    id: `proj-seed-${idx + 1}`,
    title: p.title,
    location: p.location,
    status: p.status,
    category: p.category,
    image: p.image,
    progress: p.progress,
    desc: p.desc,
  }));
}

export function useRealtimeProperties() {
  const [properties, setProperties] = useState<PropertyItem[]>(getInitialProperties);
  const [loading, setLoading] = useState(false);

  // Sync with Supabase table 'properties' if available, plus listen to real-time events
  useEffect(() => {
    let isMounted = true;

    async function loadFromSupabase() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: PropertyItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title || d.name,
            location: d.location || "Bauchi",
            price: d.price || "₦0",
            tag: d.tag || "For Sale",
            beds: Number(d.beds ?? 0),
            baths: Number(d.baths ?? 0),
            area: d.area || "400 sqm",
            image: d.image || d.image_url,
            images: d.images || (d.image ? [d.image] : []),
            features: d.features || [],
            created_at: d.created_at,
          }));

          if (isMounted) {
            setProperties(formatted);
            try {
              localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(formatted));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Realtime properties remote load note:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFromSupabase();

    // Listen to real-time changes on 'properties' table in Supabase
    const channel = supabase
      .channel("realtime:properties")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const d = payload.new;
            const newItem: PropertyItem = {
              id: d.id,
              title: d.title || d.name,
              location: d.location || "Bauchi",
              price: d.price || "₦0",
              tag: d.tag || "For Sale",
              beds: Number(d.beds ?? 0),
              baths: Number(d.baths ?? 0),
              area: d.area || "400 sqm",
              image: d.image || d.image_url,
              images: d.images || [d.image || d.image_url],
              features: d.features || [],
              created_at: d.created_at,
            };
            setProperties((prev) => [newItem, ...prev.filter((p) => p.id !== newItem.id)]);
          } else if (payload.eventType === "UPDATE") {
            const d = payload.new;
            setProperties((prev) =>
              prev.map((item) =>
                item.id === d.id
                  ? {
                      ...item,
                      title: d.title || d.name || item.title,
                      location: d.location || item.location,
                      price: d.price || item.price,
                      tag: d.tag || item.tag,
                      beds: Number(d.beds ?? item.beds),
                      baths: Number(d.baths ?? item.baths),
                      area: d.area || item.area,
                      image: d.image || d.image_url || item.image,
                      images: d.images || item.images,
                      features: d.features || item.features,
                    }
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            const d = payload.old;
            setProperties((prev) => prev.filter((item) => item.id !== d.id));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Super Admin action: Save (Insert or Update)
  const saveProperty = async (property: Partial<PropertyItem> & { id?: string }) => {
    const isUpdate = Boolean(property.id);
    const targetId = property.id || `prop-${Date.now()}`;

    const record: PropertyItem = {
      id: targetId,
      title: property.title || "Untitled Property",
      location: property.location || "Bauchi, Bauchi State",
      price: property.price || "₦0",
      tag: property.tag || "For Sale",
      beds: Number(property.beds ?? 0),
      baths: Number(property.baths ?? 0),
      area: property.area || "400 sqm",
      image: property.image || "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/5%20bedrooms/facee4.jpeg",
      images: property.images && property.images.length > 0 ? property.images : [property.image || ""],
      features: property.features || [],
      created_at: new Date().toISOString(),
    };

    // 1. Immediate optimistic UI update
    setProperties((prev) => {
      let updated: PropertyItem[];
      if (isUpdate) {
        updated = prev.map((item) => (item.id === targetId ? { ...item, ...record } : item));
      } else {
        updated = [record, ...prev];
      }
      try {
        localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Direct Supabase database sync
    try {
      const dbPayload = {
        id: targetId,
        title: record.title,
        name: record.title,
        location: record.location,
        price: record.price,
        tag: record.tag,
        beds: record.beds,
        baths: record.baths,
        area: record.area,
        image: record.image,
        image_url: record.image,
        images: record.images,
        features: record.features,
        updated_at: new Date().toISOString(),
      };

      await supabase.from("properties").upsert(dbPayload, { onConflict: "id" });
    } catch (err) {
      console.warn("Supabase properties sync note:", err);
    }
  };

  // Super Admin action: Delete
  const deleteProperty = async (id: string) => {
    // 1. Optimistic removal
    setProperties((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Supabase deletion
    try {
      await supabase.from("properties").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase property delete note:", err);
    }
  };

  return {
    properties,
    loading,
    saveProperty,
    deleteProperty,
  };
}

export function useRealtimeProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>(getInitialProjects);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFromSupabase() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: ProjectItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title || d.name,
            location: d.location || "Bauchi, Bauchi State",
            status: d.status || "Ongoing",
            category: d.category || "Estate Development",
            image: d.image || d.image_url,
            images: d.images || (d.image ? [d.image] : []),
            progress: Number(d.progress ?? 50),
            desc: d.desc || d.description || "",
            created_at: d.created_at,
          }));

          if (isMounted) {
            setProjects(formatted);
            try {
              localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(formatted));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Realtime projects remote load note:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFromSupabase();

    // Listen to real-time events on 'projects' table in Supabase
    const channel = supabase
      .channel("realtime:projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const d = payload.new;
            const newItem: ProjectItem = {
              id: d.id,
              title: d.title || d.name,
              location: d.location || "Bauchi, Bauchi State",
              status: d.status || "Ongoing",
              category: d.category || "Estate Development",
              image: d.image || d.image_url,
              images: d.images || [d.image || d.image_url],
              progress: Number(d.progress ?? 50),
              desc: d.desc || d.description || "",
              created_at: d.created_at,
            };
            setProjects((prev) => [newItem, ...prev.filter((p) => p.id !== newItem.id)]);
          } else if (payload.eventType === "UPDATE") {
            const d = payload.new;
            setProjects((prev) =>
              prev.map((item) =>
                item.id === d.id
                  ? {
                      ...item,
                      title: d.title || d.name || item.title,
                      location: d.location || item.location,
                      status: d.status || item.status,
                      category: d.category || item.category,
                      image: d.image || d.image_url || item.image,
                      images: d.images || item.images,
                      progress: Number(d.progress ?? item.progress),
                      desc: d.desc || d.description || item.desc,
                    }
                  : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            const d = payload.old;
            setProjects((prev) => prev.filter((item) => item.id !== d.id));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const saveProject = async (project: Partial<ProjectItem> & { id?: string }) => {
    const isUpdate = Boolean(project.id);
    const targetId = project.id || `proj-${Date.now()}`;

    const record: ProjectItem = {
      id: targetId,
      title: project.title || "Untitled Project",
      location: project.location || "Bauchi, Bauchi State",
      status: project.status || "Ongoing",
      category: project.category || "Estate Development",
      image: project.image || "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/5%20bedrooms/facee4.jpeg",
      images: project.images && project.images.length > 0 ? project.images : [project.image || "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public/5%20bedrooms/facee4.jpeg"],
      progress: Number(project.progress ?? 50),
      desc: project.desc || "",
      created_at: new Date().toISOString(),
    };

    // 1. Optimistic UI update
    setProjects((prev) => {
      let updated: ProjectItem[];
      if (isUpdate) {
        updated = prev.map((item) => (item.id === targetId ? { ...item, ...record } : item));
      } else {
        updated = [record, ...prev];
      }
      try {
        localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Supabase DB sync
    try {
      const dbPayload = {
        id: targetId,
        title: record.title,
        name: record.title,
        location: record.location,
        status: record.status,
        category: record.category,
        image: record.image,
        image_url: record.image,
        images: record.images,
        progress: record.progress,
        desc: record.desc,
        description: record.desc,
        updated_at: new Date().toISOString(),
      };

      await supabase.from("projects").upsert(dbPayload, { onConflict: "id" });
    } catch (err) {
      console.warn("Supabase projects sync note:", err);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase project delete note:", err);
    }
  };

  return {
    projects,
    loading,
    saveProject,
    deleteProject,
  };
}
