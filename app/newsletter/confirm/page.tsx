"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

type Status = "loading" | "invalid" | "already" | "error" | "success"

const statusConfig = {
  loading: { icon: null, title: null, message: null, accent: null },
  success: {
    accent: "emerald",
    label: "Confirmed",
    title: "You're in the loop.",
    message: "Your subscription is live. Expect something worth reading — written by the students who built it.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="170" strokeDashoffset="170"
          style={{ animation: "draw 0.8s 0.2s ease-out forwards" }} />
        <path d="M17 28l8 8 14-16" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="40" strokeDashoffset="40"
          style={{ animation: "draw 0.4s 0.9s ease-out forwards" }} />
      </svg>
    ),
  },
  already: {
    accent: "sky",
    label: "Already active",
    title: "Already confirmed.",
    message: "Your email is verified and you're already subscribed. Nothing left to do here.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="170" strokeDashoffset="170"
          style={{ animation: "draw 0.8s 0.2s ease-out forwards" }} />
        <path d="M28 20v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeDasharray="20" strokeDashoffset="20"
          style={{ animation: "draw 0.3s 0.9s ease-out forwards" }} />
        <circle cx="28" cy="36" r="1.5" fill="currentColor"
          style={{ opacity: 0, animation: "appear 0.1s 1.15s forwards" }} />
      </svg>
    ),
  },
  invalid: {
    accent: "amber",
    label: "Link invalid",
    title: "Link not valid.",
    message: "This confirmation link is invalid or has expired. Try subscribing again from the newsletter page.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="170" strokeDashoffset="170"
          style={{ animation: "draw 0.8s 0.2s ease-out forwards" }} />
        <path d="M22 22l12 12M34 22l-12 12" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40" strokeDashoffset="40"
          style={{ animation: "draw 0.4s 0.9s ease-out forwards" }} />
      </svg>
    ),
  },
  error: {
    accent: "rose",
    label: "Error",
    title: "Something went wrong.",
    message: "We hit a snag on our end. Please try again in a moment.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12">
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="170" strokeDashoffset="170"
          style={{ animation: "draw 0.8s 0.2s ease-out forwards" }} />
        <path d="M22 22l12 12M34 22l-12 12" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40" strokeDashoffset="40"
          style={{ animation: "draw 0.4s 0.9s ease-out forwards" }} />
      </svg>
    ),
  },
} as const

const ACCENT_BLOB: Record<string, string> = {
  emerald: "rgba(52,211,153,0.09)",
  sky:     "rgba(56,189,248,0.09)",
  amber:   "rgba(217,119,6,0.09)",
  rose:    "rgba(251,113,133,0.09)",
}
const ACCENT_HEX: Record<string, string> = {
  emerald: "#34d399",
  sky:     "#38bdf8",
  amber:   "#d97706",
  rose:    "#fb7185",
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="font-mono min-h-screen flex items-center justify-center" style={{ backgroundColor: "#111118" }}>
        <div className="py-20 flex flex-col items-center gap-4">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(255,255,255,0.20)", animation: "spinSlow 3s linear infinite" }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="40" strokeDashoffset="15" />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-[0.32em]" style={{ color: "rgba(255,255,255,0.20)" }}>
            Loading
          </span>
        </div>
      </div>
    }>
      <ConfirmPageContent />
    </Suspense>
  )
}

function ConfirmPageContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<Status>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")
    console.log("[Confirm] Token:", token)
    
    if (!token) { 
      setStatus("invalid")
      return 
    }

    const confirmSubscription = async () => {
      const supabase = createClient()
      const { data: subscriber, error } = await supabase
        .from("newsletter_subscribers")
        .select("id, status, email")
        .eq("token", token)
        .single()

      console.log("[Confirm] Subscriber query result:", { subscriber, error })
      if (error || !subscriber) { 
        console.error("[Confirm] Error or no subscriber:", error)
        setStatus("invalid")
        return 
      }
      if (subscriber.status === "active") { 
        console.log("[Confirm] Already active")
        setStatus("already")
        return 
      }

      console.log("[Confirm] Updating subscriber to active")
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ status: "active", unsubscribed_at: null })
        .eq("id", subscriber.id)

      if (updateError) { 
        console.error("[Confirm] Update error:", updateError)
        setErrorMessage(updateError.message)
        setStatus("error")
        return 
      }
      console.log("[Confirm] Success!")
      setStatus("success")
    }

    confirmSubscription()
  }, [searchParams])

  useEffect(() => {
    if (status !== "loading") {
      const t = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(t)
    }
  }, [status])

  const config = status !== "loading" ? statusConfig[status] : null
  const accent = config && "accent" in config ? (config.accent as string) : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono    { font-family: 'DM Mono', 'Fira Code', monospace; }

        @keyframes draw   { to { stroke-dashoffset: 0; } }
        @keyframes appear { to { opacity: 1; } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes blobA { from{transform:translate(0,0) scale(1)} to{transform:translate(-30px,20px) scale(1.10)} }
        @keyframes blobB { from{transform:translate(0,0) scale(1)} to{transform:translate(25px,-18px) scale(1.07)} }
        @keyframes blobC { from{transform:translate(0,0) scale(1)} to{transform:translate(-18px,-22px) scale(1.12)} }
        @keyframes pulseRing {
          0%,100% { transform: scale(0.94); opacity: 0.55; }
          50%     { transform: scale(1.06); opacity: 0.25; }
        }

        .anim-spin { animation: spinSlow 3s linear infinite; }
        .anim-up-1 { animation: fadeUp .55s .05s ease-out both; }
        .anim-up-2 { animation: fadeUp .55s .18s ease-out both; }
        .anim-up-3 { animation: fadeUp .55s .30s ease-out both; }
        .anim-up-4 { animation: fadeUp .55s .44s ease-out both; }

        .back-link { color: rgba(255,255,255,0.28); transition: color .2s ease; }
        .back-link:hover { color: rgba(255,255,255,0.60); }
      `}</style>

      <div className="font-mono min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: "#111118" }}>

        {/* ── Blob glows — identical to the newsletter dark sections ── */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-32 -left-24 h-[560px] w-[560px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(109,40,217,0.55) 0%, transparent 65%)", filter: "blur(72px)", opacity: 0.15, animation: "blobA 18s ease-in-out infinite alternate" }} />
          <div className="absolute -right-16 top-0 h-[440px] w-[440px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(2,132,199,0.55) 0%, transparent 65%)", filter: "blur(60px)", opacity: 0.11, animation: "blobB 14s ease-in-out infinite alternate" }} />
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(217,119,6,0.40) 0%, transparent 65%)", filter: "blur(50px)", opacity: 0.07, animation: "blobC 22s ease-in-out infinite alternate" }} />
        </div>

        {/* ── Grid overlay ── */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* ── Status accent glow ── */}
        {accent && (
          <div className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: visible ? 1 : 0, background: `radial-gradient(ellipse 55% 45% at 50% 65%, ${ACCENT_BLOB[accent]} 0%, transparent 70%)` }} />
        )}

        {/* ── Corner rings ── */}
        <div className="absolute bottom-0 right-0 w-72 h-72 pointer-events-none opacity-[0.022]">
          <svg viewBox="0 0 256 256" fill="none">
            <circle cx="256" cy="256" r="200" stroke="white" strokeWidth="0.5" />
            <circle cx="256" cy="256" r="140" stroke="white" strokeWidth="0.5" />
            <circle cx="256" cy="256" r="80"  stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-56 h-56 pointer-events-none opacity-[0.022]">
          <svg viewBox="0 0 192 192" fill="none">
            <circle cx="0" cy="0" r="160" stroke="white" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="100" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* ── Main card ── */}
        <div className="relative z-10 w-full max-w-xs mx-6 text-center transition-all duration-700"
          style={{ opacity: (visible || status === "loading") ? 1 : 0, transform: (visible || status === "loading") ? "none" : "translateY(16px)" }}>

          {/* ── Loading ── */}
          {status === "loading" && (
            <div className="py-20 flex flex-col items-center gap-4">
              <svg className="w-5 h-5 anim-spin" viewBox="0 0 24 24" fill="none"
                style={{ color: "rgba(255,255,255,0.20)" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="40" strokeDashoffset="15" />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-[0.32em]" style={{ color: "rgba(255,255,255,0.20)" }}>
                Verifying
              </span>
            </div>
          )}

          {/* ── All other states ── */}
          {status !== "loading" && config && "title" in config && (
            <>
              {/* Rule label — matches newsletter RuleLabel */}
              <div className="flex items-center justify-center gap-3 mb-10 anim-up-1">
                <div className="h-px w-8"
                  style={{ backgroundColor: accent ? `${ACCENT_HEX[accent]}55` : "rgba(255,255,255,0.12)" }} />
                <span className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] whitespace-nowrap"
                  style={{ color: accent ? `${ACCENT_HEX[accent]}80` : "rgba(255,255,255,0.28)" }}>
                  {"label" in config ? config.label : ""}
                </span>
                <div className="h-px w-8"
                  style={{ backgroundColor: accent ? `${ACCENT_HEX[accent]}55` : "rgba(255,255,255,0.12)" }} />
              </div>

              {/* Icon + pulse ring */}
              <div className="relative inline-flex items-center justify-center mb-8 anim-up-1">
                <div className="absolute w-24 h-24 rounded-full"
                  style={{ backgroundColor: accent ? `${ACCENT_HEX[accent]}0d` : "rgba(255,255,255,0.03)", animation: "pulseRing 3s ease-in-out infinite" }} />
                <div style={{ color: accent ? ACCENT_HEX[accent] : "rgba(255,255,255,0.55)" }}>
                  {"icon" in config ? config.icon : null}
                </div>
              </div>

              {/* Title — Playfair Display, matches newsletter h2s */}
              <h1 className="font-display font-bold text-white mb-4 anim-up-2"
                style={{ fontSize: "clamp(1.75rem,5vw,2.1rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}>
                {"title" in config ? config.title : ""}
              </h1>

              {/* Message — DM Mono, muted */}
              <p className="font-mono text-[13px] leading-[1.85] mb-8 anim-up-3"
                style={{ color: "rgba(255,255,255,0.36)" }}>
                {"message" in config ? config.message : ""}
              </p>

              {/* Error detail */}
              {status === "error" && errorMessage && (
                <div className="text-left rounded-lg border mb-6 px-4 py-3 anim-up-3"
                  style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.025)" }}>
                  <p className="font-mono text-[11px] leading-relaxed break-all"
                    style={{ color: "rgba(255,255,255,0.22)" }}>
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="h-px mb-8 anim-up-3"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }} />

              {/* Back link — same mono style as newsletter nav */}
              <a href="/" className="back-link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] anim-up-4">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to home
              </a>
            </>
          )}
        </div>
      </div>
    </>
  )
}