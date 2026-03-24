"use server"

import { createClient } from "@/lib/supabase/server"

export async function getSubscribers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  if (error) {
    console.error("Error fetching subscribers:", error)
    return []
  }

  return data || []
}

export async function exportSubscribers() {
  const subscribers = await getSubscribers()

  const headers = ["Email", "First Name", "Status", "Preferences", "Subscribed At", "Source"]
  const rows = subscribers.map((sub) => [
    sub.email,
    sub.first_name,
    sub.is_active ? "Active" : "Unsubscribed",
    sub.preferences?.join("; ") || "",
    new Date(sub.subscribed_at).toISOString(),
    sub.source || "",
  ])

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csv
}
