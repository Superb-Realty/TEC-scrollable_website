"use client";

import { useState, useEffect, useId, useCallback } from "react";

interface FormState {
  name: string;
  phone: string;
  areaRequired: string;
  budget: string;
  additionalEnquiry: string;
}

const AREA_PRESETS = [
  "5,000 – 10,000 sq. ft.",
  "10,000 – 25,000 sq. ft.",
  "25,000 – 50,000 sq. ft.",
  "Full Floor / 50k+ sq. ft.",
];

const BUDGET_PRESETS = [
  "Flexible / Open",
  "₹120 – ₹160 / sq. ft.",
  "₹160 – ₹220 / sq. ft.",
  "Custom Commercial",
];

// Global helper to trigger modal from any component
export function openEnquiryModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-enquiry-modal"));
  }
}

export function EnquiryModal() {
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phone: "",
    areaRequired: "",
    budget: "",
    additionalEnquiry: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<FormState | null>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // If the hash is #enquire, clear it without page jump
    if (typeof window !== "undefined" && window.location.hash === "#enquire") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setErrorMessage(null);
  }, []);

  // Listen to open events and hash changes
  useEffect(() => {
    const onOpenEvent = () => handleOpen();
    const onCloseEvent = () => handleClose();
    const onHashChange = () => {
      if (window.location.hash === "#enquire") {
        handleOpen();
      }
    };

    window.addEventListener("open-enquiry-modal", onOpenEvent);
    window.addEventListener("close-enquiry-modal", onCloseEvent);
    window.addEventListener("hashchange", onHashChange);

    // Initial check if opened with #enquire
    if (window.location.hash === "#enquire") {
      handleOpen();
    }

    return () => {
      window.removeEventListener("open-enquiry-modal", onOpenEvent);
      window.removeEventListener("close-enquiry-modal", onCloseEvent);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [handleOpen, handleClose]);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMessage("Please enter a valid phone number (e.g. +91 98765 43210).");
      return;
    }

    if (!formData.areaRequired.trim()) {
      setErrorMessage("Please specify the area required.");
      return;
    }

    if (!formData.budget.trim()) {
      setErrorMessage("Please select or enter your budget.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit enquiry. Please try again.");
      }

      setSubmittedData({ ...formData });
      setSubmitSuccess(true);
      setFormData({
        name: "",
        phone: "",
        areaRequired: "",
        budget: "",
        additionalEnquiry: "",
      });
    } catch (err: any) {
      setErrorMessage(
        err.message || "An error occurred while submitting. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNew = () => {
    setSubmitSuccess(false);
    setSubmittedData(null);
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="modal-dialog">
        <div className="modal-accent-bar" aria-hidden="true" />
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close enquiry modal"
        >
          ✕
        </button>

        {submitSuccess && submittedData ? (
          <div className="enquiry-success modal-success" role="status" aria-live="polite">
            <div className="success-badge">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 id="enquiry-modal-title">Enquiry Received</h3>
            <p className="success-lead">
              Thank you, <strong>{submittedData.name}</strong>. Your requirement has been registered and synced with our Google Sheet &amp; leasing desk.
            </p>

            <div className="submitted-summary">
              <div className="summary-row">
                <span>Contact Phone:</span>
                <strong>{submittedData.phone}</strong>
              </div>
              <div className="summary-row">
                <span>Area Required:</span>
                <strong>{submittedData.areaRequired}</strong>
              </div>
              <div className="summary-row">
                <span>Budget:</span>
                <strong>{submittedData.budget}</strong>
              </div>
              {submittedData.additionalEnquiry && (
                <div className="summary-row">
                  <span>Notes:</span>
                  <span className="summary-notes">{submittedData.additionalEnquiry}</span>
                </div>
              )}
            </div>

            <div className="success-actions">
              <button
                type="button"
                className="btn-enquiry-secondary"
                onClick={handleResetForNew}
              >
                Submit Another
              </button>
              <button
                type="button"
                className="btn-enquiry-primary"
                onClick={handleClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="modal-header">
              <p className="eyebrow light">EASTERN CHAMBER • LEASING DESK</p>
              <h2 id="enquiry-modal-title">Commercial Enquiry</h2>
              <p className="modal-subtitle">
                Reserve space, request architectural specification decks, or schedule a private preview walkthrough.
              </p>
            </div>

            {errorMessage && (
              <div className="form-error-banner" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="enquiry-modal-form">
              {/* 1. Name */}
              <div className="form-group">
                <label htmlFor={`${formId}-modal-name`}>
                  NAME <span className="req">*</span>
                </label>
                <input
                  id={`${formId}-modal-name`}
                  name="name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  placeholder="e.g. Vikram Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="enquiry-input"
                />
              </div>

              {/* 2. Phone no. */}
              <div className="form-group">
                <label htmlFor={`${formId}-modal-phone`}>
                  PHONE NO. <span className="req">*</span>
                </label>
                <input
                  id={`${formId}-modal-phone`}
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="e.g. +91 98200 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="enquiry-input"
                />
              </div>

              {/* 3. Area Required */}
              <div className="form-group">
                <label htmlFor={`${formId}-modal-area`}>
                  AREA REQUIRED <span className="req">*</span>
                </label>
                <div className="preset-chips" role="group" aria-label="Area required options">
                  {AREA_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      className={`preset-chip ${formData.areaRequired === preset ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, areaRequired: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  id={`${formId}-modal-area`}
                  name="areaRequired"
                  type="text"
                  required
                  placeholder="Or enter custom area (e.g. 18,500 sq. ft.)"
                  value={formData.areaRequired}
                  onChange={(e) => setFormData({ ...formData, areaRequired: e.target.value })}
                  className="enquiry-input"
                />
              </div>

              {/* 4. Budget */}
              <div className="form-group">
                <label htmlFor={`${formId}-modal-budget`}>
                  BUDGET <span className="req">*</span>
                </label>
                <div className="preset-chips" role="group" aria-label="Budget options">
                  {BUDGET_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      className={`preset-chip ${formData.budget === preset ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, budget: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  id={`${formId}-modal-budget`}
                  name="budget"
                  type="text"
                  required
                  placeholder="Or enter custom budget (e.g. ₹150 / sq. ft.)"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="enquiry-input"
                />
              </div>

              {/* 5. Additional Enquiry */}
              <div className="form-group">
                <label htmlFor={`${formId}-modal-additional`}>
                  ADDITIONAL ENQUIRY
                </label>
                <textarea
                  id={`${formId}-modal-additional`}
                  name="additionalEnquiry"
                  rows={3}
                  placeholder="Floor level preference, parking allocation, handover timelines, or specific technical requirements..."
                  value={formData.additionalEnquiry}
                  onChange={(e) => setFormData({ ...formData, additionalEnquiry: e.target.value })}
                  className="enquiry-textarea"
                />
              </div>

              {/* Submit CTA */}
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-enquiry-submit"
                  id="btn-modal-submit"
                >
                  {isSubmitting ? (
                    <span className="submitting-state">
                      <span className="spinner" aria-hidden="true" />
                      Syncing with leasing desk...
                    </span>
                  ) : (
                    <span>Submit Enquiry &amp; Request Deck →</span>
                  )}
                </button>
                <p className="form-disclaimer">
                  🔒 Connected to Google Sheet &amp; leasing CRM. Your data is handled strictly confidentially.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
