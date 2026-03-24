"use server"

import { createClient } from "@/lib/supabase/server"

export async function getTemplates() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("newsletter_templates")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching templates:", error)
    return []
  }

  return data || []
}

export async function saveTemplate(template: {
  id?: string
  name: string
  subject: string
  html_content: string
}) {
  const supabase = await createClient()

  if (template.id) {
    // Update existing
    const { error } = await supabase
      .from("newsletter_templates")
      .update({
        name: template.name,
        subject: template.subject,
        html_content: template.html_content,
      })
      .eq("id", template.id)

    if (error) {
      console.error("Error updating template:", error)
      return { success: false }
    }
  } else {
    // Create new
    const { error } = await supabase.from("newsletter_templates").insert({
      name: template.name,
      subject: template.subject,
      html_content: template.html_content,
    })

    if (error) {
      console.error("Error creating template:", error)
      return { success: false }
    }
  }

  return { success: true }
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("newsletter_templates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting template:", error)
    return { success: false }
  }

  return { success: true }
}
