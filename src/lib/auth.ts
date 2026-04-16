"use client";

import { createClient } from "@/lib/supabase/client";

export async function handleSignInWithGoogle() {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function handleSignOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = "/";
}
