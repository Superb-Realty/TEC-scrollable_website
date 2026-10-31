"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { measureSeams, pinnedProgress } from "@/components/pinned-progress";

const LAST = 191;
const src = (index: number) => `/sequence/frame-${String(index + 1).padStart(3, "0")}.webp?v=video1`;

export function SequenceStory() {
  const storyRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desired = useRef(0);
  const drawRequested = useRef<(() => void) | null>(null);
  const loadAround = useRef<((index: number) => void) | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);
  const reduced = prefersReduced && !motionOverride;
  const [activeCopy, setActiveCopy] = useState("intro");
  const scrollYProgress = useMotionValue(0);
  const introOpacity = useTransform(scrollYProgress, [0, 0.09], [1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.85, 0.93], [0, 1]);
  const scrollCuePointerEvents = useTransform(scrollYProgress, (v) => (v > 0.08 ? "none" : "auto"));

  const handleScrollToExperience = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    let seams = measureSeams(story);
    const update = () => {
      const progress = pinnedProgress(story, seams);
      scrollYProgress.set(progress);
      const next = Math.round(Math.min(progress / 0.86, 1) * LAST);
      if (next !== desired.current) {
        desired.current = next;
        loadAround.current?.(next);
        drawRequested.current?.();
      }
    };
    const onResize = () => { seams = measureSeams(story); update(); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, [scrollYProgress, reduced]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActiveCopy(progress < 0.12 ? "intro" : progress >= 0.85 ? "reveal" : "none");
  });

  useEffect(() => {
    const progress = scrollYProgress.get();
    setActiveCopy(progress < 0.12 ? "intro" : progress >= 0.85 ? "reveal" : "none");
  }, [scrollYProgress]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    const cache = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    let raf = 0;
    let lastDrawn = -1;
    let disposed = false;
    let prefetchTimer: ReturnType<typeof setTimeout>;
    const cap = window.matchMedia("(max-width: 700px)").matches ? 16 : 36;

    const paint = () => {
      raf = 0;
      const target = desired.current;
      let selected = cache.has(target) ? target : -1;
      if (selected < 0) {
        let distance = Infinity;
        for (const index of cache.keys()) {
          const delta = Math.abs(index - target);
          if (delta < distance) { selected = index; distance = delta; }
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#17211c";
      ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const sw = image.naturalWidth;
      const sh = image.naturalHeight;
      // Slight 1.035 bleed crops corner watermark while keeping the centered building elevation framed
      const baseScale = Math.max(width / sw, height / sh) * 1.035;
      const dw = sw * baseScale;
      const dh = sh * baseScale;
      const dx = (width - dw) * 0.5;
      const dy = (height - dh) * 0.48;
      ctx.drawImage(image, 0, 0, sw, sh, dx, dy, dw, dh);
      lastDrawn = selected;
    };
    const requestDraw = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const load = (index: number) => {
      if (index < 0 || index > LAST || cache.has(index) || loading.has(index)) return;
      loading.add(index);
      const image = new Image();
      image.src = src(index);
      image.decode().then(() => {
        if (disposed) return;
        cache.set(index, image);
        while (cache.size > cap) {
          const oldest = cache.keys().next().value;
          if (oldest === undefined) break;
          cache.delete(oldest);
        }
        requestDraw();
      }).catch(() => {
        // Keep the closest decoded frame visible if this request fails.
      }).finally(() => loading.delete(index));
    };
    const around = (index: number) => {
      load(index);
      for (let distance = 1; distance <= 3; distance++) {
        load(index + distance);
        load(index - distance);
      }
    };
    drawRequested.current = requestDraw;
    loadAround.current = around;
    around(desired.current);
    const resize = new ResizeObserver(() => { lastDrawn = -1; requestDraw(); });
    resize.observe(canvas);
    let prefetchIndex = 0;
    const prefetch = () => {
      if (disposed || prefetchIndex > LAST) return;
      if (!cache.has(prefetchIndex) && !loading.has(prefetchIndex)) {
        const image = new Image();
        image.src = src(prefetchIndex);
      }
      prefetchIndex++;
      prefetchTimer = setTimeout(prefetch, 120);
    };
    prefetchTimer = setTimeout(prefetch, 500);
    return () => {
      disposed = true;
      clearTimeout(prefetchTimer);
      cancelAnimationFrame(raf);
      resize.disconnect();
      drawRequested.current = null;
      loadAround.current = null;
      cache.clear();
    };
  }, [reduced]);

  return <section className={reduced ? "story reduced" : "story"} ref={storyRef} id="top" aria-label="Eastern Chamber architectural reveal">
    <div className="story-sticky">
      <div className="story-stage">
        {reduced ? <picture className="still-frame"><img src={src(0)} alt="Eastern Chamber glimpsed through a mangrove forest" /></picture> : <canvas ref={canvasRef} aria-label="Scroll controlled sequence revealing Eastern Chamber through a mangrove forest" role="img" />}
        <div className="story-vignette" aria-hidden="true" />
      </div>
      <div className="story-caption">
        {(reduced || activeCopy === "intro") && (
          <motion.div className="opening-copy" style={reduced ? undefined : { opacity: introOpacity }}>
            <h1>A WORLD-CLASS<br /><em>EPICENTRE UNFOLDS</em></h1>
          </motion.div>
        )}
        {(reduced || activeCopy === "intro") && (
          <motion.div
            className="story-scroll-wrap"
            style={reduced ? undefined : { opacity: introOpacity, pointerEvents: scrollCuePointerEvents }}
          >
            <div
              onClick={handleScrollToExperience}
              className="story-scroll-cue"
              role="button"
              tabIndex={0}
              aria-label="Scroll to explore"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleScrollToExperience();
                }
              }}
            >
              <div className="scroll-cue-mouse" aria-hidden="true">
                <div className="scroll-cue-dot" />
              </div>
              <span className="scroll-cue-text">SCROLL</span>
              <svg className="scroll-cue-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
        )}
        {!reduced && activeCopy === "reveal" && (
          <motion.div className="reveal-copy" style={{ opacity: revealOpacity }}>
            <h2>AT Vikhroli</h2>
          </motion.div>
        )}
        {reduced && (
          <button className="enable-animation" type="button" onClick={() => setMotionOverride(true)}>
            Enable scroll animation <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
    </div>
  </section>;
}






