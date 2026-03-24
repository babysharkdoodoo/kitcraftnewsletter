"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; success?: string }>
}) {
  const [token, setToken] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [subscriber, setSubscriber] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [unsubscribing, setUnsubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    searchParams.then((params) => {
      const t = params.token
      const s = params.success
      
      if (s === "true") {
        setSuccess(true)
        setLoading(false)
        return
      }
      
      setToken(t || null)
      if (t) {
        loadSubscriber(t)
      } else {
        setLoading(false)
      }
    })
  }, [])

  async function loadSubscriber(token: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, status, email, first_name")
      .eq("token", token)
      .single()

    if (error || !data) {
      setError("invalid")
    } else if (data.status !== "active") {
      setError("already")
    } else {
      setSubscriber(data)
    }
    setLoading(false)
  }

  async function handleUnsubscribe() {
    if (!token || !subscriber) return

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
      setError("failed")
      setUnsubscribing(false)
    } else {
      // Show success directly instead of redirecting
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
