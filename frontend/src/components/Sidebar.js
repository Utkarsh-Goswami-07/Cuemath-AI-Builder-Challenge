import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHistory, deleteCreative } from "../utils/api";
import toast from "react-hot-toast";

export default function Sidebar({ onLoad, currentId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
        .then(r => setItems(r.creatives || []))
        .catch(() => {})
        .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteCreative(id);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const formatLabel = { carousel: "▦", instagram_post: "□", story: "▯", linkedin: "▭" };

  return (
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <span style={styles.title}>History</span>
          <span style={styles.count}>{items.length}</span>
        </div>
        {loading && <div style={styles.empty}>Loading...</div>}
        {!loading && items.length === 0 && (
            <div style={styles.empty}>No creatives yet.<br />Generate one to see it here.</div>
        )}
        <div style={styles.list}>
          <AnimatePresence>
            {items.map(item => (
                <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{ ...styles.item, ...(currentId === item._id ? styles.itemActive : {}) }}
                    onClick={() => onLoad(item)}
                >
                  <div style={styles.itemTop}>
                    <span style={styles.formatBadge}>{formatLabel[item.format] || "□"}</span>
                    <span style={styles.itemTitle}>{item.title || "Untitled"}</span>
                    <button style={styles.deleteBtn} onClick={(e) => handleDelete(e, item._id)}>✕</button>
                  </div>
                  <div style={styles.itemMeta}>
                    {item.slides?.length || 0} slides · {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  {item.originalPrompt && (
                      <div style={styles.itemPrompt}>
                        {item.originalPrompt.substring(0, 55)}{item.originalPrompt.length > 55 ? "..." : ""}
                      </div>
                  )}
                </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 14px 10px", flexShrink: 0, borderBottom: "1px solid var(--border)",
  },
  title: { fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" },
  count: { background: "rgba(255,107,53,0.12)", color: "var(--brand-orange)", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 100 },
  list: { overflowY: "auto", flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 5 },
  empty: { padding: 20, fontSize: 12, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 },
  item: {
    padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
    background: "var(--surface-raised)", cursor: "pointer", transition: "var(--transition)",
  },
  itemActive: { border: "1.5px solid var(--brand-orange)", background: "rgba(255,107,53,0.05)" },
  itemTop: { display: "flex", alignItems: "center", gap: 6, marginBottom: 3 },
  formatBadge: { fontSize: 12, color: "var(--brand-orange)", flexShrink: 0 },
  itemTitle: { flex: 1, fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  deleteBtn: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 10, cursor: "pointer", padding: "2px 4px", borderRadius: 4 },
  itemMeta: { fontSize: 10, color: "var(--text-muted)", marginBottom: 3 },
  itemPrompt: { fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.4, fontStyle: "italic" },
};