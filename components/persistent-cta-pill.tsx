"use client";

import { useEffect, useState } from "react";
import { openEnquiryModal } from "@/components/enquiry-modal";

export function PersistentCtaPill() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Fade in after scrolling past the hero fold (350px)
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      className={`persistent-cta-container ${isVisible ? "is-visible" : ""}`}
      aria-label="Direct leasing and enquiry actions"
    >
      <div className="persistent-glass-pill">
        {/* Live Status indicator */}
        <div className="pill-status-strip">
          <span className="pill-dot-pulse" aria-hidden="true" />
          <span className="pill-status-text font-mono">LEASING DESK ACTIVE</span>
        </div>

        <div className="pill-actions-group">
          {/* Main Enquiry / Site Visit trigger */}
          <button
            type="button"
            className="pill-btn-enquire"
            onClick={() => openEnquiryModal()}
            aria-label="Enquire or schedule a site visit"
          >
            <span>Enquire / Schedule Visit</span>
            <span className="pill-arrow" aria-hidden="true">↗</span>
          </button>

          {/* Quick WhatsApp Link */}
          <a
            href="https://wa.me/919090263264?text=Hello%2C%20I%20would%20like%20to%20request%20commercial%20floor%20plans%20and%20availability."
            target="_blank"
            rel="noopener noreferrer"
            className="pill-btn-whatsapp"
            aria-label="Chat on WhatsApp with Commercial Leasing Desk"
            title="Chat on WhatsApp with Commercial Leasing Desk"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29" />
            </svg>
            <span className="pill-channel-label">WhatsApp</span>
          </a>

          {/* Quick Direct Call Link */}
          <a
            href="tel:+919090263264"
            className="pill-btn-phone"
            aria-label="Direct Call to Commercial Leasing Desk"
            title="Direct Call: +91 9090 263 264"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="pill-channel-label">Call Desk</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
