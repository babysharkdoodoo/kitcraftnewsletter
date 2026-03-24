"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import Link from "next/link"
import {
  ArrowRight, BookOpen, Heart, Sparkles, Star, Package,
  Truck, Users, Award, MessageCircle, Layers,
  MapPin, Mail, ChevronDown, Eye, Check,
  Hammer, Search, Plus, Minus, ArrowUpRight, Radio,
} from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"

/* ═══════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.05) {
  const ref = useRef<HTMLElement | null>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold })
    io.observe(el); return () => io.disconnect()
  }, [threshold])
  return { ref, on }
}

function useCountUp(target: number, dur = 1800, go = true) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!go) return
    let raf: number, t0: number | null = null
    const tick = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / dur, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [target, dur, go])
  return v
}

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:"new-kits",      icon:Package,   label:"New Kit Releases",       tagline:"First look, every time.",          desc:"Every time we finish designing a new kit — the CAD decisions, what failed during testing, what inspired the concept, and which kids it's going to.", freq:"Every launch", accent:"#7c3aed", bg:"#f5f3ff" },
  { id:"impact",        icon:Heart,     label:"Impact Stories",          tagline:"The moments that matter.",          desc:"Real stories from the kids, parents, and staff at our partner organizations. Written from memory, not press releases.",                            freq:"Monthly",      accent:"#be185d", bg:"#fdf2f8" },
  { id:"delivery",      icon:Truck,     label:"Delivery Updates",        tagline:"Where they went and who got them.", desc:"When kits go out — how many, which organizations received them, what the delivery looked like, and the students who showed up.",                   freq:"Per delivery", accent:"#0369a1", bg:"#f0f9ff" },
  { id:"behind-scenes", icon:BookOpen,  label:"Behind the Scenes",       tagline:"The real process, unfiltered.",     desc:"What the student team is designing, printing, and learning. The failures at 2am, the breakthroughs, and everything between.",                      freq:"Monthly",      accent:"#92400e", bg:"#fffbeb" },
  { id:"volunteer",     icon:Users,     label:"Volunteer Opportunities", tagline:"First notice when we need hands.",  desc:"When we need extra help — assembly days, delivery runs, community events. Subscribers get the call before we post it anywhere.",                   freq:"As needed",    accent:"#1e40af", bg:"#eff6ff" },
  { id:"fundraising",   icon:Sparkles,  label:"Fundraising & Campaigns", tagline:"Every dollar goes to a kit.",       desc:"Donation drives, matching campaigns, and giving opportunities. We explain exactly what the money builds before we ask for it.",                     freq:"Per campaign", accent:"#9a3412", bg:"#fff7ed" },
]

const STATS = [
  { value:200,  suffix:"+", label:"Kits planned",          sub:"across Brevard County"     },
  { value:2,    suffix:"+", label:"Partner organizations",  sub:"verified schools & centers" },
  { value:9,    suffix:"",  label:"Student builders",       sub:"West Shore Jr/Sr High"     },
  { value:400,  suffix:"+", label:"Build hours logged",     sub:"this school year"          },
]

const STORIES = [
  { issue:"14", date:"Mar 2025", title:"The kit that made a 6-year-old want to be an engineer", excerpt:"Maya had been in the pediatric ward for eleven days when her nurse brought in the Vertical Ball Launcher. What happened next stopped the entire floor.", category:"Impact",  mins:4, author:"Priya K."  },
  { issue:"13", date:"Feb 2025", title:"How a failed print at 2am became our best kit yet",     excerpt:"The Walking Robot's feet were snapping off on every third step. Three students stayed until midnight rethinking the joint geometry from scratch.",        category:"Process", mins:6, author:"Marcus T." },
  { issue:"12", date:"Jan 2025", title:"847 kits — the number we never thought we'd reach.",    excerpt:"When we started with one printer and five students, 100 kits seemed impossibly far. Here's how we got to 847 — the partnerships, the hard nights.",       category:"Delivery",mins:5, author:"Jordan L." },
]

const TESTIMONIALS = [
  { quote:"I've never seen a 6-year-old concentrate that hard on anything. She built the whole thing herself and cried when it worked.",  author:"Registered Nurse", org:"Arnold Palmer Hospital, Orlando", initials:"RN" },
  { quote:"The kits arrive already sorted in build order. Our staff doesn't have to do anything except watch the kids light up.",          author:"Program Director",  org:"Brevard Family Partnership",       initials:"PD" },
  { quote:"My son asks about the next kit every single week. It's the one thing that makes him forget he's in the hospital.",             author:"Parent",            org:"Pediatric Ward, Melbourne",         initials:"P"  },
]

const REASONS = [
  { icon:Star,          title:"Written by students",     body:"Every word from the 9th-graders who built the kits."        },
  { icon:Heart,         title:"No sponsors. No ads.",    body:"We don't sell your attention. Full stop."                    },
  { icon:MapPin,        title:"Hyper-local.",            body:"Melbourne, FL. Places you might actually drive past."        },
  { icon:Award,         title:"~2 emails per month.",   body:"We only write when there's something genuinely worth saying." },
  { icon:Layers,        title:"You control the topics.", body:"Six categories. Your inbox, your rules."                     },
  { icon:MessageCircle, title:"Reply and we respond.",  body:"A real student writes back. Usually within 48 hours."        },
]

const PROCESS_STEPS = [
  { n:"I",   icon:Hammer,   title:"Something real happens",  body:"A kit ships. A kid reacts. A print fails at 2am. Every issue starts with something that actually happened."  },
  { n:"II",  icon:BookOpen, title:"A student writes it",     body:"Whoever lived it writes it. No brand voice, no polish — direct, specific, and a little rough."               },
  { n:"III", icon:Search,   title:"One round of edits",      body:"Another student reads for clarity and spelling. No committees, no approval chains."                          },
  { n:"IV",  icon:Mail,     title:"It lands in your inbox",  body:"We send to the relevant categories only. You only hear about what you asked for."                            },
]

const FAQ_ITEMS = [
  { q:"How often will I actually receive emails?",        a:"About twice a month. We've never sent more than two in a single month. Some months it's one — we only send when there's something real to say."             },
  { q:"Can I choose what topics I get emails about?",    a:"Yes — that's the whole point. Select from six categories at signup. Change anytime using the preferences link in any email footer."                         },
  { q:"Is there anything being sold in the newsletter?", a:"No. No sponsors, no affiliate links, no product promotions. Occasionally we mention a fundraising campaign for the kits themselves."                       },
  { q:"Who actually writes the newsletter?",              a:"9th-grade students at West Shore Jr/Sr High School in Melbourne, FL — the same ones who build the kits. Each issue is written by whoever lived that story." },
  { q:"How do I unsubscribe?",                            a:"Every email has an unsubscribe link in the footer. One click, no confirmation required, instant. We don't ask why."                                       },
  { q:"Can I share the newsletter with someone?",         a:"Absolutely. Every issue includes a forward link. The best way to support us is to tell someone who would actually care about what we're doing."           },
]

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

/* ═══════════════════════════════════════════════════════════════════════
   REVEAL HELPER
═══════════════════════════════════════════════════════════════════════ */
const rv = (on: boolean, d = 0): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(22px)",
  transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${d}ms, transform .7s cubic-bezier(.22,1,.36,1) ${d}ms`,
})

/* ═══════════════════════════════════════════════════════════════════════
   GRAIN OVERLAY  (SVG noise — gives every section a printed feel)
═══════════════════════════════════════════════════════════════════════ */
function Grain() {
  return (
    <div className="grain-overlay" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="300" height="300" filter="url(#noise)" opacity="1"/>
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION LABEL  (monospace eyebrow with dot and line)
═══════════════════════════════════════════════════════════════════════ */
function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${light ? "bg-amber-400" : "bg-amber-500"}`} />
      <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.38em] ${light ? "text-amber-300/75" : "text-amber-700/80"}`}>
        {children}
      </span>
      <div className={`flex-1 h-px max-w-[60px] ${light ? "bg-white/10" : "bg-stone-200"}`} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MARQUEE TICKER
═══════════════════════════════════════════════════════════════════════ */
function Ticker({ light = false }: { light?: boolean }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className={`ticker-wrap overflow-hidden py-3 border-y ${light ? "border-white/10 bg-white/[0.04]" : "border-stone-800/60 bg-stone-950/40"}`}>
      <div className="ticker-track flex gap-0 whitespace-nowrap" style={{ animation: "tickerScroll 38s linear infinite" }}>
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-3 shrink-0 font-mono text-[10px] tracking-[0.12em] px-6 ${light ? "text-stone-500" : "text-stone-600"}`}>
            <span className="text-amber-500/60">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 1 — HERO  (newspaper broadsheet masthead)
═══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = setTimeout(() => setM(true), 60); return () => clearTimeout(t) }, [])
  const r = (d: number): React.CSSProperties => ({
    opacity: m ? 1 : 0, transform: m ? "none" : "translateY(20px)",
    transition: `opacity .95s cubic-bezier(.22,1,.36,1) ${d}ms, transform .95s cubic-bezier(.22,1,.36,1) ${d}ms`,
  })

  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })

  return (
    <section className="hero-section relative overflow-hidden min-h-screen flex flex-col">
      <Grain />

      {/* ── Paper texture lines ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.018) 28px)", zIndex:1 }} />

      {/* ── Top rule + publication info ── */}
      <div className="relative z-10" style={{ opacity: m ? 1 : 0, transition:"opacity .5s ease 0ms" }}>
        <div className="border-b border-white/20 px-8 lg:px-16 py-2 flex items-center justify-between">
          <span className="font-mono text-[9px] text-white/30 tracking-[0.22em] uppercase">{dateStr}</span>
          <span className="font-mono text-[9px] text-white/30 tracking-[0.22em] uppercase">Vol. I · Issue No. 14</span>
        </div>

        {/* ── Masthead ── */}
        <div className="border-b-2 border-white/15 px-8 lg:px-16 py-6 text-center relative">
          <div className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-start gap-1">
            <span className="font-mono text-[8.5px] text-white/25 tracking-[0.22em] uppercase">Melbourne · FL</span>
            <span className="font-mono text-[8.5px] text-white/25 tracking-[0.22em] uppercase">Est. 2024</span>
          </div>
          <h1 className="font-display font-black text-white tracking-[-0.03em] leading-none inline-block"
            style={{ fontSize:"clamp(2.2rem,6vw,4.2rem)", textShadow:"0 0 80px rgba(217,119,6,0.2)" }}>
            KitCraft
            <span className="text-amber-400 mx-2">·</span>
            The Newsletter
          </h1>
          <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-1">
            <span className="font-mono text-[8.5px] text-white/25 tracking-[0.22em] uppercase">Student-made</span>
            <span className="font-mono text-[8.5px] text-white/25 tracking-[0.22em] uppercase">Free always</span>
          </div>
        </div>

        {/* ── Column headers ── */}
        <div className="border-b border-white/10 px-8 lg:px-16 py-1.5 hidden lg:flex items-center gap-0">
          {["Impact Stories","Kit Releases","Delivery Updates","Behind the Scenes","Volunteer Calls","Fundraising"].map((col, i) => (
            <span key={i} className={`flex-1 font-mono text-[8px] text-center tracking-[0.2em] uppercase ${i > 0 ? "border-l border-white/10" : ""}`}
              style={{ color:"rgba(255,255,255,0.28)" }}>
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="relative z-10 flex-1 px-8 lg:px-16 py-14 lg:py-18 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-0 max-w-[1400px] mx-auto w-full items-start">

        {/* Left column — headline + body */}
        <div className="lg:border-r lg:border-white/10 lg:pr-14 pt-4">

          {/* Massive display headline */}
          <div style={r(60)}>
            <div className="hero-headline-wrap relative">
              {/* Ghost "THE" behind */}
              <div className="absolute -left-4 -top-6 font-display font-black text-white/[0.028] leading-none select-none"
                style={{ fontSize:"clamp(8rem,18vw,14rem)", letterSpacing:"-0.05em", zIndex:0 }}>THE</div>
              <h2 className="relative z-10 font-display font-black text-white leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize:"clamp(4rem,10vw,8.5rem)" }}>
                The loop<span className="text-amber-400">.</span>
              </h2>
              <h2 className="relative z-10 font-display font-black leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize:"clamp(4rem,10vw,8.5rem)", color:"rgba(255,255,255,0.28)", WebkitTextStroke:"1px rgba(255,255,255,0.15)" }}>
                For people
              </h2>
              <h2 className="relative z-10 font-display font-black leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize:"clamp(4rem,10vw,8.5rem)", color:"rgba(255,255,255,0.28)", WebkitTextStroke:"1px rgba(255,255,255,0.15)" }}>
                who care.
              </h2>
            </div>
          </div>

          {/* Ruled break */}
          <div className="flex items-center gap-4 my-9" style={r(160)}>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/60 to-transparent" />
            <span className="font-mono text-[8.5px] text-white/25 tracking-[0.25em] uppercase shrink-0">KitCraft Newsletter</span>
            <div className="h-px w-8 bg-white/10" />
          </div>

          <p className="text-[16.5px] leading-[1.85] text-white/55 max-w-[540px] mb-10 font-light" style={r(220)}>
            Twice a month — real stories from the 9th-graders who build the kits, updates on where they went, and ways to get more involved. Straight from Melbourne, FL.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 mb-12" style={r(300)}>
            <a href="#signup" className="btn-primary flex items-center gap-2.5">
              <Mail className="h-3.5 w-3.5" /> Subscribe free <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a href="#what-you-get" className="btn-ghost flex items-center gap-2">
              See what's inside <ChevronDown className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-5" style={r(380)}>
            <div className="flex -space-x-2.5">
              {["#7c3aed","#be185d","#0369a1","#92400e","#1e40af"].map((c, i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-stone-900 flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: c, zIndex: 5-i }}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-[13px] text-white/70">200+ subscribers</p>
              <p className="font-mono text-[10px] text-white/30 mt-0.5">across Brevard County</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <Radio className="h-3 w-3 text-amber-400/70 animate-pulse" />
              <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em]">Live</span>
            </div>
          </div>
        </div>

        {/* Right column — editorial sidebar */}
        <div className="hidden lg:flex flex-col pl-12 pt-4 gap-0" style={r(120)}>
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.35em] text-white/20 mb-5">What you'll receive</p>

          {CATEGORIES.map((cat, i) => {
            const I = cat.icon
            return (
              <div key={cat.id} className="hero-cat-row group flex items-center gap-3.5 py-4 border-b border-white/[0.07] cursor-default"
                style={{ opacity: m ? 1 : 0, transform: m ? "none" : "translateX(18px)", transition: `opacity .75s ease ${180 + i * 65}ms, transform .75s ease ${180 + i * 65}ms` }}>
                <div className="w-1 h-5 rounded-full shrink-0 transition-all duration-200 group-hover:h-7"
                  style={{ backgroundColor: cat.accent, opacity: 0.7 }} />
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${cat.accent}18` }}>
                  <I className="h-3 w-3" style={{ color: cat.accent }} />
                </div>
                <p className="flex-1 font-display font-semibold text-[13px] text-white/65 group-hover:text-white/85 transition-colors truncate">{cat.label}</p>
                <span className="font-mono text-[9px] text-white/25 shrink-0">{cat.freq}</span>
              </div>
            )
          })}

          <a href="#signup" className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-white/[0.08] font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/30 hover:text-amber-400 transition-colors">
            Subscribe to all <ArrowRight className="h-3 w-3" />
          </a>

          {/* Mini stat callout */}
          <div className="mt-6 p-4 border border-amber-500/15 bg-amber-500/[0.05] rounded-lg">
            <p className="font-mono text-[8.5px] text-amber-400/60 uppercase tracking-[0.2em] mb-2">Next issue</p>
            <p className="font-display font-bold text-white/70 text-[1.05rem] leading-snug">
              847 kits and counting.
            </p>
            <p className="font-mono text-[10px] text-white/30 mt-1.5">April 2025 · Impact Report</p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="relative z-10 pb-6 flex justify-center"
        style={{ opacity: m ? 0.4 : 0, transition: "opacity 1s ease 1.4s", animation: m ? "heroBounce 2.6s ease-in-out infinite" : "none" }}>
        <ChevronDown className="h-5 w-5 text-white/60" />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 2 — WHAT YOU GET
═══════════════════════════════════════════════════════════════════════ */
function WhatYouGet() {
  const { ref, on } = useReveal()
  const [active, setActive] = useState(0)
  const cat = CATEGORIES[active]
  const I = cat.icon

  return (
    <section id="what-you-get" ref={ref as React.RefObject<HTMLElement>} className="cream-section relative px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      <div className="relative z-10 mx-auto max-w-7xl">

        <div className="mb-14 pb-10 border-b-2 border-stone-800/10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end" style={rv(on)}>
          <div>
            <SectionLabel>What's Inside</SectionLabel>
            <h2 className="font-display font-black text-stone-900 leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize:"clamp(2.6rem,5vw,4.2rem)" }}>
              Six topics.
              <br /><em className="not-italic text-amber-600">You pick what lands.</em>
            </h2>
          </div>
          <p className="text-[15.5px] font-light leading-[1.85] text-stone-500 border-l-2 border-stone-200 pl-5">
            Choose exactly what you want to hear about. We only send what you asked for — no algorithm, no surprises, no filler.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">
          {/* Tab list */}
          <div className="border-r-2 border-stone-100">
            {CATEGORIES.map((c, i) => {
              const Ic = c.icon
              const isActive = active === i
              return (
                <button key={c.id} onClick={() => setActive(i)}
                  className="group w-full py-4 pr-6 text-left border-b border-stone-100 transition-all duration-150 relative overflow-hidden"
                  style={rv(on, i * 40)}>
                  {/* Hover fill */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: `${c.accent}07` }} />
                  <div className="relative flex items-center gap-3">
                    <div className="w-[3px] self-stretch rounded-full shrink-0 transition-all duration-200"
                      style={{ minHeight:44, backgroundColor: isActive ? c.accent : "transparent", opacity: isActive ? 1 : 0 }} />
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150"
                      style={{ backgroundColor: isActive ? `${c.accent}16` : "transparent", color: isActive ? c.accent : "#a8a29e" }}>
                      <Ic className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold leading-tight transition-colors"
                        style={{ color: isActive ? "#1c1917" : "#78716c" }}>{c.label}</p>
                      <p className="font-mono text-[9px] mt-0.5 text-stone-400">{c.freq}</p>
                    </div>
                    <ArrowRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 transition-all duration-150 -translate-x-1 group-hover:translate-x-0"
                      style={{ color: c.accent }} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail pane */}
          <div className="px-0 lg:pl-14 py-8 flex flex-col justify-center" style={rv(on, 80)}>
            <div key={active} style={{ animation:"panelIn .32s cubic-bezier(.22,1,.36,1) forwards" }}>
              {/* Color strip */}
              <div className="h-1 w-16 rounded-full mb-7" style={{ backgroundColor: cat.accent }} />

              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${cat.accent}14`, color: cat.accent }}>
                  <I className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${cat.accent}10`, color: cat.accent }}>
                  {cat.freq}
                </span>
              </div>

              <h3 className="font-display font-black text-stone-900 leading-[1.02] tracking-[-0.025em] mb-3"
                style={{ fontSize:"clamp(2rem,3.2vw,2.8rem)" }}>{cat.label}</h3>

              <p className="text-[15.5px] font-bold italic mb-5" style={{ color: cat.accent }}>{cat.tagline}</p>

              <p className="text-[15px] font-light leading-[1.85] text-stone-500 mb-8 max-w-md">{cat.desc}</p>

              <a href="#signup" className="inline-flex items-center gap-2 text-[13px] font-bold px-6 py-3 rounded-full transition-all hover:opacity-80 active:scale-[0.98]"
                style={{ backgroundColor: `${cat.accent}12`, color: cat.accent, border:`1.5px solid ${cat.accent}28` }}>
                Subscribe to receive this <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-9 font-mono text-[10.5px] text-stone-400" style={rv(on, 300)}>
          Select any combination · Change anytime · No account needed
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 3 — STATS
═══════════════════════════════════════════════════════════════════════ */
function StatItem({ stat, on, i }: { stat: typeof STATS[number]; on: boolean; i: number }) {
  const count = useCountUp(stat.value, 1800, on)
  return (
    <div className="stat-cell relative overflow-hidden flex flex-col p-10 py-14 group" style={rv(on, i * 90)}>
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background:"radial-gradient(circle at 50% 50%, rgba(217,119,6,0.08) 0%, transparent 70%)" }} />
      {/* Ghost numeral */}
      <div className="absolute -bottom-6 -right-3 font-display font-black leading-none select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
        style={{ fontSize:"9rem", color:"rgba(255,255,255,0.038)", letterSpacing:"-0.06em", lineHeight:1 }}>
        {stat.value}
      </div>
      <div className="relative">
        <div className="flex items-end gap-0.5 mb-5">
          <span className="font-display font-black text-white leading-[0.85]"
            style={{ fontSize:"clamp(3.2rem,5.5vw,5rem)" }}>
            {on ? count.toLocaleString() : "0"}
          </span>
          <span className="font-display font-black text-amber-400 mb-1" style={{ fontSize:"clamp(2rem,3.5vw,3rem)" }}>
            {stat.suffix}
          </span>
        </div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-px w-8 bg-amber-500/50" />
          <div className="h-px w-3 bg-amber-500/20" />
        </div>
        <p className="font-bold text-[14px] text-stone-200">{stat.label}</p>
        <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.12em] mt-1.5">{stat.sub}</p>
      </div>
    </div>
  )
}

function Stats() {
  const { ref, on } = useReveal(0.08)
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="dark-section relative overflow-hidden">
      <Grain />
      <Ticker />
      <div className="relative z-10 px-8 py-24 lg:px-16 lg:py-28">
        {/* Enormous background word */}
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <div className="font-display font-black text-white/[0.022] leading-none" style={{ fontSize:"clamp(14rem,30vw,26rem)", letterSpacing:"-0.05em", marginRight:"-2rem" }}>
            BUILT
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-0">
            <div className="flex flex-col justify-center pr-14 pb-12 lg:pb-0 mb-10 lg:mb-0 border-b lg:border-b-0 lg:border-r border-stone-800" style={rv(on)}>
              <SectionLabel light>By the numbers</SectionLabel>
              <h2 className="font-display font-black text-white leading-[0.95] tracking-[-0.03em]"
                style={{ fontSize:"clamp(2rem,3.5vw,3rem)" }}>
                What we<br />plan to build.
              </h2>
              <p className="font-mono text-[9.5px] text-stone-600 uppercase tracking-[0.15em] leading-[2] mt-6">
                Since June 2025<br />Melbourne, FL
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-stone-800/70">
              {STATS.map((s, i) => <StatItem key={s.label} stat={s} on={on} i={i} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 4 — HOW IT WORKS
═══════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="cream-section relative px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 pb-12 border-b-2 border-stone-800/10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-end" style={rv(on)}>
          <div>
            <SectionLabel>The Process</SectionLabel>
            <h2 className="font-display font-black text-stone-900 leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize:"clamp(2.6rem,5vw,4.2rem)" }}>
              How each issue<br />gets made.
            </h2>
          </div>
          <p className="text-[15.5px] font-light leading-[1.85] text-stone-500 border-l-2 border-stone-200 pl-5">
            No editorial staff. No content calendar. Just students writing about what actually happened.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-0">
          {PROCESS_STEPS.map((step, i) => {
            const I = step.icon
            return (
              <div key={i} className="relative lg:pr-10 group" style={rv(on, i * 90)}>
                {/* Roman numeral ghost */}
                <div className="absolute -top-2 left-0 font-display font-black leading-none select-none pointer-events-none text-stone-900/[0.05] transition-all duration-500 group-hover:text-stone-900/[0.08]"
                  style={{ fontSize:"6rem", letterSpacing:"-0.04em", zIndex:0 }}>
                  {step.n}
                </div>
                {/* Connector */}
                {i < 3 && <div className="absolute hidden lg:block top-8 left-10 h-px bg-gradient-to-r from-stone-200 to-stone-100" style={{ right:0 }} />}

                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50 mb-6 transition-all duration-200 group-hover:border-amber-300 group-hover:bg-amber-100 group-hover:scale-105">
                    <I className="h-4.5 w-4.5 text-amber-700" style={{ width:18, height:18 }} />
                  </div>
                  <p className="font-mono text-[8.5px] font-bold text-stone-400 uppercase tracking-[0.25em] mb-2.5">{step.n}</p>
                  <h3 className="font-display font-bold text-[1.2rem] text-stone-800 mb-3 leading-snug">{step.title}</h3>
                  <p className="text-[13.5px] font-light leading-[1.8] text-stone-500">{step.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 5 — RECENT STORIES  (hover-reveal cards)
═══════════════════════════════════════════════════════════════════════ */
const STORY_ACCENTS: Record<string, string> = { Impact:"#be185d", Process:"#92400e", Delivery:"#0369a1" }

function StoryCard({ story, featured, delay, on }: { story: typeof STORIES[number]; featured?: boolean; delay: number; on: boolean }) {
  const accent = STORY_ACCENTS[story.category] ?? "#6b7280"
  return (
    <div className={`story-card group relative overflow-hidden ${featured ? "min-h-[480px] flex flex-col justify-end" : "flex flex-col justify-between"} p-8 rounded-2xl`}
      style={rv(on, delay)}>
      {/* Hover overlay tint */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background:`radial-gradient(ellipse at 30% 70%, ${accent}14 0%, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5 rounded"
            style={{ backgroundColor:`${accent}1a`, color:accent }}>
            {story.category}
          </span>
          <span className="font-mono text-[10px] text-stone-600">#{story.issue} · {story.date}</span>
        </div>

        <h3 className={`font-display font-black text-white leading-[1.08] tracking-[-0.02em] transition-all duration-300 group-hover:text-white ${featured ? "text-[1.85rem] max-w-[480px]" : "text-[1.05rem]"}`}
          style={{ lineHeight: 1.1 }}>
          {story.title}
        </h3>

        {/* Excerpt — slides in on hover */}
        <div className="overflow-hidden transition-all duration-400 ease-out"
          style={{ maxHeight: featured ? "none" : "0px" }}
          ref={(el) => {
            if (!el) return
            const setHeight = () => {
              el.style.maxHeight = el.parentElement?.matches(":hover") ? `${el.scrollHeight}px` : "0px"
            }
            el.parentElement?.addEventListener("mouseenter", setHeight)
            el.parentElement?.addEventListener("mouseleave", setHeight)
          }}>
          <p className="text-[13.5px] font-light leading-[1.75] text-stone-400 mt-3">{story.excerpt}</p>
        </div>
        {featured && <p className="text-[14px] font-light leading-[1.75] text-stone-400 mt-3 max-w-lg line-clamp-2">{story.excerpt}</p>}

        <div className="flex items-center justify-between border-t border-white/[0.09] pt-5 mt-5">
          <span className="flex items-center gap-2 font-mono text-[10.5px] text-stone-600">
            <Eye className="h-3 w-3" />{story.mins} min · {story.author}
          </span>
          <a href="#signup" className="flex items-center gap-1.5 font-mono text-[10.5px] transition-all duration-200 group-hover:gap-2.5"
            style={{ color: accent }}>
            Subscribe <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

function RecentStories() {
  const { ref, on } = useReveal()
  const [featured, ...rest] = STORIES
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="dark-section relative overflow-hidden px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      {/* Ghost word — vertical */}
      <div className="absolute right-0 top-0 bottom-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="font-display font-black text-white/[0.025] leading-none h-full flex items-center"
          style={{ fontSize:"clamp(10rem,22vw,20rem)", letterSpacing:"-0.05em", writingMode:"vertical-rl", paddingRight:"1rem" }}>
          ARCHIVE
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-8 mb-14" style={rv(on)}>
          <div>
            <SectionLabel light>From the Archive</SectionLabel>
            <h2 className="font-display font-black text-white leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize:"clamp(2.4rem,4.5vw,3.6rem)" }}>
              Recent issues.
            </h2>
          </div>
          <a href="#signup" className="hidden lg:flex items-center gap-2 font-mono text-[10.5px] text-stone-500 hover:text-amber-400 transition-colors uppercase tracking-[0.16em]">
            Subscribe to read <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-3">
          <StoryCard story={featured} featured delay={60} on={on} />
          <div className="flex flex-col gap-3">
            {rest.map((story, i) => (
              <StoryCard key={i} story={story} delay={140 + i * 80} on={on} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 6 — TESTIMONIALS
═══════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const { ref, on } = useReveal()
  const [active, setActive] = useState(0)

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="cream-section relative overflow-hidden px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      {/* Enormous decorative quote mark */}
      <div className="absolute -left-6 top-8 font-display font-black text-stone-100 leading-none select-none pointer-events-none"
        style={{ fontSize:"clamp(14rem,28vw,22rem)", letterSpacing:"-0.05em", lineHeight:0.85, zIndex:0 }}>
        &ldquo;
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionLabel>From Our Partners</SectionLabel>

        {/* Active testimonial — large */}
        <div key={active} style={{ animation:"panelIn .4s cubic-bezier(.22,1,.36,1) forwards", ...rv(on) }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12 items-end mb-14 pb-14 border-b-2 border-stone-800/10">
            <div>
              <p className="font-display font-bold italic text-stone-800 leading-[1.25] tracking-[-0.015em]"
                style={{ fontSize:"clamp(1.6rem,3vw,2.4rem)" }}>
                {TESTIMONIALS[active].quote}
              </p>
              <div className="flex items-center gap-4 mt-8">
                <div className="h-11 w-11 rounded-full flex items-center justify-center text-[13px] font-black text-white"
                  style={{ background:"linear-gradient(135deg, #d97706, #92400e)" }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <div className="h-[2px] w-8 bg-amber-500/60 mb-2.5" />
                  <p className="font-bold text-[14px] text-stone-800">{TESTIMONIALS[active].author}</p>
                  <p className="font-mono text-[10.5px] text-stone-400 mt-0.5">{TESTIMONIALS[active].org}</p>
                </div>
                <div className="ml-2 flex gap-0.5">
                  {Array.from({length:5}).map((_,j) => <Star key={j} className="h-3.5 w-3.5 fill-current text-amber-400" />)}
                </div>
              </div>
            </div>
            {/* Nav dots */}
            <div className="flex lg:flex-col gap-3 lg:items-end">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="group flex items-center gap-2 transition-all">
                  <span className="font-mono text-[9px] text-stone-400 group-hover:text-stone-600 transition-colors hidden lg:block">
                    0{i+1}
                  </span>
                  <div className={`rounded-full transition-all duration-300 ${active === i ? "w-8 h-2 bg-amber-500" : "w-2 h-2 bg-stone-300 group-hover:bg-stone-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All quotes as mini cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-200 ${active === i ? "border-amber-200 bg-amber-50/60" : "border-stone-200/70 bg-white/40 hover:border-stone-300"}`}
              style={rv(on, i * 80)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                  style={{ background: active === i ? "linear-gradient(135deg,#d97706,#92400e)" : "linear-gradient(135deg,#a8a29e,#78716c)" }}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[12px] text-stone-700">{t.author}</p>
                  <p className="font-mono text-[9.5px] text-stone-400">{t.org}</p>
                </div>
              </div>
              <p className="text-[13px] font-light italic leading-[1.7] text-stone-500 line-clamp-3">{t.quote}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 7 — WHY SUBSCRIBE
═══════════════════════════════════════════════════════════════════════ */
function WhySubscribe() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="dark-section relative overflow-hidden px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="font-display font-black text-white/[0.025] leading-none" style={{ fontSize:"clamp(12rem,26vw,22rem)", letterSpacing:"-0.05em", lineHeight:0.85, marginRight:"-1rem", marginBottom:"-1rem" }}>
          WHY
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
        <div style={rv(on)}>
          <SectionLabel light>Why Subscribe</SectionLabel>
          <h2 className="font-display font-black text-white leading-[0.95] tracking-[-0.03em] mb-7"
            style={{ fontSize:"clamp(2.4rem,4.5vw,3.6rem)" }}>
            A newsletter<br />worth opening.
          </h2>
          <p className="text-[15.5px] font-light leading-[1.85] text-stone-400 mb-14 max-w-[380px] border-l border-amber-500/30 pl-5">
            Most newsletters exist to sell you something. This one exists because something real is happening in Melbourne, FL.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {REASONS.map(({ icon:I, title, body }, i) => (
              <div key={title} className="reason-cell flex gap-4 py-6 border-b border-stone-800/70" style={rv(on, 80 + i * 55)}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 mt-0.5">
                  <I className="h-3.5 w-3.5 text-amber-400/80" />
                </div>
                <div>
                  <p className="font-bold text-[13.5px] text-stone-200 mb-1">{title}</p>
                  <p className="text-[12.5px] font-light leading-[1.72] text-stone-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4" style={rv(on, 100)}>
          {/* Promise card */}
          <div className="promise-card p-9 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[3px] w-8 bg-amber-500 rounded-full" />
              <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-stone-400">Our Promise</p>
            </div>
            <span className="font-display font-black text-[5rem] text-stone-100 leading-none select-none block -mb-4">&ldquo;</span>
            <p className="font-display font-bold italic text-[1.3rem] leading-[1.55] text-stone-900">
              We will never fill your inbox with fluff. Every email either tells you something real about what we&apos;re doing, or asks you to help us do more of it.
            </p>
            <div className="mt-7 pt-6 border-t border-stone-100 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                style={{ background:"linear-gradient(135deg,#d97706,#92400e)" }}>KC</div>
              <div>
                <p className="font-bold text-[13px] text-stone-600">The KitCraft Student Team</p>
                <p className="font-mono text-[10.5px] text-stone-400 mt-0.5">West Shore Jr/Sr High · Melbourne, FL</p>
              </div>
            </div>
          </div>

          {/* 2×2 stat grid */}
          <div className="grid grid-cols-2 border border-stone-800 divide-x divide-y divide-stone-800 rounded-xl overflow-hidden">
            {[["~2","emails/month"],["0","ads or sponsors"],["6","topic categories"],["100%","student-written"]].map(([n, l]) => (
              <div key={l} className="px-7 py-7 group hover:bg-white/[0.03] transition-colors duration-200">
                <span className="font-display font-black text-white leading-none block" style={{ fontSize:"2.4rem" }}>{n}</span>
                <p className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-[0.12em] mt-2.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 8 — SIGNUP
═══════════════════════════════════════════════════════════════════════ */
function SignupSection() {
  const { ref, on } = useReveal()
  return (
    <section id="signup" ref={ref as React.RefObject<HTMLElement>} className="cream-section relative px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-16 lg:gap-24 items-start">
        <div style={rv(on)}>
          <SectionLabel>Join the Loop</SectionLabel>
          <h2 className="font-display font-black text-stone-900 leading-[0.95] tracking-[-0.03em] mb-5"
            style={{ fontSize:"clamp(2.6rem,5vw,4.2rem)" }}>
            Subscribe.<br />
            <em className="not-italic text-amber-600">Read. Be part of it.</em>
          </h2>
          <div className="flex items-center gap-4 mb-7">
            <div className="h-[2px] w-12 bg-amber-500/60 rounded-full" />
            <div className="h-[2px] w-5 bg-stone-200 rounded-full" />
          </div>
          <p className="text-[16px] font-light leading-[1.85] text-stone-500 mb-10 max-w-[380px]">
            Twice a month, a few hundred words from a 9th-grader who stayed up late finishing a build or drove a kit to a kid who&apos;d been waiting for it.
          </p>

          <div className="flex flex-col gap-3 mb-10">
            {["Choose exactly which topics land in your inbox","Stories written by the students themselves","First notice when we need volunteers","Impact reports: where every kit went","No ads, no sponsors, no affiliate links","One-click unsubscribe — no confirmation needed"].map((text, i) => (
              <div key={i} className="flex items-center gap-3.5 text-[14.5px] text-stone-600" style={rv(on, i * 45)}>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-50 border border-amber-200">
                  <Check className="h-3 w-3 text-amber-600" />
                </div>
                {text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-6 border-t-2 border-stone-800/10 mt-2" style={rv(on, 300)}>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
              <MapPin className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <p className="font-mono text-[11px] text-stone-400">Melbourne, FL · Brevard County · Student-led nonprofit</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-8" style={rv(on, 100)}>
          <div className="form-card rounded-2xl p-8 lg:p-10">
            <div className="mb-8 pb-7 border-b-2 border-stone-800/8">
              <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-stone-400 mb-2.5">Free · No account needed</p>
              <h3 className="font-display font-black text-stone-900 leading-[1.02] tracking-[-0.025em]" style={{ fontSize:"1.85rem" }}>
                Subscribe to KitCraft
              </h3>
            </div>
            <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
              <NewsletterSignup className="max-w-none w-full" />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 9 — FAQ
═══════════════════════════════════════════════════════════════════════ */
function FaqItem({ item, index, isOpen, onToggle, on }: {
  item: typeof FAQ_ITEMS[number]; index: number; isOpen: boolean; onToggle: () => void; on: boolean
}) {
  const [h, setH] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (bodyRef.current) setH(bodyRef.current.scrollHeight) }, [item.a])

  return (
    <div className={`border-b transition-colors duration-200 ${isOpen ? "border-stone-700" : "border-stone-800/60"}`}
      style={rv(on, index * 50)}>
      <button onClick={onToggle} className="flex w-full items-start gap-5 py-6 text-left group" aria-expanded={isOpen}>
        <span className={`mt-0.5 shrink-0 font-mono text-[10px] font-bold tracking-[0.1em] transition-colors ${isOpen ? "text-amber-400" : "text-stone-700 group-hover:text-stone-500"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`flex-1 font-display font-bold text-[1.08rem] leading-snug transition-colors ${isOpen ? "text-white" : "text-stone-300 group-hover:text-stone-100"}`}>
          {item.q}
        </span>
        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-200 ${isOpen ? "border-amber-500/40 bg-amber-500/12 text-amber-400" : "border-stone-700 text-stone-600 group-hover:border-stone-600 group-hover:text-stone-400"}`}>
          {isOpen ? <Minus className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
        </div>
      </button>
      <div style={{ maxHeight: isOpen ? h : 0, overflow:"hidden", transition:"max-height .44s cubic-bezier(.22,1,.36,1)" }}>
        <div ref={bodyRef} className="pb-7 pl-[3.75rem]">
          <p className="text-[15px] font-light leading-[1.88] text-stone-400">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, on } = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="dark-section relative overflow-hidden px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      <Ticker />
      <div className="relative z-10 mt-12 mx-auto max-w-3xl">
        <div className="mb-14" style={rv(on)}>
          <SectionLabel light>Questions</SectionLabel>
          <h2 className="font-display font-black text-white leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize:"clamp(2.4rem,4.5vw,3.6rem)" }}>
            Got questions?{" "}
            <span className="text-stone-600">We&apos;ve got answers.</span>
          </h2>
        </div>
        <div className="border-t border-stone-800/60">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} item={item} index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              on={on} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 10 — BOTTOM CTA
═══════════════════════════════════════════════════════════════════════ */
function BottomCta() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="cream-section relative px-8 py-24 lg:px-16 lg:py-28">
      <Grain />
      <div className="relative z-10 mx-auto max-w-7xl" style={rv(on)}>
        <div className="cta-card relative overflow-hidden rounded-2xl">
          <Grain />
          {/* Amber glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse 55% 60% at 12% 50%, rgba(217,119,6,0.12) 0%, transparent 65%)" }} />
          {/* Ghost text */}
          <div className="absolute -bottom-8 -right-6 font-display font-black text-white/[0.04] leading-none select-none pointer-events-none"
            style={{ fontSize:"clamp(9rem,20vw,18rem)", letterSpacing:"-0.05em" }}>
            MORE
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_210px] gap-12 items-center px-10 py-14 lg:px-16 lg:py-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-6 bg-amber-400/50" />
                <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-amber-400/70">More from KitCraft</p>
              </div>
              <h2 className="font-display font-black text-white leading-[0.97] tracking-[-0.03em] mb-4"
                style={{ fontSize:"clamp(2rem,3.5vw,3rem)" }}>
                Want to do more<br />than read about it?
              </h2>
              <p className="text-[15.5px] font-light leading-[1.85] text-stone-400 max-w-lg mb-4">
                Sponsor a kit, volunteer on a delivery run, or order kits for your school. Every action puts a STEM kit in a child&apos;s hands.
              </p>
              <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.12em]">100% of donations toward production · Zero overhead</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link href="/help-out" className="btn-primary flex items-center justify-center gap-2 text-center">
                <Heart className="h-3.5 w-3.5" /> Sponsor a Kit
              </Link>
              <Link href="/order-kits" className="btn-ghost flex items-center justify-center gap-2">
                <Package className="h-3.5 w-3.5" /> Order for a School
              </Link>
              <Link href="/careers" className="btn-ghost flex items-center justify-center gap-2">
                <Users className="h-3.5 w-3.5" /> Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════════ */
export default function NewsletterPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        * { box-sizing: border-box; }

        /* ── Font utilities ── */
        .font-display { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .font-mono    { font-family: 'DM Mono', 'Fira Code', 'Courier New', monospace; }
        .font-body    { font-family: 'Lora', Georgia, serif; }

        /* ── Section backgrounds ── */
        .dark-section  { background-color: #141412; }
        .cream-section { background-color: #f7f4ef; }

        .hero-section {
          background-color: #141412;
          background-image:
            radial-gradient(ellipse 65% 55% at 45% -5%, rgba(217,119,6,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 95% 55%, rgba(30,64,175,0.05) 0%, transparent 60%);
        }

        /* ── Grain overlay ── */
        .grain-overlay {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 2;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .dark-section  .grain-overlay { opacity: 0.035; }
        .hero-section  .grain-overlay { opacity: 0.040; }

        /* ── Paper texture lines on hero ── */
        .hero-lines {
          background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.016) 28px);
        }

        /* ── Ticker ── */
        .ticker-wrap { position: relative; z-index: 5; }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background-color: #d97706;
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.02em;
          padding: 14px 28px;
          border-radius: 100px;
          border: none; cursor: pointer;
          text-decoration: none;
          box-shadow: 0 4px 22px rgba(217,119,6,0.35), 0 1px 4px rgba(0,0,0,0.2);
          transition: all .22s ease;
        }
        .btn-primary:hover {
          background-color: #b45309;
          box-shadow: 0 6px 28px rgba(217,119,6,0.45), 0 2px 6px rgba(0,0,0,0.25);
          transform: translateY(-2px);
        }
        .btn-primary:active { transform: scale(0.975); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background-color: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.55);
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.02em;
          padding: 13px 24px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.13);
          cursor: pointer; text-decoration: none;
          transition: all .22s ease;
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.28);
          color: rgba(255,255,255,0.82);
          background-color: rgba(255,255,255,0.09);
        }

        /* ── Story cards ── */
        .story-card {
          background-color: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.09);
          cursor: default;
          transition: border-color .25s ease, background-color .25s ease, transform .25s ease;
        }
        .story-card:hover {
          border-color: rgba(255,255,255,0.16);
          background-color: rgba(255,255,255,0.07);
          transform: translateY(-2px);
        }
        .story-card.featured {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.04) 100%);
          border-color: rgba(255,255,255,0.11);
        }
        /* Hover-reveal excerpt on small story cards */
        .story-card:not(.featured) .excerpt-reveal {
          max-height: 0; overflow: hidden;
          transition: max-height .38s cubic-bezier(.22,1,.36,1);
        }
        .story-card:not(.featured):hover .excerpt-reveal { max-height: 80px; }

        /* ── Stat cell ── */
        .stat-cell { transition: background-color .25s ease; }
        .stat-cell:hover { background-color: rgba(255,255,255,0.025); }

        /* ── Reason cell border ── */
        .reason-cell:nth-child(odd)  { border-right: 1px solid rgba(255,255,255,0.06); padding-right: 2rem; }
        .reason-cell:nth-child(even) { padding-left: 2rem; }

        /* ── Promise card ── */
        .promise-card {
          background-color: #faf8f4;
          box-shadow: 0 2px 0 rgba(0,0,0,0.06), 0 10px 40px rgba(0,0,0,0.09);
        }

        /* ── Form card ── */
        .form-card {
          background-color: #ffffff;
          border: 1.5px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 0 rgba(0,0,0,0.04), 0 14px 50px rgba(0,0,0,0.08);
        }

        /* ── CTA card ── */
        .cta-card {
          background-color: #1c1917;
          border: 1.5px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }

        /* ── Hero category row ── */
        .hero-cat-row { transition: border-color .15s ease; }
        .hero-cat-row:last-child { border-bottom: none !important; }

        /* ── Animations ── */
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes heroBounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(9px); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── Responsive tweaks ── */
        @media (max-width: 1024px) {
          .reason-cell:nth-child(odd)  { border-right: none; padding-right: 0; }
          .reason-cell:nth-child(even) { padding-left: 0; }
        }
      `}</style>

      <main>
        <Hero />
        <WhatYouGet />
        <Stats />
        <HowItWorks />
        <RecentStories />
        <Testimonials />
        <WhySubscribe />
        <SignupSection />
        <FAQ />
        <BottomCta />
      </main>
    </>
  )
}