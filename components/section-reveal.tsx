"use client";

import { useEffect } from "react";

/*
 * Arrival choreography: as each section's feathered seam rises, its editorial copy settles in
 * a beat later (soft fade + lift, staggered within each group), so a new section is never
 * presented all at once. Elements already on screen at load are left untouched, and nothing
 * is hidden without JavaScript or when reduced motion is requested.
 */
const TARGETS = [
  ".address-note > *",
  ".benchmarks-title",
  ".benchmarks-intro",
  ".benchmarks-footnote",
  ".breakdown-heading",
  ".breakdown-intro > p",
  ".breakdown-scroll-note",
  ".breakdown-details > .eyebrow",
  ".breakdown-detail-grid > article",
  ".architecture-heading > .eyebrow",
  ".architecture-heading > h2",
  ".architecture-copy > p",
  ".architecture-caption",
  ".pillars-heading > .eyebrow",
  ".pillars-heading > h2",
  ".pillars-intro",
  ".pf-head",
  ".vision-top",
  ".vision h2",
  ".vision-bottom > *",
  ".closing-top",
  ".closing-copy > *",
].join(",");

export function SectionReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const visibleEdge = window.innerHeight * 0.92;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
      .filter((element) => element.getBoundingClientRect().top > visibleEdge);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    for (const element of elements) {
      const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
      const order = Math.max(0, siblings.indexOf(element));
      element.style.setProperty("--reveal-delay", `${Math.min(order, 4) * 90}ms`);
      element.classList.add("reveal-item");
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      for (const element of elements) element.classList.remove("reveal-item", "is-in");
    };
  }, []);

  return null;
}
