"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { measureSeams, pinnedProgress } from "@/components/pinned-progress";

const TOTAL_FRAMES = 235;
const frameSrc = (index: number) => `/section-2/frame-${String(index + 1).padStart(3, "0")}.webp?v=b202db4b`;

export function WormViewStory() {
  const storyRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const desiredFrame = useRef(0);
  const drawRequested = useRef<(() => void) | null>(null);

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
    let seams = measureSeams(story);
    const update = () => {
      raf = 0;
      const progress = pinnedProgress(story, seams);
      scrollYProgress.set(progress);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      const next = Math.round(progress * (TOTAL_FRAMES - 1));
      if (next !== desiredFrame.current) {
        desiredFrame.current = next;
        drawRequested.current?.();
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      seams = measureSeams(story);
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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

  // Canvas drawing and bounded frame preloading
  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    const cache = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    const pending = new Set<number>();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const cacheLimit = isMobile ? 20 : 40;
    const loadLimit = isMobile ? 3 : 5;
    const preloadRadius = isMobile ? 7 : 12;
    let playhead = desiredFrame.current;
    let lastDrawn = -1;
    let lastTick = 0;
    let raf = 0;
    let disposed = false;

    const draw = () => {
      const target = Math.round(playhead);
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
        // Follow the camera upward: show the entrance first, then the roofline.
        const framingProgress = Math.max(0, Math.min(1, (selected / (TOTAL_FRAMES - 1) - 0.1) / 0.4));
        offsetY = -(drawHeight - height) * (1 - framingProgress);
      } else {
        drawHeight = height;
        drawWidth = height * imgRatio;
        offsetX = (width - drawWidth) / 2;
      }

      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      lastDrawn = selected;
    };

    function queueDraw() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function pump() {
      while (!disposed && loading.size < loadLimit && pending.size) {
        const index = pending.values().next().value as number;
        pending.delete(index);
        if (cache.has(index) || loading.has(index)) continue;
        loading.add(index);
        const img = new Image();
        img.src = frameSrc(index);
        img.decode()
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
          .finally(() => {
            loading.delete(index);
            pump();
          });
      }
    }

    function around(index: number) {
      pending.clear();
      const direction = desiredFrame.current >= playhead ? 1 : -1;
      const enqueue = (frame: number) => {
        if (frame >= 0 && frame < TOTAL_FRAMES && !cache.has(frame) && !loading.has(frame)) pending.add(frame);
      };
      enqueue(index);
      for (let i = 1; i <= preloadRadius; i++) enqueue(index + direction * i);
      for (let i = 1; i <= preloadRadius; i++) enqueue(index - direction * i);
      pump();
    }

    function tick(time: number) {
      raf = 0;
      const elapsed = lastTick ? Math.min(time - lastTick, 50) : 16;
      lastTick = time;
      const distance = desiredFrame.current - playhead;
      const advance = Math.max(1, elapsed * 0.18);
      playhead = Math.abs(distance) <= advance ? desiredFrame.current : playhead + Math.sign(distance) * advance;
      around(Math.round(playhead));
      draw();
      if (Math.abs(desiredFrame.current - playhead) > 0.01) queueDraw();
    }

    drawRequested.current = queueDraw;

    // Initial load around the current scroll position
    around(Math.round(playhead));

    const resizeObserver = new ResizeObserver(() => {
      lastDrawn = -1;
      queueDraw();
    });
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(raf);
      drawRequested.current = null;
      pending.clear();
      cache.clear();
    };
  }, [prefersReduced]);

  return (
    <section className="worm-story blend-in blend-sm" ref={storyRef} id="elevation" aria-label="Architectural elevation scroll experience">
      <div className="worm-sticky">
        <div className="worm-stage">
          <canvas ref={canvasRef} className="worm-canvas" />
          <div className="worm-vignette" aria-hidden="true" />
        </div>

        <div className="worm-captions" aria-live="polite">
          {activeChapter === "summit" && (
            <motion.div className="worm-brand-copy" style={{ opacity: summitOpacity }}>
              <NextImage src="/logo-eastern-chambers.png" alt="The Eastern Chambers" width={679} height={368} sizes="(max-width: 600px) 80vw, 540px" className="worm-brand-logo" />
            </motion.div>
          )}
        </div>

        {activeChapter === "summit" && (
          <motion.div className="worm-summit-tagline" style={{ opacity: summitOpacity }}>
            <p>THE CHAMBERS OF<br /><em>CORPORATE POWER.</em></p>
            <span>Grade A+ Commercial Workspaces</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
