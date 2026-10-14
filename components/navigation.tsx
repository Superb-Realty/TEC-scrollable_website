"use client";

import { useState } from "react";
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
  return <header className="site-header">
    <a className="wordmark" href="#top" aria-label={`${site.name}, back to top`}><Image src={chamberLogo} alt="" priority /></a>
    <nav className={open ? "nav-links open" : "nav-links"} aria-label="Main navigation" id="main-navigation">
      {links.map(({ label, href }) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="mobile-enquire" href="#enquire" onClick={() => setOpen(false)}>Enquire</a>
    </nav>
    <a className="header-enquire" href="#enquire">Enquire <span aria-hidden="true">?</span></a>
    <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span /> <span />
    </button>
  </header>;
}

