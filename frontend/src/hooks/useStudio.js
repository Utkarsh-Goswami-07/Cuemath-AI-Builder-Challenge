import { useState, useCallback } from "react";
import { generateCreative, regenerateSlide, generateCaption, updateCreative } from "../utils/api";
import toast from "react-hot-toast";

export function useStudio() {
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("carousel");
  const [slideCount, setSlideCount] = useState(6);
  const [tone, setTone] = useState("Educational yet warm");
  const [brand] = useState({ name: "Cuemath" });

  const [creative, setCreative] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingSlide, setLoadingSlide] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [history, setHistory] = useState([]);

  const simulateProgress = useCallback(() => {
    const steps = ["Reading your idea...", "Crafting slide structure...", "Writing copy...", "Generating visuals...", "Polishing creative..."];
    let i = 0;
    setProgress(5); setProgressMessage(steps[0]);
    const iv = setInterval(() => {
      i++;
      if (i < steps.length) { setProgress(5 + (i / steps.length) * 85); setProgressMessage(steps[i]); }
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  const generate = useCallback(async () => {
    if (!prompt.trim()) { toast.error("Please enter your idea first"); return; }
    setLoading(true);
    const stop = simulateProgress();
    try {
      const result = await generateCreative({ prompt: prompt.trim(), format, slideCount: format === "carousel" ? slideCount : 1, tone, brand, generateImages: true });
      stop(); setProgress(100); setProgressMessage("Done! ✨");
      if (result.creative) {
        setCreative(result.creative);
        setActiveSlide(0);
        setHistory(h => [result.creative, ...h.slice(0, 19)]);
        toast.success(`Generated ${result.creative.slides?.length} slides!`, { icon: "🎨" });
      }
    } catch (err) {
      stop(); setProgress(0);
      toast.error(err.message || "Generation failed");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [prompt, format, slideCount, tone, brand, simulateProgress]);

  const saveCreative = useCallback(async (updated) => {
    if (!updated?._id) return;
    try { await updateCreative(updated._id, updated); }
    catch (e) { console.warn("Auto-save failed:", e.message); }
  }, []);

  const applyAndSave = useCallback((updated) => {
    setCreative(updated);
    saveCreative(updated);
  }, [saveCreative]);

  const regenerateOneSlide = useCallback(async (slideIndex, instruction) => {
    if (!creative) return;
    setLoadingSlide(slideIndex);
    try {
      const result = await regenerateSlide({ slide: creative.slides[slideIndex], instruction, format: creative.format, brand });
      if (result.slide) {
        const newSlides = [...creative.slides];
        newSlides[slideIndex] = { ...result.slide, slideNumber: slideIndex + 1 };
        applyAndSave({ ...creative, slides: newSlides });
        toast.success("Slide updated!", { icon: "✏️" });
      }
    } catch (err) { toast.error(err.message || "Failed to update slide"); }
    finally { setLoadingSlide(null); }
  }, [creative, brand, applyAndSave]);

  const updateSlideText = useCallback((idx, field, value) => {
    if (!creative) return;
    const newSlides = [...creative.slides];
    newSlides[idx] = { ...newSlides[idx], [field]: value };
    applyAndSave({ ...creative, slides: newSlides });
  }, [creative, applyAndSave]);

  const deleteSlide = useCallback((idx) => {
    if (!creative || creative.slides.length <= 1) { toast.error("Cannot delete the only slide"); return; }
    const newSlides = creative.slides.filter((_, i) => i !== idx).map((s, i) => ({ ...s, slideNumber: i + 1 }));
    applyAndSave({ ...creative, slides: newSlides });
    if (activeSlide >= newSlides.length) setActiveSlide(newSlides.length - 1);
  }, [creative, activeSlide, applyAndSave]);

  const updateTheme = useCallback((updates) => {
    if (!creative) return;
    applyAndSave({ ...creative, theme: { ...creative.theme, ...updates } });
  }, [creative, applyAndSave]);

  const refreshCaption = useCallback(async () => {
    if (!creative?.slides) return;
    try {
      const result = await generateCaption({ slides: creative.slides, format: creative.format, tone });
      applyAndSave({ ...creative, caption: result.caption, hashtags: result.hashtags });
      toast.success("Caption refreshed!", { icon: "✍️" });
    } catch (err) { toast.error("Failed to refresh caption"); }
  }, [creative, tone, applyAndSave]);

  const loadCreative = useCallback((c) => {
    setCreative(c);
    setActiveSlide(0);
    setFormat(c.format || "carousel");
    setPrompt(c.originalPrompt || "");
  }, []);

  return {
    prompt, setPrompt, format, setFormat, slideCount, setSlideCount, tone, setTone,
    creative, setCreative: applyAndSave, activeSlide, setActiveSlide,
    loading, loadingSlide, progress, progressMessage,
    history, setHistory,
    generate, regenerateOneSlide, updateSlideText, deleteSlide, updateTheme, refreshCaption, loadCreative,
  };
}