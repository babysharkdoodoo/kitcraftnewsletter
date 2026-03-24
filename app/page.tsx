"use client"

import { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react"
import Link from "next/link"
import {
  ArrowRight, BookOpen, Heart, Sparkles, Star, Package,
  Truck, Users, Award, MessageCircle, Layers, CheckCircle,
  MapPin, Mail, ChevronDown, Eye, Check,
  Hammer, Search, Plus, Minus, ArrowUpRight, Zap,
} from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"

/* ═══════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.06) {
  const ref = useRef<HTMLElement | null>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, on }
}

function useCountUp(target: number, dur = 1600, go = true) {
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
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, dur, go])
  return v
}

/* ═══════════════════════════════════════════════════════════════════════
   DATA — all real, from the KitCraft Collective internal roadmap
═══════════════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: "kit-releases",
    icon: Package,
    label: "Kit Releases",
    tagline: "First look at every new build.",
    desc: "When we finish designing a new kit — the CAD decisions, what broke during testing, what inspired the concept, and which kids it's going to. Currently: catapult kits and domino machines.",
    freq: "Every launch",
    accent: "#6d28d9",
    light: "#ede9fe",
  },
  {
    id: "impact",
    icon: Heart,
    label: "Impact Stories",
    tagline: "The moments that stick.",
    desc: "Real stories from children, parents, and staff at our partner organizations — West Melbourne School for Science, Palm Bay Elementary, and the hospital and shelter programs we're building toward.",
    freq: "Monthly",
    accent: "#be185d",
    light: "#fce7f3",
  },
  {
    id: "delivery",
    icon: Truck,
    label: "Delivery Updates",
    tagline: "Where the kits went. Who got them.",
    desc: "When kits go out — how many, which school or shelter received them, what the handoff looked like, and the students who drove them there. Heading toward Salvation Army, Community of Hope, and Family Promise.",
    freq: "Per delivery",
    accent: "#0369a1",
    light: "#e0f2fe",
  },
  {
    id: "behind-scenes",
    icon: BookOpen,
    label: "Behind the Build",
    tagline: "The real process, unfiltered.",
    desc: "What the team is designing, printing, and breaking. The overnight print runs, the joints that kept snapping, and the Tuesday when we finally got the catapult arm geometry right.",
    freq: "Monthly",
    accent: "#b45309",
    light: "#fef3c7",
  },
  {
    id: "volunteer",
    icon: Users,
    label: "Volunteer Calls",
    tagline: "First notice when we need hands.",
    desc: "Assembly days, delivery runs, and community events. We reach subscribers before we post anywhere else — especially as we scale from 10 kits to 50+.",
    freq: "As needed",
    accent: "#1d4ed8",
    light: "#dbeafe",
  },
  {
    id: "fundraising",
    icon: Sparkles,
    label: "Fundraising",
    tagline: "Every dollar goes to a kit.",
    desc: "Donation drives and campaigns — including our current push for a high-precision printer ($800–$1,000) that would triple our production capacity. We explain what the money builds before we ask for it.",
    freq: "Per campaign",
    accent: "#c2410c",
    light: "#ffedd5",
  },
]

const STATS = [
  { value: 15,  suffix: "+", label: "Kits printed",           sub: "proof-of-concept phase"        },
  { value: 10,  suffix: "+", label: "Kits in children's hands", sub: "and counting"                },
  { value: 2,   suffix: "",  label: "Active pilot partners",   sub: "West Melbourne & Palm Bay"     },
  { value: 5,   suffix: "",  label: "Student founders",        sub: "West Shore Jr/Sr High, 9th grade" },
]

const STORIES = [
  {
    issue: "03",
    date: "Feb 2026",
    title: "The domino machine arm that kept snapping at 2am",
    excerpt: "The third prototype was almost there — except the pivot joint sheared clean off every time we tested it. Three of us stayed until the print finished and we figured out why.",
    category: "Behind the Build",
    mins: 5,
    author: "Aryan, Technical Lead",
  },
  {
    issue: "02",
    date: "Jan 2026",
    title: "First delivery: what West Melbourne School for Science said",
    excerpt: "We packed ten catapult kits into a car and drove them to our first real partner. The teacher's exact words when the kids started building: 'I've never seen this class this quiet.'",
    category: "Delivery",
    mins: 4,
    author: "Sankeerth, VP",
  },
  {
    issue: "01",
    date: "Dec 2025",
    title: "Why we're building a catapult for a kid we've never met",
    excerpt: "The idea came out of a Boy Scout service trip where we kept seeing the same thing: kids in waiting rooms and shelters with nothing to do. Here's how that turned into a 3D printing operation.",
    category: "Impact",
    mins: 6,
    author: "Faizan, President",
  },
]

const TESTIMONIALS = [
  {
    quote: "I've never seen this class this quiet — they were completely focused on getting the catapult to actually fire. Then when it did, the whole room erupted.",
    author: "STEM Teacher",
    org: "West Melbourne School for Science",
    stars: 5,
  },
  {
    quote: "The kits are smart — they don't feel like classroom materials. The kids engage with them like they're discovering something, not completing an assignment.",
    author: "Program Coordinator",
    org: "Palm Bay Elementary",
    stars: 5,
  },
  {
    quote: "A student-built STEM kit for kids in shelters and hospitals — that's exactly the kind of thing we want to bring into our programs. The mission aligns completely.",
    author: "Director of Programs",
    org: "Brevard Family Partnership",
    stars: 5,
  },
]

const REASONS = [
  { icon: Star,          title: "Written by the builders",    body: "Every issue comes from a 9th-grader at West Shore Jr/Sr High who actually designed or delivered the kit being described." },
  { icon: Heart,         title: "Zero ads. Zero sponsors.",   body: "We don't monetize your attention. The newsletter exists to share what we're doing — nothing else is in the envelope."        },
  { icon: MapPin,        title: "Hyper-local.",               body: "Brevard County, FL. Real schools, real shelters — places you might actually drive past on US-1."                          },
  { icon: Award,         title: "~2 emails per month.",      body: "We only send when there's something real to say. We've never sent three in a month."                                        },
  { icon: Layers,        title: "You pick the topics.",       body: "Six categories. Subscribe to any combination. Change your preferences any time from any email footer."                     },
  { icon: MessageCircle, title: "Reply and we write back.",   body: "Hit reply on any issue and a real student responds. Not a form. Usually within 48 hours."                                 },
]

const PROCESS_STEPS = [
  { n: "01", icon: Hammer,   title: "We design a kit",       body: "CAD models, prototyping, iterative testing. Every kit goes through multiple print-and-test cycles before it leaves the school." },
  { n: "02", icon: Zap,      title: "We print and inspect",  body: "Printed on FDM printers at West Shore. Every component is checked against dimensional tolerances and stress-tested before assembly." },
  { n: "03", icon: Package,  title: "We pack it for a child", body: "Assembly instructions go in every box. Components are sorted in build order. Kits are designed to be reused — not used once." },
  { n: "04", icon: Mail,     title: "We write about it",     body: "Whoever lived the story writes the issue. Then it lands in your inbox — in the categories you asked for, and only those." },
]

const FAQ_ITEMS = [
  { q: "How often will I actually receive emails?",           a: "About twice a month. We've never sent more than two in a single month. Some months it's one — we only send when there's something real to report from our builds or deliveries."         },
  { q: "What are the six topics I can choose from?",         a: "Kit Releases, Impact Stories, Delivery Updates, Behind the Build, Volunteer Calls, and Fundraising. Check any combination. Most subscribers pick two or three."                         },
  { q: "Where do the kits actually go?",                     a: "Currently West Melbourne School for Science and Palm Bay Elementary. We're formalizing partnerships with Salvation Army, Community of Hope, and Family Promise for hospital and shelter distribution." },
  { q: "Who runs KitCraft Collective?",                      a: "Five 9th-grade students at West Shore Jr/Sr High School in Melbourne, FL: Faizan Ahmed (President), Sankeerth Kesireddy (VP), Aryan (Technical Lead), Kairav (Treasurer), and Anay Patel." },
  { q: "Is anything being sold in the newsletter?",          a: "No. No sponsors, no affiliate links, no product promotions. Occasionally we announce a fundraising campaign for the kits themselves — we always explain what the money builds first." },
  { q: "How do I unsubscribe?",                              a: "Every email has an unsubscribe link in the footer. One click, no confirmation required, instant removal. We don't ask why." },
]

/* ═══════════════════════════════════════════════════════════════════════
   REVEAL STYLE HELPER
═══════════════════════════════════════════════════════════════════════ */
const rv = (on: boolean, d = 0): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(20px)",
  transition: `opacity .65s ease ${d}ms, transform .65s ease ${d}ms`,
})

/* ═══════════════════════════════════════════════════════════════════════
   SHARED: BLOB DARK BG (from the blue version)
═══════════════════════════════════════════════════════════════════════ */
function BlobDark({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: "#111118" }}>
      {/* Animated blob glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 -left-24 h-[600px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.55) 0%, transparent 65%)", filter: "blur(72px)", opacity: 0.18, animation: "blobA 18s ease-in-out infinite alternate" }} />
        <div className="absolute -right-16 top-0 h-[480px] w-[480px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(2,132,199,0.55) 0%, transparent 65%)", filter: "blur(60px)", opacity: 0.13, animation: "blobB 14s ease-in-out infinite alternate" }} />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,119,6,0.40) 0%, transparent 65%)", filter: "blur(50px)", opacity: 0.08, animation: "blobC 22s ease-in-out infinite alternate" }} />
      </div>
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  )
}

/* ─── Rule label ─────────────────────────────────────────────────── */
function RuleLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`h-px w-8 ${light ? "bg-amber-400/60" : "bg-amber-500/70"}`} />
      <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.35em] whitespace-nowrap ${light ? "text-amber-300/70" : "text-amber-600/90"}`}>
        {children}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 1 — HERO
═══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t) }, [])
  const r = (d: number): React.CSSProperties => ({
    opacity: m ? 1 : 0,
    transform: m ? "none" : "translateY(24px)",
    transition: `opacity .9s cubic-bezier(.22,1,.36,1) ${d}ms, transform .9s cubic-bezier(.22,1,.36,1) ${d}ms`,
  })

  return (
    <BlobDark className="min-h-screen flex flex-col">
      {/* Masthead */}
      <div className="relative z-10 border-b border-white/[0.06] px-8 lg:px-16 py-4 flex items-center justify-between"
        style={{ opacity: m ? 1 : 0, transition: "opacity .6s ease" }}>
        <div className="flex items-center gap-5">
          <span className="font-display font-bold text-white text-[1.1rem] tracking-tight">KitCraft Collective</span>
          <span className="hidden sm:block font-mono text-[9px] text-white/25 uppercase tracking-[0.25em]">Newsletter</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:block font-mono text-[9px] text-white/25 tracking-[0.2em]">Melbourne, FL</span>
          <span className="font-mono text-[9px] text-white/20 tracking-[0.2em]">Est. 2024</span>
          <a href="#signup" className="border border-white/[0.12] rounded-md font-mono text-[10px] uppercase tracking-[0.18em] px-4 py-2 text-white/40 hover:border-white/25 hover:text-white/65 transition-colors">
            Subscribe
          </a>
        </div>
      </div>

      {/* Hero body */}
      <div className="relative z-10 flex-1 px-8 lg:px-16 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 max-w-7xl mx-auto w-full items-center">

        {/* Ghost text */}
        <div className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none pointer-events-none"
          style={{ fontSize: "clamp(10rem,24vw,20rem)", color: "rgba(255,255,255,0.022)", letterSpacing: "-0.04em", opacity: m ? 1 : 0, transition: "opacity 1.4s ease 300ms" }}>
          LOOP
        </div>

        <div className="relative">
          <div style={r(0)} className="flex items-center gap-3 mb-10">
            <div className="h-px w-10 bg-amber-500/70" />
            <span className="font-mono text-[9px] text-amber-400/80 uppercase tracking-[0.35em]">The KitCraft Newsletter</span>
            <div className="h-px w-4 bg-amber-500/30" />
          </div>

          <h1 className="font-display font-black text-white leading-[0.95] tracking-[-0.03em] mb-8"
            style={{ fontSize: "clamp(3.8rem,9vw,7rem)", ...r(80) }}>
            The loop<span className="text-amber-400">.</span><br />
            <span style={{ color: "rgba(255,255,255,0.38)" }}>For people<br />who care.</span>
          </h1>

          <div style={{ ...r(180), marginBottom: 28 }}>
            <div className="flex items-center gap-4">
              <div className="h-[1.5px] w-16 bg-amber-500/50 rounded-full" />
              <div className="h-[1.5px] w-6 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />
            </div>
          </div>

          <p className="text-[16px] font-light leading-[1.85] max-w-[500px] mb-10" style={{ color: "rgba(255,255,255,0.42)", ...r(240) }}>
            Twice a month — real stories from the 9th-graders at West Shore Jr/Sr High who design the kits, updates on where they went, and ways to help. Straight from Brevard County, FL.
          </p>

          <div className="flex flex-wrap gap-3 mb-12" style={r(320)}>
            <a href="#signup" className="kc-btn-primary flex items-center gap-2.5">
              <Mail className="h-3.5 w-3.5" /> Subscribe free <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a href="#what-you-get" className="kc-btn-outline flex items-center gap-2">
              See what's inside <ChevronDown className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-2" style={r(380)}>
            {["~2 emails/month", "Written by students", "No ads. Ever.", "Unsubscribe anytime"].map((t, i) => (
              <span key={t} className="flex items-center gap-2 font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.30)" }}>
                {i > 0 && <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>}
                <CheckCircle className="h-2.5 w-2.5 text-amber-500/60" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="hidden lg:block relative" style={r(120)}>
          <div className="kc-panel">
            <div className="absolute -top-3 -left-2 font-mono text-[8px] uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.22)" }}>
              What you'll receive
            </div>
            {CATEGORIES.map((cat, i) => {
              const I = cat.icon
              return (
                <div key={cat.id} className="kc-category-row flex items-center gap-3.5 py-3.5"
                  style={{ opacity: m ? 1 : 0, transform: m ? "none" : "translateX(16px)", transition: `opacity .7s ease ${220 + i * 60}ms, transform .7s ease ${220 + i * 60}ms` }}>
                  <div className="kc-cat-dot" style={{ backgroundColor: cat.accent }} />
                  <p className="flex-1 font-display text-[13.5px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.60)" }}>{cat.label}</p>
                  <span className="font-mono text-[9px] shrink-0" style={{ color: "rgba(255,255,255,0.22)" }}>{cat.freq}</span>
                </div>
              )
            })}
            <a href="#signup"
              className="flex items-center gap-2 pt-4 mt-1 border-t border-white/[0.07] font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-amber-400"
              style={{ color: "rgba(255,255,255,0.25)", opacity: m ? 1 : 0, transition: "opacity .7s ease 600ms, color .2s ease" }}>
              Subscribe to all <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 pb-8 flex justify-center"
        style={{ opacity: m ? 0.4 : 0, transition: "opacity .8s ease 1.2s", animation: m ? "scrollBounce 2.4s ease-in-out infinite" : "none" }}>
        <ChevronDown className="h-5 w-5 text-white" />
      </div>
    </BlobDark>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 2 — WHAT YOU GET  ·  cream
═══════════════════════════════════════════════════════════════════════ */
function WhatYouGet() {
  const { ref, on } = useReveal()
  const [active, setActive] = useState(0)
  const cat = CATEGORIES[active]
  const I = cat.icon

  return (
    <section id="what-you-get" ref={ref as React.RefObject<HTMLElement>} className="kc-cream px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 pb-10 border-b border-stone-200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end" style={rv(on)}>
          <div>
            <RuleLabel>What's Inside</RuleLabel>
            <h2 className="font-display font-black text-stone-900 leading-[0.97] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)" }}>
              Six topics.<br />
              <span className="text-amber-600">You pick what lands.</span>
            </h2>
          </div>
          <p className="text-[15px] font-light leading-[1.85] text-stone-500">
            Choose exactly what you want to hear about. We only ever send what you subscribed to — no algorithm, no padding, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0">
          {/* Tab list */}
          <div className="border-r border-stone-200">
            {CATEGORIES.map((c, i) => {
              const Ic = c.icon
              const isActive = active === i
              return (
                <button key={c.id} onClick={() => setActive(i)}
                  className={`group w-full py-4 pr-6 text-left border-b border-stone-100 transition-all duration-150 ${isActive ? "" : "hover:bg-stone-50/70"}`}
                  style={rv(on, i * 35)}>
                  <div className="flex items-center gap-3">
                    <div className="w-[3px] self-stretch rounded-full shrink-0 transition-colors"
                      style={{ minHeight: 44, backgroundColor: isActive ? c.accent : "transparent" }} />
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all"
                      style={{ backgroundColor: isActive ? `${c.accent}18` : "transparent", color: isActive ? c.accent : "#a8a29e" }}>
                      <Ic className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-bold leading-tight transition-colors ${isActive ? "text-stone-900" : "text-stone-500 group-hover:text-stone-700"}`}>{c.label}</p>
                      <p className="font-mono text-[9.5px] mt-0.5 text-stone-400">{c.freq}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail pane */}
          <div className="px-0 lg:pl-14 py-8 flex flex-col justify-center" style={rv(on, 80)}>
            <div key={active} style={{ animation: "panelIn .3s cubic-bezier(.22,1,.36,1) forwards" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.accent}15`, color: cat.accent }}>
                  <I className="h-4 w-4" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full" style={{ backgroundColor: `${cat.accent}12`, color: cat.accent }}>
                  {cat.freq}
                </span>
              </div>
              <h3 className="font-display font-black text-stone-900 leading-[1.05] tracking-[-0.02em] mb-3"
                style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>{cat.label}</h3>
              <p className="text-[15px] font-semibold italic mb-5" style={{ color: cat.accent }}>{cat.tagline}</p>
              <p className="text-[15px] font-light leading-[1.85] text-stone-500 mb-8 max-w-md">{cat.desc}</p>
              <a href="#signup" className="inline-flex items-center gap-2 font-bold text-[13px] px-5 py-3 rounded-full transition-all hover:opacity-80"
                style={{ backgroundColor: `${cat.accent}14`, color: cat.accent, border: `1.5px solid ${cat.accent}30` }}>
                Subscribe to receive this <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-8 font-mono text-[11px] text-stone-400" style={rv(on, 300)}>
          Select any combination · Change anytime from any email footer · No account needed
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 3 — STATS  ·  blob dark
═══════════════════════════════════════════════════════════════════════ */
function StatItem({ stat, on, i }: { stat: typeof STATS[number]; on: boolean; i: number }) {
  const count = useCountUp(stat.value, 1600, on)
  return (
    <div className="relative overflow-hidden flex flex-col justify-between p-10 py-12 border-r border-white/[0.06] last:border-r-0" style={rv(on, i * 80)}>
      <div className="absolute -bottom-4 -right-2 font-display font-black leading-none select-none pointer-events-none"
        style={{ fontSize: "8rem", color: "rgba(255,255,255,0.032)", letterSpacing: "-0.05em" }}>
        {stat.value}
      </div>
      <div className="relative">
        <div className="flex items-baseline gap-0.5 mb-5">
          <span className="font-display font-black text-white leading-none" style={{ fontSize: "clamp(3rem,5vw,4.5rem)" }}>
            {on ? count.toLocaleString() : "0"}
          </span>
          <span className="font-display font-black text-amber-400 leading-none" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}>
            {stat.suffix}
          </span>
        </div>
        <div className="h-px w-10 bg-amber-500/40 mb-4" />
        <p className="font-bold text-[13.5px] text-stone-300">{stat.label}</p>
        <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.1em] mt-1">{stat.sub}</p>
      </div>
    </div>
  )
}

function Stats() {
  const { ref, on } = useReveal(0.1)
  return (
    <BlobDark>
      <section ref={ref as React.RefObject<HTMLElement>} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none pointer-events-none"
          style={{ fontSize: "clamp(10rem,25vw,18rem)", color: "rgba(255,255,255,0.022)", letterSpacing: "-0.04em" }}>
          BUILT
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[260px_1fr]">
            <div className="flex flex-col justify-center pr-14 py-8 mb-10 lg:mb-0 lg:border-r lg:border-white/[0.07]" style={rv(on)}>
              <RuleLabel light>By the numbers</RuleLabel>
              <h2 className="font-display font-black text-white leading-[0.97] tracking-[-0.025em]"
                style={{ fontSize: "clamp(1.9rem,3.2vw,2.8rem)" }}>
                Where we are.<br />Where we're going.
              </h2>
              <p className="font-mono text-[9.5px] text-stone-600 uppercase tracking-[0.14em] leading-[1.9] mt-6">
                Proof-of-concept complete<br />Melbourne, FL · Est. 2024
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.06]">
              {STATS.map((s, i) => <StatItem key={s.label} stat={s} on={on} i={i} />)}
            </div>
          </div>
        </div>
      </section>
    </BlobDark>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 4 — HOW IT WORKS  ·  cream
═══════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="kc-cream px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-end pb-12 border-b border-stone-200" style={rv(on)}>
          <div>
            <RuleLabel>The Process</RuleLabel>
            <h2 className="font-display font-black text-stone-900 leading-[0.97] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.4rem,4.5vw,3.8rem)" }}>
              From CAD file<br />to a child's hands.
            </h2>
          </div>
          <p className="text-[15px] font-light leading-[1.85] text-stone-500">
            No editorial staff. No content calendar. Just students writing about what actually happened in the build room or on the delivery run.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-0">
          {PROCESS_STEPS.map((step, i) => {
            const I = step.icon
            return (
              <div key={i} className="relative lg:pr-10" style={rv(on, i * 90)}>
                <div className="absolute -top-4 left-0 font-display font-black leading-none select-none pointer-events-none"
                  style={{ fontSize: "7rem", color: "rgba(0,0,0,0.04)", letterSpacing: "-0.04em" }}>
                  {step.n}
                </div>
                <div className="relative z-10 flex items-center gap-4 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50">
                    <I className="h-4 w-4 text-amber-600" />
                  </div>
                  {i < 3 && <div className="hidden lg:block flex-1 h-px bg-stone-200" />}
                </div>
                <p className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2">{step.n}</p>
                <h3 className="font-display font-bold text-[1.15rem] text-stone-800 mb-2.5 leading-snug">{step.title}</h3>
                <p className="text-[13.5px] font-light leading-[1.78] text-stone-500">{step.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 5 — RECENT STORIES  ·  blob dark
═══════════════════════════════════════════════════════════════════════ */
function RecentStories() {
  const { ref, on } = useReveal()
  const CATEGORY_COLORS: Record<string, string> = {
    "Behind the Build": "#b45309",
    "Delivery": "#0369a1",
    "Impact": "#be185d",
  }
  const [featured, ...rest] = STORIES

  return (
    <BlobDark>
      <section ref={ref as React.RefObject<HTMLElement>} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 font-display font-black leading-none select-none pointer-events-none"
          style={{ fontSize: "clamp(8rem,20vw,16rem)", color: "rgba(255,255,255,0.022)", letterSpacing: "-0.04em", writingMode: "vertical-rl", textOrientation: "mixed" }}>
          ISSUES
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-8 mb-14" style={rv(on)}>
            <div>
              <RuleLabel light>From the Archive</RuleLabel>
              <h2 className="font-display font-black text-white leading-[0.97] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}>
                Recent issues.
              </h2>
            </div>
            <a href="#signup" className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-stone-500 hover:text-amber-400 transition-colors uppercase tracking-[0.15em]">
              Subscribe to read more <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
            {/* Featured */}
            <div className="kc-story-card featured flex flex-col justify-end p-10 min-h-[460px]" style={rv(on, 60)}>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-sm"
                  style={{ backgroundColor: `${CATEGORY_COLORS[featured.category]}20`, color: CATEGORY_COLORS[featured.category] }}>
                  {featured.category}
                </span>
                <span className="font-mono text-[10px] text-stone-600">Issue #{featured.issue} · {featured.date}</span>
              </div>
              <h3 className="font-display font-black text-white leading-[1.1] tracking-[-0.02em] mb-4"
                style={{ fontSize: "clamp(1.6rem,2.8vw,2.2rem)", maxWidth: 480 }}>
                {featured.title}
              </h3>
              <p className="text-[14.5px] font-light leading-[1.75] text-stone-400 mb-6 max-w-lg line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center justify-between border-t border-stone-800 pt-5">
                <span className="flex items-center gap-2 font-mono text-[11px] text-stone-600">
                  <Eye className="h-3.5 w-3.5" />{featured.mins} min read · {featured.author}
                </span>
                <a href="#signup" className="flex items-center gap-1.5 font-mono text-[11px] text-amber-500 hover:text-amber-400 transition-colors">
                  Subscribe to read <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Small cards */}
            <div className="flex flex-col gap-4">
              {rest.map((story, i) => (
                <div key={i} className="kc-story-card flex-1 flex flex-col justify-between p-7" style={rv(on, 140 + i * 80)}>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                        style={{ backgroundColor: `${CATEGORY_COLORS[story.category]}20`, color: CATEGORY_COLORS[story.category] }}>
                        {story.category}
                      </span>
                      <span className="font-mono text-[10px] text-stone-600">#{story.issue} · {story.date}</span>
                    </div>
                    <h3 className="font-display font-bold leading-snug text-[1.05rem]" style={{ color: "rgba(255,255,255,0.85)" }}>{story.title}</h3>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-stone-800 pt-4">
                    <span className="font-mono text-[10.5px] text-stone-600">{story.mins} min · {story.author}</span>
                    <a href="#signup" className="font-mono text-[10px] text-stone-500 hover:text-amber-400 transition-colors">Read →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </BlobDark>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 6 — TESTIMONIALS  ·  cream (editorial pull-quote style)
═══════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const { ref, on } = useReveal()
  const [featured, ...rest] = TESTIMONIALS

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="kc-cream px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <RuleLabel>From Our Partners</RuleLabel>

        <div className="mb-16 pb-16 border-b border-stone-200 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10 items-start" style={rv(on)}>
          <div>
            <span className="font-display font-black leading-none text-stone-100 select-none block -mb-8" style={{ fontSize: "7rem" }}>&ldquo;</span>
            <p className="font-display font-bold italic text-stone-800 leading-[1.3] tracking-[-0.01em]"
              style={{ fontSize: "clamp(1.5rem,2.8vw,2.2rem)" }}>
              {featured.quote}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-[2px] w-10 bg-amber-500/60" />
              <div>
                <p className="font-bold text-[13.5px] text-stone-700">{featured.author}</p>
                <p className="font-mono text-[10.5px] text-stone-400 mt-0.5">{featured.org}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-1">
              {Array.from({ length: featured.stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current text-amber-400" />)}
            </div>
            <p className="font-mono text-[10px] text-stone-400 uppercase tracking-[0.2em] mt-4">Partner Review</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {rest.map((t, i) => (
            <div key={i} className="flex gap-6" style={rv(on, 80 + i * 80)}>
              <div className="h-full w-[2px] rounded-full bg-stone-200 shrink-0 mt-1" />
              <div>
                <p className="text-[15px] font-light italic leading-[1.8] text-stone-600 mb-4">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-current text-amber-400" />)}</div>
                  <p className="font-bold text-[12.5px] text-stone-700">{t.author}</p>
                  <span className="text-stone-300">·</span>
                  <p className="font-mono text-[10.5px] text-stone-400">{t.org}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 7 — WHY SUBSCRIBE  ·  blob dark
═══════════════════════════════════════════════════════════════════════ */
function WhySubscribe() {
  const { ref, on } = useReveal()
  return (
    <BlobDark>
      <section ref={ref as React.RefObject<HTMLElement>} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="absolute right-0 bottom-0 font-display font-black leading-none select-none pointer-events-none"
          style={{ fontSize: "clamp(10rem,22vw,18rem)", color: "rgba(255,255,255,0.020)", letterSpacing: "-0.04em", lineHeight: 0.85 }}>
          WHY
        </div>
        <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-24">

          <div style={rv(on)}>
            <RuleLabel light>Why Subscribe</RuleLabel>
            <h2 className="font-display font-black text-white leading-[0.97] tracking-[-0.025em] mb-6"
              style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}>
              A newsletter<br />worth opening.
            </h2>
            <p className="text-[15px] font-light leading-[1.85] text-stone-400 mb-14 max-w-sm">
              Most newsletters exist to sell you something. This one exists because nine 9th-graders in Melbourne, FL are building STEM kits for kids in hospitals and shelters — and people keep asking how it's going.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {REASONS.map(({ icon: I, title, body }, i) => (
                <div key={title} className="flex flex-col gap-2.5" style={rv(on, 80 + i * 45)}>
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10">
                    <I className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <p className="font-bold text-[13.5px] text-stone-200">{title}</p>
                  <p className="text-[12.5px] font-light leading-[1.75] text-stone-500">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4" style={rv(on, 100)}>
            {/* Promise card — white */}
            <div className="bg-[#faf8f4] rounded-2xl p-8 shadow-xl shadow-black/[0.14]">
              <div className="h-[2px] w-8 bg-amber-500 rounded-full mb-5" />
              <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.32em] text-stone-500 mb-4">Our Promise</p>
              <p className="font-display font-bold italic text-[1.25rem] leading-[1.55] text-stone-900">
                &ldquo;We will never fill your inbox with fluff. Every email either tells you something real about what we&apos;re building, or asks you to help us do more of it.&rdquo;
              </p>
              <div className="mt-6 pt-5 border-t border-stone-100">
                <p className="font-bold text-[13px] text-stone-600">— The KitCraft Collective Team</p>
                <p className="font-mono text-[11px] text-stone-400 mt-0.5">West Shore Jr/Sr High · Melbourne, FL · Est. 2024</p>
              </div>
            </div>

            {/* Quick stat grid */}
            <div className="grid grid-cols-2 border border-white/[0.07] divide-x divide-y divide-white/[0.07]">
              {[["~2", "emails/month"], ["0", "ads or sponsors"], ["6", "topic categories"], ["100%", "student-written"]].map(([n, l]) => (
                <div key={l} className="px-7 py-6">
                  <span className="font-display font-black text-white leading-none block" style={{ fontSize: "2.2rem" }}>{n}</span>
                  <p className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-[0.1em] mt-2">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </BlobDark>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 8 — SIGNUP  ·  cream  ·  centered, full-width form
═══════════════════════════════════════════════════════════════════════ */
function SignupSection() {
  const { ref, on } = useReveal()
  return (
    <section id="signup" ref={ref as React.RefObject<HTMLElement>} className="kc-cream px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-3xl">

        {/* Section header — centered */}
        <div className="text-center mb-12" style={rv(on)}>
          <RuleLabel>Join the Loop</RuleLabel>
          <h2 className="font-display font-black text-stone-900 leading-[0.97] tracking-[-0.025em] mb-5"
            style={{ fontSize: "clamp(2.4rem,4.5vw,3.6rem)" }}>
            Subscribe.<br />
            <span className="text-amber-600">Read. Be part of it.</span>
          </h2>
          <div className="mx-auto h-[2px] w-12 bg-amber-500/60 rounded-full mb-6" />
          <p className="text-[15.5px] font-light leading-[1.85] text-stone-500 max-w-lg mx-auto">
            Twice a month, a few hundred words from a 9th-grader who stayed up waiting for a print to finish or drove a kit to a kid who&apos;d been in a hospital bed for two weeks.
          </p>
        </div>

        {/* Benefit bullets — two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10" style={rv(on, 80)}>
          {[
            "Choose exactly which topics land in your inbox",
            "Stories written by the students who built the kit",
            "First notice when we need volunteers",
            "Impact reports: where every kit actually went",
            "No ads, no sponsors, no affiliate links",
            "Unsubscribe in one click — no confirmation needed",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3.5 text-[14px] text-stone-600">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-50 border border-amber-200">
                <Check className="h-2.5 w-2.5 text-amber-600" />
              </div>
              {text}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200 mb-10" style={rv(on, 140)} />

        {/* Form card — full width, centered */}
        <div className="kc-form-card p-8 lg:p-12" style={rv(on, 160)}>
          <div className="mb-8 pb-7 border-b border-stone-100 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-2">Free · No account needed</p>
              <h3 className="font-display font-black text-stone-900 text-[1.8rem] leading-tight tracking-[-0.02em]">Subscribe to KitCraft</h3>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <MapPin className="h-3.5 w-3.5 text-amber-500/70 shrink-0" />
              <p className="font-mono text-[11px]">Melbourne, FL · Brevard County</p>
            </div>
          </div>
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <NewsletterSignup className="max-w-none w-full" />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 9 — FAQ  ·  blob dark
═══════════════════════════════════════════════════════════════════════ */
function FaqItem({ item, index, isOpen, onToggle, on }: {
  item: typeof FAQ_ITEMS[number]; index: number; isOpen: boolean; onToggle: () => void; on: boolean
}) {
  const [h, setH] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => { if (bodyRef.current) setH(bodyRef.current.scrollHeight) }, [item.a])

  return (
    <div className={`border-b border-white/[0.07] transition-colors ${isOpen ? "border-white/[0.12]" : ""}`}
      style={rv(on, index * 50)}>
      <button onClick={onToggle} className="flex w-full items-start gap-5 py-6 text-left group" aria-expanded={isOpen}>
        <span className={`mt-0.5 shrink-0 font-mono text-[10px] font-bold transition-colors ${isOpen ? "text-amber-400" : "text-stone-700 group-hover:text-stone-500"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`flex-1 font-display font-bold text-[1.05rem] leading-snug transition-colors ${isOpen ? "text-white" : "text-stone-300 group-hover:text-stone-100"}`}>
          {item.q}
        </span>
        <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-200 ${isOpen ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-stone-700 text-stone-600 group-hover:border-stone-600"}`}>
          {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </div>
      </button>
      <div style={{ maxHeight: isOpen ? h : 0, overflow: "hidden", transition: "max-height .44s cubic-bezier(.22,1,.36,1)" }}>
        <div ref={bodyRef} className="pb-6 pl-[3.75rem]">
          <p className="text-[14.5px] font-light leading-[1.88] text-stone-400">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, on } = useReveal()
  return (
    <BlobDark>
      <section ref={ref as React.RefObject<HTMLElement>} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-14" style={rv(on)}>
            <RuleLabel light>Questions</RuleLabel>
            <h2 className="font-display font-black text-white leading-[0.97] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}>
              Got questions?{" "}
              <span style={{ color: "rgba(255,255,255,0.32)" }}>We&apos;ve got answers.</span>
            </h2>
          </div>
          <div className="border-t border-white/[0.07]">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} item={item} index={i}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
                on={on} />
            ))}
          </div>
        </div>
      </section>
    </BlobDark>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 10 — BOTTOM CTA  ·  cream
═══════════════════════════════════════════════════════════════════════ */
function BottomCta() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="kc-cream px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl" style={rv(on)}>
        <BlobDark className="rounded-2xl overflow-hidden">
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12 items-center px-10 py-14 lg:px-16 lg:py-16">
            <div className="absolute -right-8 -bottom-8 font-display font-black leading-none select-none pointer-events-none"
              style={{ fontSize: "clamp(8rem,20vw,16rem)", color: "rgba(255,255,255,0.025)", letterSpacing: "-0.04em" }}>
              MORE
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-6 bg-amber-400/60" />
                <p className="font-mono text-[8.5px] font-bold uppercase tracking-[0.3em] text-amber-400/80">More from KitCraft</p>
              </div>
              <h2 className="font-display font-black text-white leading-[1.02] tracking-[-0.025em] mb-4"
                style={{ fontSize: "clamp(1.9rem,3.2vw,2.8rem)" }}>
                Want to do more<br />than read about it?
              </h2>
              <p className="text-[15px] font-light leading-[1.85] text-stone-400 max-w-lg">
                Sponsor a kit build, volunteer on a delivery run, or fund the high-precision printer that would take us from 10 kits to 50. Every action puts a STEM kit in a child&apos;s hands.
              </p>
              <p className="font-mono text-[10.5px] text-stone-600 mt-4">100% of donations toward kit production · No overhead</p>
            </div>
            <div className="relative flex flex-col gap-2.5">
              <Link href="/help-out" className="kc-btn-primary-sm flex items-center justify-center gap-2">
                <Heart className="h-3.5 w-3.5" /> Sponsor a Kit
              </Link>
              <Link href="/order-kits" className="kc-btn-outline-sm flex items-center justify-center gap-2">
                <Package className="h-3.5 w-3.5" /> Order for a School
              </Link>
              <Link href="/volunteer" className="kc-btn-outline-sm flex items-center justify-center gap-2">
                <Users className="h-3.5 w-3.5" /> Volunteer
              </Link>
            </div>
          </div>
        </BlobDark>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════════════════════════════ */
export default function NewsletterPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono    { font-family: 'DM Mono', 'Fira Code', monospace; }

        .kc-cream { background-color: #faf8f4; }

        /* ── Buttons ── */
        .kc-btn-primary {
          background-color: #d97706; color: #fff;
          font-family: 'DM Mono', monospace; font-size: 12.5px; font-weight: 500; letter-spacing: 0.02em;
          padding: 13px 26px; border-radius: 100px; border: none; cursor: pointer; text-decoration: none;
          box-shadow: 0 4px 20px rgba(217,119,6,0.32);
          transition: all .2s ease;
        }
        .kc-btn-primary:hover { background-color: #b45309; box-shadow: 0 6px 28px rgba(217,119,6,0.45); transform: translateY(-1px); }

        .kc-btn-outline {
          background-color: transparent; color: rgba(255,255,255,0.50);
          font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
          padding: 12px 22px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.13);
          transition: all .2s ease; text-decoration: none; cursor: pointer;
        }
        .kc-btn-outline:hover { border-color: rgba(255,255,255,0.28); color: rgba(255,255,255,0.80); background-color: rgba(255,255,255,0.04); }

        .kc-btn-primary-sm {
          background-color: #d97706; color: #fff;
          font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500;
          padding: 12px 20px; border-radius: 100px; cursor: pointer; text-decoration: none;
          box-shadow: 0 3px 14px rgba(217,119,6,0.28); transition: all .2s ease;
        }
        .kc-btn-primary-sm:hover { background-color: #b45309; transform: translateY(-1px); }

        .kc-btn-outline-sm {
          background-color: rgba(255,255,255,0.06); color: rgba(255,255,255,0.55);
          font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500;
          padding: 12px 20px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.13);
          transition: all .2s ease; text-decoration: none; cursor: pointer;
        }
        .kc-btn-outline-sm:hover { border-color: rgba(255,255,255,0.26); color: rgba(255,255,255,0.80); }

        /* ── Hero panel ── */
        .kc-panel {
          border: 1.5px solid rgba(255,255,255,0.08);
          background-color: rgba(255,255,255,0.03);
          border-radius: 14px; padding: 20px 22px;
          backdrop-filter: blur(8px);
        }
        .kc-category-row { border-bottom: 1px solid rgba(255,255,255,0.06); transition: border-color .15s ease; }
        .kc-category-row:hover { border-color: rgba(255,255,255,0.12); }
        .kc-category-row:last-of-type { border-bottom: none; }
        .kc-cat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; opacity: 0.85; }

        /* ── Story cards ── */
        .kc-story-card {
          border: 1.5px solid rgba(255,255,255,0.08);
          background-color: rgba(255,255,255,0.04);
          border-radius: 18px; transition: border-color .2s ease, background-color .2s ease;
        }
        .kc-story-card:hover { border-color: rgba(255,255,255,0.14); background-color: rgba(255,255,255,0.06); }
        .kc-story-card.featured {
          background: linear-gradient(145deg, rgba(109,40,217,0.08) 0%, rgba(255,255,255,0.04) 60%);
          border-color: rgba(255,255,255,0.10);
        }

        /* ── Form card ── */
        .kc-form-card {
          background-color: #ffffff; border-radius: 18px;
          border: 1.5px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 0 rgba(0,0,0,0.04), 0 12px 48px rgba(0,0,0,0.08);
        }

        /* ── Blob animations ── */
        @keyframes blobA { from{transform:translate(0,0) scale(1)} to{transform:translate(-35px,25px) scale(1.10)} }
        @keyframes blobB { from{transform:translate(0,0) scale(1)} to{transform:translate(28px,-22px) scale(1.07)} }
        @keyframes blobC { from{transform:translate(0,0) scale(1)} to{transform:translate(-22px,-28px) scale(1.12)} }

        /* ── Misc ── */
        @keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @keyframes panelIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
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