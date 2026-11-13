import { supabase } from "../supabaseClient.js";

/**
 * Saves or updates user phone number and details into database tables.
 * Tries known user tables ('profiles', 'users', 'user_profiles') with the 'phone' column.
 */
export async function saveUserPhoneToDatabase({
  userId,
  name,
  email,
  phone,
}: {
  userId: string;
  name: string;
  email: string;
  phone: string;
}) {
  if (!userId || !phone) return;

  const payloadWithTimestamps = {
    id: userId,
    name,
    full_name: name,
    email,
    phone, // <-- saved directly in 'phone' column
    phone_number: phone,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const simplePayload = {
    id: userId,
    name,
    email,
    phone, // <-- 'phone' column
  };

  // Attempt saving to 'profiles'
  try {
    const { error: pErr1 } = await supabase.from("profiles").upsert(payloadWithTimestamps, { onConflict: "id" });
    if (pErr1) {
      // Retry with minimal payload if timestamp columns are different
      await supabase.from("profiles").upsert(simplePayload, { onConflict: "id" });
    }
  } catch {
    // Continue
  }

  // Attempt saving to 'users'
  try {
    const { error: uErr1 } = await supabase.from("users").upsert(payloadWithTimestamps, { onConflict: "id" });
    if (uErr1) {
      await supabase.from("users").upsert(simplePayload, { onConflict: "id" });
    }
  } catch {
    // Continue
  }

  // Attempt saving to 'user_profiles'
  try {
    await supabase.from("user_profiles").upsert(simplePayload, { onConflict: "id" });
  } catch {
    // Continue
  }
}
