"use client";

import { openEnquiryModal } from "@/components/enquiry-modal";

export function FooterEnquireButton() {
  return (
    <button
      type="button"
      onClick={() => openEnquiryModal()}
      className="footer-enquire-pill-btn"
      aria-label="Open Enquiry Form"
    >
      <span>Enquiry Form</span>
      <span aria-hidden="true" className="footer-enquire-arrow">↗</span>
    </button>
  );
}

