// ==============================================
// /api/send-results
// Sends the rate breakdown email via Resend.
// Called by the EmailCapture component after
// the Supabase insert succeeds.
//
// If RESEND_API_KEY is not set, returns 200 silently
// so the UI still shows success — never block UX
// on an email failure.
// ==============================================

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Lazily initialized — Resend throws at construction time if key is missing
let resend: Resend | null = null;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY!);
  return resend;
}

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function buildEmail({
  email,
  discipline,
  experience,
  location,
  dayRate,
  currentRate,
}: {
  email:       string;
  discipline:  string;
  experience:  string;
  location:    string;
  dayRate:     number;
  currentRate: number | null;
}) {
  const gap        = currentRate ? dayRate - currentRate : null;
  const gapMessage = gap && gap > 0
    ? `<p style="margin:0 0 16px;color:#a8a097;">You're currently charging <strong style="color:#f2ede5;">${fmt(currentRate!)}/day</strong> — that's a gap of <strong style="color:#d85c46;">${fmt(gap)}/day</strong>, or <strong style="color:#d85c46;">${fmt(gap * 200)}/year</strong> at 200 billable days.</p>`
    : gap && gap <= 0
    ? `<p style="margin:0 0 16px;color:#a8a097;">You're already charging <strong style="color:#f2ede5;">${fmt(currentRate!)}/day</strong> — <strong style="color:#d4920a;">${fmt(Math.abs(gap))}/day above your minimum</strong>. Nice.</p>`
    : "";

  // Build URL with params so clicking the email reopens their exact calculation
  const params = new URLSearchParams({
    d: discipline,
    e: experience,
    l: location,
  });
  const toolUrl = `https://therateguide.com?${params.toString()}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your rate breakdown</title>
</head>
<body style="margin:0;padding:0;background:#16120d;font-family:'Courier New',Courier,monospace;color:#f2ede5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#16120d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <a href="https://therateguide.com" style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#d4920a;text-decoration:none;">
                The Rate Guide
              </a>
            </td>
          </tr>

          <!-- Rate hero -->
          <tr>
            <td style="border-top:2px solid #d4920a;padding-top:28px;padding-bottom:32px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#d4920a;">
                Your Target Day Rate
              </p>
              <p style="margin:0;font-size:52px;line-height:1;color:#d4920a;font-weight:bold;">
                ${fmt(dayRate)}
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:#a8a097;">
                ${experience} ${discipline} · ${location}
              </p>
            </td>
          </tr>

          <!-- Gap message (if they entered current rate) -->
          ${gapMessage ? `<tr><td style="padding-bottom:24px;">${gapMessage}</td></tr>` : ""}

          <!-- What this covers -->
          <tr>
            <td style="background:#251f17;border:1px solid #413925;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f2ede5;">
                What this rate covers
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #413925;color:#a8a097;">Self-employment tax</td>
                  <td style="padding:8px 0;border-bottom:1px solid #413925;text-align:right;color:#f2ede5;">15.3% (both sides)</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #413925;color:#a8a097;">Health insurance</td>
                  <td style="padding:8px 0;border-bottom:1px solid #413925;text-align:right;color:#f2ede5;">~$7,400/yr</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #413925;color:#a8a097;">Federal + state income tax</td>
                  <td style="padding:8px 0;border-bottom:1px solid #413925;text-align:right;color:#f2ede5;">Estimated after deductions</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#a8a097;">Profit margin</td>
                  <td style="padding:8px 0;text-align:right;color:#f2ede5;">20%</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td>
              <a href="${toolUrl}" style="display:inline-block;background:#d4920a;color:#000;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:bold;padding:14px 28px;text-decoration:none;">
                View Full Breakdown →
              </a>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:40px;"></td></tr>

          <!-- Methodology link -->
          <tr>
            <td style="border-top:1px solid #413925;padding-top:24px;">
              <p style="margin:0 0 8px;font-size:12px;color:#a8a097;line-height:1.6;">
                The methodology page explains every line: where the rates come from, how taxes are estimated, and why billable days matter.
              </p>
              <a href="https://therateguide.com/methodology" style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#d4920a;text-decoration:none;">
                Read the methodology →
              </a>
            </td>
          </tr>

          <!-- Contract Pack soft sell -->
          <tr>
            <td style="padding-top:32px;border-top:1px solid #413925;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#f2ede5;">
                Now protect that rate
              </p>
              <p style="margin:0 0 12px;font-size:13px;color:#a8a097;line-height:1.6;">
                The Freelancer's Contract Pack has everything you need to actually charge what you're worth — a services agreement, quote sheet, change order, invoice template, and five email scripts for the conversations most freelancers avoid.
              </p>
              <a href="https://daredevil484.gumroad.com/l/therateguidecontractpack" style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#d4920a;text-decoration:none;">
                Get the Contract Pack — $9.99 →
              </a>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #413925;padding-top:24px;">
              <p style="margin:0;font-size:11px;color:#413925;line-height:1.6;">
                You're receiving this because you entered your email at therateguide.com.<br/>
                <a href="https://therateguide.com" style="color:#413925;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  // Silently succeed if key isn't configured — never block the UI
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true });
  }

  const { email, discipline, experience, location, dayRate, currentRate } =
    await request.json();

  if (!email || !dayRate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await getResend().emails.send({
      from:    "The Rate Guide <hello@therateguide.com>",
      to:      email,
      subject: `Your ${experience} ${discipline} rate: ${fmt(dayRate)}/day`,
      html:    buildEmail({ email, discipline, experience, location, dayRate, currentRate }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log in dev, fail silently in prod — email is best-effort
    if (process.env.NODE_ENV === "development") {
      console.error("[send-results]", err);
    }
    return NextResponse.json({ ok: true }); // still 200 — don't surface email errors to user
  }
}
