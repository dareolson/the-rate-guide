"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const supabase     = createClient();

  const callbackError = searchParams.get("error") === "confirmation_failed"
    ? "That confirmation link is invalid or has expired. Please sign up again."
    : null;

  const [mode,      setMode]      = useState<"login" | "signup">("login");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState<string | null>(callbackError);
  const [loading,   setLoading]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      // Show "check your email" — don't navigate until they confirm
      setConfirmed(true);
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/dashboard");
    }
  };

  if (confirmed) {
    return (
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "6rem 1.5rem" }}>
        <a href="/" style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none" }}>
          ← The Rate Guide
        </a>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--mono)", marginTop: "1.5rem", lineHeight: 1.1 }}>
          Check your email.
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginTop: "0.6rem", lineHeight: 1.6 }}>
          We sent a confirmation link to <strong style={{ color: "var(--text)" }}>{email}</strong>.
          Click it to activate your account and get to your dashboard.
        </p>
        <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: "1.25rem", lineHeight: 1.6 }}>
          Didn&apos;t get it? Check your spam folder, or{" "}
          <button
            onClick={() => { setConfirmed(false); setMode("signup"); }}
            style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "0.75rem", cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            try again
          </button>.
        </p>
      </div>
    );
  }

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

export default dynamic(() => Promise.resolve(LoginForm), { ssr: false });
