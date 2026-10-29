"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import urbanEleganceImg from "@/assets/three_global_benchmarks/Urban_elegance.jpg";
import leedLogo from "@/assets/three_global_benchmarks/Leed.png";
import wiredScoreSeal from "@/assets/three_global_benchmarks/Wired_Score_Seal.webp";
import smartScoreLogo from "@/assets/three_global_benchmarks/smart-score.webp";

const benchmarks = [
  {
    name: "LEED*",
    logo: leedLogo,
    alt: "LEED Certification Seal",
    description:
      "A benchmark for environmental performance across energy efficiency, water conservation, indoor environmental quality, materials and site considerations.",
  },
  {
    name: "WIREDSCORE*",
    logo: wiredScoreSeal,
    alt: "WiredScore Certified Seal",
    description:
      "A benchmark for digital connectivity, resilience and technology infrastructure helping buildings stay connected as business requirements evolve.",
  },
  {
    name: "SMARTSCORE*",
    logo: smartScoreLogo,
    alt: "SmartScore Certified Seal",
    description:
      "A benchmark for smart building technology, automation, IoT integration and data-enabled operations.",
  },
];

export function BenchmarksScene() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".benchmark-card"));
    const visibleEdge = window.innerHeight * 0.9;
    for (const card of cards) {
      if (card.getBoundingClientRect().top < visibleEdge) card.classList.add("is-visible");
    }
    section.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    for (const card of cards) {
      if (!card.classList.contains("is-visible")) observer.observe(card);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="benchmarks" id="benchmarks" aria-labelledby="benchmarks-title">
      <div className="benchmarks-bg-wrap" aria-hidden="true">
        <Image
          src={urbanEleganceImg}
          alt="The Eastern Chambers panoramic dusk architectural elevation"
          fill
          priority
          sizes="100vw"
          className="benchmarks-bg-image"
        />
      </div>

      <div className="benchmarks-container">
        <div className="benchmarks-content">
          <h2 id="benchmarks-title" className="benchmarks-title">
            THREE GLOBAL BENCHMARKS.
            <br />
            ONE FUTURE-READY WORKSPACE.
          </h2>
          <p className="benchmarks-intro">
            From sustainable infrastructure and resilient connectivity to intelligent building
            performance, The Eastern Chambers brings together three global benchmarks to create a
            workplace equipped for how businesses will work tomorrow.
          </p>

          <div className="benchmarks-grid">
            {benchmarks.map(({ name, logo, alt, description }) => (
              <article className="benchmark-card" key={name}>
                <div className="benchmark-badge">
                  <Image
                    src={logo}
                    alt={alt}
                    width={76}
                    height={76}
                    className="benchmark-seal"
                  />
                </div>
                <div className="benchmark-card-body">
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="benchmarks-footnote">
          <span>Artistic impression</span>
          <span>*Pre-Certification Aligned</span>
        </div>
      </div>
    </section>
  );
}
