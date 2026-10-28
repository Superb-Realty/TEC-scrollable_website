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
    id: "sky-lounge",
    pill: "01 / Sky Lounge & Terrace",
    level: "LEVEL 36 • ROOFTOP",
    title: "Panoramic Skyline Breakouts",
    benefit: "Open-air rooftop terrace with expansive mangrove horizons for executive downtime and informal deals.",
    image: "/pillars/Pillar_04.png",
    alt: "Landscaped rooftop amenity deck with loungers and sweeping city views",
  },
  {
    id: "biophilic-deck",
    pill: "02 / Biophilic Green Reserve",
    level: "PODIUM DECK • 10,000 SQ. FT.",
    title: "Oxygen-Rich Workstations",
    benefit: "10,000 sq. ft. dedicated landscaped park with outdoor power ports and high-speed campus Wi-Fi.",
    image: "/pillars/pillar-03.webp",
    alt: "Lush landscaped terrace deck with contemporary timber seating and greenery",
  },
  {
    id: "triple-view",
    pill: "03 / Triple-Side Glass Façade",
    level: "FLOORS 1–35 • FULL PERIMETER",
    title: "Natural Daylight on Every Side",
    benefit: "Acoustically insulated double-glazed curtain wall with unobstructed city, mountain, and mangrove vistas.",
    image: "/sequence/frame-192.webp",
    alt: "The Eastern Chambers glass facade rising majestically above the green reserve",
  },
  {
    id: "arrival-lobby",
    pill: "04 / Grand Arrival Atrium",
    level: "GROUND LEVEL • 8.5M ATRIUM",
    title: "Hospitality-Led First Impression",
    benefit: "Double-height lobby with concierge check-in, biometric speed-gates, and an artisanal espresso bar.",
    image: "/pillars/pillar-01.webp",
    alt: "Grand architectural entrance and arrival lobby at dusk",
  },
  {
    id: "aqi-wellness",
    pill: "05 / Pure Air & Executive Health",
    level: "TOWER-WIDE • IBMS CONTROLLED",
    title: "Smart Indoor Environmental Quality",
    benefit: "Centralized MERV-13 air filtration with real-time AQI monitoring to keep workforce energy peak all day.",
    image: "/urban_elegance.webp",
    alt: "Architectural dusk perspective representing intelligent building performance",
  },
  {
    id: "retail-dining",
    pill: "06 / High-Street Retail & Dining",
    level: "GROUND & MEZZANINE • G+1",
    title: "Curated Culinary Promenade",
    benefit: "On-site gourmet dining, grab-and-go health delis, and executive business lunch venues at your doorstep.",
    image: "/pillars/pillar-02.webp",
    alt: "Retail and commercial base integrated with pedestrian plazas",
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
      className="amenity-marquee-section blend-in blend-sm blend-out blend-out-sm"
      id="amenities"
      aria-labelledby="amenities-marquee-title"
    >
      <div className="amenity-layout">
        {/* Sticky Editorial Left Column */}
        <div className="amenity-editorial-sticky">
          <p className="eyebrow">03.2 / AMENITIES &amp; LIFESTYLE MATRIX</p>
          <h2 id="amenities-marquee-title" className="amenity-editorial-title">
            Where a walk through nature isn’t a weekend getaway—<br />
            <em>it’s your lunch break.</em>
          </h2>
          <p className="amenity-editorial-copy">
            Static office parks belong to the past. The Eastern Chambers is built for the
            modern enterprise where executive recovery, biophilic serenity, and high-impact
            work seamlessly intersect.
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
              Schedule Private Campus Walkthrough <span aria-hidden="true">→</span>
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
