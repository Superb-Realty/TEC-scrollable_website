"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/content/site";
import chamberLogo from "@/assets/the_eastern_chambers_logo/the_eastern_chambers_logo.png";

const links = [
  { label: "Benchmarks", href: "#benchmarks" },
  { label: "The building", href: "#breakdown" },
  { label: "Architecture", href: "#architecture" },
  { label: "Vision", href: "#vision" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll(".benchmarks, .vision");
    const update = () => {
      const y = window.innerWidth <= 900 ? 36 : 43;
      setOnLight(Array.from(sections).some((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= y && bounds.bottom > y;
      }));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return <header className={onLight && !open ? "site-header on-light" : "site-header"}>
    <a className="wordmark" href="#top" aria-label={`${site.name}, back to top`}><Image src={chamberLogo} alt="" priority /></a>
    <nav className={open ? "nav-links open" : "nav-links"} aria-label="Main navigation" id="main-navigation">
      {links.map(({ label, href }) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
    <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span /> <span />
    </button>
  </header>;
}

