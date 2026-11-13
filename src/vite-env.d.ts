/// <reference types="vite/client" />

declare module "*supabaseClient.js" {
  export const supabase: any;
  export default supabase;
}

declare module "*supabaseClient" {
  export const supabase: any;
  export default supabase;
}
