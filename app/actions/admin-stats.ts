"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAdminStats() {
  const supabase = await createClient()

  // Total and active subscribers
  const { count: totalSubscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })

  const { count: activeSubscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Weekly growth
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { count: weeklyGrowth } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .gte("subscribed_at", oneWeekAgo.toISOString())

  // Total campaigns
  const { count: totalCampaigns } = await supabase
    .from("newsletter_campaigns")
    .select("*", { count: "exact", head: true })

  // Average open rate
  const { data: campaigns } = await supabase
    .from("newsletter_campaigns")
    .select("sent_count, total_opens")
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  let avgOpenRate = 0
  if (campaigns && campaigns.length > 0) {
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0)
    const totalOpens = campaigns.reduce((sum, c) => sum + (c.total_opens || 0), 0)
    avgOpenRate = totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0
  }

  // Preference breakdown
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("preferences")
    .eq("status", "active")

  const preferenceCounts: Record<string, number> = {}
  subscribers?.forEach((sub) => {
    sub.preferences?.forEach((pref: string) => {
      preferenceCounts[pref] = (preferenceCounts[pref] || 0) + 1
    })
  })

  const preferenceBreakdown = Object.entries(preferenceCounts)
    .map(([preference, count]) => ({
      preference,
      count,
      percentage: activeSubscribers ? Math.round((count / activeSubscribers) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalSubscribers: totalSubscribers || 0,
    activeSubscribers: activeSubscribers || 0,
    weeklyGrowth: weeklyGrowth || 0,
    totalCampaigns: totalCampaigns || 0,
    avgOpenRate,
    preferenceBreakdown,
  }
}
