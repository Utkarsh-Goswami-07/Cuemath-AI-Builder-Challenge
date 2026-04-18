import React from "react";
import { motion } from "framer-motion";

export default function SlideStrip({ studio }) {
  const { creative, activeSlide, setActiveSlide, loadingSlide } = studio;
  if (!creative?.slides?.length) return null;

  const theme = creative.theme || {};
  const primary = theme.primaryColor || "#FF6B35";

  const getBg = (slide) => {
    const bg = theme.backgroundColor || "#1A1A2E";
    const isLight = bg === "#FFFFFF" || bg === "#FFF8F5" || bg === "#ffffff";
    return isLight ? "#1A1A2E" : bg;
  };

  return (
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <span style={styles.title}>Slides</span>
          <span style={styles.count}>{creative.slides.length} total</span>
        </div>
        <div style={styles.strip}>
          {creative.slides.map((slide, i) => {
            const bg = getBg(slide);
            const isActive = i === activeSlide;
            const isLoading = loadingSlide === i;

            return (
                <motion.div
                    key={i}
                    style={{
                      ...styles.thumb,
                      background: bg,
                      border: isActive ? `2px solid ${primary}` : "2px solid transparent",
                      boxShadow: isActive ? `0 0 0 2px ${primary}33` : "var(--shadow-sm)",
                    }}
                    onClick={() => setActiveSlide(i)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                  {/* BG image */}
                  {slide.imageData && (
                      <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: `url(${slide.imageData})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.2, borderRadius: 7,
                      }} />
                  )}

                  {/* Dark overlay */}
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 7,
                    background: `linear-gradient(135deg, ${bg}ee, ${bg}99)`,
                  }} />

                  {/* Content */}
                  <div style={{ position: "relative", zIndex: 1, padding: "7px 8px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 7, fontWeight: 800, color: "white",
                      }}>
                        {i + 1}
                      </div>
                      {slide.emoji && <span style={{ fontSize: 12 }}>{slide.emoji}</span>}
                    </div>

                    <div>
                      <div style={{
                        fontSize: 8, fontWeight: 700, color: "white",
                        lineHeight: 1.3, marginBottom: 4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {slide.heading}
                      </div>
                      <div style={{
                        width: 16, height: 2, borderRadius: 100,
                        background: primary,
                      }} />
                    </div>
                  </div>

                  {/* Type badge */}
                  <div style={{
                    position: "absolute", bottom: 5, right: 6,
                    fontSize: 6, fontWeight: 800, color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {slide.type}
                  </div>

                  {/* Loading */}
                  {isLoading && (
                      <div style={{
                        position: "absolute", inset: 0, borderRadius: 7,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14,
                      }}>🔄</div>
                  )}
                </motion.div>
            );
          })}
        </div>
      </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 14px 6px", flexShrink: 0,
  },
  title: { fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" },
  count: { fontSize: 11, color: "var(--text-muted)" },
  strip: {
    display: "flex", flexDirection: "column", gap: 6,
    padding: "4px 12px 12px", overflowY: "auto", flex: 1,
  },
  thumb: {
    height: 76, borderRadius: 8, cursor: "pointer",
    position: "relative", overflow: "hidden", flexShrink: 0,
    transition: "border 0.2s, box-shadow 0.2s",
  },
};