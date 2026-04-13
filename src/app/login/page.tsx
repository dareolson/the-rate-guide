"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Shared input style
const inputStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontFamily: "var(--mono)",
  fontSize: "0.9rem",
  padding: "0.75rem 1rem",
  width: "100%",
};

const btnStyle = {
  width: "100%",
  padding: "0.9rem",
  background: "var(--accent)",
  color: "#000",
  fontFamily: "var(--mono)",
  fontSize: "0.8rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

export default function LoginPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [mode,     setMode]     = useState<"login" | "signup">("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      // After signup, go straight to dashboard to finish profile setup
      router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto", padding: "6rem 1.5rem" }}>

      <div style={{ marginBottom: "3rem" }}>
        <a href="/" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          ← The Rate Guide
        </a>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--mono)", marginTop: "1.5rem", lineHeight: 1.1 }}>
          {mode === "login" ? "Welcome back." : "Create your account."}
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginTop: "0.6rem", lineHeight: 1.6 }}>
          {mode === "login"
            ? "Log in to see your rate history and progression roadmap."
            : "Free account. No credit card. Just your rate and where you want it to go."}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.78rem", lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
          {loading ? "..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>

      <button
        onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-dim)", fontFamily: "var(--mono)",
          fontSize: "0.75rem", marginTop: "1.5rem", letterSpacing: "0.08em",
          textDecoration: "underline",
        }}
      >
        {mode === "login" ? "Don't have an account? Sign up." : "Already have an account? Log in."}
      </button>
    </div>
  );
}
