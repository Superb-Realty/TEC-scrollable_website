"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export interface PillarData {
  id: string;
  number: string;
  tabLabel: string;
  leadWord: string;
  titleRest: React.ReactNode;
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
    leadWord: "DESIGNED",
    titleRest: (
      <>
        FOR<br />THE FUTURE OF WORK.
      </>
    ),
    description:
      "Every design decision is rooted in the realities of contemporary business, balancing functionality, flexibility and architectural distinction to create a workplace that works intuitively.",
    image: "/pillars/Pillar_02.jpg",
    alt: "Artistic impression of The Eastern Chambers double-height arrival lobby and contemporary facade",
    features: [
      { text: "Triple-Side Views - Mangroves, Mountains and City" },
      { text: "Stone, Metal and Glass Façade" },
      { text: "Biophilic Landscape" },
      { text: "Hospitality-Grade Double-Height Arrival Lobby with Café" },
      { text: "Column-Free Floor Plates" },
      { text: "Eight High-Speed Elevators" },
      { text: "Natural Daylight on Every Side" },
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

/* Line icons for the pillar 02 feature grid (order matches PILLARS[1].features). */
const PILLAR_02_ICONS = [
  // 1. Triple-Side Views - Mangroves, Mountains and City
  <svg key="views" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="6.5" width="23" height="17" rx="2" />
    <path d="M7 9l1 1M25 9l-1 1M7 21l1-1M25 21l-1-1" strokeWidth="1" />
    <circle cx="16" cy="11.5" r="2.2" />
    <path d="M16 7.8v1.2M16 14v1.2M12.3 11.5h1.2M18.5 11.5h1.2M13.4 8.9l.8.8M17.8 13.3l.8.8M13.4 14.1l.8-.8M17.8 9.7l.8-.8" strokeWidth="1" />
    <path d="M5.5 22.5l6-5.5 4 3.5 5.5-5 5.5 5.5" />
  </svg>,
  // 2. Stone, Metal and Glass Façade
  <svg key="facade" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6.5" y="5.5" width="19" height="21" rx="2" />
    <path d="M12.5 5.5l-6 6M18.5 5.5l-12 12M24.5 5.5l-18 18M25.5 10.5l-13 13M25.5 16.5l-7 7" />
    <path d="M4.5 9.5V4.5h5M22.5 27.5h5v-5" />
  </svg>,
  // 3. Biophilic Landscape
  <svg key="landscape" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 25.5h23" />
    <path d="M16 7.5a4.5 5.5 0 0 1 0 11a4.5 5.5 0 0 1 0-11" />
    <path d="M16 18.5v7M16 14.5l2.5-2M16 16.5l-2-1.8" />
    <path d="M9.5 12.5a3.5 4.5 0 0 1 0 9a3.5 4.5 0 0 1 0-9" />
    <path d="M9.5 21.5v4M9.5 17.5l2-1.5" />
    <path d="M22.5 13a3.5 4.5 0 0 1 0 9a3.5 4.5 0 0 1 0-9" />
    <path d="M22.5 22v3.5M22.5 18l-2-1.5" />
    <circle cx="24.5" cy="8" r="1.8" />
  </svg>,
  // 4. Hospitality-Grade Double-Height Arrival Lobby with Café
  <svg key="lobby" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="22" cy="7.5" r="2.2" />
    <path d="M18.5 14a3.5 3.5 0 0 1 7 0" />
    <path d="M22 10.5v3.5" />
    <rect x="6.5" y="9" width="6.5" height="5" rx="1" />
    <path d="M9.8 14v2M7.5 16h4.5" />
    <rect x="5" y="16" width="22" height="9.5" rx="1.5" />
    <rect x="8" y="18.5" width="16" height="4.5" rx="1" />
  </svg>,
  // 5. Column-Free Floor Plates
  <svg key="floorplates" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="4.5" height="4.5" />
    <path d="M5 5l4.5 4.5M9.5 5L5 9.5" strokeWidth="0.8" />
    <rect x="5" y="22.5" width="4.5" height="4.5" />
    <path d="M5 22.5l4.5 4.5M9.5 22.5L5 27" strokeWidth="0.8" />
    <rect x="22.5" y="22.5" width="4.5" height="4.5" />
    <path d="M22.5 22.5l4.5 4.5M27 22.5l-4.5 4.5" strokeWidth="0.8" />
    <path d="M9.5 7h6M20 7h2.5M7 9.5v13M25 9.5v13M9.5 25h13" />
    <path d="M16 5v5h4" />
    <rect x="18" y="13" width="3" height="3" strokeDasharray="1.5 1.5" />
    <rect x="18" y="18" width="3" height="3" strokeDasharray="1.5 1.5" />
  </svg>,
  // 6. Eight High-Speed Elevators
  <svg key="elevators" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 26.5V9.5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v17" />
    <path d="M4.5 26.5h23" />
    <rect x="8.5" y="9.5" width="7" height="17" />
    <rect x="16.5" y="9.5" width="7" height="17" />
    <circle cx="26" cy="16.5" r="1" />
    <circle cx="26" cy="19.5" r="1" />
  </svg>,
  // 7. Natural Daylight on Every Side
  <svg key="daylight" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="16" r="4.8" />
    <path d="M16 4v3.5M16 24.5V28M4 16h3.5M24.5 16H28M7.5 7.5l2.5 2.5M22 22l2.5 2.5M7.5 24.5l2.5-2.5M22 10l2.5-2.5M10.2 5.9l1.7 3.1M20.1 23l1.7 3.1M5.9 21.8l3.1-1.7M23 11.9l3.1-1.7" />
  </svg>,
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
  const rowCountClass = pillar.features.length > 6 ? "is-7" : pillar.features.length > 4 ? "is-6" : "is-4";
  return (
    <article className="pillar-feature" id={pillar.id}>
      <div className={`pf-panel ${panelClass}`} aria-hidden="true" />
      <div className="pf-head">
        <p className="pf-eyebrow"><span>{label}</span><span className="pf-eyebrow-num font-mono">{num}</span><span className="pf-eyebrow-rule" /></p>
        <h3 className="pf-title"><strong>{pillar.leadWord}</strong> {pillar.titleRest}</h3>
        <p className="pf-desc">{pillar.description}</p>
      </div>
      <figure className="pf-media">
        <Image src={pillar.image} alt={pillar.alt} fill sizes="(max-width: 900px) 100vw, 92vw" className="pf-media-img" priority={pillar.id === "pillar-01"} />
        <figcaption>{pillar.id === "pillar-04" || pillar.id === "pillar-02" ? "Artistic Impression" : "Representative image"}</figcaption>
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
        <h2 id="pillars-title">INNOVATION SHAPING<br /><em>THE FUTURE OF BUSINESS</em></h2>
        <p className="pillars-intro">
          The Eastern Chambers reimagines the modern workplace for businesses that expect their address to work as hard as they do. A Grade A+ workplace should do more than accommodate business. It should enable what comes next, driven by <strong className="pillars-highlight">Technology, Design, Sustainability and Wellness</strong>.
        </p>
        <nav className="pillar-index" aria-label="Explore the four pillars">{PILLARS.map((pillar, idx) => <a href={`#${pillar.id}`} key={pillar.id}><span className="font-mono">0{idx + 1}</span>{pillar.tabLabel}<span aria-hidden="true">↗</span></a>)}</nav>
      </div>
      <div className="pillars-chapters">
        {PILLARS.map((pillar, idx) => {
          if (idx === 0) {
            return <PillarFeature pillar={pillar} key={pillar.id} icons={PILLAR_01_ICONS} panelClass="pf-panel-sand" />;
          }
          if (idx === 1) {
            return <PillarFeature pillar={pillar} key={pillar.id} icons={PILLAR_02_ICONS} panelClass="pf-panel-leather" />;
          }
          if (idx === 2) {
            return <PillarFeature pillar={pillar} key={pillar.id} icons={PILLAR_03_ICONS} panelClass="pf-panel-leather" />;
          }
          if (idx === 3) {
            return <PillarFeature pillar={pillar} key={pillar.id} icons={PILLAR_04_ICONS} panelClass="pf-panel-plaster" />;
          }
          return null;
        })}
      </div>
    </section>
  );
}
