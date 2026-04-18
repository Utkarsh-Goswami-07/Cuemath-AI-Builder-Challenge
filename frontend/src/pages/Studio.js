import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudio } from "../hooks/useStudio";
import { getCreative } from "../utils/api";
import IdeaInput from "../components/IdeaInput";
import FormatSelector from "../components/FormatSelector";
import SlideCanvas from "../components/SlideCanvas";
import SlideEditor from "../components/SlideEditor";
import SlideStrip from "../components/SlideStrip";
import CaptionPanel from "../components/CaptionPanel";
import BrandPanel from "../components/BrandPanel";
import ExportPanel from "../components/ExportPanel";
import ProgressOverlay from "../components/ProgressOverlay";
import Sidebar from "../components/Sidebar";

export default function Studio() {
  const studio = useStudio();
  const [rightPanel, setRightPanel] = useState("edit");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLoadFromHistory = async (item) => {
    try {
      const result = await getCreative(item._id);
      if (result.creative) studio.loadCreative(result.creative);
    } catch {
      studio.loadCreative(item);
    }
  };

  return (
      <div style={styles.root}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.sidebarToggle} onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
            <div style={styles.logo}>
              <span style={styles.logoMark}>C</span>
              <div>
                <div style={styles.logoText}>Cuemath</div>
                <div style={styles.logoSub}>Social Studio</div>
              </div>
            </div>
          </div>
          <div style={styles.headerCenter}>
            <FormatSelector value={studio.format} onChange={studio.setFormat} slideCount={studio.slideCount} onSlideCountChange={studio.setSlideCount} />
          </div>
          <div style={styles.headerRight}>
            {studio.creative && (
                <button style={styles.btnOutline} onClick={() => setRightPanel("export")}>↓ Export</button>
            )}
          </div>
        </header>

        <div style={styles.body}>
          <AnimatePresence>
            {sidebarOpen && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={styles.sidebar}
                >
                  <Sidebar onLoad={handleLoadFromHistory} currentId={studio.creative?._id} />
                </motion.div>
            )}
          </AnimatePresence>

          <div style={styles.leftCol}>
            <IdeaInput studio={studio} />
            {studio.creative && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.stripWrapper}>
                  <SlideStrip studio={studio} />
                </motion.div>
            )}
          </div>

          <div style={styles.centerCol}>
            <AnimatePresence mode="wait">
              {studio.loading ? (
                  <ProgressOverlay progress={studio.progress} message={studio.progressMessage} />
              ) : studio.creative ? (
                  <motion.div key="canvas" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SlideCanvas studio={studio} onEditRequest={() => setRightPanel("edit")} />
                  </motion.div>
              ) : (
                  <EmptyState studio={studio} />
              )}
            </AnimatePresence>
          </div>

          {studio.creative && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={styles.rightCol}>
                <div style={styles.panelTabs}>
                  {[["edit","✏️ Edit"],["caption","✍️ Caption"],["brand","🎨 Brand"],["export","↓ Export"]].map(([id, label]) => (
                      <button key={id} style={rightPanel === id ? styles.panelTabActive : styles.panelTab} onClick={() => setRightPanel(id)}>
                        {label}
                      </button>
                  ))}
                </div>
                <div style={styles.panelContent}>
                  {rightPanel === "edit" && <SlideEditor studio={studio} />}
                  {rightPanel === "caption" && <CaptionPanel studio={studio} />}
                  {rightPanel === "brand" && <BrandPanel studio={studio} />}
                  {rightPanel === "export" && <ExportPanel studio={studio} />}
                </div>
              </motion.div>
          )}
        </div>
      </div>
  );
}

function EmptyState({ studio }) {
  const examples = [
    { emoji: "🧠", label: "Forgetting Curve", prompt: "Carousel about why kids forget what they learn — explain the forgetting curve — end with how spaced repetition fixes it" },
    { emoji: "💪", label: "Math Confidence", prompt: "Why mental math builds confidence in kids and how parents can practice it daily" },
    { emoji: "🌱", label: "Growth Mindset", prompt: "Growth mindset vs fixed mindset in math with examples and how to shift your child thinking" },
    { emoji: "⭐", label: "Is My Child Ready?", prompt: "5 signs your child is ready for advanced math and how to nurture it" },
  ];
  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.emptyState}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
        <h2 style={styles.emptyTitle}>Your creative will appear here</h2>
        <p style={styles.emptyText}>Type your idea on the left and hit Generate — or try one of these:</p>
        <div style={styles.exampleGrid}>
          {examples.map(ex => (
              <button key={ex.label} style={styles.exampleCard} onClick={() => studio.setPrompt(ex.prompt)}>
                <span style={{ fontSize: 24 }}>{ex.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{ex.label}</span>
              </button>
          ))}
        </div>
      </motion.div>
  );
}

const styles = {
  root: { display: "flex", flexDirection: "column", height: "100vh", background: "var(--brand-cream)", overflow: "hidden" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 24px", height: 64, background: "var(--brand-navy)",
    borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0, zIndex: 100,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 200, flexShrink: 0 },
  headerCenter: { flex: 1, display: "flex", justifyContent: "center" },
  headerRight: { display: "flex", alignItems: "center", gap: 10, minWidth: 200, justifyContent: "flex-end" },
  sidebarToggle: {
    background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.6)",
    width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 11,
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 36, height: 36, borderRadius: 10, background: "var(--brand-orange)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "white",
  },
  logoText: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "white", lineHeight: 1.2 },
  logoSub: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  btnOutline: {
    background: "var(--brand-orange)", color: "white", border: "none",
    borderRadius: "var(--radius-sm)", padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  body: { display: "flex", flex: 1, overflow: "hidden", minHeight: 0 },
  sidebar: { flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden" },
  leftCol: {
    width: 300, flexShrink: 0, display: "flex", flexDirection: "column",
    borderRight: "1px solid var(--border)", background: "var(--surface)",
    overflow: "hidden", minHeight: 0,
  },
  centerCol: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--brand-cream)", padding: 20, overflow: "auto", position: "relative",
  },
  rightCol: {
    width: 300, flexShrink: 0, display: "flex", flexDirection: "column",
    borderLeft: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden",
  },
  stripWrapper: { flex: 1, overflow: "hidden", borderTop: "1px solid var(--border)", minHeight: 0 },
  panelTabs: { display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 },
  panelTab: {
    flex: 1, padding: "10px 4px", fontSize: 11, fontWeight: 500, background: "transparent",
    color: "var(--text-muted)", border: "none", cursor: "pointer", borderBottom: "2px solid transparent",
  },
  panelTabActive: {
    flex: 1, padding: "10px 4px", fontSize: 11, fontWeight: 600, background: "transparent",
    color: "var(--brand-orange)", border: "none", cursor: "pointer", borderBottom: "2px solid var(--brand-orange)",
  },
  panelContent: { flex: 1, overflow: "auto", padding: 16 },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", textAlign: "center", padding: 40, maxWidth: 500,
  },
  emptyTitle: { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 8 },
  emptyText: { fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 },
  exampleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" },
  exampleCard: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    padding: "16px 12px", background: "var(--surface-raised)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer",
  },
};