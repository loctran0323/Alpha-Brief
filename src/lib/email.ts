import { Resend } from "resend";
import type { MarketEvent } from "@/types/database";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function formatEventsDigestHtml(events: MarketEvent[]): string {
  if (events.length === 0) {
    return "<p>No upcoming events in your window.</p>";
  }
  const rows = events
    .map(
      (e) => `
    <div style="margin-bottom:16px;padding:12px;border:1px solid #1f2835;border-radius:8px;background:#131820;">
      <div style="font-weight:600;color:#e8eaed;">${escapeHtml(e.title)}</div>
      <div style="color:#8b949e;font-size:13px;margin-top:4px;">
        ${escapeHtml(e.event_type)} · ${escapeHtml(e.ticker ?? "Macro")} · ${new Date(e.event_date).toLocaleString()}
      </div>
      <p style="color:#e8eaed;margin:8px 0 0;font-size:14px;">${escapeHtml(e.why_it_matters)}</p>
      <p style="color:#8b949e;margin:6px 0 0;font-size:13px;"><strong>Watch:</strong> ${escapeHtml(e.watch_for)}</p>
    </div>`,
    )
    .join("");
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;">${rows}</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendDigestEmail(params: {
  to: string;
  subject: string;
  events: MarketEvent[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const html = formatEventsDigestHtml(params.events);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: `<h1 style="font-family:system-ui,sans-serif;">Your event digest</h1>${html}`,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
