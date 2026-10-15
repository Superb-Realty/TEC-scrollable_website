"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function BenchmarksScene({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>(".benchmark-card"));
    const visibleEdge = window.innerHeight * 0.88;
    for (const card of cards) {
      if (card.getBoundingClientRect().top < visibleEdge) card.classList.add("is-visible");
    }
    section.classList.add("reveal-ready");

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });
    for (const card of cards) {
      if (!card.classList.contains("is-visible")) observer.observe(card);
    }
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef} className="benchmarks" id="benchmarks" aria-labelledby="benchmarks-title">
    <div className="benchmarks-layout">{children}</div>
  </section>;
}
