"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { openEnquiryModal } from "@/components/enquiry-modal";

interface RagSource {
  id: string;
  title: string;
  category: string;
  score: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
  leadCaptured?: {
    name: string;
    phone: string;
  };
  isStreaming?: boolean;
}

const QUICK_PROMPTS = [
  "Floor Plans & Sizes",
  "Location & Metro",
  "Pricing Trend",
  "Book Site Visit",
];

const INITIAL_GREETING: ChatMessage = {
  id: "welcome-msg",
  role: "assistant",
  content: "Welcome to **The Eastern Chambers**. How can I assist you today?",
};

const CHATBOT_API_BASE =
  process.env.NEXT_PUBLIC_CHATBOT_API_URL || "https://tec-chatbot.vercel.app";

function formatMessageText(text: string): React.ReactNode[] {
  const sanitizedText = text
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\bleasing\s*&\s*sales\b/gi, "Sales")
    .replace(/\bcorporate\s+leasing\b/gi, "Sales")
    .replace(/\bleasing\b/gi, "sales");
  const lines = sanitizedText.split("\n");
  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={lineIdx} className="tec-chat-spacer" />;
    }

    const isBullet = /^[•\-*]\s+/.test(trimmed);
    const cleanLine = isBullet ? trimmed.replace(/^[•\-*]\s+/, "") : line;

    // Parse **bold** and `code`
    const parts = cleanLine.split(/(\*\*.*?\*\*|`.*?`)/g);
    const renderedParts = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="tec-chat-code font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="tec-chat-bullet">
          <span className="tec-chat-bullet-dot" aria-hidden="true">
            ◆
          </span>
          <span>{renderedParts}</span>
        </div>
      );
    }

    return (
      <p key={lineIdx} className="tec-chat-paragraph">
        {renderedParts}
      </p>
    );
  });
}

export function SalesChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState("session_init");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showLeadDrawer, setShowLeadDrawer] = useState(false);

  // Quick Lead Form state inside chat
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadArea, setLeadArea] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadCapturedBanner, setLeadCapturedBanner] = useState<string | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session ID & restore chat history from sessionStorage
  useEffect(() => {
    try {
      let sid = sessionStorage.getItem("tec_chat_session_id");
      if (!sid) {
        sid = `tec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem("tec_chat_session_id", sid);
      }
      setSessionId(sid);

      const savedMsgs = sessionStorage.getItem("tec_chat_messages_v3");
      if (savedMsgs) {
        const parsed = JSON.parse(savedMsgs) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  // Save chat history to sessionStorage
  useEffect(() => {
    if (messages.length <= 1) return;
    try {
      sessionStorage.setItem(
        "tec_chat_messages_v3",
        JSON.stringify(messages.slice(-20))
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, showLeadDrawer]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !showLeadDrawer) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, showLeadDrawer]);

  const sendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isStreaming) return;

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      const assistantMsgId = `bot_${Date.now() + 1}`;
      const placeholderAssistant: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      const historyPayload = messages
        .filter((m) => m.id !== "welcome-msg" && m.content.trim().length > 0)
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMsg, placeholderAssistant]);
      setInputValue("");
      setIsStreaming(true);

      try {
        let response: Response;
        try {
          response = await fetch(`${CHATBOT_API_BASE}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              message: trimmed,
              history: historyPayload,
            }),
          });
        } catch {
          // Fallback to Next.js proxy route if direct port 4000 call is blocked
          response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              message: trimmed,
              history: historyPayload,
            }),
          });
        }

        if (!response.ok || !response.body) {
          const errData = await response.json().catch(() => null);
          throw new Error(
            errData?.error ||
              "Our concierge desk is momentarily busy. Please call +91 9090 263 264."
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent = "message";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            if (line.startsWith("event:")) {
              currentEvent = line.slice(6).trim();
              continue;
            }

            if (line.startsWith("data:")) {
              const dataStr = line.slice(5).trim();
              try {
                const payload = JSON.parse(dataStr);

                if (currentEvent === "token" && payload.token) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: m.content + payload.token }
                        : m
                    )
                  );
                } else if (currentEvent === "sources" && payload.sources) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, sources: payload.sources }
                        : m
                    )
                  );
                } else if (currentEvent === "lead_captured" && payload.phone) {
                  setLeadCapturedBanner(
                    `Enquiry registered for ${payload.name} (${payload.phone})`
                  );
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            leadCaptured: {
                              name: payload.name,
                              phone: payload.phone,
                            },
                          }
                        : m
                    )
                  );
                } else if (currentEvent === "error" && payload.error) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: payload.error, isStreaming: false }
                        : m
                    )
                  );
                }
              } catch {
                // Ignore partial JSON frame
              }
            }
          }
        }
      } catch (err: unknown) {
        const fallbackMsg =
          err instanceof Error
            ? err.message
            : "Connection interrupted. You can reach our sales desk directly at +91 9090 263 264.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: fallbackMsg, isStreaming: false }
              : m
          )
        );
      } finally {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          )
        );
        setIsStreaming(false);
      }
    },
    [isStreaming, messages, sessionId]
  );

  const handleQuickLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim() || leadSubmitting) return;

    const digits = leadPhone.replace(/\D/g, "");
    if (digits.length < 10) {
      alert("Please enter a legitimate 10-digit mobile or WhatsApp number.");
      return;
    }

    setLeadSubmitting(true);
    try {
      const res = await fetch(`${CHATBOT_API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: leadName.trim(),
          phone: leadPhone.trim(),
          areaRequired: leadArea.trim(),
          additionalEnquiry: "Submitted via Chatbot Instant Callback Drawer",
        }),
      }).catch(() =>
        // Fallback to existing Next.js /api/enquiry endpoint
        fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: leadName.trim(),
            phone: leadPhone.trim(),
            areaRequired: leadArea.trim(),
            additionalEnquiry: "Submitted via Chatbot Instant Callback Drawer",
          }),
        })
      );

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Could not submit enquiry.");
      }

      setLeadCapturedBanner(
        `Callback scheduled for ${leadName.trim()} (${leadPhone.trim()})`
      );
      setShowLeadDrawer(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `lead_confirm_${Date.now()}`,
          role: "assistant",
          content: `Thank you, **${leadName.trim()}**. Your callback request for **${leadPhone.trim()}**${leadArea ? ` (Requirement: **${leadArea.trim()}**)` : ""} has been prioritized with our Sales Desk.`,
          leadCaptured: { name: leadName.trim(), phone: leadPhone.trim() },
        },
      ]);
      setLeadName("");
      setLeadPhone("");
      setLeadArea("");
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : "Please enter a valid name and phone number."
      );
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_GREETING]);
    try {
      sessionStorage.removeItem("tec_chat_messages_v3");
    } catch {
      // Ignore
    }
  };

  return (
    <div className="tec-chatbot-root" aria-live="polite">
      {/* Floating Luxury Minimal Icon Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="tec-chatbot-launcher"
          aria-label="Open The Eastern Chambers AI Sales Concierge"
        >
          <span className="tec-launcher-badge" aria-hidden="true" />
          <span className="tec-launcher-icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              <path
                d="M12 7.5l1.1 2.4 2.4 1.1-2.4 1.1L12 14.5l-1.1-2.4-2.4-1.1 2.4-1.1L12 7.5z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </span>
          <span className="tec-launcher-tooltip font-mono">AI CONCIERGE</span>
        </button>
      )}

      {/* Conversational Sales Panel */}
      {isOpen && (
        <section
          className="tec-chatbot-window"
          role="dialog"
          aria-label="The Eastern Chambers AI Sales Concierge"
        >
          {/* Top Gold Accent Bar */}
          <div className="tec-chatbot-gold-bar" aria-hidden="true" />

          {/* Header */}
          <header className="tec-chatbot-header">
            <div className="tec-chatbot-brand">
              <div className="tec-chatbot-status-row">
                <span className="tec-status-dot" aria-hidden="true" />
                <span className="tec-chatbot-eyebrow font-mono">
                  THE EASTERN CHAMBERS • AI DESK
                </span>
              </div>
              <h3 className="tec-chatbot-heading">Sales Concierge</h3>
            </div>

            <div className="tec-chatbot-header-actions">
              <button
                type="button"
                onClick={handleResetChat}
                className="tec-header-icon-btn"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="tec-header-icon-btn"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Direct Action Sub-Bar */}
          <div className="tec-chatbot-subbar">
            <button
              type="button"
              onClick={() => setShowLeadDrawer((prev) => !prev)}
              className={`tec-subbar-btn ${showLeadDrawer ? "is-active" : ""}`}
            >
              {showLeadDrawer ? "← Back to Chat" : "📋 Instant Floor Plan Deck"}
            </button>
            <a
              href="tel:+919090263264"
              className="tec-subbar-link font-mono"
            >
              📞 9090 263 264
            </a>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openEnquiryModal();
              }}
              className="tec-subbar-link font-mono"
            >
              Enquire ↗
            </button>
          </div>

          {leadCapturedBanner && (
            <div className="tec-lead-banner font-mono">
              <span>✓ {leadCapturedBanner}</span>
            </div>
          )}

          {/* Expandable Quick Callback / Deck Request Form */}
          {showLeadDrawer ? (
            <form
              onSubmit={handleQuickLeadSubmit}
              className="tec-lead-drawer"
            >
              <p className="tec-drawer-eyebrow font-mono">
                PRIORITY SALES DESK
              </p>
              <h4 className="tec-drawer-title">
                Receive Floor Plans &amp; Commercial Sheet
              </h4>
              <p className="tec-drawer-desc">
                Share your coordinates below or simply type them in the chat.
                Synced directly with our Sales team.
              </p>

              <label className="tec-drawer-label font-mono">
                FULL NAME *
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="tec-drawer-input"
                />
              </label>

              <label className="tec-drawer-label font-mono">
                PHONE / WHATSAPP NUMBER (10 DIGITS) *
                <input
                  type="tel"
                  required
                  pattern="[0-9+ -]{10,18}"
                  placeholder="e.g. 98200 12345 or +91 98200 12345"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="tec-drawer-input"
                />
              </label>

              <label className="tec-drawer-label font-mono">
                APPROX. CARPET AREA / REQUIREMENT
                <input
                  type="text"
                  placeholder="e.g. 5,000 sq.ft. / Full Floor / Boutique Office"
                  value={leadArea}
                  onChange={(e) => setLeadArea(e.target.value)}
                  className="tec-drawer-input"
                />
              </label>

              <div className="tec-drawer-actions">
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="tec-drawer-submit"
                >
                  {leadSubmitting
                    ? "Registering Priority Enquiry..."
                    : "Request Commercial Deck →"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Messages Viewport */}
              <div className="tec-chatbot-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`tec-msg-row ${
                      msg.role === "user" ? "is-user" : "is-assistant"
                    }`}
                  >
                    <div className="tec-msg-bubble">
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="tec-msg-source-badge font-mono">
                          <span>✓ Verified • {msg.sources[0].category}</span>
                        </div>
                      )}

                      <div className="tec-msg-content">
                        {msg.content ? (
                          formatMessageText(msg.content)
                        ) : (
                          <span className="tec-typing-dots" aria-label="Concierge is typing">
                            <span />
                            <span />
                            <span />
                          </span>
                        )}
                      </div>

                      {msg.leadCaptured && (
                        <div className="tec-msg-lead-pill font-mono">
                          ✓ Priority Lead Logged: {msg.leadCaptured.name} (
                          {msg.leadCaptured.phone})
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Starter Quick-Prompt Chips */}
                {messages.length <= 2 && !isStreaming && (
                  <div className="tec-quick-prompts">
                    <span className="tec-quick-label font-mono">
                      SUGGESTED TOPICS:
                    </span>
                    <div className="tec-quick-chips">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void sendMessage(prompt)}
                          className="tec-quick-chip"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage(inputValue);
                }}
                className="tec-chatbot-composer"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question or share your 10-digit number..."
                  disabled={isStreaming}
                  className="tec-composer-input"
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !inputValue.trim()}
                  className="tec-composer-send"
                  aria-label="Send message"
                >
                  ↑
                </button>
              </form>
            </>
          )}

          {/* Footer MahaRERA & Confidentiality Seal */}
          <footer className="tec-chatbot-footer font-mono">
            <span>MahaRERA: P51800054892</span>
            <span>•</span>
            <span>LBS Marg, Vikhroli West</span>
          </footer>
        </section>
      )}
    </div>
  );
}

