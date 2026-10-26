"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/content/site";
import chamberLogo from "@/assets/the_eastern_chambers_logo/the_eastern_chambers_logo.png";
import { openEnquiryModal } from "@/components/enquiry-modal";

const links = [
  { label: "Benchmarks", href: "#benchmarks" },
  { label: "The building", href: "#breakdown" },
  { label: "Architecture", href: "#architecture" },
  { label: "The pillars", href: "#pillars" },
  { label: "Vision", href: "#vision" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    headerRef.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        headerRef.current?.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
      if (event.key === "Tab") {
        const controls = headerRef.current?.querySelectorAll<HTMLElement>("a, button");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const closeOnDesktop = () => { if (window.innerWidth > 900) setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <a className="wordmark" href="#top" onClick={() => setOpen(false)} aria-label={`${site.name}, back to top`}>
        <Image src={chamberLogo} alt="" priority />
      </a>
      <nav className={open ? "nav-links open" : "nav-links"} aria-label="Main navigation" id="main-navigation">
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
        <button
          type="button"
          className="nav-cta-btn"
          onClick={() => {
            setOpen(false);
            openEnquiryModal();
          }}
        >
          Leasing enquiries <span aria-hidden="true">↗</span>
        </button>
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-controls="main-navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span /> <span />
      </button>
    </header>
  );
}
