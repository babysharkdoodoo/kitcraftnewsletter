"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const PREFERENCE_LABELS: Record<string, string> = {
  "new-kits":      "New Kit Releases",
  "impact":        "Impact Stories",
  "delivery":      "Delivery Updates",
  "behind-scenes": "Behind the Scenes",
  "volunteer":     "Volunteer Opportunities",
  "fundraising":   "Fundraising & Campaigns",
}

function buildWelcomeEmail({
  firstName,
  preferences,
  unsubscribeUrl,
}: {
  firstName: string
  preferences: string[]
  unsubscribeUrl: string
}): string {
  const preferenceItems = preferences
    .map((p) => PREFERENCE_LABELS[p] ?? p)
    .map(
      (label) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
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
                  font-size: 14px; color: #374151; line-height: 1.5;
                ">${label}</td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join("")

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to KitCraft</title>
</head>
<body style="
  margin: 0; padding: 0;
  background-color: #f5f5f4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Welcome to the KitCraft newsletter! Here's what to expect.
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f4; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">

          <!-- HEADER -->
          <tr>
            <td style="
              background-color: #1e1b4b;
              border-radius: 16px 16px 0 0;
              padding: 36px 48px 32px;
            ">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
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

              <div style="margin-top: 32px;">
                <div style="
                  width: 28px; height: 2px; background-color: rgba(255,255,255,0.25);
                  border-radius: 2px; margin-bottom: 20px;
                "></div>
                <h1 style="
                  font-family: Georgia, 'Times New Roman', serif;
                  font-size: 36px; font-weight: bold; line-height: 1.1;
                  color: #ffffff; margin: 0; letter-spacing: -0.02em;
                ">Welcome,<br />${firstName}.</h1>
                <p style="
                  font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.60);
                  margin: 16px 0 0; max-width: 380px;
                ">You're officially in the loop. Here's what you can expect from us.</p>
              </div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="
              background-color: #ffffff;
              padding: 40px 48px;
            ">

              <p style="
                font-size: 10px; font-weight: 800; letter-spacing: 0.22em;
                text-transform: uppercase; color: #9ca3af;
                margin: 0 0 14px;
              ">You're subscribed to</p>

              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${preferenceItems}
              </table>

              <div style="border-top: 1px solid #f3f4f6; margin-top: 28px; margin-bottom: 28px;"></div>

              <p style="
                font-size: 10px; font-weight: 800; letter-spacing: 0.22em;
                text-transform: uppercase; color: #9ca3af;
                margin: 0 0 14px;
              ">What to expect</p>

              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 15px; font-weight: bold; color: #111827;
                      margin: 0 0 6px;
                    ">~2 emails per month</p>
                    <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.6;">
                      We only send when there's something real to say — a kit shipped, a story worth sharing, or a way you can help.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 15px; font-weight: bold; color: #111827;
                      margin: 0 0 6px;
                    ">Written by students</p>
                    <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.6;">
                      Every issue comes from a 9th-grader at West Shore Jr/Sr High who actually built or delivered the kit.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="
                      font-family: Georgia, 'Times New Roman', serif;
                      font-size: 15px; font-weight: bold; color: #111827;
                      margin: 0 0 6px;
                    ">No ads. Ever.</p>
                    <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.6;">
                      No sponsors, no affiliate links, no product promotions. Just updates on what we're building.
                    </p>
                  </td>
                </tr>
              </table>

              <div style="border-top: 1px solid #f3f4f6; margin-top: 28px; margin-bottom: 28px;"></div>

              <p style="
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 15px; font-weight: bold; color: #111827;
                margin: 0 0 12px;
              ">Your first issue is on the way</p>
              <p style="font-size: 13px; color: #6b7280; margin: 0; line-height: 1.6;">
                Expect something in your inbox within the next week or two. In the meantime, feel free to reply to this email if you have any questions — a real student will write back.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
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
                      You can change your preferences or unsubscribe anytime using the link in any email footer.
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

export async function sendWelcomeEmail({
  email,
  firstName,
  preferences,
  token,
}: {
  email: string
  firstName: string
  preferences: string[]
  token: string
}) {
  // Check if welcome emails are enabled
  const welcomeEmailsEnabled = process.env.SEND_WELCOME_EMAIL === "true"
  
  if (!welcomeEmailsEnabled) {
    console.log("[Welcome Email] Disabled via env variable")
    return { success: true, message: "Welcome emails disabled" }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${token}`

  try {
    console.log("[Welcome Email] Sending to:", email)
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: `Welcome to KitCraft, ${firstName}!`,
      html: buildWelcomeEmail({ firstName, preferences, unsubscribeUrl }),
    })
    console.log("[Welcome Email] Sent successfully:", result)
    return { success: true, message: "Welcome email sent" }
  } catch (error) {
    console.error("[Welcome Email] Error:", error)
    return { success: false, message: "Failed to send welcome email" }
  }
}
