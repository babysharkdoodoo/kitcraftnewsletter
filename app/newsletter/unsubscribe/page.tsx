"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    }>
      <UnsubscribePageContent />
    </Suspense>
  )
}

function UnsubscribePageContent() {
  const searchParams = useSearchParams()
  const [subscriber, setSubscriber] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [unsubscribing, setUnsubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get("token")
    const successParam = searchParams.get("success")
    
    console.log("[Unsubscribe] Token:", token)
    console.log("[Unsubscribe] Success param:", successParam)
    
    if (successParam === "true") {
      setSuccess(true)
      setLoading(false)
      return
    }
    
    if (token) {
      loadSubscriber(token)
    } else {
      console.error("[Unsubscribe] No token found")
      setError("invalid")
      setLoading(false)
    }
  }, [searchParams])

  async function loadSubscriber(token: string) {
    console.log("[Unsubscribe] Loading subscriber for token:", token)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, status, email, first_name, token")
      .eq("token", token)
      .single()

    console.log("[Unsubscribe] Database response:", { data, error })

    if (error || !data) {
      console.error("[Unsubscribe] Error or no subscriber:", error)
      setError("invalid")
    } else if (data.status !== "active") {
      console.log("[Unsubscribe] Subscriber not active, status:", data.status)
      setError("already")
    } else {
      console.log("[Unsubscribe] Subscriber loaded:", data)
      setSubscriber(data)
    }
    setLoading(false)
  }

  async function handleUnsubscribe() {
    if (!subscriber) return

    console.log("[Unsubscribe] Unsubscribing subscriber:", subscriber.id)
    setUnsubscribing(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id)

    if (error) {
      console.error("[Unsubscribe] Update error:", error)
      setError("failed")
      setUnsubscribing(false)
    } else {
      console.log("[Unsubscribe] Success!")
      setSuccess(true)
      setUnsubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Success state (after unsubscribe)
  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">✓ Unsubscribed</h1>
        <p>You've been successfully unsubscribed from our newsletter.</p>
        <p className="text-sm text-gray-500 mt-4">Sorry to see you go!</p>
      </div>
    )
  }

  if (error === "invalid") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
        <p>This unsubscribe link is invalid or has expired.</p>
      </div>
    )
  }

  if (error === "already") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Already Unsubscribed</h1>
        <p>You've already been unsubscribed from our newsletter.</p>
      </div>
    )
  }

  if (error === "failed") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>Something went wrong. Please try again later.</p>
      </div>
    )
  }

  // Confirmation screen
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      <h1 className="text-2xl font-bold mb-4">Unsubscribe from Newsletter</h1>
      <p className="mb-6">
        Are you sure you want to unsubscribe <strong>{subscriber?.email}</strong> from our newsletter?
      </p>
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={unsubscribing}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleUnsubscribe}
          disabled={unsubscribing}
        >
          {unsubscribing ? "Unsubscribing..." : "Yes, Unsubscribe"}
        </Button>
      </div>
    </div>
  )
}
