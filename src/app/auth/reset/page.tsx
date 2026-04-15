"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// User lands here after clicking the password reset link in their email.
// Supabase has already exchanged the token via /auth/callback — the user
// is now in a temporary session and just needs to set a new password.

const inputStyle: React.CSSProperties = {
  background: "var(--surface)",
  border:     "1px solid var(--border)",
  color:      "var(--text)",
  fontFamily: "var(--mono)",
  fontSize:   "0.9rem",
  padding:    "0.75rem 1rem",
  width:      "100%",
};

function ResetPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [error,     setError]     = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      // Redirect to dashboard after a short pause so they can read the confirmation
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  if (done) {
    return (
      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "6rem 1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--mono)", lineHeight: 1.1, marginBottom: "0.75rem" }}>
          Password updated.
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", lineHeight: 1.6 }}>
          Taking you to your dashboard…
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
          Choose a new password.
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginTop: "0.6rem", lineHeight: 1.6 }}>
          Must be at least 8 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={inputStyle}
        />

        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.78rem", lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width:         "100%",
            padding:       "0.9rem",
            background:    "var(--accent)",
            color:         "#000",
            fontFamily:    "var(--mono)",
            fontSize:      "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            border:        "none",
            cursor:        "pointer",
            fontWeight:    "bold",
            opacity:       loading ? 0.6 : 1,
          }}
        >
          {loading ? "..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ResetPage), { ssr: false });
