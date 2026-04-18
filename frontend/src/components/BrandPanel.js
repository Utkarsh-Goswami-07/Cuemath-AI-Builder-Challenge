import React from "react";
import toast from "react-hot-toast";

const PRESET_THEMES = [
  {
    name: "Cuemath Classic",
    emoji: "🟠",
    theme: {
      primaryColor: "#FF6B35", secondaryColor: "#1A1A2E",
      accentColor: "#FFD700", backgroundColor: "#1A1A2E",
      textColor: "#FFFFFF", fontStyle: "modern", backgroundStyle: "gradient",
    },
  },
  {
    name: "Ocean Deep",
    emoji: "🔵",
    theme: {
      primaryColor: "#3B82F6", secondaryColor: "#0F172A",
      accentColor: "#38BDF8", backgroundColor: "#0F172A",
      textColor: "#FFFFFF", fontStyle: "modern", backgroundStyle: "gradient",
    },
  },
  {
    name: "Forest Fresh",
    emoji: "🟢",
    theme: {
      primaryColor: "#10B981", secondaryColor: "#064E3B",
      accentColor: "#A7F3D0", backgroundColor: "#064E3B",
      textColor: "#FFFFFF", fontStyle: "elegant", backgroundStyle: "gradient",
    },
  },
  {
    name: "Sunset Warm",
    emoji: "🌅",
    theme: {
      primaryColor: "#F59E0B", secondaryColor: "#7C2D12",
      accentColor: "#FDE68A", backgroundColor: "#7C2D12",
      textColor: "#FFFFFF", fontStyle: "bold", backgroundStyle: "gradient",
    },
  },
  {
    name: "Purple Mind",
    emoji: "🟣",
    theme: {
      primaryColor: "#8B5CF6", secondaryColor: "#1E0A3C",
      accentColor: "#C4B5FD", backgroundColor: "#1E0A3C",
      textColor: "#FFFFFF", fontStyle: "modern", backgroundStyle: "mesh",
    },
  },
  {
    name: "Clean Light",
    emoji: "⬜",
    theme: {
      primaryColor: "#FF6B35", secondaryColor: "#2D2D2D",
      accentColor: "#FF6B35", backgroundColor: "#FFFFFF",
      textColor: "#1A1A2E", fontStyle: "modern", backgroundStyle: "solid",
    },
  },
];

export default function BrandPanel({ studio }) {
  const { creative, updateTheme } = studio;
  if (!creative) return null;
  const theme = creative.theme || {};

  const applyPreset = (preset) => {
    updateTheme(preset.theme);
    toast.success(`Applied "${preset.name}" theme`);
  };

  return (
    <div style={styles.wrapper}>
      {/* Preset themes */}
      <div style={styles.section}>
        <div style={styles.label}>Theme Presets</div>
        <div style={styles.presetGrid}>
          {PRESET_THEMES.map((p) => (
            <button
              key={p.name}
              style={styles.preset}
              onClick={() => applyPreset(p)}
              title={p.name}
            >
              <div style={{
                ...styles.presetSwatch,
                background: `linear-gradient(135deg, ${p.theme.backgroundColor}, ${p.theme.primaryColor})`,
              }} />
              <span style={styles.presetName}>{p.emoji} {p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom colors */}
      <div style={styles.section}>
        <div style={styles.label}>Custom Colors</div>
        <div style={styles.colorRows}>
          <ColorRow
            label="Primary"
            value={theme.primaryColor || "#FF6B35"}
            onChange={(v) => updateTheme({ primaryColor: v })}
          />
          <ColorRow
            label="Background"
            value={theme.backgroundColor || "#1A1A2E"}
            onChange={(v) => updateTheme({ backgroundColor: v })}
          />
          <ColorRow
            label="Accent"
            value={theme.accentColor || "#FFD700"}
            onChange={(v) => updateTheme({ accentColor: v })}
          />
          <ColorRow
            label="Text"
            value={theme.textColor || "#FFFFFF"}
            onChange={(v) => updateTheme({ textColor: v })}
          />
        </div>
      </div>

      {/* Font style */}
      <div style={styles.section}>
        <div style={styles.label}>Font Style</div>
        <div style={styles.fontGrid}>
          {["modern", "bold", "elegant", "playful"].map((f) => (
            <button
              key={f}
              style={theme.fontStyle === f ? styles.fontActive : styles.fontBtn}
              onClick={() => updateTheme({ fontStyle: f })}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Background style */}
      <div style={styles.section}>
        <div style={styles.label}>Background Style</div>
        <div style={styles.fontGrid}>
          {["gradient", "solid", "mesh", "pattern"].map((b) => (
            <button
              key={b}
              style={theme.backgroundStyle === b ? styles.fontActive : styles.fontBtn}
              onClick={() => updateTheme({ backgroundStyle: b })}
            >
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.note}>
        Changes apply live to the canvas. Regenerate slides to update AI visuals with new theme.
      </div>
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 32, height: 28, border: "1.5px solid var(--border)",
            borderRadius: 6, cursor: "pointer", padding: 2, background: "none",
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 18 },
  section: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  presetGrid: { display: "flex", flexDirection: "column", gap: 5 },
  preset: {
    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
    background: "var(--surface-raised)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left",
    transition: "var(--transition)",
  },
  presetSwatch: { width: 28, height: 28, borderRadius: 6, flexShrink: 0 },
  presetName: { fontSize: 12, fontWeight: 500, color: "var(--text-primary)" },
  colorRows: { display: "flex", flexDirection: "column", gap: 10 },
  fontGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 },
  fontBtn: {
    padding: "7px 10px", background: "var(--surface-raised)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
    fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", cursor: "pointer",
    textTransform: "capitalize",
  },
  fontActive: {
    padding: "7px 10px", background: "rgba(255,107,53,0.1)",
    border: "1.5px solid var(--brand-orange)", borderRadius: "var(--radius-sm)",
    fontSize: 11, fontWeight: 700, color: "var(--brand-orange)", cursor: "pointer",
    textTransform: "capitalize",
  },
  note: {
    fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5,
    fontStyle: "italic", padding: "8px 10px",
    background: "var(--surface-raised)", borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
  },
};
