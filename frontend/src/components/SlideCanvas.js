import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FORMAT_RATIOS = {
  carousel: { w: 440, h: 440 },
  instagram_post: { w: 440, h: 440 },
  story: { w: 248, h: 440 },
  linkedin: { w: 440, h: 230 },
};

export default function SlideCanvas({ studio, onEditRequest }) {
  const { creative, activeSlide, setActiveSlide, loadingSlide } = studio;
  if (!creative?.slides?.length) return null;

  const slide = creative.slides[activeSlide];
  const theme = creative.theme || {};
  const dims = FORMAT_RATIOS[creative.format] || FORMAT_RATIOS.carousel;

  const bg = (!theme.backgroundColor || theme.backgroundColor === "#FFFFFF" || theme.backgroundColor === "#ffffff" || theme.backgroundColor === "#FFF8F5") ? "#1A1A2E" : theme.backgroundColor;
  const primary = theme.primaryColor || "#FF6B35";
  const accent = theme.accentColor || "#FFD700";
  const isDarkBg = !theme.backgroundColor || theme.backgroundColor === "#1A1A2E" || theme.backgroundColor?.toLowerCase() === "#000000" || parseInt(theme.backgroundColor?.replace("#",""), 16) < 0x888888 * 3;
  const textColor = isDarkBg ? "#FFFFFF" : (theme.textColor || "#1A1A2E");

  return (
      <div style={styles.wrapper}>
        {/* Left arrow */}
        <button
            style={{ ...styles.navBtn, opacity: activeSlide === 0 ? 0.3 : 1 }}
            onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
            disabled={activeSlide === 0}
        >‹</button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <AnimatePresence mode="wait">
            <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
                style={{
                  width: dims.w,
                  height: dims.h,
                  borderRadius: 20,
                  background: bg,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onClick={onEditRequest}
            >
              {/* Background image - subtle */}
              {slide.imageData && (
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${slide.imageData})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.18,
                  }} />
              )}

              {/* Gradient overlay - strong so text is readable */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(145deg, ${bg} 40%, ${bg}bb 70%, ${primary}28 100%)`,
              }} />

              {/* Decorative circle top-right */}
              <div style={{
                position: "absolute", top: -50, right: -50,
                width: 200, height: 200, borderRadius: "50%",
                background: primary, opacity: 0.1,
              }} />
              {/* Decorative circle bottom-left */}
              <div style={{
                position: "absolute", bottom: -40, left: -40,
                width: 150, height: 150, borderRadius: "50%",
                background: accent, opacity: 0.08,
              }} />

              {/* Top bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 20px",
              }}>
                {/* Slide dots */}
                <div style={{ display: "flex", gap: 4 }}>
                  {creative.slides.map((_, i) => (
                      <div key={i} style={{
                        width: i === activeSlide ? 18 : 5,
                        height: 5, borderRadius: 100,
                        background: i === activeSlide ? primary : "rgba(255,255,255,0.25)",
                        transition: "all 0.3s",
                      }} />
                  ))}
                </div>
                {/* Brand */}
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-display)",
                }}>CUEMATH</div>
              </div>

              {/* Main content */}
              <div style={{
                position: "relative", zIndex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: creative.format === "story" ? "60px 24px 40px" : "56px 28px 28px",
                gap: 8,
              }}>
                {/* Emoji */}
                {slide.emoji && (
                    <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 4 }}>
                      {slide.emoji}
                    </div>
                )}

                {/* Stat callout for stat slides */}
                {slide.callout && slide.type === "stat" && (
                    <div style={{
                      fontSize: 52, fontWeight: 900,
                      fontFamily: "var(--font-display)",
                      color: accent, lineHeight: 1,
                      textShadow: `0 0 40px ${accent}44`,
                    }}>
                      {slide.callout}
                    </div>
                )}

                {/* Heading */}
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: slide.type === "hook" ? 34 : creative.format === "story" ? 28 : 26,
                  fontWeight: 800,
                  color: textColor,
                  lineHeight: 1.15,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}>
                  {slide.heading}
                </h2>

                {/* Accent line */}
                <div style={{
                  width: 36, height: 3, borderRadius: 100,
                  background: `linear-gradient(to right, ${primary}, ${accent})`,
                  margin: "2px 0",
                }} />

                {/* Subheading */}
                {slide.subheading && (
                    <p style={{
                      fontSize: 14, fontWeight: 600,
                      color: `${textColor}cc`,
                      margin: 0, lineHeight: 1.4,
                    }}>
                      {slide.subheading}
                    </p>
                )}

                {/* Body */}
                {slide.bodyText && (
                    <p style={{
                      fontSize: 12.5,
                      color: `${textColor}88`,
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {slide.bodyText}
                    </p>
                )}

                {/* Callout box (non-stat) */}
                {slide.callout && slide.type !== "stat" && (
                    <div style={{
                      marginTop: 6,
                      background: `${primary}18`,
                      border: `1px solid ${primary}40`,
                      borderLeft: `3px solid ${primary}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}>
                  <span style={{ fontSize: 12, color: textColor, fontWeight: 600, lineHeight: 1.4 }}>
                    {slide.callout}
                  </span>
                    </div>
                )}

                {/* CTA button */}
                {slide.type === "cta" && (
                    <div style={{
                      marginTop: 10,
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: primary, color: "white",
                      padding: "10px 20px", borderRadius: 100,
                      fontSize: 12, fontWeight: 700,
                      alignSelf: "flex-start",
                      fontFamily: "var(--font-display)",
                      boxShadow: `0 6px 20px ${primary}50`,
                      letterSpacing: "0.02em",
                    }}>
                      Learn More at Cuemath →
                    </div>
                )}
              </div>

              {/* Loading overlay */}
              {loadingSlide === activeSlide && (
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 20,
                    background: "rgba(0,0,0,0.65)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", gap: 10,
                  }}>
                    <div style={{ fontSize: 28 }}>🔄</div>
                    <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>Regenerating...</span>
                  </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom info bar */}
          <div style={styles.infoBar}>
          <span style={{ ...styles.typeBadge, background: primary }}>
            {slide.type?.toUpperCase()}
          </span>
            <span style={styles.slideCounter}>
            {activeSlide + 1} / {creative.slides.length}
          </span>
            <span style={styles.formatLabel}>
            {creative.format?.replace("_", " ")}
          </span>
          </div>
        </div>

        {/* Right arrow */}
        <button
            style={{ ...styles.navBtn, opacity: activeSlide === creative.slides.length - 1 ? 0.3 : 1 }}
            onClick={() => setActiveSlide(Math.min(creative.slides.length - 1, activeSlide + 1))}
            disabled={activeSlide === creative.slides.length - 1}
        >›</button>
      </div>
  );
}

const styles = {
  wrapper: {
    display: "flex", alignItems: "center", gap: 16, position: "relative",
  },
  navBtn: {
    width: 40, height: 40, borderRadius: "50%",
    background: "white", border: "1px solid var(--border)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    fontSize: 22, cursor: "pointer", color: "var(--text-primary)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "var(--transition)", flexShrink: 0,
    fontWeight: 300,
  },
  infoBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", padding: "0 4px",
  },
  typeBadge: {
    color: "white", fontSize: 10, fontWeight: 700,
    padding: "3px 10px", borderRadius: 100, letterSpacing: "0.06em",
  },
  slideCounter: { fontSize: 12, color: "var(--text-muted)", fontWeight: 500 },
  formatLabel: {
    fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize", fontWeight: 400,
  },
};