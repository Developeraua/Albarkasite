// Helper that creates public URLs for files in Supabase '5 bedrooms' bucket
const SUPABASE_BASE = "https://fsdinxfbjmdkcyhbsvqx.supabase.co/storage/v1/object/public";

export function get5BedroomsImageUrl(filename: string): string {
  // Encodes spaces properly for '5 bedrooms' bucket
  return `${SUPABASE_BASE}/5%20bedrooms/${encodeURIComponent(filename)}`;
}

export const FIVE_BEDROOMS_SUPABASE_IMAGES = [
  get5BedroomsImageUrl("facee4.jpeg"),
  get5BedroomsImageUrl("1.jpeg"),
  get5BedroomsImageUrl("2.jpeg"),
  get5BedroomsImageUrl("3.jpeg"),
  get5BedroomsImageUrl("4.jpeg"),
  get5BedroomsImageUrl("5.jpeg"),
];
