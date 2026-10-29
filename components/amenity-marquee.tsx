"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { openEnquiryModal } from "@/components/enquiry-modal";

interface AmenitySlide {
  id: string;
  pill: string;
  level: string;
  title: string;
  benefit: string;
  image: string;
  alt: string;
}

const AMENITY_SLIDES: AmenitySlide[] = [
  {
    id: "green-reserve",
    pill: "01 / Green Reserve",
    level: "10,000 SQ. FT. DEDICATED",
    title: "10,000 Sq.Ft. Dedicated Green Reserve",
    benefit: "Natural light, greenery, cleaner air and biophilic landscape for greater comfort and balance.",
    image: "/pillars/pillar-03.webp",
    alt: "Dedicated green reserve and biophilic landscape",
  },
  {
    id: "rooftop-amenities",
    pill: "02 / Rooftop Amenities",
    level: "ROOFTOP BREAKOUT ZONES",
    title: "Landscaped Rooftop with Breakout Zones",
    benefit: "Triple-side views across mangroves, mountains and city with spaces to pause, connect and recharge.",
    image: "/pillars/Pillar_04.png",
    alt: "Landscaped rooftop with breakout zones",
  },
  {
    id: "arrival-lobby",
    pill: "03 / Hospitality Lobby",
    level: "GROUND + 1ST FLOOR",
    title: "Hospitality-Grade Double-Height Arrival Lobby with Café",
    benefit: "Biophilic arrival experience with ground + 1st floor high-street retail at the base.",
    image: "/pillars/pillar-01.webp",
    alt: "Hospitality-grade double-height arrival lobby with café",
  },
  {
    id: "triple-view",
    pill: "04 / Triple-Side Views",
    level: "NATURAL DAYLIGHT",
    title: "Triple-Side Views - Mangroves, Mountains and City",
    benefit: "Contemporary façade comprising of stone, metal & glass with natural daylight on every side.",
    image: "/sequence/frame-192.webp",
    alt: "Triple-side views across mangroves, mountains and city",
  },
  {
    id: "aqi-wellness",
    pill: "05 / AQI Infrastructure",
    level: "COMMON AREAS",
    title: "AQI Infrastructure in Common Areas",
    benefit: "Cleaner air and spaces to pause, connect and recharge bring greater comfort and balance to the working day.",
    image: "/urban_elegance.webp",
    alt: "AQI infrastructure in common areas",
  },
  {
    id: "retail-dining",
    pill: "06 / High-Street Retail",
    level: "GROUND + 1ST FLOOR",
    title: "Retail and Dining at the Base",
    benefit: "Reserved indoor amenity space and 100% parking provision across five levels.",
    image: "/pillars/pillar-02.webp",
    alt: "Retail and dining at the base",
  },
];

export function AmenityMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Auto-pan marquee smoothly
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el || isPaused) return;

    let animId: number;
    const speed = 0.65; // pixels per frame

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // Infinite loop wrap-around logic
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 4) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  // Track active slide based on scroll
  const handleScroll = useCallback(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const cardWidth = 380;
    const index = Math.round(el.scrollLeft / cardWidth) % AMENITY_SLIDES.length;
    setActiveIndex(index);
  }, []);

  const scrollByAmount = (direction: -1 | 1) => {
    const el = marqueeRef.current;
    if (!el) return;
    const scrollAmount = 390 * direction;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Drag to scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    const el = marqueeRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = marqueeRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section
      className="amenity-marquee-section"
      id="amenities"
      aria-labelledby="amenities-marquee-title"
    >
      <div className="amenity-layout">
        {/* Sticky Editorial Left Column */}
        <div className="amenity-editorial-sticky">
          <p className="eyebrow">WELLNESS ENABLING NEXT-GEN OFFICE CULTURE</p>
          <h2 id="amenities-marquee-title" className="amenity-editorial-title">
            WELLNESS ENABLING<br />
            <em>NEXT-GEN OFFICE CULTURE.</em>
          </h2>
          <p className="amenity-editorial-copy">
            Natural light, greenery, cleaner air and spaces to pause, connect and recharge bring greater comfort and balance to the working day.
          </p>

          <div className="amenity-nav-controls">
            <div className="amenity-arrows">
              <button
                type="button"
                className="amenity-arrow-btn"
                onClick={() => scrollByAmount(-1)}
                aria-label="Previous amenity slide"
              >
                ←
              </button>
              <button
                type="button"
                className="amenity-arrow-btn"
                onClick={() => scrollByAmount(1)}
                aria-label="Next amenity slide"
              >
                →
              </button>
            </div>

            <div className="amenity-status-pill font-mono">
              <span className="amenity-live-dot" aria-hidden="true" />
              <span>
                {String(activeIndex + 1).padStart(2, "0")} / {String(AMENITY_SLIDES.length).padStart(2, "0")}
              </span>
              <span className="amenity-pause-note font-mono">
                {isPaused ? "PAUSED" : "AUTO-FLOW"}
              </span>
            </div>
          </div>

          <div className="amenity-cta-wrap">
            <button
              type="button"
              className="btn-amenity-schedule"
              onClick={() => openEnquiryModal()}
            >
              Begin a conversation <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Smooth Scrolling Draggable Visual Marquee */}
        <div
          className="amenity-marquee-viewport"
          ref={marqueeRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            isDragging.current = false;
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onScroll={handleScroll}
          role="region"
          aria-label="Amenity visual marquee"
          tabIndex={0}
        >
          <div className="amenity-marquee-track">
            {/* Render slides duplicated once to allow seamless loop feeling */}
            {[...AMENITY_SLIDES, ...AMENITY_SLIDES].map((slide, idx) => (
              <article
                key={`${slide.id}-${idx}`}
                className="amenity-slide-card"
                aria-label={slide.title}
              >
                <div className="amenity-card-visual">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 768px) 85vw, 420px"
                    className="amenity-card-img"
                    draggable={false}
                  />
                  <div className="amenity-card-overlay" aria-hidden="true" />

                  {/* Glass Pill Badge */}
                  <div className="amenity-glass-pill">
                    <span className="pill-pulse" aria-hidden="true" />
                    <span className="pill-text font-mono">{slide.pill}</span>
                  </div>

                  {/* Level Tag */}
                  <span className="amenity-level-tag font-mono">{slide.level}</span>
                </div>

                <div className="amenity-card-content">
                  <h3 className="amenity-card-title">{slide.title}</h3>
                  <p className="amenity-card-benefit">{slide.benefit}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
