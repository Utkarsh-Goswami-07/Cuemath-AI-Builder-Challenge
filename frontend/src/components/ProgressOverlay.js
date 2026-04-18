import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  { label: "Reading your idea", icon: "💭" },
  { label: "Crafting slide structure", icon: "📐" },
  { label: "Writing compelling copy", icon: "✍️" },
  { label: "Designing visual prompts", icon: "🎨" },
  { label: "Generating illustrations", icon: "🖼️" },
  { label: "Polishing the creative", icon: "✨" },
];

export default function ProgressOverlay({ progress, message }) {
  const currentStepIndex = STEPS.findIndex((s) => s.label.toLowerCase().includes(message?.split(" ")[0]?.toLowerCase()));
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : Math.floor((progress / 100) * STEPS.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.wrapper}
    >
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoMark}>C</span>
        </div>

        {/* Title */}
        <div style={styles.title}>Creating your creative</div>
        <div style={styles.subtitle}>{message || "Warming up..."}</div>

        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <motion.div
            style={styles.progressFill}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div style={styles.progressLabel}>{Math.round(progress)}%</div>

        {/* Steps */}
        <div style={styles.steps}>
          {STEPS.map((step, i) => {
            const isDone = i < activeStep;
            const isActive = i === activeStep;

            return (
              <motion.div
                key={i}
                style={{
                  ...styles.step,
                  opacity: isDone || isActive ? 1 : 0.3,
                }}
                animate={{ opacity: isDone || isActive ? 1 : 0.3 }}
              >
                <span style={styles.stepIcon}>
                  {isDone ? "✅" : isActive ? (
                    <span style={styles.spinning}>⏳</span>
                  ) : step.icon}
                </span>
                <span style={{
                  ...styles.stepLabel,
                  color: isActive ? "var(--brand-orange)" : isDone ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinning { display: inline-block; animation: pulse-spin 1s linear infinite; }
      `}</style>
    </motion.div>
  );
}

const styles = {
  wrapper: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", height: "100%",
  },
  card: {
    background: "white",
    borderRadius: "var(--radius-xl)",
    padding: "36px 40px",
    boxShadow: "var(--shadow-xl)",
    border: "1px solid var(--border)",
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 14, width: 380, maxWidth: "90%",
  },
  logo: {
    width: 52, height: 52, borderRadius: 14,
    background: "linear-gradient(135deg, var(--brand-orange), #E5541A)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 8px 24px rgba(255,107,53,0.35)",
  },
  logoMark: {
    fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 28, color: "white",
  },
  title: {
    fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800,
    color: "var(--text-primary)",
  },
  subtitle: {
    fontSize: 13, color: "var(--text-secondary)", marginTop: -6,
    minHeight: 20, textAlign: "center",
  },
  progressTrack: {
    width: "100%", height: 8, background: "var(--brand-cream-dark)",
    borderRadius: 100, overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(to right, var(--brand-orange), #FFD700)",
    borderRadius: 100,
  },
  progressLabel: {
    fontSize: 12, fontWeight: 700, color: "var(--brand-orange)",
    marginTop: -6,
  },
  steps: { width: "100%", display: "flex", flexDirection: "column", gap: 6, marginTop: 4 },
  step: { display: "flex", alignItems: "center", gap: 10 },
  stepIcon: { fontSize: 16, width: 20, textAlign: "center", flexShrink: 0 },
  stepLabel: { fontSize: 12, transition: "all 0.3s" },
  spinning: { display: "inline-block" },
};
