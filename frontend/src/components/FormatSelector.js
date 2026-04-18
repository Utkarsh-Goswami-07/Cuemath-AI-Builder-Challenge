import React from "react";

const FORMATS = [
  { id: "carousel", label: "Carousel", icon: "▦", ratio: "1:1", multi: true },
  { id: "instagram_post", label: "Post", icon: "□", ratio: "1:1", multi: false },
  { id: "story", label: "Story", icon: "▯", ratio: "9:16", multi: false },
  { id: "linkedin", label: "LinkedIn", icon: "▭", ratio: "1.91:1", multi: false },
];

export default function FormatSelector({ value, onChange, slideCount, onSlideCountChange }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.tabs}>
        {FORMATS.map((f) => (
          <button
            key={f.id}
            style={value === f.id ? styles.tabActive : styles.tab}
            onClick={() => onChange(f.id)}
            title={f.ratio}
          >
            <span style={styles.tabIcon}>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {value === "carousel" && (
        <div style={styles.slideCountWrapper}>
          <span style={styles.slideLabel}>Slides:</span>
          <div style={styles.slideButtons}>
            {[4, 5, 6, 7, 8, 10].map((n) => (
              <button
                key={n}
                style={slideCount === n ? styles.slideNumActive : styles.slideNum}
                onClick={() => onSlideCountChange(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", alignItems: "center", gap: 16 },
  tabs: {
    display: "flex", background: "rgba(255,255,255,0.08)",
    borderRadius: "var(--radius-sm)", padding: 3, gap: 2,
  },
  tab: {
    display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
    background: "transparent", color: "rgba(255,255,255,0.55)",
    border: "none", borderRadius: 6, cursor: "pointer",
    fontSize: 12, fontWeight: 500, transition: "var(--transition)",
    fontFamily: "var(--font-body)",
  },
  tabActive: {
    display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
    background: "rgba(255,255,255,0.15)", color: "white",
    border: "none", borderRadius: 6, cursor: "pointer",
    fontSize: 12, fontWeight: 600, transition: "var(--transition)",
    fontFamily: "var(--font-body)",
  },
  tabIcon: { fontSize: 14 },
  slideCountWrapper: { display: "flex", alignItems: "center", gap: 8 },
  slideLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 },
  slideButtons: { display: "flex", gap: 3 },
  slideNum: {
    width: 28, height: 24, background: "transparent",
    color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: "pointer",
    transition: "var(--transition)",
  },
  slideNumActive: {
    width: 28, height: 24, background: "var(--brand-orange)",
    color: "white", border: "1px solid var(--brand-orange)",
    borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: "pointer",
    transition: "var(--transition)",
  },
};
