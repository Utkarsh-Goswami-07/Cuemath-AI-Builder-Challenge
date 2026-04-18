import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SlideEditor({ studio }) {
  const { creative, activeSlide, updateSlideText, regenerateOneSlide, deleteSlide, loadingSlide } = studio;
  const [regenInstruction, setRegenInstruction] = useState("");
  const [showRegenBox, setShowRegenBox] = useState(false);

  if (!creative?.slides?.length) return null;

  const slide = creative.slides[activeSlide];
  const isLoading = loadingSlide === activeSlide;

  const handleFieldChange = (field, value) => {
    updateSlideText(activeSlide, field, value);
  };

  const handleRegen = async () => {
    if (!regenInstruction.trim()) {
      toast.error("Describe what to change");
      return;
    }
    await regenerateOneSlide(activeSlide, regenInstruction);
    setRegenInstruction("");
    setShowRegenBox(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* Slide info header */}
      <div style={styles.slideInfo}>
        <div style={styles.slideNum}>Slide {activeSlide + 1}</div>
        <span style={styles.slideType}>{slide.type?.toUpperCase()}</span>
      </div>

      {/* Editable fields */}
      <div style={styles.fields}>
        <Field
          label="Heading"
          value={slide.heading || ""}
          onChange={(v) => handleFieldChange("heading", v)}
          placeholder="Slide heading..."
          multiline={false}
        />
        <Field
          label="Subheading"
          value={slide.subheading || ""}
          onChange={(v) => handleFieldChange("subheading", v)}
          placeholder="Supporting text..."
        />
        <Field
          label="Body Text"
          value={slide.bodyText || ""}
          onChange={(v) => handleFieldChange("bodyText", v)}
          placeholder="Detailed explanation..."
          rows={3}
        />
        <Field
          label="Callout / Stat"
          value={slide.callout || ""}
          onChange={(v) => handleFieldChange("callout", v)}
          placeholder="Highlighted stat or quote..."
        />
        <Field
          label="Emoji"
          value={slide.emoji || ""}
          onChange={(v) => handleFieldChange("emoji", v)}
          placeholder="1-2 emojis..."
          multiline={false}
        />
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {/* AI Regenerate */}
        <button
          style={styles.btnPrimary}
          onClick={() => setShowRegenBox(!showRegenBox)}
        >
          ✨ AI Rewrite Slide
        </button>

        {showRegenBox && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.regenBox}
          >
            <textarea
              value={regenInstruction}
              onChange={(e) => setRegenInstruction(e.target.value)}
              placeholder="e.g. 'Make the heading more punchy' or 'Add a stat about memory retention'"
              style={styles.regenTextarea}
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) handleRegen();
              }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={styles.btnConfirm}
                onClick={handleRegen}
                disabled={isLoading}
              >
                {isLoading ? "Rewriting..." : "✓ Apply"}
              </button>
              <button
                style={styles.btnCancel}
                onClick={() => setShowRegenBox(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        <div style={styles.btnRow}>
          <button
            style={styles.btnSecondary}
            onClick={() => regenerateOneSlide(activeSlide, "Completely rewrite this slide with fresh content and approach")}
            disabled={isLoading}
          >
            🔄 Regenerate
          </button>
          <button
            style={styles.btnDanger}
            onClick={() => deleteSlide(activeSlide)}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Quick suggestions */}
      <div style={styles.suggestions}>
        <div style={styles.suggestLabel}>Quick rewrites</div>
        <div style={styles.chips}>
          {[
            "Make it punchier",
            "Add a surprising stat",
            "Simplify the language",
            "Make it more parent-friendly",
            "Add an example",
          ].map((s) => (
            <button
              key={s}
              style={styles.chip}
              onClick={() => regenerateOneSlide(activeSlide, s)}
              disabled={isLoading}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, rows = 2, multiline = true }) {
  return (
    <div style={fieldStyles.wrapper}>
      <label style={fieldStyles.label}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={fieldStyles.textarea}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={fieldStyles.input}
        />
      )}
    </div>
  );
}

const fieldStyles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 4 },
  label: {
    fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  input: {
    padding: "7px 10px", border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)", fontSize: 12,
    color: "var(--text-primary)", background: "var(--surface-raised)",
    fontFamily: "var(--font-body)", width: "100%",
  },
  textarea: {
    padding: "7px 10px", border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)", fontSize: 12,
    color: "var(--text-primary)", background: "var(--surface-raised)",
    fontFamily: "var(--font-body)", width: "100%", resize: "vertical",
    lineHeight: 1.5,
  },
};

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 14 },
  slideInfo: { display: "flex", alignItems: "center", gap: 8 },
  slideNum: {
    fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700,
    color: "var(--text-primary)",
  },
  slideType: {
    background: "rgba(255,107,53,0.1)", color: "var(--brand-orange)",
    fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 100,
    letterSpacing: "0.06em",
  },
  fields: { display: "flex", flexDirection: "column", gap: 10 },
  actions: { display: "flex", flexDirection: "column", gap: 8 },
  btnPrimary: {
    padding: "9px 14px", background: "var(--brand-orange)", color: "white",
    border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600,
    cursor: "pointer", width: "100%",
  },
  regenBox: {
    display: "flex", flexDirection: "column", gap: 8,
    padding: 10, background: "var(--surface-raised)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
  },
  regenTextarea: {
    padding: "8px 10px", border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)", fontSize: 12,
    fontFamily: "var(--font-body)", width: "100%",
    resize: "none", lineHeight: 1.5,
  },
  btnConfirm: {
    flex: 1, padding: "7px 12px",
    background: "var(--brand-navy)", color: "white",
    border: "none", borderRadius: "var(--radius-sm)",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  btnCancel: {
    padding: "7px 12px", background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
    fontSize: 12, cursor: "pointer",
  },
  btnRow: { display: "flex", gap: 6 },
  btnSecondary: {
    flex: 1, padding: "8px 12px", background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
    fontSize: 11, fontWeight: 500, cursor: "pointer",
  },
  btnDanger: {
    padding: "8px 12px", background: "transparent",
    color: "#E53E3E",
    border: "1px solid #FED7D7", borderRadius: "var(--radius-sm)",
    fontSize: 11, cursor: "pointer",
  },
  suggestions: { display: "flex", flexDirection: "column", gap: 6 },
  suggestLabel: {
    fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 5 },
  chip: {
    padding: "4px 10px", background: "var(--surface-raised)",
    border: "1px solid var(--border)", borderRadius: 100,
    fontSize: 11, color: "var(--text-secondary)", cursor: "pointer",
    transition: "var(--transition)",
  },
};
