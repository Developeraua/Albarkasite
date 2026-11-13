import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

export interface UserRoleState {
  isSuperAdmin: boolean;
  role: string | null;
  loading: boolean;
  user: any | null;
}

// Fallback whitelisted emails for emergency super admins if DB triggers are pending
const WHITELISTED_ADMIN_EMAILS = [
  "developeraua@gmail.com",
  "albarkapropertiesconsultantltd@gmail.com",
  "aliyuusman97k@gmail.com",
];

const WHITELISTED_ADMIN_IDS = [
  "fbff1509-7a2d-4cc6-a5f0-56680768e9c8",
  "b6da919b-f906-4790-bb48-1550f8cc2ad7",
  "81f6d908-551d-4a6b-bbaf-1e1a6ca97f32",
];

export async function checkUserRole(): Promise<{
  isSuperAdmin: boolean;
  role: string;
  user: any | null;
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;

    if (!user) {
      return { isSuperAdmin: false, role: "ANON", user: null };
    }

    // Query profiles table from Supabase for role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const dbRole = profile?.role;

    // Direct check against cryptographic ID and email whitelist as supplementary verification
    const isWhitelisted =
      WHITELISTED_ADMIN_IDS.includes(user.id) ||
      (user.email && WHITELISTED_ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));

    // Strict rule: role must be 'SUPER_ADMIN' from Supabase profiles table (or verified whitelist)
    if (dbRole === "SUPER_ADMIN" || (isWhitelisted && (!dbRole || dbRole === "SUPER_ADMIN"))) {
      return { isSuperAdmin: true, role: "SUPER_ADMIN", user };
    }

    return { isSuperAdmin: false, role: dbRole || "USER", user };
  } catch (err) {
    console.error("Error verifying role:", err);
    return { isSuperAdmin: false, role: "USER", user: null };
  }
}

export function useUserRole(): UserRoleState {
  const [state, setState] = useState<UserRoleState>({
    isSuperAdmin: false,
    role: null,
    loading: true,
    user: null,
  });

  useEffect(() => {
    let mounted = true;

    async function evaluate() {
      const result = await checkUserRole();
      if (mounted) {
        setState({
          isSuperAdmin: result.isSuperAdmin,
          role: result.role,
          loading: false,
          user: result.user,
        });
      }
    }

    evaluate();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      evaluate();
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  return state;
}
