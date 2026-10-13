"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function BenchmarksScene({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const travel = section.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? Math.max(0, Math.min(1, -section.getBoundingClientRect().top / travel)) : 1;
      setStep(progress >= 0.72 ? 3 : progress >= 0.47 ? 2 : progress >= 0.22 ? 1 : 0);
    };
    const updateMotion = () => setAnimated(!reduceMotion.matches);
    updateMotion();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduceMotion.addEventListener("change", updateMotion);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reduceMotion.removeEventListener("change", updateMotion);
    };
  }, []);

  return <section ref={sectionRef} className={animated ? "benchmarks is-animated" : "benchmarks"} id="benchmarks" aria-labelledby="benchmarks-title" data-step={step}>
    <div className="benchmarks-sticky">{children}</div>
  </section>;
}
