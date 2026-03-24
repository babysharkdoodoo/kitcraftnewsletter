"use client"

import { createClient } from "@/lib/supabase/client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Radio } from "lucide-react"

type Status = "loading" | "confirm" | "invalid" | "already" | "error" | "success"

/* ═══════════════════════════════════════════════════════════════════════
   STATUS CONFIG
═══════════════════════════════════════════════════════════════════════ */
const STATUS_META = {
  loading:  { label: null,                  ghost: null,            accent: null,      headline: null,                        sub: null,                   cta: null },
  confirm:  { label: "Confirm removal",      ghost: "UNSUBSCRIBE",   accent: "#b45309", headline: "Leave the loop?",           sub: null,                   cta: "confirm" },
  success:  { label: "Unsubscribed",         ghost: "GOODBYE",       accent: "#78716c", headline: "You've been removed.",       sub: "Your email has been unsubscribed. You won't receive any more newsletters from us. Sorry to see you go.",  cta: "done" },
  already:  { label: "Already unsubscribed", ghost: "INACTIVE",      accent: "#57534e", headline: "Already unsubscribed.",     sub: "This email is no longer active in our list. There's nothing left to do here.",                            cta: "done" },
  invalid:  { label: "Link invalid",         ghost: "INVALID",       accent: "#92400e", headline: "Link not valid.",           sub: "This unsubscribe link is invalid or has expired. Try unsubscribing again from the email we sent you.",     cta: "retry" },
  error:    { label: "Server error",         ghost: "ERROR",         accent: "#be185d", headline: "Something went wrong.",     sub: "We hit a snag on our end. Please wait a moment and try again.",                                          cta: "retry" },
} as const

/* ═══════════════════════════════════════════════════════════════════════
   GRAIN OVERLAY
═══════════════════════════════════════════════════════════════════════ */
function Grain() {
  return (
    <div className="grain-overlay" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
        <filter id="noise-u">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="300" height="300" filter="url(#noise-u)" opacity="1"/>
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   TICKER
═══════════════════════════════════════════════════════════════════════ */
const TICKER_ITEMS = [
  "Kit #847 delivered · Arnold Palmer Hospital",
  "9 student builders · West Shore Jr/Sr High",
  "400+ build hours this school year",
  "2 partner organizations in Brevard County",
  "Zero ads. Zero sponsors. Ever.",
  "~2 emails per month, written by students",
  "200+ kits planned for Brevard County",
  "Every kit is free to the recipient",
]
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="overflow-hidden py-3.5 border-b border-white/[0.07] bg-white/[0.018]">
      <div className="flex gap-0 whitespace-nowrap" style={{ animation: "tickerScroll 38s linear infinite" }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3 shrink-0 font-mono text-[10px] tracking-[0.14em] px-6 text-stone-600">
            <span className="text-amber-500/50">◆</span>{item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   STATUS ICON
═══════════════════════════════════════════════════════════════════════ */
function StatusIcon({ status, accent }: { status: Status; accent: string }) {
  if (status === "success" || status === "already") return (
    // Checkmark / confirmed removed
    <svg viewBox="0 0 64 64" fill="none" style={{ width:64, height:64, color:accent }}>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="0.75" opacity="0.2"/>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="188" strokeDashoffset="188"
        style={{ animation:"svgDraw 0.9s 0.2s ease-out forwards" }}/>
      <path d="M20 32l9 9 15-18" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="44" strokeDashoffset="44"
        style={{ animation:"svgDraw 0.5s 1.0s ease-out forwards" }}/>
    </svg>
  )
  if (status === "confirm") return (
    // Warning / question mark
    <svg viewBox="0 0 64 64" fill="none" style={{ width:64, height:64, color:accent }}>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="0.75" opacity="0.2"/>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="188" strokeDashoffset="188"
        style={{ animation:"svgDraw 0.9s 0.2s ease-out forwards" }}/>
      <path d="M32 20v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="24" strokeDashoffset="24"
        style={{ animation:"svgDraw 0.35s 1.0s ease-out forwards" }}/>
      <circle cx="32" cy="41" r="2" fill="currentColor"
        style={{ opacity:0, animation:"svgAppear 0.1s 1.3s ease-out forwards" }}/>
    </svg>
  )
  // X for invalid / error
  return (
    <svg viewBox="0 0 64 64" fill="none" style={{ width:64, height:64, color:accent }}>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="0.75" opacity="0.2"/>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="188" strokeDashoffset="188"
        style={{ animation:"svgDraw 0.9s 0.2s ease-out forwards" }}/>
      <path d="M22 22l20 20M42 22l-20 20" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="56" strokeDashoffset="56"
        style={{ animation:"svgDraw 0.5s 1.0s ease-out forwards" }}/>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function UnsubscribePage() {
  return (
    <Suspense fallback={<UnsubscribeShell status="loading" />}>
      <UnsubscribePageContent />
    </Suspense>
  )
}

function UnsubscribeShell({
  status,
  subscriber,
  onConfirm,
  unsubscribing,
  errorMessage,
}: {
  status: Status
  subscriber?: { email: string } | null
  onConfirm?: () => void
  unsubscribing?: boolean
  errorMessage?: string
}) {
  const meta = STATUS_META[status]
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])

  const r = (d = 0): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateY(20px)",
    transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${d}ms, transform .75s cubic-bezier(.22,1,.36,1) ${d}ms`,
  })

  const accentColor = meta.accent ?? "#b45309"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .font-display { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-feature-settings: "kern" 1, "liga" 1; }
        .font-mono    { font-family: 'DM Mono', 'Fira Code', 'Courier New', monospace; }

        .grain-overlay {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 2;
          opacity: 0.032;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .hero-lines {
          background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.013) 28px);
        }

        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes svgDraw      { to   { stroke-dashoffset: 0; } }
        @keyframes svgAppear    { to   { opacity: 1; } }
        @keyframes spinSlow     { to   { transform: rotate(360deg); } }
        @keyframes pulseRing    {
          0%,100% { transform: scale(0.92); opacity: 0.45; }
          50%      { transform: scale(1.08); opacity: 0.20; }
        }

        .spin { animation: spinSlow 3s linear infinite; }

        .btn-destructive {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #c2410c 0%, #9a3412 50%, #7c2d12 100%);
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 500; letter-spacing: 0.02em;
          padding: 14px 28px; border-radius: 100px;
          border: none; cursor: pointer; text-decoration: none;
          box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 24px rgba(154,52,18,0.40), 0 1px 4px rgba(0,0,0,0.2);
          transition: all .22s ease; position: relative; overflow: hidden;
        }
        .btn-destructive::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom, rgba(255,255,255,0.1), transparent); border-radius:inherit; }
        .btn-destructive:hover { background:linear-gradient(135deg,#dc2626 0%,#b91c1c 50%,#991b1b 100%); box-shadow:0 1px 0 rgba(255,255,255,0.14) inset,0 6px 32px rgba(185,28,28,0.45),0 2px 8px rgba(0,0,0,0.25); transform:translateY(-2px); }
        .btn-destructive:active { transform:scale(0.975); }
        .btn-destructive:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 500; letter-spacing: 0.02em;
          padding: 14px 28px; border-radius: 100px;
          border: none; cursor: pointer; text-decoration: none;
          box-shadow: 0 1px 0 rgba(255,255,255,0.18) inset, 0 4px 24px rgba(217,119,6,0.40), 0 1px 4px rgba(0,0,0,0.2);
          transition: all .22s ease; position: relative; overflow: hidden;
        }
        .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom, rgba(255,255,255,0.12), transparent); border-radius:inherit; }
        .btn-primary:hover { background:linear-gradient(135deg,#fbbf24 0%,#f59e0b 50%,#d97706 100%); box-shadow:0 1px 0 rgba(255,255,255,0.2) inset,0 6px 32px rgba(217,119,6,0.50),0 2px 8px rgba(0,0,0,0.25); transform:translateY(-2px); }
        .btn-primary:active { transform:scale(0.975); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background-color: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.45);
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 500; letter-spacing: 0.02em;
          padding: 13px 24px; border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.10);
          cursor: pointer; text-decoration: none;
          transition: all .22s ease; backdrop-filter: blur(4px);
        }
        .btn-ghost:hover { border-color:rgba(255,255,255,0.20); color:rgba(255,255,255,0.75); background-color:rgba(255,255,255,0.08); transform:translateY(-1px); }
        .btn-ghost:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111110; }
        ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(217,119,6,0.5); }
      `}</style>

      <main style={{ backgroundColor:"#111110", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <div className="relative overflow-hidden flex flex-col flex-1">
          <Grain />
          {/* Paper lines */}
          <div className="absolute inset-0 pointer-events-none hero-lines" style={{ zIndex:1 }} aria-hidden="true"/>

          {/* Accent spotlight */}
          {meta.accent && (
            <div className="absolute pointer-events-none" aria-hidden="true"
              style={{ top:"20%", left:"50%", transform:"translateX(-50%)", width:"70%", height:"55%",
                background:`radial-gradient(ellipse at 50% 50%, ${meta.accent}0d 0%, transparent 65%)`,
                zIndex:1, filter:"blur(50px)", transition:"background 0.8s ease" }}/>
          )}

          {/* ── Publication masthead ── */}
          <div className="relative z-10" style={{ opacity: mounted ? 1 : 0, transition:"opacity .5s ease 0ms" }}>

            {/* Top rule */}
            <div className="border-b border-white/[0.09] px-8 lg:px-16 py-2.5 flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/25 tracking-[0.22em] uppercase">{dateStr}</span>
              <div className="hidden sm:flex items-center gap-3">
                <span className="font-mono text-[9px] text-amber-500/40 tracking-[0.22em] uppercase">Vol. I</span>
                <span className="text-white/10">·</span>
                <span className="font-mono text-[9px] text-white/25 tracking-[0.22em] uppercase">Issue No. 14</span>
              </div>
            </div>

            {/* Masthead */}
            <div className="border-b-2 border-white/[0.09] px-8 lg:px-16 py-7 text-center relative">
              <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background:"linear-gradient(to bottom, transparent, rgba(217,119,6,0.6), transparent)" }}/>
              <div className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-start gap-1.5">
                <span className="font-mono text-[8px] text-white/20 tracking-[0.26em] uppercase">Melbourne · FL</span>
                <span className="font-mono text-[8px] text-white/20 tracking-[0.26em] uppercase">Est. 2024</span>
              </div>
              <Link href="/" className="inline-block">
                <h1 className="font-display font-black text-white tracking-[-0.03em] leading-none hover:opacity-80 transition-opacity"
                  style={{ fontSize:"clamp(2.2rem,6vw,4.2rem)", textShadow:"0 0 120px rgba(217,119,6,0.25), 0 0 40px rgba(217,119,6,0.1)" }}>
                  KitCraft
                  <span className="text-amber-400 mx-3 opacity-70">·</span>
                  The Newsletter
                </h1>
              </Link>
              <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-1.5">
                <span className="font-mono text-[8px] text-white/20 tracking-[0.26em] uppercase">Student-made</span>
                <span className="font-mono text-[8px] text-white/20 tracking-[0.26em] uppercase">Free always</span>
              </div>
            </div>

            {/* Column headers */}
            <div className="border-b border-white/[0.07] px-8 lg:px-16 py-2 hidden lg:flex items-center gap-0">
              {["Impact Stories","Kit Releases","Delivery Updates","Behind the Scenes","Volunteer Calls","Fundraising"].map((col, i) => (
                <span key={i} className={`flex-1 font-mono text-[8px] text-center tracking-[0.2em] uppercase ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
                  style={{ color:"rgba(255,255,255,0.22)" }}>
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Ticker */}
          <div className="relative z-10">
            <Ticker />
          </div>

          {/* ── Body ── */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-20 lg:py-28">

            {/* Ghost watermark */}
            {meta.ghost && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none" aria-hidden="true">
                <div className="font-display font-black text-white/[0.022] leading-none tracking-[-0.05em]"
                  style={{ fontSize:"clamp(6rem,18vw,16rem)", opacity: mounted ? 1 : 0, transition:"opacity 1.2s ease 0.4s" }}>
                  {meta.ghost}
                </div>
              </div>
            )}

            {/* Loading spinner */}
            {status === "loading" && (
              <div className="flex flex-col items-center gap-5">
                <svg className="spin" viewBox="0 0 28 28" fill="none" style={{ width:28, height:28, color:"rgba(255,255,255,0.22)" }}>
                  <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="48" strokeDashoffset="18"/>
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-white/22">Verifying</span>
              </div>
            )}

            {/* Status content */}
            {status !== "loading" && meta.label && (
              <div className="w-full max-w-lg mx-auto text-center flex flex-col items-center">

                {/* Section label */}
                <div className="flex items-center gap-3 mb-12" style={r(0)}>
                  <div className="h-px w-12" style={{ background:`linear-gradient(to right, transparent, ${accentColor}55)` }}/>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }}/>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.38em] whitespace-nowrap"
                    style={{ color:`${accentColor}99` }}>
                    {meta.label}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }}/>
                  <div className="h-px w-12" style={{ background:`linear-gradient(to left, transparent, ${accentColor}55)` }}/>
                </div>

                {/* Icon with pulse ring */}
                <div className="relative flex items-center justify-center mb-10" style={r(60)}>
                  <div className="absolute w-32 h-32 rounded-full"
                    style={{ backgroundColor:`${accentColor}0a`, animation:"pulseRing 3.5s ease-in-out infinite",
                      border:`1px solid ${accentColor}18` }}/>
                  <div className="absolute w-20 h-20 rounded-full"
                    style={{ backgroundColor:`${accentColor}08`, border:`1px solid ${accentColor}22` }}/>
                  <StatusIcon status={status} accent={accentColor}/>
                </div>

                {/* Headline */}
                <h2 className="font-display font-black text-white leading-[0.95] tracking-[-0.03em] mb-5"
                  style={{ fontSize:"clamp(2.4rem,6vw,4rem)", ...r(120) }}>
                  {meta.headline}
                </h2>

                {/* Ruled break */}
                <div className="flex items-center gap-4 mb-6 w-full max-w-xs" style={r(180)}>
                  <div className="h-px flex-1" style={{ background:`linear-gradient(to right, ${accentColor}50, ${accentColor}18, transparent)` }}/>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor:`${accentColor}50` }}/>
                  <div className="h-px flex-1" style={{ background:`linear-gradient(to left, ${accentColor}50, ${accentColor}18, transparent)` }}/>
                </div>

                {/* Confirm-state body — email + explanation */}
                {status === "confirm" && subscriber && (
                  <div style={r(220)} className="w-full max-w-sm mb-8">
                    <p className="font-mono text-[14px] leading-[1.9] text-stone-500 mb-5">
                      You're about to remove this address from our newsletter:
                    </p>
                    {/* Email pill */}
                    <div className="flex items-center justify-center gap-2.5 mb-6">
                      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border"
                        style={{ borderColor:`${accentColor}30`, backgroundColor:`${accentColor}0a` }}>
                        <Mail style={{ width:13, height:13, color:accentColor, opacity:0.7 }}/>
                        <span className="font-mono text-[13px] tracking-wide" style={{ color:`${accentColor}cc` }}>
                          {subscriber.email}
                        </span>
                      </div>
                    </div>
                    <p className="font-mono text-[11px] leading-[1.8] text-stone-600">
                      You won't receive any more emails from us. This action cannot be undone from this link.
                    </p>
                  </div>
                )}

                {/* Non-confirm message */}
                {status !== "confirm" && meta.sub && (
                  <p className="font-mono text-[14px] leading-[1.9] text-stone-500 mb-3 max-w-sm" style={r(220)}>
                    {meta.sub}
                  </p>
                )}

                {/* Error detail */}
                {status === "error" && errorMessage && (
                  <div className="text-left rounded-xl border border-white/[0.06] bg-white/[0.025] px-5 py-4 mb-8 mt-3 w-full" style={r(260)}>
                    <p className="font-mono text-[11px] leading-relaxed break-all text-white/22">{errorMessage}</p>
                  </div>
                )}

                {/* Location byline */}
                <div className="flex items-center gap-2 mt-3 mb-10" style={r(260)}>
                  <Radio className="h-2.5 w-2.5 text-amber-400/60 animate-pulse" style={{ width:10, height:10 }}/>
                  <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.22em]">Melbourne, FL · West Shore Jr/Sr High</span>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-2" style={r(320)}>
                  {status === "confirm" && (
                    <>
                      <button
                        className="btn-destructive"
                        onClick={onConfirm}
                        disabled={unsubscribing}
                      >
                        {unsubscribing ? (
                          <>
                            <svg className="spin" viewBox="0 0 16 16" fill="none" style={{ width:14, height:14 }}>
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="24" strokeDashoffset="8"/>
                            </svg>
                            Removing…
                          </>
                        ) : (
                          "Yes, unsubscribe me"
                        )}
                      </button>
                      <Link href="/" className="btn-ghost">
                        <ArrowLeft style={{ width:14, height:14 }}/> Keep me subscribed
                      </Link>
                    </>
                  )}
                  {(status === "success" || status === "already") && (
                    <>
                      <Link href="/" className="btn-ghost">
                        <ArrowLeft style={{ width:14, height:14 }}/> Back to home
                      </Link>
                      <Link href="/#signup" className="btn-primary">
                        <Mail style={{ width:14, height:14 }}/> Subscribe again
                      </Link>
                    </>
                  )}
                  {(status === "invalid" || status === "error") && (
                    <>
                      <Link href="/#signup" className="btn-primary">
                        <Mail style={{ width:14, height:14 }}/> Go to newsletter
                      </Link>
                      <Link href="/" className="btn-ghost">
                        <ArrowLeft style={{ width:14, height:14 }}/> Back to home
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer rule ── */}
          <div className="relative z-10 border-t border-white/[0.07] px-8 lg:px-16 py-4 flex items-center justify-between"
            style={{ opacity: mounted ? 1 : 0, transition:"opacity .8s ease 0.8s" }}>
            <span className="font-mono text-[8.5px] text-white/18 uppercase tracking-[0.22em]">KitCraft Newsletter · Melbourne, FL · Est. 2024</span>
            <div className="hidden sm:flex items-center gap-3">
              <span className="font-mono text-[8.5px] text-white/18 uppercase tracking-[0.22em]">Student-built · Zero ads · Free always</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE CONTENT — data + state logic
═══════════════════════════════════════════════════════════════════════ */
function UnsubscribePageContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<Status>("loading")
  const [subscriber, setSubscriber] = useState<{ id: string; email: string } | null>(null)
  const [unsubscribing, setUnsubscribing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) { setStatus("invalid"); return }

    const loadSubscriber = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("id, status, email, token")
        .eq("token", token)
        .single()

      if (error || !data) { setStatus("invalid"); return }
      if (data.status !== "active") { setStatus("already"); return }

      setSubscriber({ id: data.id, email: data.email })
      setStatus("confirm")
    }

    loadSubscriber()
  }, [searchParams])

  async function handleUnsubscribe() {
    if (!subscriber) return
    setUnsubscribing(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
      .eq("id", subscriber.id)

    if (error) {
      setErrorMessage(error.message)
      setStatus("error")
    } else {
      setStatus("success")
    }
    setUnsubscribing(false)
  }

  return (
    <UnsubscribeShell
      status={status}
      subscriber={subscriber}
      onConfirm={handleUnsubscribe}
      unsubscribing={unsubscribing}
      errorMessage={errorMessage}
    />
  )
}