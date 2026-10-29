"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { openEnquiryModal } from "@/components/enquiry-modal";
import elevatedWorkspace from "@/assets/amenities/13_Elevated Workspace.jpg";
import urbanCourt from "@/assets/amenities/14_Urban Court.jpg";
import twilightTerrace from "@/assets/amenities/15_Twilight Terrace.jpg";
import sitoutGarden from "@/assets/amenities/16_Sitout Garden.jpg";

interface AmenitySlide {
  id: string;
  pill: string;
  level: string;
  title: string;
  benefit: string;
  image: string | StaticImageData;
  alt: string;
}

const AMENITY_SLIDES: AmenitySlide[] = [
  {
    id: "green-reserve",
    pill: "01 / Green Reserve",
    level: "LANDSCAPED RESERVE",
    title: "Green Reserve",
    benefit: "A quiet place to pause outdoors.",
    image: "/pillars/pillar-03.webp",
    alt: "Dedicated green reserve and biophilic landscape",
  },
  {
    id: "elevated-workspace",
    pill: "02 / Elevated Workspace",
    level: "ROOFTOP AMENITIES",
    title: "Elevated Workspace",
    benefit: "Work and downtime above the city.",
    image: elevatedWorkspace,
    alt: "Aerial view of rooftop work, garden and recreation spaces",
  },
  {
    id: "urban-court",
    pill: "03 / Urban Court",
    level: "OUTDOOR RECREATION",
    title: "Urban Court",
    benefit: "A court for a quick reset.",
    image: urbanCourt,
    alt: "Outdoor racket court surrounded by rooftop planting",
  },
  {
    id: "twilight-terrace",
    pill: "04 / Twilight Terrace",
    level: "OPEN-AIR TERRACE",
    title: "Twilight Terrace",
    benefit: "Meet and unwind in the open air.",
    image: twilightTerrace,
    alt: "Covered terrace with seating and a green lawn at dusk",
  },
  {
    id: "sitout-garden",
    pill: "05 / Sitout Garden",
    level: "GARDEN SITOUT",
    title: "Sitout Garden",
    benefit: "A green space to connect and recharge.",
    image: sitoutGarden,
    alt: "Landscaped garden with seating beside the building",
  },
];

export function AmenityMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openOriginRef = useRef<DOMRect | null>(null);
  const openingAnimationRef = useRef<Animation | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<AmenitySlide | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const wasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedSlide && !dialog.open) {
      openingAnimationRef.current?.cancel();
      dialog.showModal();
      const origin = openOriginRef.current;
      if (origin && typeof dialog.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const destination = dialog.getBoundingClientRect();
        const dx = origin.left + origin.width / 2 - destination.left - destination.width / 2;
        const dy = origin.top + origin.height / 2 - destination.top - destination.height / 2;
        const scale = Math.max(0.35, Math.min(0.8, origin.width / destination.width));
        const animation = dialog.animate([
          { opacity: 0.3, transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`, filter: "blur(8px)" },
          { opacity: 1, transform: "translate(-50%, -50%) scale(1)", filter: "blur(0px)" },
        ], { duration: 700, easing: "cubic-bezier(.16, 1, .3, 1)", fill: "both" });
        openingAnimationRef.current = animation;
        animation.onfinish = () => {
          animation.cancel();
          if (openingAnimationRef.current === animation) openingAnimationRef.current = null;
        };
      }
    }
    if (!selectedSlide && dialog.open) dialog.close();
  }, [selectedSlide]);

  // Auto-pan marquee smoothly
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    let animId: number;
    let lastFrame = 0;
    const speed = 65; // pixels per second
    const cards = el.querySelectorAll<HTMLElement>(".amenity-slide-card");

    const step = (time: number) => {
      if (lastFrame && !isDragging.current) {
        el.scrollLeft += Math.min(time - lastFrame, 50) * speed / 1000;
        const loopPoint = cards.length > AMENITY_SLIDES.length
          ? cards[AMENITY_SLIDES.length].offsetLeft - cards[0].offsetLeft
          : 0;
        if (loopPoint && el.scrollLeft >= loopPoint) el.scrollLeft -= loopPoint;
      }
      lastFrame = time;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Track active slide based on scroll
  const handleScroll = useCallback(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(".amenity-slide-card");
    const cardStep = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    const index = Math.round(el.scrollLeft / cardStep) % AMENITY_SLIDES.length;
    setActiveIndex(index);
  }, []);

  const scrollByAmount = (direction: -1 | 1) => {
    const el = marqueeRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>(".amenity-slide-card");
    const cardStep = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 390;
    const scrollAmount = cardStep * direction;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Drag to scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    const el = marqueeRef.current;
    if (!el) return;
    isDragging.current = true;
    wasDragged.current = false;
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
    if (Math.abs(walk) > 6) wasDragged.current = true;
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
          <p className="eyebrow">THE EASTERN CHAMBERS</p>
          <h2 id="amenities-marquee-title" className="amenity-editorial-title">AMENITIES.</h2>
          <p className="amenity-editorial-copy">Pause. Play. Connect.</p>

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
              <span className="amenity-pause-note font-mono">AUTO-FLOW</span>
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
          onMouseLeave={() => { isDragging.current = false; }}
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
                <button
                  type="button"
                  className="amenity-card-visual"
                  aria-label={`Enlarge ${slide.title} image`}
                  onClick={(event) => {
                    if (wasDragged.current) {
                      wasDragged.current = false;
                      return;
                    }
                    openOriginRef.current = event.currentTarget.getBoundingClientRect();
                    setSelectedSlide(slide);
                  }}
                >
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
                </button>

                <div className="amenity-card-content">
                  <h3 className="amenity-card-title">{slide.title}</h3>
                  <p className="amenity-card-benefit">{slide.benefit}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="amenity-lightbox"
        aria-label={selectedSlide ? `${selectedSlide.title} enlarged image` : "Enlarged amenity image"}
        onClose={() => setSelectedSlide(null)}
        onClick={() => dialogRef.current?.close()}
      >
        {selectedSlide && (
          <div className="amenity-lightbox-content">
            <button type="button" className="amenity-lightbox-close" aria-label="Close enlarged image" onClick={() => dialogRef.current?.close()}>×</button>
            <div className="amenity-lightbox-image">
              <Image
                src={selectedSlide.image}
                alt={selectedSlide.alt}
                width={typeof selectedSlide.image === "string" ? 2560 : selectedSlide.image.width}
                height={typeof selectedSlide.image === "string" ? 852 : selectedSlide.image.height}
                sizes="(max-width: 768px) 94vw, 90vw"
                placeholder={typeof selectedSlide.image === "string" ? "empty" : "blur"}
              />
            </div>
            <p>{selectedSlide.title}</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
