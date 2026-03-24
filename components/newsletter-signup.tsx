"use client"

import { useState } from "react"
import { ArrowRight, Check, X } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────────────────
   PREFERENCE DATA
   Each pref carries an accent hex used for the active chip border/bg/text.
   These match the accent colours from the newsletter page category system.
───────────────────────────────────────────────────────────────────────── */
type Pref = {
  id: string
  label: string
  accent: string // hex
}

const PREFS: Pref[] = [
  { id: "new-kits", label: "Kit Releases", accent: "#6d28d9" },
  { id: "impact", label: "Impact Stories", accent: "#be185d" },
  { id: "delivery", label: "Delivery Updates", accent: "#0369a1" },
  { id: "behind-scenes", label: "Behind the Build", accent: "#b45309" },
  { id: "volunteer", label: "Volunteer Calls", accent: "#1d4ed8" },
  { id: "fundraising", label: "Fundraising", accent: "#c2410c" },
]

export function NewsletterSignup({ className }: { className?: string }) {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set(["new-kits", "impact"]))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; general?: string }>({})
  const [focused, setFocused] = useState<"name" | "email" | null>(null)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  const clearErr = (field: "name" | "email") =>
    setErrors((prev) => ({ ...prev, [field]: undefined }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (honeypot) {
      setIsSuccess(true)
      return
    }

    const errs: typeof errors = {}
    if (!firstName.trim()) errs.name = "First name is required."
    if (!email.trim()) errs.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address."

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.set("firstName", firstName.trim())
      fd.set("email", email.trim())
      fd.set("preferences", JSON.stringify(Array.from(selected)))
      fd.set("website", honeypot)

      const result = await subscribeToNewsletter(fd)

      if (result.success) {
        setIsSuccess(true)
      } else if (result.error === "VALIDATION_ERROR") {
        const m = result.message.toLowerCase()
        if (m.includes("email")) setErrors({ email: result.message })
        else if (m.includes("name")) setErrors({ name: result.message })
        else setErrors({ general: result.message })
      } else {
        setErrors({ general: result.message })
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedList = PREFS.filter((p) => selected.has(p.id))

  /* ── Shared input style ── */
  const inputBase = cn(
    "h-11 w-full px-4 text-[13.5px] outline-none transition-all duration-150",
    "font-mono rounded-lg border bg-transparent",
    "placeholder:text-black/35",
    "text-black"
  )

  /* ══════════════════════════════════════════════════════════════════════
     SUCCESS STATE
  ══════════════════════════════════════════════════════════════════════ */
  if (isSuccess) {
    return (
      <>
        <style>{`
          @keyframes kc-fadeup {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:none; }
          }
          @keyframes kc-scalein {
            from { opacity:0; transform:scale(0.8); }
            to   { opacity:1; transform:scale(1); }
          }
        `}</style>
        <div className={cn("w-full font-mono text-black", className)}>
          {/* Success icon */}
          <div
            className="mb-8 flex justify-center"
            style={{ animation: "kc-scalein .4s cubic-bezier(.22,1,.36,1) both" }}
          >
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: "rgba(217,119,6,0.08)",
                  border: "1px solid rgba(217,119,6,0.20)",
                }}
              />
              <Check className="h-6 w-6" style={{ color: "#d97706" }} />
            </div>
          </div>

          {/* Rule label */}
          <div
            className="mb-5 flex items-center gap-3"
            style={{ animation: "kc-fadeup .5s .06s ease-out both" }}
          >
            <div className="h-px w-8 bg-amber-500/60" />
            <span className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-amber-600/80">
              Subscribed
            </span>
          </div>

          {/* Heading */}
          <h3
            className="font-display mb-3 font-bold leading-[1.08] tracking-[-0.015em] text-black"
            style={{
              fontSize: "clamp(1.6rem,4vw,2rem)",
              animation: "kc-fadeup .5s .12s ease-out both",
            }}
          >
            You&apos;re in the loop,{" "}
            <span style={{ color: "#d97706" }}>{firstName || "friend"}.</span>
          </h3>

          <p
            className="font-mono mb-8 text-[13px] leading-[1.85]"
            style={{
              color: "rgba(0,0,0,0.62)",
              animation: "kc-fadeup .5s .20s ease-out both",
            }}
          >
            You&apos;ll hear from us about the things you asked for — nothing else.
            First email within a week.
          </p>

          {/* Divider */}
          <div
            className="mb-6 h-px"
            style={{
              background: "rgba(0,0,0,0.08)",
              animation: "kc-fadeup .5s .26s ease-out both",
            }}
          />

          {/* Selected prefs */}
          <div style={{ animation: "kc-fadeup .5s .32s ease-out both" }}>
            <p
              className="font-mono mb-3 text-[9px] font-bold uppercase tracking-[0.28em]"
              style={{ color: "rgba(0,0,0,0.45)" }}
            >
              Your interests
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedList.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-bold"
                  style={{
                    backgroundColor: `${p.accent}18`,
                    border: `1px solid ${p.accent}35`,
                    color: p.accent,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: p.accent }}
                  />
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Fine print */}
          <p
            className="font-mono mt-6 text-[11px]"
            style={{
              color: "rgba(0,0,0,0.42)",
              animation: "kc-fadeup .5s .40s ease-out both",
            }}
          >
            ~2 emails/month · Unsubscribe anytime
          </p>
        </div>
      </>
    )
  }

  /* ══════════════════════════════════════════════════════════════════════
     FORM STATE
  ══════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono    { font-family: 'DM Mono', 'Fira Code', monospace; }

        @keyframes kc-fadeup {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes kc-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className={cn("w-full font-mono text-black", className)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute -left-[9999px] opacity-0"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* ── Name + Email ── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* First name */}
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  clearErr("name")
                }}
                aria-label="First name"
                aria-invalid={!!errors.name}
                className={cn(inputBase)}
                style={{
                  borderColor: errors.name
                    ? "rgba(251,113,133,0.50)"
                    : focused === "name"
                      ? "rgba(217,119,6,0.50)"
                      : "rgba(0,0,0,0.10)",
                  boxShadow: errors.name
                    ? "0 0 0 3px rgba(251,113,133,0.08)"
                    : focused === "name"
                      ? "0 0 0 3px rgba(217,119,6,0.08)"
                      : "none",
                }}
              />
              {errors.name && (
                <p
                  role="alert"
                  className="flex items-center gap-1 font-mono text-[11px]"
                  style={{ color: "#fb7185" }}
                >
                  <X className="h-3 w-3 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearErr("email")
                }}
                aria-label="Email address"
                aria-invalid={!!errors.email}
                autoComplete="email"
                className={cn(inputBase)}
                style={{
                  borderColor: errors.email
                    ? "rgba(251,113,133,0.50)"
                    : focused === "email"
                      ? "rgba(217,119,6,0.50)"
                      : "rgba(0,0,0,0.10)",
                  boxShadow: errors.email
                    ? "0 0 0 3px rgba(251,113,133,0.08)"
                    : focused === "email"
                      ? "0 0 0 3px rgba(217,119,6,0.08)"
                      : "none",
                }}
              />
              {errors.email && (
                <p
                  role="alert"
                  className="flex items-center gap-1 font-mono text-[11px]"
                  style={{ color: "#fb7185" }}
                >
                  <X className="h-3 w-3 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* General error */}
          {errors.general && (
            <p
              role="alert"
              className="flex items-center gap-1.5 font-mono text-[12px]"
              style={{ color: "#fb7185" }}
            >
              <X className="h-3.5 w-3.5 shrink-0" />
              {errors.general}
            </p>
          )}

          {/* ── Preferences ── */}
          <div role="group" aria-label="Newsletter topic preferences">
            <p
              className="font-mono mb-3 text-[9px] font-bold uppercase tracking-[0.30em]"
              style={{ color: "rgba(0,0,0,0.45)" }}
            >
              I want to hear about
            </p>
            <div className="flex flex-wrap gap-2">
              {PREFS.map((p) => {
                const isOn = selected.has(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    aria-pressed={isOn}
                    aria-label={`${isOn ? "Deselect" : "Select"} ${p.label}`}
                    className="inline-flex select-none items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-bold transition-all duration-150 active:scale-[0.97]"
                    style={
                      isOn
                        ? {
                            backgroundColor: `${p.accent}18`,
                            border: `1px solid ${p.accent}40`,
                            color: p.accent,
                          }
                        : {
                            backgroundColor: "transparent",
                            border: "1px solid rgba(0,0,0,0.10)",
                            color: "rgba(0,0,0,0.45)",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isOn) {
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.22)"
                        ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.65)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isOn) {
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.10)"
                        ;(e.currentTarget as HTMLButtonElement).style.color = "rgba(0,0,0,0.45)"
                      }
                    }}
                  >
                    {isOn && (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: p.accent }}
                        aria-hidden="true"
                      />
                    )}
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg font-mono text-[12.5px] font-bold tracking-[0.03em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: "#d97706",
              padding: "13px 24px",
              boxShadow: "0 4px 20px rgba(217,119,6,0.30)",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "#b45309"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(217,119,6,0.40)"
              }
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "#d97706"
              ;(e.currentTarget as HTMLButtonElement).style.transform = "none"
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(217,119,6,0.30)"
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
                  style={{ animation: "kc-spin 1s linear infinite" }}
                  aria-hidden="true"
                />
                Subscribing…
              </>
            ) : (
              <>
                Subscribe free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>

          {/* Fine print */}
          <p className="text-center font-mono text-[11px]" style={{ color: "rgba(0,0,0,0.42)" }}>
            No spam · ~2 emails/month · Unsubscribe anytime
          </p>
        </form>
      </div>
    </>
  )
}