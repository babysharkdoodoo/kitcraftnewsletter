"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const BATCH_SIZE = 100 // Resend allows up to 100 emails per batch

export async function sendNewsletter(formData: FormData) {
  const subject = formData.get("subject") as string
  const htmlContent = formData.get("htmlContent") as string

  if (!subject || !htmlContent) {
    return { success: false, message: "Subject and content are required" }
  }

  const supabase = await createClient()

  // Get all active subscribers
  const { data: subscribers, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, first_name, token")
    .eq("status", "active")

  if (error || !subscribers || subscribers.length === 0) {
    return { success: false, message: "No active subscribers found" }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  let successCount = 0
  let failCount = 0

  // Split subscribers into batches
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)
    
    const emailBatch = batch.map((subscriber) => {
      const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?token=${subscriber.token}`
      
      const emailHtml = `
        ${htmlContent}
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #666; text-align: center;">
          <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe</a>
        </p>
      `

      return {
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: subscriber.email,
        subject: subject,
        html: emailHtml,
      }
    })

    try {
      await resend.batch.send(emailBatch)
      successCount += batch.length
    } catch (error) {
      console.error(`Failed to send batch ${i / BATCH_SIZE + 1}:`, error)
      failCount += batch.length
    }
  }

  return {
    success: true,
    message: `Newsletter sent! ✓ ${successCount} sent, ${failCount > 0 ? `✗ ${failCount} failed` : "0 failed"}`,
  }
}
