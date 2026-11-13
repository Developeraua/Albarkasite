import { createClient } from "@supabase/supabase-js";

// Clean project URL (must NOT include /rest/v1/ suffix so auth, storage and rest services route correctly)
const RAW_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || "https://fsdinxfbjmdkcyhbsvqx.supabase.co/rest/v1/";
const SUPABASE_URL = RAW_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const SUPABASE_PUBLIC_KEY = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || "sb_publishable_gDYlBSo7y1OhZ8RD0wXVPA_9gU2eoZU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
export default supabase;
