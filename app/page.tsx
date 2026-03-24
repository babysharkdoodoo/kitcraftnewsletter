"use client"

import { useEffect, useRef, useState } from "react"
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
  transform: on ? "none" : "translateY(28px)",
  transition: `opacity .8s cubic-bezier(.22,1,.36,1) ${d}ms, transform .8s cubic-bezier(.22,1,.36,1) ${d}ms`,
})

/* ═══════════════════════════════════════════════════════════════════════
   GRAIN OVERLAY
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
   SECTION LABEL
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
    <div className={`ticker-wrap overflow-hidden py-3.5 border-y ${light ? "border-white/[0.07] bg-white/[0.025]" : "border-amber-900/20 bg-amber-950/10"}`}>
      <div className="ticker-track flex gap-0 whitespace-nowrap" style={{ animation: "tickerScroll 38s linear infinite" }}>
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-3 shrink-0 font-mono text-[10px] tracking-[0.14em] px-6 ${light ? "text-stone-500" : "text-stone-500"}`}>
            <span className="text-amber-500/50">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 1 — HERO
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

      {/* Paper texture lines */}
      <div className="absolute inset-0 pointer-events-none hero-lines" aria-hidden="true" style={{ zIndex:1 }} />

      {/* Radial spotlight on headline */}
      <div className="absolute pointer-events-none" aria-hidden="true"
        style={{ top:"15%", left:"8%", width:"70%", height:"60%", background:"radial-gradient(ellipse at 40% 50%, rgba(217,119,6,0.07) 0%, transparent 60%)", zIndex:1, filter:"blur(40px)" }} />

      {/* Top rule + publication info */}
      <div className="relative z-10" style={{ opacity: m ? 1 : 0, transition:"opacity .5s ease 0ms" }}>
        <div className="border-b border-white/[0.11] px-8 lg:px-16 py-2.5 flex items-center justify-between">
          <span className="font-mono text-[9px] text-white/25 tracking-[0.22em] uppercase">{dateStr}</span>
          <div className="hidden sm:flex items-center gap-3">
            <span className="font-mono text-[9px] text-amber-500/40 tracking-[0.22em] uppercase">Vol. I</span>
            <span className="text-white/10">·</span>
            <span className="font-mono text-[9px] text-white/25 tracking-[0.22em] uppercase">Issue No. 14</span>
          </div>
        </div>

        {/* Masthead */}
        <div className="border-b-2 border-white/[0.09] px-8 lg:px-16 py-7 text-center relative">
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px]"
            style={{ background:"linear-gradient(to bottom, transparent, rgba(217,119,6,0.6), transparent)" }} />
          <div className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-start gap-1.5">
            <span className="font-mono text-[8px] text-white/20 tracking-[0.26em] uppercase">Melbourne · FL</span>
            <span className="font-mono text-[8px] text-white/20 tracking-[0.26em] uppercase">Est. 2024</span>
          </div>
          <h1 className="font-display font-black text-white tracking-[-0.03em] leading-none inline-block"
            style={{ fontSize:"clamp(2.2rem,6vw,4.2rem)", textShadow:"0 0 120px rgba(217,119,6,0.25), 0 0 40px rgba(217,119,6,0.1)" }}>
            KitCraft
            <span className="text-amber-400 mx-3 opacity-70">·</span>
            The Newsletter
          </h1>
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

      {/* Main body */}
      <div className="relative z-10 flex-1 px-8 lg:px-16 py-14 lg:py-18 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-0 max-w-[1400px] mx-auto w-full items-start">

        {/* Left column */}
        <div className="lg:border-r lg:border-white/[0.07] lg:pr-14 pt-4">

          <div style={r(60)}>
            <div className="hero-headline-wrap relative">
              {/* Ghost "THE" watermark */}
              <div className="absolute -left-4 -top-6 font-display font-black text-white/[0.022] leading-none select-none"
                style={{ fontSize:"clamp(8rem,18vw,14rem)", letterSpacing:"-0.05em", zIndex:0 }}>THE</div>
              <h2 className="relative z-10 font-display font-black leading-[0.90] tracking-[-0.035em] hero-gradient-text"
                style={{ fontSize:"clamp(4rem,10vw,8.5rem)" }}>
                The loop<span className="text-amber-400">.</span>
              </h2>
              <h2 className="relative z-10 font-display font-black leading-[0.90] tracking-[-0.035em]"
                style={{ fontSize:"clamp(4rem,10vw,8.5rem)", color:"rgba(255,255,255,0.18)", WebkitTextStroke:"1px rgba(255,255,255,0.1)" }}>
                For people
              </h2>
              <h2 className="relative z-10 font-display font-black leading-[0.90] tracking-[-0.035em]"
                style={{ fontSize:"clamp(4rem,10vw,8.5rem)", color:"rgba(255,255,255,0.18)", WebkitTextStroke:"1px rgba(255,255,255,0.1)" }}>
                who care.
              </h2>
            </div>
          </div>

          {/* Ruled break */}
          <div className="flex items-center gap-4 my-10" style={r(160)}>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 via-amber-500/20 to-transparent" />
            <span className="font-mono text-[8.5px] text-white/20 tracking-[0.28em] uppercase shrink-0">KitCraft Newsletter</span>
            <div className="h-px w-8 bg-white/[0.06]" />
          </div>

          <p className="text-[16.5px] leading-[1.9] text-white/45 max-w-[540px] mb-10 font-light" style={r(220)}>
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
                  style={{ backgroundColor: c, zIndex: 5-i, boxShadow:"0 2px 8px rgba(0,0,0,0.4)" }}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-[13px] text-white/65">200+ subscribers</p>
              <p className="font-mono text-[10px] text-white/25 mt-0.5">across Brevard County</p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
              <Radio className="h-2.5 w-2.5 text-amber-400/80 animate-pulse" />
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em]">Live</span>
            </div>
          </div>
        </div>

        {/* Right column — editorial sidebar */}
        <div className="hidden lg:flex flex-col pl-12 pt-4 gap-0" style={r(120)}>
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.35em] text-white/15 mb-5">What you'll receive</p>

          {CATEGORIES.map((cat, i) => {
            const I = cat.icon
            return (
              <div key={cat.id} className="hero-cat-row group flex items-center gap-3.5 py-4 border-b border-white/[0.06] cursor-default"
                style={{ opacity: m ? 1 : 0, transform: m ? "none" : "translateX(18px)", transition: `opacity .75s ease ${180 + i * 65}ms, transform .75s ease ${180 + i * 65}ms` }}>
                <div className="w-[2px] h-5 rounded-full shrink-0 transition-all duration-300 group-hover:h-8"
                  style={{ backgroundColor: cat.accent, opacity: 0.65 }} />
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.accent}18` }}>
                  <I className="h-3 w-3" style={{ color: cat.accent }} />
                </div>
                <p className="flex-1 font-display font-semibold text-[13px] text-white/55 group-hover:text-white/80 transition-colors truncate">{cat.label}</p>
                <span className="font-mono text-[9px] text-white/20 shrink-0">{cat.freq}</span>
              </div>
            )
          })}

          <a href="#signup" className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-white/[0.06] font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/25 hover:text-amber-400 transition-colors duration-200">
            Subscribe to all <ArrowRight className="h-3 w-3" />
          </a>

          {/* Mini stat callout */}
          <div className="mt-6 p-5 border border-amber-500/12 rounded-xl" style={{ background:"linear-gradient(135deg, rgba(217,119,6,0.06) 0%, rgba(217,119,6,0.02) 100%)" }}>
            <p className="font-mono text-[8px] text-amber-400/50 uppercase tracking-[0.22em] mb-2">Next issue</p>
            <p className="font-display font-bold text-white/65 text-[1.08rem] leading-snug">
              847 kits and counting.
            </p>
            <p className="font-mono text-[10px] text-white/25 mt-2">April 2025 · Impact Report</p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="relative z-10 pb-7 flex flex-col items-center gap-2"
        style={{ opacity: m ? 0.35 : 0, transition: "opacity 1s ease 1.4s", animation: m ? "heroBounce 2.8s ease-in-out infinite" : "none" }}>
        <span className="font-mono text-[8px] text-white/30 uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="h-4 w-4 text-white/50" />
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

        <div className="mb-14 pb-10 border-b-2 border-stone-800/8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end" style={rv(on)}>
          <div>
            <SectionLabel>What's Inside</SectionLabel>
            <h2 className="font-display font-black text-stone-900 leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize:"clamp(2.6rem,5vw,4.2rem)" }}>
              Six topics.
              <br /><em className="not-italic text-amber-600">You pick what lands.</em>
            </h2>
          </div>
          <p className="text-[15.5px] font-light leading-[1.9] text-stone-400 border-l-2 border-amber-200 pl-5">
            Choose exactly what you want to hear about. We only send what you asked for — no algorithm, no surprises, no filler.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0 border border-stone-200/70 rounded-2xl overflow-hidden shadow-sm">
          {/* Tab list */}
          <div className="border-r border-stone-100 bg-stone-50/60">
            {CATEGORIES.map((c, i) => {
              const Ic = c.icon
              const isActive = active === i
              return (
                <button key={c.id} onClick={() => setActive(i)}
                  className="group w-full py-4 pr-5 pl-4 text-left border-b border-stone-100 last:border-b-0 transition-all duration-200 relative overflow-hidden"
                  style={rv(on, i * 40)}>
                  {/* Active background */}
                  <div className="absolute inset-0 transition-opacity duration-200"
                    style={{ backgroundColor: isActive ? `${c.accent}08` : "transparent", opacity: 1 }} />
                  {/* Hover fill */}
                  {!isActive && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: `${c.accent}05` }} />}
                  <div className="relative flex items-center gap-3">
                    <div className="w-[3px] self-stretch rounded-full shrink-0 transition-all duration-300"
                      style={{ minHeight:40, backgroundColor: isActive ? c.accent : "transparent" }} />
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? `${c.accent}15` : "transparent",
                        color: isActive ? c.accent : "#a8a29e",
                        transform: isActive ? "scale(1.05)" : "scale(1)"
                      }}>
                      <Ic className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold leading-tight transition-colors"
                        style={{ color: isActive ? "#1c1917" : "#78716c" }}>{c.label}</p>
                      <p className="font-mono text-[9px] mt-0.5 text-stone-400">{c.freq}</p>
                    </div>
                    <ArrowRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-60 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                      style={{ color: c.accent }} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail pane */}
          <div className="px-8 lg:px-14 py-10 flex flex-col justify-center bg-white/80" style={rv(on, 80)}>
            <div key={active} style={{ animation:"panelIn .32s cubic-bezier(.22,1,.36,1) forwards" }}>
              {/* Color bar */}
              <div className="h-1 w-20 rounded-full mb-8" style={{ background:`linear-gradient(to right, ${cat.accent}, ${cat.accent}60)` }} />

              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm"
                  style={{ backgroundColor: `${cat.accent}12`, color: cat.accent, boxShadow:`0 0 0 1px ${cat.accent}20, 0 4px 12px ${cat.accent}15` }}>
                  <I className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${cat.accent}0d`, color: cat.accent, border:`1px solid ${cat.accent}20` }}>
                  {cat.freq}
                </span>
              </div>

              <h3 className="font-display font-black text-stone-900 leading-[1.02] tracking-[-0.025em] mb-3"
                style={{ fontSize:"clamp(2rem,3.2vw,2.8rem)" }}>{cat.label}</h3>

              <p className="text-[15.5px] font-bold italic mb-5" style={{ color: cat.accent }}>{cat.tagline}</p>

              <p className="text-[15px] font-light leading-[1.9] text-stone-500 mb-9 max-w-md">{cat.desc}</p>

              <a href="#signup" className="inline-flex items-center gap-2.5 text-[12.5px] font-bold px-6 py-3 rounded-full transition-all duration-200 hover:opacity-80 active:scale-[0.97]"
                style={{ backgroundColor: `${cat.accent}10`, color: cat.accent, border:`1.5px solid ${cat.accent}25`, boxShadow:`0 2px 12px ${cat.accent}18` }}>
                Subscribe to receive this <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-7 font-mono text-[10.5px] text-stone-400" style={rv(on, 300)}>
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
        style={{ background:"radial-gradient(circle at 50% 50%, rgba(217,119,6,0.1) 0%, transparent 70%)" }} />
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background:"linear-gradient(to right, transparent, rgba(217,119,6,0.4), transparent)" }} />
      {/* Ghost numeral */}
      <div className="absolute -bottom-6 -right-3 font-display font-black leading-none select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
        style={{ fontSize:"9rem", color:"rgba(255,255,255,0.03)", letterSpacing:"-0.06em", lineHeight:1 }}>
        {stat.value}
      </div>
      <div className="relative">
        <div className="flex items-end gap-0.5 mb-5">
          <span className="font-display font-black text-white leading-[0.85] stat-number-gradient"
            style={{ fontSize:"clamp(3.2rem,5.5vw,5rem)" }}>
            {on ? count.toLocaleString() : "0"}
          </span>
          <span className="font-display font-black text-amber-400 mb-1.5" style={{ fontSize:"clamp(2rem,3.5vw,3rem)" }}>
            {stat.suffix}
          </span>
        </div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-px w-8 bg-amber-500/40" />
          <div className="h-px w-3 bg-amber-500/15" />
        </div>
        <p className="font-bold text-[14px] text-stone-200/90">{stat.label}</p>
        <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.14em] mt-1.5">{stat.sub}</p>
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
          <div className="font-display font-black text-white/[0.018] leading-none" style={{ fontSize:"clamp(14rem,30vw,26rem)", letterSpacing:"-0.05em", marginRight:"-2rem" }}>
            BUILT
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-0">
            <div className="flex flex-col justify-center pr-14 pb-12 lg:pb-0 mb-10 lg:mb-0 border-b lg:border-b-0 lg:border-r border-stone-800/80" style={rv(on)}>
              <SectionLabel light>By the numbers</SectionLabel>
              <h2 className="font-display font-black text-white leading-[0.95] tracking-[-0.03em]"
                style={{ fontSize:"clamp(2rem,3.5vw,3rem)" }}>
                What we<br />plan to build.
              </h2>
              <p className="font-mono text-[9.5px] text-stone-700 uppercase tracking-[0.15em] leading-[2] mt-6">
                Since June 2025<br />Melbourne, FL
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-stone-800/60">
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
        <div className="mb-16 pb-12 border-b-2 border-stone-800/8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-end" style={rv(on)}>
          <div>
            <SectionLabel>The Process</SectionLabel>
            <h2 className="font-display font-black text-stone-900 leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize:"clamp(2.6rem,5vw,4.2rem)" }}>
              How each issue<br />gets made.
            </h2>
          </div>
          <p className="text-[15.5px] font-light leading-[1.9] text-stone-400 border-l-2 border-stone-200 pl-5">
            No editorial staff. No content calendar. Just students writing about what actually happened.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-0">
          {PROCESS_STEPS.map((step, i) => {
            const I = step.icon
            return (
              <div key={i} className="relative lg:pr-10 group" style={rv(on, i * 90)}>
                {/* Connector line */}
                {i < 3 && <div className="absolute hidden lg:block top-6 left-[52px] h-px" style={{ right:0, background:"linear-gradient(to right, rgba(217,119,6,0.25), rgba(217,119,6,0.05))" }} />}

                {/* Roman numeral ghost */}
                <div className="absolute -top-2 left-0 font-display font-black leading-none select-none pointer-events-none text-stone-900/[0.04] transition-all duration-500 group-hover:text-stone-900/[0.07]"
                  style={{ fontSize:"6rem", letterSpacing:"-0.04em", zIndex:0 }}>
                  {step.n}
                </div>

                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-200 bg-white mb-6 transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-50 group-hover:scale-105 group-hover:shadow-md"
                    style={{ boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <I className="h-4.5 w-4.5 text-amber-700" style={{ width:18, height:18 }} />
                  </div>
                  <p className="font-mono text-[8.5px] font-bold text-stone-400 uppercase tracking-[0.28em] mb-2.5">{step.n}</p>
                  <h3 className="font-display font-bold text-[1.2rem] text-stone-800 mb-3 leading-snug">{step.title}</h3>
                  <p className="text-[13.5px] font-light leading-[1.85] text-stone-500">{step.body}</p>
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
   § 5 — RECENT STORIES
═══════════════════════════════════════════════════════════════════════ */
const STORY_ACCENTS: Record<string, string> = { Impact:"#be185d", Process:"#92400e", Delivery:"#0369a1" }

function StoryCard({ story, featured, delay, on }: { story: typeof STORIES[number]; featured?: boolean; delay: number; on: boolean }) {
  const accent = STORY_ACCENTS[story.category] ?? "#6b7280"
  return (
    <div className={`story-card group relative overflow-hidden ${featured ? "min-h-[480px] flex flex-col justify-end" : "flex flex-col justify-between"} p-8 rounded-2xl`}
      style={rv(on, delay)}>
      {/* Featured gradient overlay */}
      {featured && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:`linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.4) 40%, transparent 70%)` }} />
      )}
      {/* Accent hover tint */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background:`radial-gradient(ellipse at 30% 80%, ${accent}18 0%, transparent 65%)` }} />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background:`linear-gradient(to right, transparent, ${accent}60, transparent)` }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5 rounded"
            style={{ backgroundColor:`${accent}20`, color:accent, border:`1px solid ${accent}25` }}>
            {story.category}
          </span>
          <span className="font-mono text-[10px] text-stone-600">#{story.issue} · {story.date}</span>
        </div>

        <h3 className={`font-display font-black text-white leading-[1.08] tracking-[-0.02em] transition-colors duration-300 ${featured ? "text-[1.85rem] max-w-[480px]" : "text-[1.05rem]"}`}
          style={{ lineHeight: 1.12 }}>
          {story.title}
        </h3>

        {/* Excerpt */}
        {featured
          ? <p className="text-[14px] font-light leading-[1.8] text-stone-400 mt-3 max-w-lg line-clamp-2">{story.excerpt}</p>
          : (
            <div className="overflow-hidden transition-all duration-500 ease-out"
              style={{ maxHeight:0 }}
              ref={(el) => {
                if (!el) return
                const show = () => { el.style.maxHeight = `${el.scrollHeight}px` }
                const hide = () => { el.style.maxHeight = "0" }
                el.parentElement?.addEventListener("mouseenter", show)
                el.parentElement?.addEventListener("mouseleave", hide)
              }}>
              <p className="text-[13.5px] font-light leading-[1.8] text-stone-400 mt-3">{story.excerpt}</p>
            </div>
          )
        }

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-5 mt-5">
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
      {/* Ghost word */}
      <div className="absolute right-0 top-0 bottom-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="font-display font-black text-white/[0.02] leading-none h-full flex items-center"
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
          <a href="#signup" className="hidden lg:flex items-center gap-2 font-mono text-[10.5px] text-stone-600 hover:text-amber-400 transition-colors duration-200 uppercase tracking-[0.16em] group">
            Subscribe to read <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
      {/* Decorative quote mark */}
      <div className="absolute -left-6 top-8 font-display font-black leading-none select-none pointer-events-none"
        style={{ fontSize:"clamp(14rem,28vw,22rem)", lineHeight:0.85, zIndex:0, color:"rgba(217,119,6,0.04)" }}>
        &ldquo;
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionLabel>From Our Partners</SectionLabel>

        <div key={active} style={{ animation:"panelIn .4s cubic-bezier(.22,1,.36,1) forwards", ...rv(on) }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12 items-end mb-14 pb-14 border-b-2 border-stone-800/8">
            <div>
              <p className="font-display font-bold italic text-stone-800 leading-[1.3] tracking-[-0.015em]"
                style={{ fontSize:"clamp(1.6rem,3vw,2.4rem)" }}>
                {TESTIMONIALS[active].quote}
              </p>
              <div className="flex items-center gap-4 mt-8">
                <div className="h-11 w-11 rounded-full flex items-center justify-center text-[13px] font-black text-white"
                  style={{ background:"linear-gradient(135deg, #d97706, #92400e)", boxShadow:"0 4px 14px rgba(217,119,6,0.35)" }}>
                  {TESTIMONIALS[active].initials}
                </div>
                <div>
                  <div className="h-[2px] w-8 rounded-full mb-2.5" style={{ background:"linear-gradient(to right, #d97706, transparent)" }} />
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
                  <div className={`rounded-full transition-all duration-300 ${active === i ? "w-8 h-2 bg-amber-500" : "w-2 h-2 bg-stone-300 hover:bg-stone-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`text-left p-6 rounded-xl border-2 transition-all duration-250 ${active === i ? "border-amber-300/70 bg-amber-50/80 shadow-md shadow-amber-100/50" : "border-stone-200/60 bg-white/50 hover:border-stone-300 hover:bg-white/70"}`}
              style={rv(on, i * 80)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 transition-all duration-200"
                  style={{ background: active === i ? "linear-gradient(135deg,#d97706,#92400e)" : "linear-gradient(135deg,#d6d3d1,#a8a29e)" }}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[12px] text-stone-700">{t.author}</p>
                  <p className="font-mono text-[9.5px] text-stone-400">{t.org}</p>
                </div>
              </div>
              <p className="text-[13px] font-light italic leading-[1.75] text-stone-500 line-clamp-3">{t.quote}</p>
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
        <div className="font-display font-black text-white/[0.02] leading-none" style={{ fontSize:"clamp(12rem,26vw,22rem)", letterSpacing:"-0.05em", lineHeight:0.85, marginRight:"-1rem", marginBottom:"-1rem" }}>
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
          <p className="text-[15.5px] font-light leading-[1.9] text-stone-500 mb-14 max-w-[380px] border-l border-amber-500/25 pl-5">
            Most newsletters exist to sell you something. This one exists because something real is happening in Melbourne, FL.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {REASONS.map(({ icon:I, title, body }, i) => (
              <div key={title} className="reason-cell flex gap-4 py-6 border-b border-stone-800/60 group" style={rv(on, 80 + i * 55)}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/[0.08] mt-0.5 transition-all duration-200 group-hover:bg-amber-500/[0.14] group-hover:scale-105">
                  <I className="h-3.5 w-3.5 text-amber-400/70" />
                </div>
                <div>
                  <p className="font-bold text-[13.5px] text-stone-200 mb-1">{title}</p>
                  <p className="text-[12.5px] font-light leading-[1.75] text-stone-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4" style={rv(on, 100)}>
          {/* Promise card */}
          <div className="promise-card p-9 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-8 rounded-full" style={{ background:"linear-gradient(to right, #d97706, transparent)" }} />
              <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-stone-400">Our Promise</p>
            </div>
            <span className="font-display font-black text-[5rem] leading-none select-none block -mb-4"
              style={{ color:"rgba(217,119,6,0.15)" }}>&ldquo;</span>
            <p className="font-display font-bold italic text-[1.3rem] leading-[1.58] text-stone-800">
              We will never fill your inbox with fluff. Every email either tells you something real about what we&apos;re doing, or asks you to help us do more of it.
            </p>
            <div className="mt-7 pt-6 border-t border-stone-100 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                style={{ background:"linear-gradient(135deg,#d97706,#92400e)", boxShadow:"0 3px 10px rgba(217,119,6,0.3)" }}>KC</div>
              <div>
                <p className="font-bold text-[13px] text-stone-600">The KitCraft Student Team</p>
                <p className="font-mono text-[10.5px] text-stone-400 mt-0.5">West Shore Jr/Sr High · Melbourne, FL</p>
              </div>
            </div>
          </div>

          {/* 2×2 stat grid */}
          <div className="grid grid-cols-2 border border-stone-800/70 divide-x divide-y divide-stone-800/60 rounded-xl overflow-hidden">
            {[["~2","emails/month"],["0","ads or sponsors"],["6","topic categories"],["100%","student-written"]].map(([n, l]) => (
              <div key={l} className="px-7 py-7 group hover:bg-white/[0.04] transition-colors duration-300">
                <span className="font-display font-black text-white leading-none block stat-number-gradient" style={{ fontSize:"2.4rem" }}>{n}</span>
                <p className="font-mono text-[10px] font-bold text-stone-600 uppercase tracking-[0.14em] mt-2.5">{l}</p>
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
      {/* Background amber gradient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background:"radial-gradient(ellipse 60% 50% at 70% 50%, rgba(217,119,6,0.05) 0%, transparent 70%)" }} />
      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-16 lg:gap-24 items-start">
        <div style={rv(on)}>
          <SectionLabel>Join the Loop</SectionLabel>
          <h2 className="font-display font-black text-stone-900 leading-[0.95] tracking-[-0.03em] mb-5"
            style={{ fontSize:"clamp(2.6rem,5vw,4.2rem)" }}>
            Subscribe.<br />
            <em className="not-italic text-amber-600">Read. Be part of it.</em>
          </h2>
          <div className="flex items-center gap-4 mb-7">
            <div className="h-[2px] w-12 rounded-full bg-amber-500/50" />
            <div className="h-[2px] w-4 rounded-full bg-stone-200" />
          </div>
          <p className="text-[16px] font-light leading-[1.9] text-stone-500 mb-10 max-w-[380px]">
            Twice a month, a few hundred words from a 9th-grader who stayed up late finishing a build or drove a kit to a kid who&apos;d been waiting for it.
          </p>

          <div className="flex flex-col gap-3 mb-10">
            {["Choose exactly which topics land in your inbox","Stories written by the students themselves","First notice when we need volunteers","Impact reports: where every kit went","No ads, no sponsors, no affiliate links","One-click unsubscribe — no confirmation needed"].map((text, i) => (
              <div key={i} className="flex items-center gap-3.5 text-[14.5px] text-stone-600" style={rv(on, i * 45)}>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                  style={{ background:"linear-gradient(135deg, rgba(217,119,6,0.12), rgba(217,119,6,0.06))", border:"1px solid rgba(217,119,6,0.18)" }}>
                  <Check className="h-3 w-3 text-amber-600" />
                </div>
                {text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-6 border-t-2 border-stone-800/8 mt-2" style={rv(on, 300)}>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
              <MapPin className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <p className="font-mono text-[11px] text-stone-400">Melbourne, FL · Brevard County · Student-led nonprofit</p>
          </div>
        </div>

        <div className="lg:sticky lg:top-8" style={rv(on, 100)}>
          <div className="form-card rounded-2xl p-8 lg:p-10">
            <div className="mb-8 pb-7 border-b border-stone-100">
              <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-stone-400 mb-2.5">Free · No account needed</p>
              <h3 className="font-display font-black text-stone-900 leading-[1.02] tracking-[-0.025em]" style={{ fontSize:"1.85rem" }}>
                Subscribe to KitCraft
              </h3>
            </div>
            <NewsletterSignup className="max-w-none w-full" />
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
    <div className={`border-b transition-colors duration-200 ${isOpen ? "border-amber-900/30" : "border-stone-800/50"}`}
      style={rv(on, index * 50)}>
      <button onClick={onToggle} className="flex w-full items-start gap-5 py-6 text-left group" aria-expanded={isOpen}>
        <span className={`mt-0.5 shrink-0 font-mono text-[10px] font-bold tracking-[0.1em] transition-colors duration-200 ${isOpen ? "text-amber-400" : "text-stone-700 group-hover:text-stone-500"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`flex-1 font-display font-bold text-[1.08rem] leading-snug transition-colors duration-200 ${isOpen ? "text-white" : "text-stone-300 group-hover:text-stone-100"}`}>
          {item.q}
        </span>
        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-200 ${isOpen ? "border-amber-500/40 bg-amber-500/12 text-amber-400 rotate-0" : "border-stone-700 text-stone-600 group-hover:border-stone-500 group-hover:text-stone-400"}`}>
          {isOpen ? <Minus className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
        </div>
      </button>
      <div style={{ maxHeight: isOpen ? h : 0, overflow:"hidden", transition:"max-height .44s cubic-bezier(.22,1,.36,1)" }}>
        <div ref={bodyRef} className="pb-7 pl-[3.75rem]">
          <p className="text-[15px] font-light leading-[1.9] text-stone-400">{item.a}</p>
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
            <span className="text-stone-700">We&apos;ve got answers.</span>
          </h2>
        </div>
        <div className="border-t border-stone-800/50">
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
            style={{ background:"radial-gradient(ellipse 60% 65% at 10% 50%, rgba(217,119,6,0.13) 0%, transparent 60%)" }} />
          {/* Top amber border */}
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background:"linear-gradient(to right, transparent, rgba(217,119,6,0.4), transparent)" }} />
          {/* Ghost text */}
          <div className="absolute -bottom-8 -right-6 font-display font-black text-white/[0.035] leading-none select-none pointer-events-none"
            style={{ fontSize:"clamp(9rem,20vw,18rem)", letterSpacing:"-0.05em" }}>
            MORE
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_210px] gap-12 items-center px-10 py-14 lg:px-16 lg:py-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-6 bg-amber-400/40" />
                <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.35em] text-amber-400/60">More from KitCraft</p>
              </div>
              <h2 className="font-display font-black text-white leading-[0.97] tracking-[-0.03em] mb-4"
                style={{ fontSize:"clamp(2rem,3.5vw,3rem)" }}>
                Want to do more<br />than read about it?
              </h2>
              <p className="text-[15.5px] font-light leading-[1.9] text-stone-400 max-w-lg mb-4">
                Sponsor a kit, volunteer on a delivery run, or order kits for your school. Every action puts a STEM kit in a child&apos;s hands.
              </p>
              <p className="font-mono text-[10px] text-stone-700 uppercase tracking-[0.14em]">100% of donations toward production · Zero overhead</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link href="https://www.kitcraftcollective.org/help-out" className="btn-primary flex items-center justify-center gap-2 text-center">
                <Heart className="h-3.5 w-3.5" /> Sponsor a Kit
              </Link>
              <Link href="https://www.kitcraftcollective.org/order-kits" className="btn-ghost flex items-center justify-center gap-2">
                <Package className="h-3.5 w-3.5" /> Order for a School
              </Link>
              <Link href="/https://www.kitcraftcollective.org/careers" className="btn-ghost flex items-center justify-center gap-2">
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

        *, *::before, *::after { box-sizing: border-box; }

        /* ── Font utilities ── */
        .font-display { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-feature-settings: "kern" 1, "liga" 1, "calt" 1; }
        .font-mono    { font-family: 'DM Mono', 'Fira Code', 'Courier New', monospace; font-feature-settings: "kern" 0; }
        .font-body    { font-family: 'Lora', Georgia, serif; }

        /* ── Section backgrounds ── */
        .dark-section  { background-color: #111110; }
        .cream-section {
          background-color: #f5f2ec;
          background-image: radial-gradient(ellipse 80% 60% at 100% 0%, rgba(217,119,6,0.03) 0%, transparent 60%);
        }

        /* ── Hero ── */
        .hero-section {
          background-color: #111110;
          background-image:
            radial-gradient(ellipse 70% 50% at 40% -10%, rgba(217,119,6,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 35% at 90% 60%, rgba(30,64,175,0.04) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 5% 80%, rgba(124,58,237,0.03) 0%, transparent 50%);
        }

        /* ── Hero headline gradient ── */
        .hero-gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.88) 50%, rgba(255,255,255,0.75) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Stat number gradient ── */
        .stat-number-gradient {
          background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.82) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Grain overlay ── */
        .grain-overlay {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 2;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .dark-section  .grain-overlay { opacity: 0.032; }
        .hero-section  .grain-overlay { opacity: 0.038; }

        /* ── Paper texture lines on hero ── */
        .hero-lines {
          background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.013) 28px);
        }

        /* ── Ticker ── */
        .ticker-wrap { position: relative; z-index: 5; }

        /* ── Primary button ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.02em;
          padding: 14px 28px;
          border-radius: 100px;
          border: none; cursor: pointer;
          text-decoration: none;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.18) inset,
            0 4px 24px rgba(217,119,6,0.40),
            0 1px 4px rgba(0,0,0,0.2);
          transition: all .22s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.12), transparent);
          border-radius: inherit;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.2) inset,
            0 6px 32px rgba(217,119,6,0.50),
            0 2px 8px rgba(0,0,0,0.25);
          transform: translateY(-2px);
        }
        .btn-primary:active { transform: scale(0.975); }

        /* ── Ghost button ── */
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background-color: rgba(255,255,255,0.055);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Mono', monospace;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.02em;
          padding: 13px 24px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.11);
          cursor: pointer; text-decoration: none;
          transition: all .22s ease;
          backdrop-filter: blur(4px);
        }
        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.80);
          background-color: rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }

        /* ── Story cards ── */
        .story-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%);
          border: 1.5px solid rgba(255,255,255,0.08);
          cursor: default;
          transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
        }
        .story-card:hover {
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.25);
        }

        /* ── Stat cell ── */
        .stat-cell {
          transition: background-color .3s ease;
          background-color: transparent;
        }
        .stat-cell:hover { background-color: rgba(255,255,255,0.02); }

        /* ── Reason cell ── */
        .reason-cell:nth-child(odd)  { border-right: 1px solid rgba(255,255,255,0.05); padding-right: 2rem; }
        .reason-cell:nth-child(even) { padding-left: 2rem; }

        /* ── Promise card ── */
        .promise-card {
          background: linear-gradient(145deg, #fefcf8 0%, #faf7f0 100%);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.06),
            0 4px 0 rgba(0,0,0,0.04),
            0 14px 50px rgba(0,0,0,0.08);
        }

        /* ── Form card ── */
        .form-card {
          background: linear-gradient(160deg, #ffffff 0%, #fefcf9 100%);
          border: 1.5px solid rgba(0,0,0,0.06);
          box-shadow:
            0 0 0 1px rgba(217,119,6,0.04),
            0 4px 0 rgba(0,0,0,0.03),
            0 16px 56px rgba(0,0,0,0.09),
            0 0 80px rgba(217,119,6,0.04);
        }

        /* ── CTA card ── */
        .cta-card {
          background: linear-gradient(145deg, #1e1c1a 0%, #181614 100%);
          border: 1.5px solid rgba(255,255,255,0.07);
          box-shadow: 0 0 0 1px rgba(217,119,6,0.08), 0 20px 60px rgba(0,0,0,0.25);
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
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .reason-cell:nth-child(odd)  { border-right: none; padding-right: 0; }
          .reason-cell:nth-child(even) { padding-left: 0; }
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111110; }
        ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(217,119,6,0.5); }
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