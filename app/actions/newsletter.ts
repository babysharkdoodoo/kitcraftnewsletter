"use server"

import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export type NewsletterResponse = {
  success: boolean
  message: string
  error?: string
}

/* ─────────────────────────────────────────────────────────────────────
   EMAIL TEMPLATES
   All styles must be inline — email clients strip <style> blocks.
───────────────────────────────────────────────────────────────────── */

const PREFERENCE_LABELS: Record<string, string> = {
  "new-kits":      "New Kit Releases",
  "impact":        "Impact Stories",
  "delivery":      "Delivery Updates",
  "behind-scenes": "Behind the Scenes",
  "volunteer":     "Volunteer Opportunities",
  "fundraising":   "Fundraising & Campaigns",
}

function buildConfirmationEmail({
  firstName,
  confirmUrl,
  unsubscribeUrl,
  preferences,
  isReturning = false,
}: {
  firstName: string
  confirmUrl: string
  unsubscribeUrl: string
  preferences: string[]
  isReturning?: boolean
}): string {
  const preferenceItems = preferences
    .map((p) => PREFERENCE_LABELS[p] ?? p)
    .map(
      (label) => `
        <tr>
          <td style="padding: 6px 0; border-bottom: 1px solid #f0f0f0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="20" style="vertical-align: middle; padding-right: 10px;">
                  <div style="
                    width: 6px; height: 6px; border-radius: 50%;
                    background-color: #4f46e5; margin-top: 1px;
                  "></div>
                </td>
                <td style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 13px; color: #374151; line-height: 1.5;
                ">${label}</td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join("")

  const headlineText = isReturning
    ? `Welcome back,<br />${firstName}.`
    : `One step left,<br />${firstName}.`

  const bodyText = isReturning
    ? `Good to have you back. Confirm your email below and you'll start receiving updates based on the topics you selected.`
    : `Thanks for signing up for the KitCraft newsletter. Tap the button below to confirm your email address and activate your subscription.`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Confirm your subscription — KitCraft</title>
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #f5f5f4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${isReturning ? `Welcome back! Confirm your email to reactivate your KitCraft subscription.` : `Confirm your email to start receiving KitCraft updates.`}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f4; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="
              background-color: #1e1b4b;
              border-radius: 16px 16px 0 0;
              padding: 36px 48px 32px;
            ">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <!-- Wordmark -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="
                          background-color: rgba(255,255,255,0.10);
                          border: 1px solid rgba(255,255,255,0.15);
                          border-radius: 8px;
                          padding: 8px 14px;
                        ">
                          <span style="
                            font-family: Georgia, 'Times New Roman', serif;
                            font-size: 14px; font-weight: bold;
                            color: #ffffff; letter-spacing: -0.01em;
                          ">KitCraft</span>
                          <span style="
                            font-size: 11px; color: rgba(255,255,255,0.45);
                            margin-left: 6px; letter-spacing: 0.02em;
                          ">Collective</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="
                      font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
                      text-transform: uppercase; color: rgba(255,255,255,0.35);
                    ">Newsletter</span>
                  </td>
                </tr>
              </table>

              <!-- Headline -->
              <div style="margin-top: 32px;">
                <div style="
                  width: 28px; height: 2px; background-color: rgba(255,255,255,0.25);
                  border-radius: 2px; margin-bottom: 20px;
                "></div>
                <h1 style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 36px; font-weight: bold; line-height: 1.1;
                  color: #ffffff; margin: 0; letter-spacing: -0.02em;
                ">${headlineText}</h1>
                <p style="
                  font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.60);
                  margin: 16px 0 0; max-width: 380px;
                ">${bodyText}</p>
              </div>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="
              background-color: #ffffff;
              padding: 40px 48px;
            ">

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 36px;">
                    <a href="${confirmUrl}" style="
                      display: inline-block;
                      background-color: #4f46e5;
                      color: #ffffff;
                      font-size: 14px; font-weight: 700;
                      text-decoration: none;
                      padding: 15px 36px;
                      border-radius: 100px;
                      letter-spacing: 0.01em;
                      box-shadow: 0 4px 14px rgba(79,70,229,0.35);
                    ">Confirm my subscription →</a>
                    <p style="
                      margin: 14px 0 0;
                      font-size: 11px; color: #9ca3af;
                      line-height: 1.5;
                    ">Button not working? <a href="${confirmUrl}" style="color: #6366f1; text-decoration: underline; word-break: break-all;">${confirmUrl}</a></p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="border-top: 1px solid #f3f4f6; margin-bottom: 28px;"></div>

              <!-- Selected topics -->
              <p style="
                font-size: 10px; font-weight: 800; letter-spacing: 0.22em;
                text-transform: uppercase; color: #9ca3af;
                margin: 0 0 14px;
              ">You subscribed to</p>

              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${preferenceItems}
              </table>

              <!-- Divider -->
              <div style="border-top: 1px solid #f3f4f6; margin-top: 28px; margin-bottom: 28px;"></div>

              <!-- What to expect -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-right: 20px; vertical-align: top; width: 50%;">
                    <p style="
                      font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
                      text-transform: uppercase; color: #9ca3af;
                      margin: 0 0 6px;
                    ">Frequency</p>
                    <p style="
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 15px; font-weight: bold; color: #111827;
                      margin: 0;
                    ">~2 emails/month</p>
                    <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0; line-height: 1.5;">
                      We only send when there's something real to say.
                    </p>
                  </td>
                  <td style="vertical-align: top; width: 50%;">
                    <p style="
                      font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
                      text-transform: uppercase; color: #9ca3af;
                      margin: 0 0 6px;
                    ">Written by</p>
                    <p style="
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 15px; font-weight: bold; color: #111827;
                      margin: 0;
                    ">9th-grade students</p>
                    <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0; line-height: 1.5;">
                      West Shore Jr/Sr High · Melbourne, FL
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="
              background-color: #fafaf9;
              border-top: 1px solid #e7e5e4;
              border-radius: 0 0 16px 16px;
              padding: 24px 48px;
            ">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="font-size: 11px; color: #a8a29e; margin: 0; line-height: 1.6;">
                      You're receiving this because someone entered this address at
                      <a href="https://kitcraftcollective.org" style="color: #6366f1; text-decoration: none;">kitcraftcollective.org</a>.
                      If that wasn't you, no action is needed — this link expires in 48 hours.
                    </p>
                    <p style="font-size: 11px; color: #a8a29e; margin: 10px 0 0; line-height: 1.6;">
                      KitCraft Collective · West Shore Jr/Sr High · Melbourne, FL 32901
                      &nbsp;·&nbsp;
                      <a href="${unsubscribeUrl}" style="color: #a8a29e; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/* ─────────────────────────────────────────────────────────────────────
   SERVER ACTION
───────────────────────────────────────────────────────────────────── */

export async function subscribeToNewsletter(formData: FormData): Promise<NewsletterResponse> {
  const honeypot = formData.get("website")
  if (honeypot) {
    return { success: true, message: "Thanks for subscribing!" }
  }

  const firstName = formData.get("firstName") as string
  const email = formData.get("email") as string
  const preferencesRaw = formData.get("preferences") as string

  if (!firstName || !firstName.trim()) {
    return { success: false, message: "First name is required", error: "VALIDATION_ERROR" }
  }

  if (!email || !email.trim()) {
    return { success: false, message: "Email is required", error: "VALIDATION_ERROR" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address", error: "VALIDATION_ERROR" }
  }

  let preferences: string[] = []
  try {
    preferences = JSON.parse(preferencesRaw || "[]")
  } catch {
    preferences = []
  }

  if (preferences.length === 0) {
    return { success: false, message: "Please select at least one preference", error: "VALIDATION_ERROR" }
  }

  const token = crypto.randomBytes(32).toString("hex")
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const confirmUrl = `${baseUrl}/newsletter/confirm?token=${token}`
  const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${token}`

  const supabase = await createClient()

  const { data: existingSubscriber } = await supabase
    .from("newsletter_subscribers")
    .select("id, is_active")
    .eq("email", email.toLowerCase().trim())
    .single()

  if (existingSubscriber) {
    if (existingSubscriber.is_active) {
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ first_name: firstName.trim(), preferences })
        .eq("id", existingSubscriber.id)

      if (updateError) {
        console.error("[newsletter] Error updating subscriber:", updateError)
        return { success: false, message: "Something went wrong. Please try again.", error: "DATABASE_ERROR" }
      }

      return { success: true, message: "Your preferences have been updated!" }
    } else {
      const { error: reactivateError } = await supabase
        .from("newsletter_subscribers")
        .update({ first_name: firstName.trim(), preferences, is_active: false, token })
        .eq("id", existingSubscriber.id)

      if (reactivateError) {
        console.error("[newsletter] Error reactivating subscriber:", reactivateError)
        return { success: false, message: "Something went wrong. Please try again.", error: "DATABASE_ERROR" }
      }

      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: email.toLowerCase().trim(),
          subject: `Welcome back, ${firstName} — confirm your subscription`,
          html: buildConfirmationEmail({ firstName, confirmUrl, unsubscribeUrl, preferences, isReturning: true }),
        })
      } catch (emailError) {
        console.error("[newsletter] Error sending resubscribe confirmation:", emailError)
      }

      return { success: true, message: "Welcome back! Please check your email to confirm." }
    }
  }

  const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
    first_name: firstName.trim(),
    email: email.toLowerCase().trim(),
    preferences,
    is_active: false,
    source: "website",
    token,
  })

  if (insertError) {
    console.error("[newsletter] Error inserting subscriber:", insertError)
    return { success: false, message: "Something went wrong. Please try again.", error: "DATABASE_ERROR" }
  }

  console.log("[newsletter] Attempting to send email to:", email.toLowerCase().trim())
  console.log("[newsletter] Resend API Key exists:", !!process.env.RESEND_API_KEY)
  console.log("[newsletter] Confirmation URL:", confirmUrl)

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email.toLowerCase().trim(),
      subject: `Confirm your KitCraft subscription, ${firstName}`,
      html: buildConfirmationEmail({ firstName, confirmUrl, unsubscribeUrl, preferences }),
    })
    console.log("[newsletter] Email sent successfully:", result)
  } catch (emailError) {
    console.error("[newsletter] Error sending confirmation email:", emailError)
  }

  return { success: true, message: "Please check your email to confirm your subscription!" }
}