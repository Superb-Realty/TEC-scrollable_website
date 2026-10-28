"use client";

import { useEffect, useRef, useState } from "react";
import { openEnquiryModal } from "@/components/enquiry-modal";

interface StatItem {
  id: string;
  label: string;
  badge: string;
  numericTarget?: number;
  prefix?: string;
  suffix?: string;
  displayOverride?: string;
  caption: string;
  category: string;
}

const STATS: StatItem[] = [
  {
    id: "commercial-floors",
    category: "BUILDING ELEVATION",
    label: "Commercial Workspaces",
    badge: "Grade A+ Asset",
    displayOverride: "1st – 17th Floor",
    caption: "Prime office levels engineered for institutional occupiers & enterprise headquarters.",
  },
  {
    id: "full-floors",
    category: "COLUMN-FREE SPAN",
    label: "Full Floor Plates",
    badge: "Continuous Plate",
    numericTarget: 13500,
    suffix: " Sq.Ft.",
    caption: "Expansive column-free floor plates offering complete planning flexibility.",
  },
  {
    id: "boutique-offices",
    category: "MODULAR PLANNING",
    label: "Scalable Office Suites",
    badge: "Boutique Footprint",
    numericTarget: 391,
    prefix: "From ",
    suffix: " Sq.Ft.",
    caption: "Efficiently configured units tailored for high-growth businesses and boutique firms.",
  },
  {
    id: "floor-height",
    category: "STRUCTURAL VOLUME",
    label: "Floor-to-Floor Height",
    badge: "Expansive Clearance",
    displayOverride: "11’4”",
    caption: "Generous vertical clearance maximizing natural daylight and indoor volume.",
  },
  {
    id: "parking-provision",
    category: "VEHICULAR MOBILITY",
    label: "Parking Infrastructure",
    badge: "Dedicated Bays",
    displayOverride: "100%",
    suffix: " across 5 levels",
    caption: "Comprehensive parking allocation spanning basement and multi-level podium bays.",
  },
  {
    id: "green-reserve",
    category: "BIOPHILIC LANDSCAPE",
    label: "Dedicated Green Reserve",
    badge: "Open-Air Sanctuary",
    numericTarget: 10000,
    suffix: " Sq.Ft.",
    caption: "Landscaped outdoor reserve designed to promote workplace wellness and recharge.",
  },
];

function RollingNumber({
  target,
  duration = 1800,
  shouldAnimate,
}: {
  target: number;
  duration?: number;
  shouldAnimate: boolean;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setVal(0);
      return;
    }

    let animId: number;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = ease * target;

      setVal(current);

      if (progress < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        setVal(target);
      }
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [shouldAnimate, target, duration]);

  if (target >= 1000) {
    return <span>{Math.round(val).toLocaleString("en-IN")}</span>;
  }

  return <span>{Math.round(val)}</span>;
}

export function QuickFactsPlate() {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="quick-facts-section"
      id="quick-facts"
      aria-labelledby="quick-facts-title"
    >
      <div className="quick-facts-aurora" aria-hidden="true" />
      <div className="quick-facts-container">
        {/* Header */}
        <div className="quick-facts-header">
          <div className="quick-facts-eyebrow-bar">
            <p className="eyebrow">
              01.1 / PROOF OF SCALE &amp; ENGINEERING
            </p>
            <span className="quick-facts-spec-tag font-mono">
              OFFICIAL OPPORTUNITY BENCHMARKS
            </span>
          </div>

          <div className="quick-facts-header-left">
            <h2 id="quick-facts-title" className="quick-facts-title">
              Hard Commercial Proof.<br />
              <em>Architectural Precision.</em>
            </h2>
          </div>
          <div className="quick-facts-header-right">
            <p className="quick-facts-lead">
              Strategically positioned on LBS Marg, The Eastern Chambers brings together
              Grade A+ commercial assets with intelligent design, integrated infrastructure
              and high-speed connectivity access in one future-ready address. Designed for
              institutional occupiers, established enterprises and luxury boutique businesses,
              the development combines a differentiated workplace environment with the
              advantage of freehold ownership.
            </p>
            <div className="quick-facts-actions">
              <button
                type="button"
                className="btn-spec-enquire"
                onClick={() => openEnquiryModal()}
              >
                Begin a conversation <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6-box Live Glass Stat Plates */}
        <div className="quick-facts-grid" role="list" aria-label="Key architectural specifications from Opp Doc">
          {STATS.map((stat, idx) => (
            <article
              key={stat.id}
              className={`fact-card ${isVisible ? "is-in" : ""}`}
              style={{ "--card-index": idx } as React.CSSProperties}
              role="listitem"
            >
              <div className="fact-card-corner-accent" aria-hidden="true" />
              <div className="fact-card-top">
                <span className="fact-spec-code">{stat.category}</span>
                <span className="fact-badge">
                  <span className="fact-badge-dot" aria-hidden="true" />
                  {stat.badge}
                </span>
              </div>

              <div className="fact-metric-wrap">
                <p className="fact-metric-value font-mono">
                  {stat.displayOverride ? (
                    <span>
                      {stat.displayOverride}
                      {stat.suffix && <span className="fact-metric-suffix">{stat.suffix}</span>}
                    </span>
                  ) : (
                    <>
                      {stat.prefix}
                      {stat.numericTarget !== undefined && (
                        <RollingNumber
                          target={stat.numericTarget}
                          shouldAnimate={isVisible}
                        />
                      )}
                      {stat.suffix}
                    </>
                  )}
                </p>
                <h3 className="fact-label">{stat.label}</h3>
              </div>

              <p className="fact-caption">{stat.caption}</p>

              <div className="fact-card-bottom-line" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* Footnote / Trust Strip from Opp Doc */}
        <div className="quick-facts-footer">
          <div className="quick-facts-compliance">
            <span className="compliance-icon" aria-hidden="true">✦</span>
            <span>Ground + 1st Floor Hospitality Lobby &amp; High-Street Retail • Eight High-Speed Elevators</span>
          </div>
          <div className="quick-facts-handover font-mono">
            <span>FREEHOLD OWNERSHIP</span>
            <span className="divider" aria-hidden="true">•</span>
            <span>100% PARKING ACROSS 5 LEVELS</span>
            <span className="divider" aria-hidden="true">•</span>
            <span>CONTEMPORARY FAÇADE: STONE, METAL &amp; GLASS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
