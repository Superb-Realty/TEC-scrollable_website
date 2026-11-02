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
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const summitRef = useRef<HTMLDivElement>(null);
  const desiredFrame = useRef(0);
  const drawRequested = useRef<(() => void) | null>(null);

  const [prefersReduced, setPrefersReduced] = useState(false);

  const scrollYProgress = useMotionValue(0);
  // Fade in at summit framing, hold alongside the logo, then gently fade as section concludes
  const summitOpacity = useTransform(scrollYProgress, [0.66, 0.76, 0.88, 0.96], [0, 1, 1, 0]);

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

      if (logoWrapRef.current) {
        if (prefersReduced) {
          logoWrapRef.current.style.transform = "none";
          logoWrapRef.current.style.opacity = "1";
        } else {
          const vh = window.innerHeight;
          const vw = window.innerWidth;
          const isMobile = vw <= 600;

          // Estimate base logo width based on responsive CSS clamp: clamp(165px, 17vw, 265px)
          const baseWidth = isMobile
            ? Math.max(135, Math.min(185, vw * 0.38))
            : Math.max(165, Math.min(265, vw * 0.17));
          const baseHeight = baseWidth / 1.947;

          // 1. Initial position (Bottom-left resting zone)
          const initialBottomOffset = isMobile
            ? Math.max(130, Math.min(180, vh * 0.20))
            : Math.max(vh * 0.23, vw * 0.132);
          const initialY = vh - initialBottomOffset - baseHeight;
          const initialX = isMobile ? (vw <= 400 ? 16 : 24) : 25;
          const initialScale = 1;

          // 2. Summit alignment position (Same horizontal line as "THE CHAMBERS OF CORPORATE POWER")
          let summitY = isMobile
            ? Math.max(76, Math.min(104, vh * 0.11))
            : Math.max(100, Math.min(145, vh * 0.13));

          if (summitRef.current) {
            const sRect = summitRef.current.getBoundingClientRect();
            if (sRect.top > 0) {
              summitY = sRect.top;
            }
          }

          const summitX = initialX;
          const summitScale = isMobile ? 0.84 : 0.76;

          // 3. Navbar target position (Merged into navbar header)
          let navY = isMobile ? 18 : 20;
          let navX = initialX;
          let navScale = isMobile ? 110 / baseWidth : 138 / baseWidth;

          const navWordmark = document.querySelector(".site-header .wordmark");
          if (navWordmark) {
            const wRect = navWordmark.getBoundingClientRect();
            if (wRect.width > 0) {
              navX = wRect.left;
              navY = wRect.top;
              navScale = wRect.width / baseWidth;
            }
          }

          let currentX = initialX;
          let currentY = initialY;
          let currentScale = initialScale;
          let currentOpacity = 1;

          if (progress <= 0.72) {
            // Phase 1: Move up and diminish toward the summit horizontal line
            const t = Math.min(1, Math.max(0, progress / 0.72));
            const ease = 1 - Math.pow(1 - t, 2.5);
            currentY = initialY + (summitY - initialY) * ease;
            currentX = initialX + (summitX - initialX) * ease;
            currentScale = initialScale + (summitScale - initialScale) * ease;
            currentOpacity = 1;
          } else if (progress <= 0.86) {
            // Phase 2: Hold alignment in the same horizontal line with "THE CHAMBERS OF CORPORATE POWER"
            currentY = summitY;
            currentX = summitX;
            currentScale = summitScale;
            currentOpacity = 1;
          } else {
            // Phase 3: Slowly glide up and diminish further, merging seamlessly into the navbar
            const t = Math.min(1, Math.max(0, (progress - 0.86) / 0.14));
            const ease = t * t * (3 - 2 * t);
            currentY = summitY + (navY - summitY) * ease;
            currentX = summitX + (navX - summitX) * ease;
            currentScale = summitScale + (navScale - summitScale) * ease;
            // Smoothly dissolve as the persistent navbar reveals at the header line
            currentOpacity = t >= 0.55 ? Math.max(0, 1 - (t - 0.55) / 0.40) : 1;
          }

          logoWrapRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
          logoWrapRef.current.style.opacity = String(currentOpacity);
        }
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
          <div id="worm-hero-logo" ref={logoWrapRef} className="worm-brand-copy">
            <NextImage src="/logo-eastern-chambers-v2.png" alt="The Eastern Chambers" width={1542} height={792} sizes="(max-width: 600px) 80vw, 540px" className="worm-brand-logo" priority unoptimized />
          </div>
        </div>

        <motion.div
          ref={summitRef}
          className="worm-summit-tagline"
          style={{ opacity: summitOpacity }}
        >
          <p>THE CHAMBERS OF<br /><em>CORPORATE POWER.</em></p>
          <span>Grade A+ Commercial Workspaces</span>
        </motion.div>
      </div>
    </section>
  );
}
