"use client";

// ==============================================
// PaletteSwitcher — Dev tool for auditioning color palettes
// Floating panel, fixed bottom-right. Toggle between options live.
// Remove this component from layout.tsx when you've picked a palette.
// ==============================================

import { useState, useEffect } from "react";

// Each palette defines only the variables it changes from the base.
// Unset values fall back to whatever is in globals.css.
const PALETTES: Record<string, Record<string, string>> = {
  "Current": {
    "--bg":           "#18140f",
    "--surface":      "#221d16",
    "--border":       "#332b20",
    "--text":         "#f0ece4",
    "--text-dim":     "#9a8f82",
    "--accent":       "#d4920a",
    "--accent-dim":   "#a87010",
    "--accent-2":     "transparent",
    "--danger":       "#e05c4a",
  },
  "1 · Aged Brass & Slate": {
    "--bg":           "#18140f",
    "--surface":      "#221d16",
    "--border":       "#332b20",
    "--text":         "#f0ece4",
    "--text-dim":     "#9a8f82",
    "--accent":       "#d4920a",
    "--accent-dim":   "#a87010",
    "--accent-2":     "#4a5f7f",   // deep slate blue
    "--danger":       "#e05c4a",
  },
  "2 · Cognac & Emerald": {
    "--bg":           "#18140f",
    "--surface":      "#221d16",
    "--border":       "#3a3226",
    "--text":         "#f0ece4",
    "--text-dim":     "#9a8f82",
    "--accent":       "#d4920a",
    "--accent-dim":   "#a87010",
    "--accent-2":     "#2d5a47",   // deep forest green
    "--danger":       "#d85a42",
  },
  "3 · Copper & Teal": {
    "--bg":           "#18140f",
    "--surface":      "#241e16",
    "--border":       "#3d3428",
    "--text":         "#f0ece4",
    "--text-dim":     "#a8a099",
    "--accent":       "#d4920a",
    "--accent-dim":   "#9d7f0a",
    "--accent-2":     "#3a5260",   // charcoal teal
    "--danger":       "#d85a42",
  },
  "4 · Espresso & Gunmetal": {
    "--bg":           "#16120d",
    "--surface":      "#251f17",
    "--border":       "#413925",
    "--text":         "#f2ede5",
    "--text-dim":     "#a8a097",
    "--accent":       "#d4920a",
    "--accent-dim":   "#a87010",
    "--accent-2":     "#4a535f",   // gunmetal gray-blue
    "--danger":       "#d85c46",
  },
  "5 · Bronze & Ink": {
    "--bg":           "#19150f",
    "--surface":      "#23201a",
    "--border":       "#38332a",
    "--text":         "#ede9df",
    "--text-dim":     "#9c9386",
    "--accent":       "#c99a12",   // bronze shift
    "--accent-dim":   "#a6800f",
    "--accent-2":     "#2a3e52",   // ink navy
    "--danger":       "#e05c48",
  },

  // ── Out-of-the-box options ──────────────────────────────────────

  "6 · Dark Academia": {
    // Deep burgundy-wine secondary against the warm dark —
    // feels like a rare book dealer's website or a literary journal
    "--bg":           "#17120f",
    "--surface":      "#221a15",
    "--border":       "#352820",
    "--text":         "#f0e8df",
    "--text-dim":     "#9a8f82",
    "--accent":       "#d4920a",
    "--accent-dim":   "#a87010",
    "--accent-2":     "#7a2e3a",   // deep burgundy/wine
    "--danger":       "#e05c4a",
  },

  "7 · Pitch & Violet": {
    // True near-black base with a muted violet secondary —
    // unexpected for a financial tool, signals premium creative work
    "--bg":           "#13100d",
    "--surface":      "#1d1916",
    "--border":       "#2e2820",
    "--text":         "#f0ece4",
    "--text-dim":     "#9a8f82",
    "--accent":       "#d4920a",
    "--accent-dim":   "#a87010",
    "--accent-2":     "#5c4a7a",   // muted violet-plum
    "--danger":       "#e05c4a",
  },

  "8 · Carbon & Flame": {
    // Almost neutral dark carbon base — lets the amber read as pure fire.
    // Cooler and more modern, like a high-end gear review site
    "--bg":           "#141414",
    "--surface":      "#1e1c1a",
    "--border":       "#2e2b28",
    "--text":         "#f0ece4",
    "--text-dim":     "#888480",
    "--accent":       "#e8960a",   // slightly hotter amber
    "--accent-dim":   "#b87808",
    "--accent-2":     "#3a3632",   // warm charcoal — depth through tone, not hue
    "--danger":       "#e05c4a",
  },

  "9 · Verdigris": {
    // Flips the script — patina green becomes the primary, amber secondary.
    // Evokes aged copper, old maps, and serious craft
    "--bg":           "#0f1512",
    "--surface":      "#18211b",
    "--border":       "#25352c",
    "--text":         "#e8ede9",
    "--text-dim":     "#849186",
    "--accent":       "#4a9e72",   // verdigris / patina green
    "--accent-dim":   "#367a57",
    "--accent-2":     "#c99a12",   // amber becomes the secondary
    "--danger":       "#e05c4a",
  },

  "10 · Noir Cinema": {
    // True near-black with a single warm cream and amber —
    // like a 1940s film title card. Maximum contrast, zero noise
    "--bg":           "#0d0c0a",
    "--surface":      "#181614",
    "--border":       "#252320",
    "--text":         "#f5f0e8",
    "--text-dim":     "#7a7570",
    "--accent":       "#d4920a",
    "--accent-dim":   "#a87010",
    "--accent-2":     "#3d3830",   // near-neutral warm gray
    "--danger":       "#c84a38",
  },
};

const PALETTE_NAMES = Object.keys(PALETTES);

export default function PaletteSwitcher() {
  const [active,  setActive]  = useState("Current");
  const [open,    setOpen]    = useState(false);

  // Apply palette by writing CSS variables directly onto :root
  useEffect(() => {
    const root = document.documentElement;
    const vars = PALETTES[active];
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [active]);

  return (
    <div style={{
      position:   "fixed",
      bottom:     "1.25rem",
      right:      "1.25rem",
      zIndex:     9999,
      fontFamily: "var(--mono)",
      fontSize:   "0.7rem",
    }}>
      {/* Expanded panel */}
      {open && (
        <div style={{
          background:   "var(--surface)",
          border:       "1px solid var(--border)",
          padding:      "1rem",
          marginBottom: "0.5rem",
          minWidth:     "220px",
          boxShadow:    "0 8px 32px rgba(0,0,0,0.6)",
        }}>
          <div style={{ color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem", fontSize: "0.62rem" }}>
            Palette Audition
          </div>

          {/* Palette buttons */}
          {PALETTE_NAMES.map((name) => {
            const vars    = PALETTES[name];
            const isActive = name === active;
            return (
              <button
                key={name}
                onClick={() => setActive(name)}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            "0.6rem",
                  width:          "100%",
                  background:     isActive ? "var(--bg)" : "transparent",
                  border:         isActive ? "1px solid var(--accent)" : "1px solid transparent",
                  padding:        "0.45rem 0.6rem",
                  marginBottom:   "0.25rem",
                  color:          isActive ? "var(--accent)" : "var(--text-dim)",
                  cursor:         "pointer",
                  textAlign:      "left",
                  fontFamily:     "var(--mono)",
                  fontSize:       "0.68rem",
                  letterSpacing:  "0.04em",
                }}
              >
                {/* Color swatches for this palette */}
                <span style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                  {[vars["--bg"], vars["--accent"], vars["--accent-2"], vars["--text"]].map((c, i) => (
                    <span key={i} style={{
                      width:        "10px",
                      height:       "10px",
                      background:   c,
                      borderRadius: "2px",
                      border:       "1px solid rgba(255,255,255,0.08)",
                      display:      "inline-block",
                    }} />
                  ))}
                </span>
                {name}
              </button>
            );
          })}

          {/* Accent-2 preview — shows how the new color looks on this palette */}
          {PALETTES[active]["--accent-2"] !== "transparent" && (
            <div style={{
              marginTop:    "0.75rem",
              paddingTop:   "0.75rem",
              borderTop:    "1px solid var(--border)",
              color:        "var(--text-dim)",
              fontSize:     "0.62rem",
              letterSpacing: "0.06em",
            }}>
              New accent-2:
              <span style={{
                marginLeft:  "0.5rem",
                color:       PALETTES[active]["--accent-2"],
                fontWeight:  "bold",
              }}>
                {PALETTES[active]["--accent-2"]}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background:    "var(--surface)",
          border:        "1px solid var(--accent)",
          color:         "var(--accent)",
          padding:       "0.5rem 0.9rem",
          cursor:        "pointer",
          fontFamily:    "var(--mono)",
          fontSize:      "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          boxShadow:     "0 4px 16px rgba(0,0,0,0.5)",
          display:       "block",
          width:         "100%",
        }}
      >
        {open ? "✕ Close" : "Palette ▲"}
      </button>
    </div>
  );
}
