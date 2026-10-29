"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 240;
const frameSrc = (index: number) => `/section-4/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

export function BuildingBreakdown() {
  const sequenceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const desiredFrame = useRef(0);
  const loadNear = useRef<((index: number) => void) | null>(null);
  const requestDraw = useRef<(() => void) | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const sequence = sequenceRef.current;
    if (!sequence) return;
    let raf = 0;
    let near = false;

    const update = () => {
      raf = 0;
      const travel = sequence.offsetHeight - window.innerHeight;
      const progress = travel > 0
        ? Math.max(0, Math.min(1, -sequence.getBoundingClientRect().top / travel))
        : 0;
      const frame = Math.round(progress * (FRAME_COUNT - 1));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      if (frame !== desiredFrame.current) {
        desiredFrame.current = frame;
        if (near) loadNear.current?.(frame);
        requestDraw.current?.();
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) {
        update();
        loadNear.current?.(desiredFrame.current);
      }
    }, { rootMargin: "100% 0px" });
    observer.observe(sequence);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;
    const cache = new Map<number, HTMLImageElement>();
    const loading = new Set<number>();
    const cacheLimit = window.matchMedia("(max-width: 700px)").matches ? 28 : 52;
    let lastDrawn = -1;
    let raf = 0;
    let disposed = false;

    const draw = () => {
      raf = 0;
      const target = desiredFrame.current;
      let selected = cache.has(target) ? target : -1;
      if (selected < 0) {
        let distance = Infinity;
        for (const index of cache.keys()) {
          const delta = Math.abs(index - target);
          if (delta < distance) { selected = index; distance = delta; }
        }
      }
      if (selected < 0 || selected === lastDrawn) return;
      const frame = cache.get(selected)!;
      cache.delete(selected);
      cache.set(selected, frame);
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
      context.fillStyle = "#17251f";
      context.fillRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      // Scale by width; wider viewports crop vertically, while narrower ones retain the full frame.
      const scale = width / frame.naturalWidth;
      const drawWidth = frame.naturalWidth * scale;
      const drawHeight = frame.naturalHeight * scale;
      context.drawImage(frame, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      lastDrawn = selected;
    };
    const queueDraw = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const load = (index: number) => {
      if (index < 0 || index >= FRAME_COUNT || cache.has(index) || loading.has(index)) return;
      loading.add(index);
      const image = new Image();
      image.src = frameSrc(index);
      image.decode().then(() => {
        if (disposed) return;
        cache.set(index, image);
        while (cache.size > cacheLimit) {
          const oldest = cache.keys().next().value;
          if (oldest === undefined) break;
          cache.delete(oldest);
        }
        queueDraw();
      }).catch(() => {
        // Retain the nearest decoded frame until another image is ready.
      }).finally(() => loading.delete(index));
    };
    const around = (index: number) => {
      load(index);
      for (let distance = 1; distance <= 8; distance++) {
        load(index + distance);
        load(index - distance);
      }
    };
    loadNear.current = around;
    requestDraw.current = queueDraw;
    around(desiredFrame.current);
    const resize = new ResizeObserver(() => { lastDrawn = -1; queueDraw(); });
    resize.observe(canvas);
    return () => {
      disposed = true;
      resize.disconnect();
      cancelAnimationFrame(raf);
      loadNear.current = null;
      requestDraw.current = null;
      cache.clear();
    };
  }, [reducedMotion]);

  return <section className="breakdown blend-in blend-out" id="breakdown" aria-label="Building architectural cutaway breakdown">
    <h2 className="sr-only">Building Cutaway Breakdown</h2>
    <div className={reducedMotion ? "breakdown-sequence is-still" : "breakdown-sequence"} ref={sequenceRef}>
      <div className="breakdown-sticky">
        {reducedMotion
          ? <img className="breakdown-still" src={frameSrc(FRAME_COUNT - 1)} alt="The Eastern Chambers cutaway showing 1st - 17th floor commercial workspaces, contemporary facade, boutique offices, podium amenities and parking" />
          : <canvas ref={canvasRef} role="img" aria-label="Scroll controlled architectural cutaway of The Eastern Chambers, showing rooftop amenities, commercial workspaces, boutique offices and podium amenities" />}
        {!reducedMotion && <div className="breakdown-progress" aria-hidden="true"><div ref={progressRef} /></div>}
      </div>
    </div>
  </section>;
}
