"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/content/site";
import chamberLogo from "@/assets/the_eastern_chambers_logo/the_eastern_chambers_logo.png";
import { openEnquiryModal } from "@/components/enquiry-modal";

const links = [
  { num: "01", label: "Three Global Benchmarks", href: "#benchmarks" },
  { num: "02", label: "The Chambers of Corporate Power", href: "#breakdown" },
  { num: "03", label: "Innovation Shaping Business", href: "#architecture" },
  { num: "04", label: "Four Pillars", href: "#pillars" },
  { num: "05", label: "Wellness & Amenities", href: "#amenities" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first link in drawer
    drawerRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        headerRef.current?.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
      if (event.key === "Tab" && drawerRef.current) {
        const controls = drawerRef.current.querySelectorAll<HTMLElement>("a, button");
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <header className="site-header" ref={headerRef}>
        <a
          className="wordmark"
          href="#top"
          onClick={() => setOpen(false)}
          aria-label={`${site.name}, back to top`}
        >
          <Image src={chamberLogo} alt={site.name} priority />
        </a>

        <div className="site-header-actions">
          <button
            type="button"
            className="nav-enquire-btn"
            onClick={() => {
              setOpen(false);
              openEnquiryModal();
            }}
          >
            Enquire
          </button>
          <button
            className={`menu-toggle ${open ? "is-active" : ""}`}
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="main-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="menu-burger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Dimmed backdrop */}
      <div
        className={`nav-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Navigation Drawer */}
      <aside
        ref={drawerRef}
        className={`nav-drawer ${open ? "is-open" : ""}`}
        id="main-navigation"
        aria-label="Main navigation menu"
        aria-hidden={!open}
      >
        <div className="nav-drawer-header">
          <p className="eyebrow">00 / NAVIGATION</p>
          <button
            type="button"
            className="nav-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <span aria-hidden="true">✕</span> Close
          </button>
        </div>

        <nav className="nav-drawer-links" aria-label="Section links">
          {links.map(({ num, label, href }) => (
            <a
              key={href}
              href={href}
              className="nav-drawer-item"
              onClick={() => setOpen(false)}
            >
              <span className="nav-drawer-num">{num}</span>
              <span className="nav-drawer-label">{label}</span>
              <span className="nav-drawer-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </nav>

        <div className="nav-drawer-footer">
          <button
            type="button"
            className="nav-drawer-enquire-btn"
            onClick={() => {
              setOpen(false);
              openEnquiryModal();
            }}
          >
            Enquire <span aria-hidden="true">↗</span>
          </button>
          <div className="nav-drawer-meta">
            <span className="nav-drawer-brand">The Eastern Chambers</span>
            <span className="nav-drawer-sub">Grade A+ Commercial Workspaces</span>
          </div>
        </div>
      </aside>
    </>
  );
}
