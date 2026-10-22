"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export interface PillarData {
  id: string;
  number: string;
  tabLabel: string;
  leadWord: string;
  titleRest: string;
  description: string;
  image: string;
  alt: string;
  footnote?: string;
  features: {
    text: string;
  }[];
}

export const PILLARS: PillarData[] = [
  {
    id: "pillar-01",
    number: "PILLAR 01",
    tabLabel: "Intelligence",
    leadWord: "Intelligence",
    titleRest: "behind tomorrow’s workplace.",
    description:
      "At The Eastern Chambers, technology is seamlessly integrated into the building, making everyday operations more connected, responsive and effortless.",
    image: "/pillars/pillar-01.webp",
    alt: "Artistic impression of the building entrance and city skyline at sunset",
    footnote: "*Pre-Certification Aligned",
    features: [
      {
        text: "SmartScore Gold & WiredScore Gold*",
      },
      {
        text: "IoT-Enabled Tenant Experience",
      },
      {
        text: "IBMS Powered by Enlite",
      },
      {
        text: "Tenant App for Access, Visitor Management & Services",
      },
    ],
  },
  {
    id: "pillar-02",
    number: "PILLAR 02",
    tabLabel: "Architecture",
    leadWord: "Designed",
    titleRest: "for the future of work.",
    description:
      "Every design decision is rooted in the realities of contemporary business, balancing functionality, flexibility and architectural distinction to create a workplace that works intuitively.",
    image: "/pillars/pillar-02.webp",
    alt: "Pillar 02 - Designed for the future of work featuring double-height grand lobby and facade",
    features: [
      {
        text: "Stone, Metal and Glass Façade",
      },
      {
        text: "Triple-Side Views (Mangroves, Mountains & City)",
      },
      {
        text: "Biophilic Landscape",
      },
      {
        text: "Double-Height Arrival Lobby with Café",
      },
      {
        text: "Column-Free Floor Plates",
      },
      {
        text: "Eight High-Speed Elevators",
      },
      {
        text: "Natural Daylight on Every Side",
      },
    ],
  },
  {
    id: "pillar-03",
    number: "PILLAR 03",
    tabLabel: "Sustainability",
    leadWord: "Sustainability",
    titleRest: "redefining future-ready workspaces.",
    description:
      "Resource-efficient systems and sustainable design come together to create a workplace that performs efficiently and is built for the future.",
    image: "/pillars/pillar-03.webp",
    alt: "Pillar 03 - Sustainability redefining future-ready workspaces with lush outdoor breakout deck",
    footnote: "*Pre-Certification Aligned",
    features: [
      {
        text: "LEED Gold*",
      },
      {
        text: "Solar Integration",
      },
      {
        text: "Rainwater Harvesting & Recycling",
      },
      {
        text: "On-Site Sewage Treatment Plant",
      },
      {
        text: "Double-Glazed Thermal & Acoustic Glass",
      },
      {
        text: "EV Charging Infrastructure",
      },
    ],
  },
  {
    id: "pillar-04",
    number: "PILLAR 04",
    tabLabel: "Wellness",
    leadWord: "Wellness",
    titleRest: "enabling next-gen office culture.",
    description:
      "Natural light, greenery, cleaner air and spaces to pause, connect and recharge bring greater comfort and balance to the working day.",
    image: "/pillars/pillar-04.webp",
    alt: "Artistic impression of the building entrance and landscaped terrace at sunset",
    features: [
      {
        text: "10,000 Sq.Ft. Dedicated Green Reserve",
      },
      {
        text: "AQI Infrastructure in Common Areas",
      },
      {
        text: "Landscaped Rooftop with Breakout Zones",
      },
      {
        text: "Reserved Indoor Amenity Space",
      },
      {
        text: "Retail and Dining at the Base",
      },
    ],
  },
];

export function ProjectPillars() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    section.querySelectorAll(".slide-panoramic-viewport").forEach((image) => observer.observe(image));
    section.classList.add("reveal-ready");
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pillars-experience" ref={sectionRef} id="pillars" aria-labelledby="pillars-title">
      <div className="pillars-heading">
        <p className="eyebrow">03.1 / THE FOUR PILLARS</p>
        <h2 id="pillars-title">Four pillars.</h2>
      </div>
      <div className="pillars-chapters">
        {PILLARS.map((pillar, idx) => (
          <article className="pillar-editorial-slide" key={pillar.id} id={pillar.id}>
            <div className="slide-content">
              <div className="slide-eyebrow-line">
                <span className="slide-num">0{idx + 1} / 04</span>
                <span>{pillar.tabLabel}</span>
              </div>
              <h3 className="slide-title">{pillar.leadWord} {pillar.titleRest}</h3>
            </div>
            <div className="slide-panoramic-viewport">
              <Image
                src={pillar.image}
                alt={pillar.alt}
                fill
                sizes="(max-width: 900px) 100vw, 84vw"
                className="slide-panoramic-img"
              />
              <span className="slide-caption-overlay">Artist&apos;s impression</span>
            </div>
            <div className="slide-details">
              <p className="slide-lead-p">{pillar.description}</p>
              <div>
                <p className="slide-details-label">In practice</p>
                <ul className="slide-specs-list">
                  {pillar.features.map((feature) => <li key={feature.text}>{feature.text}</li>)}
                </ul>
                {pillar.footnote && <p className="spec-footnote">{pillar.footnote}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
