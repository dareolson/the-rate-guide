"use client";

// Auth-aware nav link — shows Dashboard when logged in, Sign In when not.
// Runs client-side so it can read the Supabase session without blocking SSR.

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const linkStyle: React.CSSProperties = {
  fontFamily:     "var(--mono)",
  fontSize:       "0.68rem",
  letterSpacing:  "0.12em",
  textTransform:  "uppercase",
  color:          "var(--text-dim)",
  textDecoration: "none",
};

export default function NavAuthLink() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const supabase = createClient();

    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });

    // Keep in sync when user logs in/out in another tab
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Render nothing while loading to avoid a flash of the wrong label
  if (loggedIn === null) return null;

  return loggedIn
    ? <a href="/dashboard" style={linkStyle}>Dashboard</a>
    : <a href="/login"     style={linkStyle}>Sign In</a>;
}
