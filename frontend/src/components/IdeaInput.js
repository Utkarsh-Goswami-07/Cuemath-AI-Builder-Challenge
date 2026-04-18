import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const TONES = ["Educational yet warm", "Bold & Punchy", "Data-driven", "Conversational", "Inspirational", "Witty"];

export default function IdeaInput({ studio }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const charCount = studio.prompt.length;
  const maxChars = 500;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      studio.generate();
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={styles.title}>Your Idea</h3>
        <span style={styles.hint}>⌘↩ to generate</span>
      </div>

      {/* Prompt Input */}
      <div style={{ ...styles.textareaWrapper, ...(focused ? styles.textareaFocused : {}) }}>
        <textarea
          ref={textareaRef}
          value={studio.prompt}
          onChange={(e) => studio.setPrompt(e.target.value.slice(0, maxChars))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the creative you want to make...

e.g. 'Carousel for parents about why kids forget what they learn — explain the forgetting curve — end with how spaced repetition fixes it'"
          style={styles.textarea}
        />
        <div style={styles.charCount}>
          <span style={charCount > maxChars * 0.9 ? styles.charWarn : styles.charNormal}>
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Tone Selector */}
      <div style={styles.section}>
        <label style={styles.label}>Tone</label>
        <div style={styles.toneGrid}>
          {TONES.map((t) => (
            <button
              key={t}
              style={studio.tone === t ? styles.toneActive : styles.tone}
              onClick={() => studio.setTone(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        style={styles.generateBtn}
        onClick={studio.generate}
        disabled={studio.loading || !studio.prompt.trim()}
        whileHover={{ scale: studio.loading ? 1 : 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {studio.loading ? (
          <span style={styles.btnLoading}>
            <LoadingSpinner />
            Generating...
          </span>
        ) : (
          <>
            <span>✨</span>
            <span>Generate Creative</span>
          </>
        )}
      </motion.button>

      {studio.creative && (
        <button
          style={styles.regenerateBtn}
          onClick={studio.generate}
          disabled={studio.loading}
        >
          🔄 Regenerate All
        </button>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

const styles = {
  wrapper: { padding: 16, display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)" },
  hint: { fontSize: 11, color: "var(--text-muted)", fontWeight: 400 },
  textareaWrapper: {
    border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)",
    background: "var(--surface-raised)", transition: "var(--transition)", position: "relative",
  },
  textareaFocused: { borderColor: "var(--brand-orange)", boxShadow: "0 0 0 3px rgba(255,107,53,0.12)" },
  textarea: {
    width: "100%", minHeight: 120, maxHeight: 200, padding: "12px 14px",
    border: "none", background: "transparent", resize: "vertical",
    fontSize: 13, lineHeight: 1.6, color: "var(--text-primary)",
    fontFamily: "var(--font-body)", outline: "none",
  },
  charCount: { padding: "4px 12px 8px", textAlign: "right" },
  charNormal: { fontSize: 11, color: "var(--text-muted)" },
  charWarn: { fontSize: 11, color: "var(--brand-orange)" },
  section: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" },
  toneGrid: { display: "flex", flexWrap: "wrap", gap: 5 },
  tone: {
    padding: "4px 10px", fontSize: 11, fontWeight: 500,
    border: "1px solid var(--border)", borderRadius: 100,
    background: "transparent", color: "var(--text-secondary)",
    cursor: "pointer", transition: "var(--transition)",
  },
  toneActive: {
    padding: "4px 10px", fontSize: 11, fontWeight: 600,
    border: "1px solid var(--brand-orange)", borderRadius: 100,
    background: "rgba(255,107,53,0.08)", color: "var(--brand-orange)",
    cursor: "pointer", transition: "var(--transition)",
  },
  generateBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px 20px", borderRadius: "var(--radius-md)",
    background: "linear-gradient(135deg, var(--brand-orange) 0%, #E5541A 100%)",
    color: "white", fontWeight: 700, fontSize: 14, border: "none",
    cursor: "pointer", transition: "var(--transition)", width: "100%",
    boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
    fontFamily: "var(--font-display)",
  },
  btnLoading: { display: "flex", alignItems: "center", gap: 8, opacity: 0.9 },
  regenerateBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: "9px 16px", borderRadius: "var(--radius-md)",
    background: "transparent", color: "var(--text-secondary)",
    border: "1px solid var(--border)", fontSize: 13, fontWeight: 500,
    cursor: "pointer", width: "100%",
  },
};
