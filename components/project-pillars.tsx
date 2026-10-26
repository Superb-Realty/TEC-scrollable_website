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
        text: "Tenant App for Access, Visitor Management and Building Services",
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
    image: "/sequence/frame-192.webp",
    alt: "The Eastern Chambers facade rising above the mangrove landscape",
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
        text: "Rainwater Harvesting and Recycling",
      },
      {
        text: "On-Site Sewage Treatment Plant",
      },
      {
        text: "Solar Integration",
      },
      {
        text: "Double-Glazed Glass for Thermal and Acoustic Control",
      },
      {
        text: "EV Charging",
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
    image: "/pillars/Pillar_04.png",
    alt: "Pillar 04 - Wellness enabling next-gen office culture with landscaped rooftop amenity deck",
    features: [
      {
        text: "10,000 Sq.Ft. Dedicated Green Reserve",
      },
      {
        text: "Landscaped Rooftop with Breakout Zones",
      },
      {
        text: "Retail and Dining at the Base",
      },
      {
        text: "AQI Infrastructure in Common Areas",
      },
      {
        text: "Reserved Indoor Amenity Space",
      },
    ],
  },
];

/* Line icons for the pillar 01 feature grid (order matches PILLARS[0].features). */
const PILLAR_01_ICONS = [
  // Certification rosette
  <svg key="award" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3.5l2.2 1.6 2.7-.2 1 2.5 2.4 1.3-.4 2.7 1.3 2.4-1.9 2 .1 2.7-2.6.8-1.4 2.3-2.7-.4L16 22.5l-2.2-1.6-2.7.4-1.4-2.3-2.6-.8.1-2.7-1.9-2 1.3-2.4-.4-2.7 2.4-1.3 1-2.5 2.7.2z" /><circle cx="16" cy="12.8" r="5" /><path d="M13.8 12.9l1.6 1.6 3-3.1M11 21l-2.5 7.5 3.5-1.5 2 3 2-7M21 21l2.5 7.5-3.5-1.5-2 3-2-7" /></svg>,
  // IoT signal
  <svg key="iot" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 8.5a10 10 0 0114 0M11.5 11.2a6.4 6.4 0 019 0M9 23.5a10 10 0 0014 0M11.5 20.8a6.4 6.4 0 009 0" /><text x="16" y="18.2" textAnchor="middle" fontSize="6.4" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">IOT</text></svg>,
  // IBMS monitor
  <svg key="ibms" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="9.5" /><path d="M21 21l7 7M14 9.5l4.3 7.6H9.7z" /><path d="M14 12.6v2.2M14 16.2v.1" /></svg>,
  // Tenant app
  <svg key="app" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="3.5" width="12" height="25" rx="2" /><path d="M14.5 6.5h3M15.2 25.2h1.6" /></svg>,
];

/* Line icons for the pillar 03 feature grid (order matches PILLARS[2].features). */
const PILLAR_03_ICONS = [
  // LEED Gold rosette
  <svg key="leed" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3.5l2.2 1.6 2.7-.2 1 2.5 2.4 1.3-.4 2.7 1.3 2.4-1.9 2 .1 2.7-2.6.8-1.4 2.3-2.7-.4L16 22.5l-2.2-1.6-2.7.4-1.4-2.3-2.6-.8.1-2.7-1.9-2 1.3-2.4-.4-2.7 2.4-1.3 1-2.5 2.7.2z" /><circle cx="16" cy="12.8" r="5" /><path d="M13.8 12.9l1.6 1.6 3-3.1M11 21l-2.5 7.5 3.5-1.5 2 3 2-7M21 21l2.5 7.5-3.5-1.5-2 3-2-7" /></svg>,
  // Rainwater harvesting & recycling
  <svg key="rainwater" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 11.5a3.8 3.8 0 0 1 7.2-1.4 3.2 3.2 0 0 1 4.5 3.2c0 .2 0 .4-.1.6A2.8 2.8 0 0 1 23 18H9a3.2 3.2 0 0 1-.5-6.3 3.6 3.6 0 0 1 1.5-.2z" /><path d="M12 19.5v2M16 19.5v2.5M20 19.5v2" /><path d="M8 24.5c2.5 2 5.5 2.8 8 2.8s5.5-.8 8-2.8M6.5 22.5c2 2.5 5.5 4.5 9.5 4.5s7.5-2 9.5-4.5" /></svg>,
  // On-site sewage treatment plant
  <svg key="sewage" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 11h5a3 3 0 0 1 3 3v7h4" /><path d="M6 8v6M14 17h6a2 2 0 0 1 2 2v4" /><path d="M22 25a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /><path d="M5 27h20" /><path d="M9 24v3M15 24v3" /></svg>,
  // Solar integration
  <svg key="solar" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="5" /><path d="M16 4v3.5M16 24.5V28M4 16h3.5M24.5 16H28M7.5 7.5l2.5 2.5M22 22l2.5 2.5M7.5 24.5l2.5-2.5M22 10l2.5-2.5" /></svg>,
  // Double-glazed glass
  <svg key="glass" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 6.5l8-2.5v21l-8 2.5z" /><path d="M15 6.5l8-2.5v21l-8 2.5" /><path d="M11 11v12M19 11v12" strokeDasharray="2 2" /></svg>,
  // EV charging
  <svg key="ev" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="15" cy="16" r="9.5" /><text x="15" y="19" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">EV</text><path d="M24.5 16a9.5 9.5 0 0 1-5 8.5h-3" /><path d="M24 13h2v6h-2M26 14.5h2M26 17.5h2" /></svg>,
];

/* Line icons for the pillar 04 feature grid (order matches PILLARS[3].features). */
const PILLAR_04_ICONS = [
  // 10,000 Sq.Ft. Dedicated Green Reserve (Tree canopy cluster)
  <svg key="green" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="11" r="5" /><path d="M16 16v9M13.5 21l2.5-2.5 2.5 2.5" /><circle cx="10" cy="15" r="3.5" /><path d="M10 18.5v6.5M8.5 22.5l1.5-1.5 1.5 1.5" /><circle cx="22" cy="15" r="3.5" /><path d="M22 18.5v6.5M20.5 22.5l1.5-1.5 1.5 1.5" /><path d="M6 25h20" /></svg>,
  // Landscaped Rooftop with Breakout Zones (Beach umbrella & lounge deck chair)
  <svg key="rooftop" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 10a7 7 0 0 1 12 0H9z" /><path d="M15 10v13" /><path d="M11 20l7-2.5 5 5.5" /><path d="M11 23h12" /><circle cx="23" cy="8" r="2.2" /><path d="M23 4.5v1M26.5 8h-1M25.5 5.5l-.7.7M25.5 10.5l-.7-.7" /></svg>,
  // Retail and Dining at the Base (Shopping trolley / cart)
  <svg key="retail" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="25" r="2" /><circle cx="22" cy="25" r="2" /><path d="M6 8h4l2.5 12h11.5l2.5-8.5H10.5" /><path d="M14 12v6M18 12v6M22 12v6" /></svg>,
  // AQI Infrastructure in Common Areas (Air quality breeze / wind lines)
  <svg key="aqi" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13h15a3.5 3.5 0 1 0-3.5-3.5" /><path d="M8 18h16a3 3 0 1 1-3 3" /><path d="M6 23h9a2.5 2.5 0 1 0-2.5-2.5" /></svg>,
  // Reserved Indoor Amenity Space (Indoor lounge furniture / table & plant)
  <svg key="amenity" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="14" width="18" height="6" rx="2" /><path d="M5 16h2v6H5zM25 16h2v6h-2z" /><path d="M9 20v4M23 20v4" /><rect x="11" y="22" width="10" height="2" rx="1" /><path d="M13 14V11a3 3 0 0 1 6 0v3" /></svg>,
];

function PillarFeature({
  pillar,
  icons,
  panelClass = "pf-panel-sand",
}: {
  pillar: PillarData;
  icons: React.ReactNode[];
  panelClass?: string;
}) {
  const [label, num] = pillar.number.split(" ");
  const rowCountClass = pillar.features.length > 4 ? "is-6" : "is-4";
  return (
    <article className="pillar-feature" id={pillar.id}>
      <div className={`pf-panel ${panelClass}`} aria-hidden="true" />
      <div className="pf-head">
        <p className="pf-eyebrow"><span>{label}</span><span className="pf-eyebrow-num">{num}</span><span className="pf-eyebrow-rule" /></p>
        <h3 className="pf-title"><strong>{pillar.leadWord}</strong> {pillar.titleRest}</h3>
        <p className="pf-desc">{pillar.description}</p>
      </div>
      <figure className="pf-media">
        <Image src={pillar.image} alt={pillar.alt} fill sizes="(max-width: 900px) 100vw, 92vw" className="pf-media-img" />
        <figcaption>{pillar.id === "pillar-04" ? "Artistic impression" : "Representative image"}</figcaption>
      </figure>
      <div className="pf-features-wrap">
        <ul className={`pf-features ${rowCountClass}`}>
          {pillar.features.map((feature, i) => (
            <li key={feature.text}>
              <span className="pf-icon" aria-hidden="true">{icons[i]}</span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
        {pillar.footnote && <p className="pf-footnote">{pillar.footnote}</p>}
      </div>
    </article>
  );
}

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

    section.querySelectorAll(".slide-panoramic-viewport, .pf-media").forEach((image) => observer.observe(image));
    section.classList.add("reveal-ready");
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pillars-experience" ref={sectionRef} id="pillars" aria-labelledby="pillars-title">
      <div className="pillars-heading">
        <p className="eyebrow">03.1 / THE FOUR PILLARS</p>
        <h2 id="pillars-title">Every detail.<br /><em>A greater purpose.</em></h2>
        <p className="pillars-intro">Four connected ideas. One considered workplace. Discover the thinking that gives The Eastern Chambers its character.</p>
        <nav className="pillar-index" aria-label="Explore the four pillars">{PILLARS.map((pillar, idx) => <a href={`#${pillar.id}`} key={pillar.id}><span>0{idx + 1}</span>{pillar.tabLabel}<span aria-hidden="true">↗</span></a>)}</nav>
      </div>
      <div className="pillars-chapters">
        {PILLARS.map((pillar, idx) => {
          if (idx === 0) {
            return <PillarFeature pillar={pillar} key={pillar.id} icons={PILLAR_01_ICONS} panelClass="pf-panel-sand" />;
          }
          if (idx === 2) {
            return <PillarFeature pillar={pillar} key={pillar.id} icons={PILLAR_03_ICONS} panelClass="pf-panel-leather" />;
          }
          if (idx === 3) {
            return <PillarFeature pillar={pillar} key={pillar.id} icons={PILLAR_04_ICONS} panelClass="pf-panel-plaster" />;
          }
          return (
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
                sizes={idx === 2 ? "(max-width: 600px) 300vw, 90vw" : "(max-width: 600px) 300vw, 150vw"}
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
          );
        })}
      </div>
    </section>
  );
}
