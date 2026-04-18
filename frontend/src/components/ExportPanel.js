import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ExportPanel({ studio }) {
  const { creative } = studio;
  const [exporting, setExporting] = useState(null);

  if (!creative) return null;

  const handleCopyAll = async () => {
    const text = creative.slides
      .map((s, i) => [
        `--- Slide ${i + 1} [${s.type?.toUpperCase()}] ---`,
        `Heading: ${s.heading}`,
        s.subheading ? `Subheading: ${s.subheading}` : "",
        s.bodyText ? `Body: ${s.bodyText}` : "",
        s.callout ? `Callout: ${s.callout}` : "",
      ].filter(Boolean).join("\n"))
      .join("\n\n");

    const full = `${creative.title}\n${"=".repeat(40)}\n\n${text}\n\nCAPTION:\n${creative.caption}\n\nHASHTAGS:\n${creative.hashtags?.join(" ")}`;
    await navigator.clipboard.writeText(full);
    toast.success("All content copied!", { icon: "📋" });
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(creative, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cuemath-${creative.id || "creative"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded!");
  };

  const handleDownloadText = () => {
    let text = `CUEMATH SOCIAL MEDIA CREATIVE\n================================\n`;
    text += `Title: ${creative.title}\nFormat: ${creative.format}\nGenerated: ${creative.createdAt}\n\n`;
    text += `SLIDES\n------\n`;
    creative.slides?.forEach((slide, i) => {
      text += `\nSlide ${i + 1} [${slide.type?.toUpperCase()}]\n`;
      text += `Heading: ${slide.heading}\n`;
      if (slide.subheading) text += `Subheading: ${slide.subheading}\n`;
      if (slide.bodyText) text += `Body: ${slide.bodyText}\n`;
      if (slide.callout) text += `Callout: ${slide.callout}\n`;
      if (slide.emoji) text += `Emoji: ${slide.emoji}\n`;
      text += `Visual Description: ${slide.visualPrompt}\n`;
    });
    text += `\nCAPTION\n-------\n${creative.caption}\n`;
    text += `\nHASHTAGS\n--------\n${creative.hashtags?.join(" ")}\n`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cuemath-${creative.id || "creative"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded!");
  };

  const stats = {
    slides: creative.slides?.length || 0,
    words: creative.slides?.reduce((acc, s) => {
      return acc + (s.heading || "").split(" ").length + (s.bodyText || "").split(" ").length;
    }, 0) || 0,
    hashtags: creative.hashtags?.length || 0,
  };

  return (
    <div style={styles.wrapper}>
      {/* Summary */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryTitle}>{creative.title}</div>
        <div style={styles.summaryMeta}>
          <span>{creative.format?.replace("_", " ")}</span>
          <span>•</span>
          <span>{stats.slides} slides</span>
          <span>•</span>
          <span>~{stats.words} words</span>
        </div>
        <div style={styles.statRow}>
          <Stat label="Slides" value={stats.slides} />
          <Stat label="Words" value={stats.words} />
          <Stat label="Hashtags" value={stats.hashtags} />
        </div>
      </div>

      {/* Export options */}
      <div style={styles.section}>
        <div style={styles.label}>Copy to Clipboard</div>
        <button style={styles.exportBtn} onClick={handleCopyAll}>
          <span style={styles.exportIcon}>📋</span>
          <div>
            <div style={styles.exportTitle}>Copy All Content</div>
            <div style={styles.exportDesc}>All slides + caption + hashtags</div>
          </div>
        </button>
        <button
          style={styles.exportBtn}
          onClick={async () => {
            await navigator.clipboard.writeText(creative.caption || "");
            toast.success("Caption copied!");
          }}
        >
          <span style={styles.exportIcon}>✍️</span>
          <div>
            <div style={styles.exportTitle}>Copy Caption Only</div>
            <div style={styles.exportDesc}>Ready to paste into Instagram</div>
          </div>
        </button>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Download Files</div>
        <button style={styles.exportBtn} onClick={handleDownloadText}>
          <span style={styles.exportIcon}>📄</span>
          <div>
            <div style={styles.exportTitle}>Download as .txt</div>
            <div style={styles.exportDesc}>Clean text file for copywriters</div>
          </div>
        </button>
        <button style={styles.exportBtn} onClick={handleDownloadJSON}>
          <span style={styles.exportIcon}>⚙️</span>
          <div>
            <div style={styles.exportTitle}>Download as .json</div>
            <div style={styles.exportDesc}>Full data with images & metadata</div>
          </div>
        </button>
      </div>

      {/* Individual slide copy */}
      <div style={styles.section}>
        <div style={styles.label}>Copy Individual Slides</div>
        <div style={styles.slideList}>
          {creative.slides?.map((slide, i) => (
            <button
              key={i}
              style={styles.slideCopyBtn}
              onClick={async () => {
                const t = `Slide ${i + 1}: ${slide.heading}\n${slide.bodyText || ""}`;
                await navigator.clipboard.writeText(t);
                toast.success(`Slide ${i + 1} copied!`);
              }}
            >
              <span style={styles.slideIndex}>{i + 1}</span>
              <span style={styles.slideName}>{slide.heading?.substring(0, 30)}{slide.heading?.length > 30 ? "..." : ""}</span>
              <span style={styles.slideAction}>Copy</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: "var(--brand-orange)", fontFamily: "var(--font-display)" }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 18 },
  summaryCard: {
    padding: 14, background: "linear-gradient(135deg, var(--brand-navy), rgba(255,107,53,0.15))",
    borderRadius: "var(--radius-md)", border: "1px solid rgba(255,107,53,0.2)",
  },
  summaryTitle: {
    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
    color: "white", marginBottom: 4,
  },
  summaryMeta: {
    fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", gap: 5,
    marginBottom: 12, textTransform: "capitalize",
  },
  statRow: { display: "flex", justifyContent: "space-around" },
  section: { display: "flex", flexDirection: "column", gap: 7 },
  label: {
    fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  exportBtn: {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
    background: "var(--surface-raised)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left",
    transition: "var(--transition)",
  },
  exportIcon: { fontSize: 20, flexShrink: 0 },
  exportTitle: { fontSize: 12, fontWeight: 600, color: "var(--text-primary)" },
  exportDesc: { fontSize: 11, color: "var(--text-muted)", marginTop: 1 },
  slideList: { display: "flex", flexDirection: "column", gap: 4 },
  slideCopyBtn: {
    display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
    background: "var(--surface-raised)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left",
  },
  slideIndex: {
    width: 20, height: 20, borderRadius: "50%",
    background: "rgba(255,107,53,0.12)", color: "var(--brand-orange)",
    fontSize: 10, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  slideName: { flex: 1, fontSize: 11, color: "var(--text-primary)", fontWeight: 500 },
  slideAction: { fontSize: 10, color: "var(--brand-orange)", fontWeight: 600 },
};
