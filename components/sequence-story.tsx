"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

const LAST = 239;
const src = (index: number) => `/sequence/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

export function SequenceStory() {
  const storyRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desired = useRef(0);
  const drawRequested = useRef<(() => void) | null>(null);
  const loadAround = useRef<((index: number) => void) | null>(null);
  const [reduced, setReduced] = useState(false);
  const [activeCopy, setActiveCopy] = useState("intro");
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const frame = useTransform(scrollYProgress, [0, 0.86], [0, LAST], { clamp: true });
  const introOpacity = useTransform(scrollYProgress, [0, 0.09], [1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.85, 0.93], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActiveCopy(progress < 0.12 ? "intro" : progress >= 0.85 ? "reveal" : "none");
  });

  useEffect(() => {
    const progress = scrollYProgress.get();
    setActiveCopy(progress < 0.12 ? "intro" : progress >= 0.85 ? "reveal" : "none");
  }, [scrollYProgress]);
  useMotionValueEvent(frame, "change", (value) => {
    desired.current = Math.max(0, Math.min(LAST, Math.round(value)));
    loadAround.current?.(desired.current);
    drawRequested.current?.();
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
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
    const layer = document.createElement("canvas");
    const layerCtx = layer.getContext("2d")!;
    const backdrop = document.createElement("canvas");
    const backdropCtx = backdrop.getContext("2d")!;
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
      // The supplied sequence has side-fill bands until the full-width reveal.
      const edge = selected < 175 ? 100 : Math.max(0, 100 * (1 - (selected - 175) / 15));
      const sw = image.naturalWidth - edge * 2;
      const sh = image.naturalHeight;
      if (width < 700) {
        backdrop.width = 32;
        backdrop.height = 21;
        backdropCtx.drawImage(image, edge, 0, sw, sh, 0, 0, backdrop.width, backdrop.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(backdrop, 0, 0, backdrop.width, backdrop.height, 0, 0, width, height);
        const shade = ctx.createLinearGradient(0, 0, 0, height);
        shade.addColorStop(0, "rgba(17, 31, 24, .18)");
        shade.addColorStop(1, "rgba(17, 31, 24, .56)");
        ctx.fillStyle = shade;
        ctx.fillRect(0, 0, width, height);
        const cropWidth = Math.min(900, sw);
        const cropX = (image.naturalWidth - cropWidth) / 2;
        const bandHeight = width * sh / cropWidth;
        layer.width = pixelWidth;
        layer.height = Math.round(bandHeight * dpr);
        layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        layerCtx.drawImage(image, cropX, 0, cropWidth, sh, 0, 0, width, bandHeight);
        layerCtx.globalCompositeOperation = "destination-in";
        const fade = layerCtx.createLinearGradient(0, 0, 0, bandHeight);
        fade.addColorStop(0, "transparent");
        fade.addColorStop(.16, "black");
        fade.addColorStop(.84, "black");
        fade.addColorStop(1, "transparent");
        layerCtx.fillStyle = fade;
        layerCtx.fillRect(0, 0, width, bandHeight);
        layerCtx.globalCompositeOperation = "source-over";
        ctx.drawImage(layer, 0, (height - bandHeight) * .42, width, bandHeight);
      } else {
        const scale = Math.max(width / sw, height / sh);
        const dw = sw * scale;
        const dh = sh * scale;
        ctx.drawImage(image, edge, 0, sw, sh, (width - dw) / 2, (height - dh) / 2, dw, dh);
      }
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
    desired.current = Math.round(frame.get());
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
  }, [frame, reduced]);

  return <section className={reduced ? "story reduced" : "story"} ref={storyRef} id="top" aria-label="Eastern Chamber architectural reveal">
    <div className="story-sticky">
      {reduced ? <picture className="still-frame"><img src={src(0)} alt="Eastern Chamber glimpsed through a mangrove forest" /></picture> : <canvas ref={canvasRef} aria-label="Scroll controlled sequence revealing Eastern Chamber through a mangrove forest" role="img" />}
      <div className="story-vignette" aria-hidden="true" />
      {(reduced || activeCopy === "intro") && <motion.div className="opening-copy" style={reduced ? undefined : { opacity: introOpacity }}>
        <p className="eyebrow light">AN ARCHITECTURAL JOURNEY <span>—</span> EASTERN CHAMBER</p>
        <h1>Where nature<br /><em>meets distinction.</em></h1>
        <p className="opening-description">An architectural expression of ambition, elegance, and timeless design.</p>
      </motion.div>}
      {!reduced && activeCopy === "reveal" && <motion.div className="reveal-copy" style={{ opacity: revealOpacity }}><p className="eyebrow light">THE REVEAL</p><h2>An address<br /><em>beyond the ordinary.</em></h2></motion.div>}
    </div>
  </section>;
}






