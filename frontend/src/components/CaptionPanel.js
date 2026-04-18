import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CaptionPanel({ studio }) {
  const { creative, setCreative, refreshCaption } = studio;
  const [copying, setCopying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  if (!creative) return null;

  const handleCopyCaption = async () => {
    const text = `${creative.caption || ""}\n\n${creative.hashtags?.join(" ") || ""}`;
    await navigator.clipboard.writeText(text);
    setCopying(true);
    toast.success("Caption copied!", { icon: "📋" });
    setTimeout(() => setCopying(false), 2000);
  };

  const handleCopyHashtags = async () => {
    await navigator.clipboard.writeText(creative.hashtags?.join(" ") || "");
    toast.success("Hashtags copied!", { icon: "#️⃣" });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshCaption();
    setRefreshing(false);
  };

  const handleCaptionEdit = (e) => {
    setCreative({ ...creative, caption: e.target.value });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.label}>Caption</span>
          <div style={styles.sectionActions}>
            <button
              style={styles.iconBtn}
              onClick={handleRefresh}
              disabled={refreshing}
              title="Regenerate caption with AI"
            >
              {refreshing ? "⏳" : "✨ Refresh"}
            </button>
            <button
              style={styles.iconBtn}
              onClick={handleCopyCaption}
              title="Copy caption + hashtags"
            >
              {copying ? "✅ Copied" : "📋 Copy"}
            </button>
          </div>
        </div>
        <textarea
          value={creative.caption || ""}
          onChange={handleCaptionEdit}
          style={styles.captionArea}
          rows={6}
          placeholder="Your caption will appear here after generating..."
        />
        <div style={styles.charInfo}>
          {(creative.caption || "").length} characters
          {(creative.caption || "").length > 2200 && (
            <span style={styles.charWarn}> (Instagram max: 2200)</span>
          )}
        </div>
      </div>

      {creative.hashtags?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.label}>Hashtags</span>
            <button style={styles.iconBtn} onClick={handleCopyHashtags}>
              📋 Copy
            </button>
          </div>
          <div style={styles.hashtagCloud}>
            {creative.hashtags.map((tag, i) => (
              <span
                key={i}
                style={styles.hashtag}
                onClick={async () => {
                  await navigator.clipboard.writeText(tag);
                  toast.success(`Copied ${tag}`);
                }}
                title="Click to copy"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
          <div style={styles.hashCount}>
            {creative.hashtags.length} hashtags
            {creative.hashtags.length > 30 && (
              <span style={styles.charWarn}> (Instagram max: 30)</span>
            )}
          </div>
        </div>
      )}

      {creative.insights && (
        <div style={styles.section}>
          <div style={styles.label}>Content Insights</div>
          <div style={styles.insightCard}>
            <div style={styles.insight}>
              <span style={styles.insightIcon}>🪝</span>
              <div>
                <div style={styles.insightLabel}>Hook Strategy</div>
                <div style={styles.insightText}>{creative.insights.hook}</div>
              </div>
            </div>
            <div style={styles.insight}>
              <span style={styles.insightIcon}>📖</span>
              <div>
                <div style={styles.insightLabel}>Story Arc</div>
                <div style={styles.insightText}>{creative.insights.narrative}</div>
              </div>
            </div>
            <div style={styles.insight}>
              <span style={styles.insightIcon}>🎯</span>
              <div>
                <div style={styles.insightLabel}>CTA Goal</div>
                <div style={styles.insightText}>{creative.insights.cta}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {creative.altText && (
        <div style={styles.section}>
          <div style={styles.label}>Alt Text (Accessibility)</div>
          <div style={styles.altText}>{creative.altText}</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 18 },
  section: { display: "flex", flexDirection: "column", gap: 8 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sectionActions: { display: "flex", gap: 6 },
  label: {
    fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
    textTransform: "uppercase", letterSpacing: "0.06em",
  },
  iconBtn: {
    padding: "4px 8px", background: "transparent",
    color: "var(--text-secondary)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  captionArea: {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
    fontSize: 12, lineHeight: 1.6, color: "var(--text-primary)",
    fontFamily: "var(--font-body)", resize: "vertical",
    background: "var(--surface-raised)",
  },
  charInfo: { fontSize: 11, color: "var(--text-muted)", textAlign: "right" },
  charWarn: { color: "var(--brand-orange)", fontWeight: 600 },
  hashtagCloud: { display: "flex", flexWrap: "wrap", gap: 5 },
  hashtag: {
    padding: "3px 8px", background: "rgba(255,107,53,0.08)",
    border: "1px solid rgba(255,107,53,0.2)", borderRadius: 100,
    fontSize: 11, color: "var(--brand-orange)", cursor: "pointer",
    fontWeight: 500, transition: "var(--transition)",
  },
  hashCount: { fontSize: 11, color: "var(--text-muted)" },
  insightCard: {
    display: "flex", flexDirection: "column", gap: 10,
    padding: 12, background: "var(--surface-raised)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
  },
  insight: { display: "flex", gap: 10, alignItems: "flex-start" },
  insightIcon: { fontSize: 16, flexShrink: 0, marginTop: 1 },
  insightLabel: { fontSize: 10, fontWeight: 700, color: "var(--brand-orange)", marginBottom: 2, textTransform: "uppercase" },
  insightText: { fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 },
  altText: {
    padding: "8px 10px", background: "var(--surface-raised)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
    fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5, fontStyle: "italic",
  },
};
