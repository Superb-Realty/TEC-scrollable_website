import { promises as fs } from "fs";
import path from "path";

// Simple in-memory rate limiting to prevent spam
const ipSubmissionTracker = new Map<string, { count: number; firstSeen: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 6;

// Sanitize inputs against Formula Injection (=, +, -, @)
function sanitizeCell(val: unknown, maxLength: number): string {
  if (val === null || val === undefined) return "";
  let str = String(val).trim().slice(0, maxLength);
  // Neutralize formula injection in spreadsheets
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return str;
}

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const now = Date.now();

    const record = ipSubmissionTracker.get(clientIp);
    if (record) {
      if (now - record.firstSeen < RATE_LIMIT_WINDOW_MS) {
        if (record.count >= MAX_SUBMISSIONS_PER_WINDOW) {
          return Response.json(
            { success: false, error: "Too many submissions. Please wait a few minutes before trying again." },
            { status: 429 }
          );
        }
        record.count++;
      } else {
        ipSubmissionTracker.set(clientIp, { count: 1, firstSeen: now });
      }
    } else {
      ipSubmissionTracker.set(clientIp, { count: 1, firstSeen: now });
    }

    // 2. Body parsing and validation
    const body = await request.json();
    const { name, phone, areaRequired, budget, additionalEnquiry } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return Response.json(
        { success: false, error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // Basic international phone pattern (at least 7 digits)
    const phoneDigits = (typeof phone === "string" ? phone : "").replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return Response.json(
        { success: false, error: "Please enter a valid contact phone number." },
        { status: 400 }
      );
    }

    if (!areaRequired || typeof areaRequired !== "string" || areaRequired.trim().length === 0) {
      return Response.json(
        { success: false, error: "Please specify the area required." },
        { status: 400 }
      );
    }

    if (!budget || typeof budget !== "string" || budget.trim().length === 0) {
      return Response.json(
        { success: false, error: "Please select or enter your budget." },
        { status: 400 }
      );
    }

    // 3. Sanitized submission payload
    const submissionData = {
      timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }),
      name: sanitizeCell(name, 120),
      phone: sanitizeCell(phone, 30),
      areaRequired: sanitizeCell(areaRequired, 100),
      budget: sanitizeCell(budget, 100),
      additionalEnquiry: sanitizeCell(additionalEnquiry, 1000),
    };

    // 4. Secure local backup persistence
    try {
      const dataDir = path.join(process.cwd(), "data");
      await fs.mkdir(dataDir, { recursive: true });
      const filePath = path.join(dataDir, "enquiries.json");
      let existing: any[] = [];
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        existing = JSON.parse(fileContent);
      } catch {
        existing = [];
      }
      existing.push({
        id: `enq_${Date.now()}`,
        submittedAt: new Date().toISOString(),
        clientIp: clientIp.replace(/\.\d+$/, ".xxx"), // Mask IP for privacy
        ...submissionData,
      });
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
    } catch (saveErr) {
      console.error("Local secure backup write error:", saveErr);
    }

    // 5. Secure Server-to-Server Webhook forwarding
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const secretToken = process.env.ENQUIRY_SECRET_TOKEN || "tec_leasing_key_2026";
    let sheetSynced = false;
    let sheetError: string | null = null;

    if (webhookUrl && webhookUrl.startsWith("http")) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Enquiry-Secret": secretToken,
          },
          body: JSON.stringify({
            ...submissionData,
            secretToken, // Sent inside payload for Google Apps Script verification
          }),
          redirect: "follow",
        });

        if (response.ok) {
          const resJson = await response.json().catch(() => null);
          if (resJson && resJson.status === "error") {
            sheetError = resJson.message;
            console.error("Google Sheet rejected:", resJson.message);
          } else {
            sheetSynced = true;
          }
        } else {
          sheetError = `Google Sheet returned HTTP ${response.status}`;
          console.error("Google Sheet webhook HTTP error:", sheetError);
        }
      } catch (err: any) {
        sheetError = err?.message || "Failed to contact Google Sheet";
        console.error("Google Sheet webhook error:", err);
      }
    }

    return Response.json({
      success: true,
      message: "Enquiry submitted securely. Our corporate leasing team will contact you shortly.",
      sheetSynced,
      sheetConfigured: Boolean(webhookUrl),
      data: submissionData,
      sheetNote: !webhookUrl
        ? "Google Sheet webhook is not configured yet in .env.local. Submission saved safely in local storage."
        : undefined,
    });
  } catch (error: any) {
    console.error("Error in enquiry API route:", error);
    return Response.json(
      { success: false, error: "Something went wrong while processing your enquiry. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  return Response.json({
    status: "active",
    googleSheetConnected: Boolean(webhookUrl && webhookUrl.startsWith("http")),
  });
}
