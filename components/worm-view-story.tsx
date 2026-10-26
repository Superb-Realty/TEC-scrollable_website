"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";

const TOTAL_FRAMES = 181;
const frameSrc = (index: number) => `/section-2/frame-${String(index + 1).padStart(3, "0")}.webp`;

export function WormViewStory() {
  const storyRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const desiredFrame = useRef(0);
  const drawRequested = useRef<(() => void) | null>(null);
  const loadAround = useRef<((index: number) => void) | null>(null);

  const [prefersReduced, setPrefersReduced] = useState(false);
  const [activeChapter, setActiveChapter] = useState<"arrival" | "summit" | "none">("arrival");

  const scrollYProgress = useMotionValue(0);
  const arrivalOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const summitOpacity = useTransform(scrollYProgress, [0.86, 0.94], [0, 1]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Track scroll position and map to target frame
  useEffect(() => {
    if (prefersReduced) return;
    const story = storyRef.current;
    if (!story) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const travel = story.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? Math.max(0, Math.min(1, -story.getBoundingClientRect().top / travel)) : 0;
      scrollYProgress.set(progress);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      const next = Math.round(progress * (TOTAL_FRAMES - 1));
      if (next !== desiredFrame.current) {
        desiredFrame.current = next;
        loadAround.current?.(next);
        drawRequested.current?.();
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollYProgress, prefersReduced]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (progress < 0.10) {
      setActiveChapter("arrival");
    } else if (progress >= 0.86) {
      setActiveChapter("summit");
    } else {
      setActiveChapter("none");
    }
  });

  // Canvas drawing & preloading engine with LRU cache
  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    const cache = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const cacheLimit = isMobile ? 32 : 64;
    let lastDrawn = -1;
    let raf = 0;
    let disposed = false;

    const draw = () => {
      raf = 0;
      const target = desiredFrame.current;
      let selected = cache.has(target) ? target : -1;

      if (selected < 0) {
        let minDistance = Infinity;
        for (const idx of cache.keys()) {
          const dist = Math.abs(idx - target);
          if (dist < minDistance) {
            selected = idx;
            minDistance = dist;
          }
        }
      }

      if (selected < 0 || selected === lastDrawn) return;
      const image = cache.get(selected)!;
      cache.delete(selected);
      cache.set(selected, image);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      // Cover drawing math
      const imgRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawWidth = width;
        drawHeight = width / imgRatio;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawHeight = height;
        drawWidth = height * imgRatio;
        offsetX = (width - drawWidth) / 2;
      }

      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      lastDrawn = selected;
    };

    const queueDraw = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const loadFrame = (index: number) => {
      if (index < 0 || index >= TOTAL_FRAMES || cache.has(index) || loading.has(index)) return;
      loading.add(index);
      const img = new Image();
      img.src = frameSrc(index);
      img
        .decode()
        .then(() => {
          if (disposed) return;
          cache.set(index, img);
          while (cache.size > cacheLimit) {
            const oldest = cache.keys().next().value;
            if (oldest === undefined) break;
            cache.delete(oldest);
          }
          queueDraw();
        })
        .catch(() => {})
        .finally(() => loading.delete(index));
    };

    const around = (index: number) => {
      loadFrame(index);
      const radius = isMobile ? 6 : 10;
      for (let i = 1; i <= radius; i++) {
        loadFrame(index + i);
        loadFrame(index - i);
      }
    };

    loadAround.current = around;
    drawRequested.current = queueDraw;

    // Initial load around start
    around(0);

    const resizeObserver = new ResizeObserver(() => {
      lastDrawn = -1;
      queueDraw();
    });
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(raf);
      loadAround.current = null;
      drawRequested.current = null;
      cache.clear();
    };
  }, [prefersReduced]);

  return (
    <section className="worm-story" ref={storyRef} id="elevation" aria-label="Architectural elevation scroll experience">
      <div className="worm-sticky">
        <div className="worm-stage">
          <canvas ref={canvasRef} className="worm-canvas" />
          <div className="worm-vignette" aria-hidden="true" />
        </div>

        <div className="worm-captions" aria-live="polite">
          {activeChapter === "arrival" && (
            <motion.div className="worm-copy" style={{ opacity: arrivalOpacity }}>
              <p className="eyebrow light">THE ARRIVAL <span>/</span> PLAZA & SCALE</p>
              <h2>From the ground up,<br /><em>built to inspire.</em></h2>
              <p className="worm-copy-desc">A grand arrival plaza welcomes ambitious enterprises to a workplace of uncommon presence.</p>
            </motion.div>
          )}

          {activeChapter === "summit" && (
            <motion.div className="worm-copy" style={{ opacity: summitOpacity }}>
              <p className="eyebrow light">THE SUMMIT</p>
              <h2>A soaring<br /><em>vertical statement.</em></h2>
              <p className="worm-copy-desc">Reaching toward tomorrow with uncompromising architectural clarity.</p>
            </motion.div>
          )}
        </div>

        <div className="worm-hud">
          <div className="worm-scroll-indicator">
            <span>↓</span>
            <span>Scroll to ascend</span>
          </div>
          <div className="worm-progress-track">
            <div ref={progressRef} className="worm-progress-bar" />
          </div>
        </div>
      </div>
    </section>
  );
}
