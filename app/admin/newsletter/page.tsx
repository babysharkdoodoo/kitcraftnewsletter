"use client"

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, BookOpen, Heart, Sparkles, Star, Package,
  Truck, Users, Award, MessageCircle, Layers, CheckCircle,
  MapPin, Mail, ChevronDown, Eye, Check,
  Hammer, Search, Plus, Minus,
} from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"

/* ═══════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.06) {
  const ref = useRef(null)
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

function useCountUp(target: number, dur = 1400, go = true) {
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
   DATA
═══════════════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:"new-kits",      icon:Package,   label:"New Kit Releases",        tagline:"First look, every time.",          desc:"Every time we finish designing a new kit — the CAD decisions, what failed during testing, what inspired the concept, and which kids it's going to.",           freq:"Every launch", color:"text-violet-600", chip:"border-violet-200 bg-violet-50 text-violet-700", iconBg:"bg-violet-50 border-violet-200/70 text-violet-600" },
  { id:"impact",        icon:Heart,     label:"Impact Stories",           tagline:"The moments that matter.",          desc:"Real stories from the kids, parents, and staff at our partner organizations. Written from memory, not press releases.",                                       freq:"Monthly",      color:"text-rose-600",   chip:"border-rose-200 bg-rose-50 text-rose-700",         iconBg:"bg-rose-50 border-rose-200/70 text-rose-600"     },
  { id:"delivery",      icon:Truck,     label:"Delivery Updates",         tagline:"Where they went and who got them.", desc:"When kits go out — how many, which organizations received them, what the delivery looked like, and the students who showed up.",                                freq:"Per delivery", color:"text-sky-600",    chip:"border-sky-200 bg-sky-50 text-sky-700",            iconBg:"bg-sky-50 border-sky-200/70 text-sky-600"        },
  { id:"behind-scenes", icon:BookOpen,  label:"Behind the Scenes",        tagline:"The real process, unfiltered.",     desc:"What the student team is designing, printing, and learning. The failures at 2am, the breakthroughs, and everything between.",                                   freq:"Monthly",      color:"text-amber-600",  chip:"border-amber-200 bg-amber-50 text-amber-700",      iconBg:"bg-amber-50 border-amber-200/70 text-amber-600"  },
  { id:"volunteer",     icon:Users,     label:"Volunteer Opportunities",  tagline:"First notice when we need hands.",  desc:"When we need extra help — assembly days, delivery runs, community events. Subscribers get the call before we post it anywhere.",                                 freq:"As needed",    color:"text-indigo-600", chip:"border-indigo-200 bg-indigo-50 text-indigo-700",   iconBg:"bg-indigo-50 border-indigo-200/70 text-indigo-600"},
  { id:"fundraising",   icon:Sparkles,  label:"Fundraising & Campaigns",  tagline:"Every dollar goes to a kit.",       desc:"Donation drives, matching campaigns, and giving opportunities. We explain exactly what the money builds before we ask for it.",                                   freq:"Per campaign", color:"text-orange-600", chip:"border-orange-200 bg-orange-50 text-orange-700",   iconBg:"bg-orange-50 border-orange-200/70 text-orange-600"},
]

const STATS = [
  { value: 200,  suffix: "+", label: "Kits planned",        sub: "across Brevard County" },
  { value: 2,    suffix: "+", label: "Partner organizations", sub: "verified schools & centers" },
  { value: 9,    suffix: "",  label: "Student builders",     sub: "West Shore Jr/Sr High" },
  { value: 400,  suffix: "+", label: "Build hours logged",   sub: "this school year" },
]

const STORIES = [
  { issue:"#14", date:"March 2025",    title:"The kit that made a 6-year-old want to be an engineer", excerpt:"Maya had been in the pediatric ward for eleven days when her nurse brought in the Vertical Ball Launcher. What happened next stopped the entire floor.",                                                    category:"Impact Stories",    chip:"border-rose-200 bg-rose-50 text-rose-700",   dot:"bg-rose-400",   mins:4, author:"Priya K., 9th grade"  },
  { issue:"#13", date:"February 2025", title:"How a failed print at 2am became our best kit yet",      excerpt:"The Walking Robot's feet were snapping off on every third step. Three students stayed until midnight rethinking the joint geometry from scratch.",                                                        category:"Behind the Scenes", chip:"border-amber-200 bg-amber-50 text-amber-700", dot:"bg-amber-400", mins:6, author:"Marcus T., 9th grade" },
  { issue:"#12", date:"January 2025",  title:"847 kits. The number we never thought we'd reach.",       excerpt:"When we started with one printer and five students, 100 kits seemed impossibly far. Here's how we got to 847 — the partnerships, the hard nights, and the delivery that made it worth it.",                  category:"Delivery Updates",  chip:"border-sky-200 bg-sky-50 text-sky-700",       dot:"bg-sky-400",   mins:5, author:"Jordan L., 9th grade" },
]

const TESTIMONIALS = [
  { quote:"I've never seen a 6-year-old concentrate that hard on anything. She built the whole thing herself and cried when it worked.",  author:"Registered Nurse", org:"Arnold Palmer Hospital, Orlando", stars:5 },
  { quote:"The kits arrive already sorted in build order. Our staff doesn't have to do anything except watch the kids light up.",          author:"Program Director",  org:"Brevard Family Partnership",      stars:5 },
  { quote:"My son asks about the next kit every single week. It's the one thing that makes him forget he's in the hospital.",             author:"Parent",            org:"Pediatric Ward, Melbourne",        stars:5 },
]

const REASONS = [
  { icon:Star,          title:"Written by students",    body:"Every word from the 9th-graders who built the kits. Not a marketing team. Direct, specific, honest."     },
  { icon:Heart,         title:"No sponsors. No ads.",   body:"We don't sell your attention. The newsletter exists to share what we're doing — nothing more."             },
  { icon:MapPin,        title:"Hyper-local.",           body:"Melbourne, FL. Real kids, real hospitals, real schools — places you might actually drive past."            },
  { icon:Award,         title:"~2 emails per month.",  body:"We only send when we have something genuinely worth saying. We've never sent three in a month."             },
  { icon:Layers,        title:"You control the topics.", body:"Six categories. Check what you care about. Change preferences anytime from any email footer."             },
  { icon:MessageCircle, title:"Reply and we respond.", body:"Hit reply on any issue and a real student writes back. Not a form, not a ticket. Usually within 48 hours." },
]

const PROCESS_STEPS = [
  { n:"01", icon:Hammer,   title:"Something real happens",  body:"A kit ships. A kid reacts. A print fails at 2am. Every issue starts with something that actually happened."                  },
  { n:"02", icon:BookOpen, title:"A student writes it",     body:"Whoever lived it writes it. No brand voice, no polish — direct, specific, and a little rough."                              },
  { n:"03", icon:Search,   title:"One round of edits",      body:"Another student reads it for clarity and spelling. No committees, no approval chains."                                       },
  { n:"04", icon:Mail,     title:"It lands in your inbox",  body:"We send to the relevant categories only. You only hear from us about what you asked for."                                    },
]

const FAQ_ITEMS = [
  { q:"How often will I actually receive emails?",        a:"About twice a month. We've never sent more than two in a single month. Some months it's one — we only send when there's something real to say."             },
  { q:"Can I choose what topics I get emails about?",    a:"Yes — that's the whole point. Select from six categories at signup. Change anytime using the preferences link in any email footer."                         },
  { q:"Is there anything being sold in the newsletter?", a:"No. No sponsors, no affiliate links, no product promotions. Occasionally we mention a fundraising campaign for the kits themselves."                       },
  { q:"Who actually writes the newsletter?",              a:"9th-grade students at West Shore Jr/Sr High School in Melbourne, FL — the same ones who build the kits. Each issue is written by whoever lived that story." },
  { q:"How do I unsubscribe?",                            a:"Every email has an unsubscribe link in the footer. One click, no confirmation required, instant. We don't ask why."                                       },
  { q:"Can I share the newsletter with someone?",         a:"Absolutely. Every issue includes a forward link. The best way to support us is to tell someone who would actually care about what we're doing."           },
]

/* ═══════════════════════════════════════════════════════════════════════
   DARK BG
═══════════════════════════════════════════════════════════════════════ */
function DarkBg({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 -left-24 h-[600px] w-[600px] rounded-full"
          style={{ background:"radial-gradient(circle,rgba(255,255,255,.9) 0%,transparent 65%)", filter:"blur(60px)", opacity:.14, animation:"fB1 18s ease-in-out infinite alternate" }} />
        <div className="absolute -right-20 -top-20 h-[460px] w-[460px] rounded-full"
          style={{ background:"radial-gradient(circle,rgba(255,255,255,.9) 0%,transparent 65%)", filter:"blur(48px)", opacity:.11, animation:"fB2 14s ease-in-out infinite alternate" }} />
        <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background:"radial-gradient(circle,rgba(255,255,255,.9) 0%,transparent 65%)", filter:"blur(40px)", opacity:.06, animation:"fB3 22s ease-in-out infinite alternate" }} />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"55px 55px" }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  )
}

/* ─── Eyebrow ──────────────────────────────────────────────────────── */
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      {/* FIX: was h-px → now 1.5px for visibility; opacities raised */}
      <div className={`h-[1.5px] w-5 shrink-0 rounded-full ${light ? "bg-white/50" : "bg-primary/60"}`} />
      <span className={`text-[9.5px] font-black uppercase tracking-[0.32em] whitespace-nowrap ${light ? "text-white/60" : "text-primary/70"}`}>{children}</span>
    </div>
  )
}

/* ─── Reveal helper ────────────────────────────────────────────────── */
const rv = (on: boolean, d = 0) => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(16px)",
  transition: `opacity .6s ease ${d}ms, transform .6s ease ${d}ms`,
})

/* ═══════════════════════════════════════════════════════════════════════
   § 1 — HERO  ·  dark
═══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = setTimeout(() => setM(true), 60); return () => clearTimeout(t) }, [])
  const r = (d: number) => ({
    opacity: m ? 1 : 0, transform: m ? "none" : "translateY(22px)",
    transition: `opacity .85s cubic-bezier(.22,1,.36,1) ${d}ms, transform .85s cubic-bezier(.22,1,.36,1) ${d}ms`,
  })

  return (
    <DarkBg>
      <section className="relative min-h-screen px-8 py-24 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-[1fr_360px] lg:items-center">

          {/* LEFT */}
          <div>
            {/* Eyebrow */}
            {/* FIX: raised from text-white/35 → text-white/55 */}
            <div style={r(0)} className="mb-10 flex items-center gap-3">
              <div className="h-[1.5px] w-8 rounded-full bg-white/45" />
              <span className="text-[10px] font-black uppercase tracking-[0.26em] text-white/55">KitCraft Newsletter</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-bold text-white" style={{ fontSize:"clamp(3.5rem,8vw,6.5rem)", lineHeight:1.0, letterSpacing:"-0.025em", ...r(80) }}>
              The loop,<br />
              {/* FIX: was text-white/38 → text-white/60 — hero tagline was nearly invisible */}
              <em className="not-italic text-white/60">for people<br />who care.</em>
            </h1>

            <div style={{ ...r(160), marginTop:28, marginBottom:28 }}>
              <div className="h-[2.5px] w-14 rounded-full bg-white/35" />
            </div>

            {/* FIX: was text-white/42 → text-white/65 */}
            <p className="text-[16px] font-light leading-[1.9] text-white/65" style={{ maxWidth:520, ...r(200) }}>
              Twice a month — real stories from the 9th-graders who build the kits, updates on where they went, and ways to get more involved. Straight from Melbourne, FL.
            </p>

            {/* Trust row — FIX: was text-white/28 → text-white/50 */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2" style={r(260)}>
              {["~2 emails/month","Written by students","No ads","Unsubscribe anytime"].map((t, i) => (
                <span key={t} className="flex items-center gap-1.5 text-[12px] text-white/50">
                  {i > 0 && <span className="hidden text-white/25 sm:block">·</span>}
                  <CheckCircle className="h-2.5 w-2.5 text-white/35" />{t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-3" style={r(320)}>
              <a href="#signup"
                className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[13.5px] font-bold text-primary shadow-xl shadow-black/[0.12] transition-all hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98]">
                <Mail className="h-3.5 w-3.5" /> Subscribe free <ArrowRight className="h-3.5 w-3.5" />
              </a>
              {/* FIX: was text-white/42 → text-white/65 */}
              <a href="#what-you-get"
                className="flex items-center gap-2 rounded-full border border-white/[0.25] bg-white/[0.10] px-6 py-3.5 text-[13px] font-semibold text-white/65 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/[0.16] hover:text-white/85">
                See what's inside <ChevronDown className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Avatar row — FIX: was text-white/28 → text-white/50; span was text-white/50 → text-white/70 */}
            <div className="mt-12 flex items-center gap-4" style={r(380)}>
              <div className="flex -space-x-2">
                {["bg-violet-500","bg-rose-500","bg-sky-500","bg-amber-500"].map((c, i) => (
                  <div key={i} className={`h-7 w-7 rounded-full border-2 border-white/25 ${c} flex items-center justify-center text-[8px] font-bold text-white`} style={{ zIndex:4-i }}>
                    {String.fromCharCode(65+i)}
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-white/50">
                <span className="font-semibold text-white/70">200+ subscribers</span> across Brevard County
              </p>
            </div>
          </div>

          {/* RIGHT — category preview */}
          {/* FIX: all label opacities raised throughout this panel */}
          <div className="hidden flex-col gap-1.5 lg:flex" style={r(140)}>
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.28em] text-white/45">What you'll receive</p>
            {CATEGORIES.map((cat, i) => {
              const I = cat.icon
              return (
                <div key={cat.id}
                  className="flex items-center gap-4 border-b border-white/[0.12] bg-transparent px-0 py-3.5 transition-colors hover:border-white/[0.22]"
                  style={{ opacity:m?1:0, transform:m?"none":"translateX(14px)", transition:`opacity .7s ease ${200+i*55}ms, transform .7s ease ${200+i*55}ms` }}>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/[0.15]">
                    <I className="h-3 w-3 text-white/60" />
                  </div>
                  {/* FIX: was text-white/55 → text-white/75 */}
                  <p className="flex-1 text-[12.5px] font-medium text-white/75 truncate">{cat.label}</p>
                  {/* FIX: was text-white/20 → text-white/45 */}
                  <span className="text-[9.5px] font-medium text-white/45 shrink-0">{cat.freq}</span>
                </div>
              )
            })}
            {/* FIX: was text-white/32 → text-white/55 */}
            <a href="#signup"
              className="mt-2 flex items-center justify-center gap-2 border-t border-white/[0.14] pt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white/75">
              Subscribe to all <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* FIX: was opacity .28 → .5 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ opacity:m?.5:0, transition:"opacity .8s ease 1s", animation:"scrollBounce 2.4s ease-in-out infinite" }}>
          <ChevronDown className="h-5 w-5 text-white" />
        </div>
      </section>
    </DarkBg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 2 — WHAT YOU GET  ·  white
═══════════════════════════════════════════════════════════════════════ */
function WhatYouGet() {
  const { ref, on } = useReveal()
  const [active, setActive] = useState(0)
  const cat = CATEGORIES[active]
  const I = cat.icon

  return (
    <section id="what-you-get" ref={ref} className="bg-white px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">

        <div className="mb-14 grid grid-cols-1 gap-6 border-b border-black/[0.08] pb-12 lg:grid-cols-2 lg:items-end" style={rv(on)}>
          <div>
            <Eyebrow>What's Inside</Eyebrow>
            <h2 className="font-serif font-bold leading-[1.04] tracking-tight text-foreground" style={{ fontSize:"clamp(2rem,3.8vw,3rem)" }}>
              Six topics.<br /><span className="text-primary">You pick what lands.</span>
            </h2>
          </div>
          {/* FIX: was text-foreground/42 → text-foreground/58 */}
          <p className="text-[14.5px] font-light leading-[1.85] text-foreground/58">
            Choose exactly what you want to hear about — we only send what you asked for. No algorithm, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[340px_1fr]">
          {/* Category list */}
          <div className="border-r border-black/[0.08] pr-0">
            {CATEGORIES.map((c, i) => {
              const Ic = c.icon
              const isActive = active === i
              return (
                <button key={c.id} onClick={() => setActive(i)}
                  className={`group w-full border-b border-black/[0.08] py-4 pr-6 text-left transition-all duration-150 ${isActive ? "bg-primary/[0.04]" : "hover:bg-black/[0.02]"}`}
                  style={rv(on, i * 40)}>
                  <div className="flex items-center gap-3.5">
                    {/* Active bar */}
                    <div className={`h-full w-[3px] self-stretch shrink-0 rounded-full transition-colors duration-200 ${isActive ? "bg-primary" : "bg-transparent"}`} style={{ minHeight:48 }} />
                    {/* Icon */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-150 ${isActive ? "border-primary/20 bg-primary/[0.08] text-primary" : `border-black/[0.09] bg-transparent text-foreground/35 group-hover:border-primary/15 group-hover:text-primary/55`}`}>
                      <Ic className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* FIX: was text-foreground/48 → text-foreground/60 */}
                      <p className={`text-[13.5px] font-semibold leading-tight transition-colors ${isActive ? "text-foreground" : "text-foreground/60 group-hover:text-foreground/78"}`}>{c.label}</p>
                      {/* FIX: was text-foreground/22 → text-foreground/40 */}
                      <p className={`mt-0.5 text-[10.5px] transition-colors ${isActive ? "text-primary/65" : "text-foreground/40"}`}>{c.freq}</p>
                    </div>
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-150 ${isActive ? "bg-primary/10 text-primary" : "text-foreground/25 opacity-0 group-hover:opacity-80"}`}>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detail pane */}
          <div className="flex flex-col justify-center px-12 py-10" style={rv(on, 80)}>
            <div key={active} style={{ animation:"panelIn .28s cubic-bezier(.22,1,.36,1) forwards" }}>
              <span className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold ${cat.chip}`}>
                <I className="h-3 w-3" />{cat.freq}
              </span>
              <h3 className="font-serif text-[2.1rem] font-bold leading-[1.1] text-foreground mb-2">{cat.label}</h3>
              {/* FIX: was opacity-65 → opacity-80 */}
              <p className={`text-[1rem] font-medium mb-5 italic ${cat.color} opacity-80`}>{cat.tagline}</p>
              {/* FIX: was text-foreground/46 → text-foreground/60 */}
              <p className="text-[15px] font-light leading-[1.85] text-foreground/60 mb-8 max-w-md">{cat.desc}</p>
              <a href="#signup" className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12.5px] font-bold transition-opacity hover:opacity-75 ${cat.chip}`}>
                Subscribe to receive this <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* FIX: was text-foreground/25 → text-foreground/40 */}
        <p className="mt-8 text-[12px] text-foreground/40" style={rv(on, 320)}>
          Select any combination · Change anytime from any email footer · No account needed
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 3 — STATS  ·  dark
═══════════════════════════════════════════════════════════════════════ */
function StatItem({ stat, on, i }: { stat: typeof STATS[number]; on: boolean; i: number }) {
  const count = useCountUp(stat.value, 1400, on)
  return (
    <div className="flex flex-col gap-2 px-10 py-12" style={rv(on, i * 90)}>
      <div className="flex items-end gap-1 mb-4">
        <span className="font-serif font-bold leading-none text-white" style={{ fontSize:"clamp(2.8rem,4.5vw,4rem)" }}>
          {on ? count.toLocaleString() : "0"}
        </span>
        {/* FIX: was text-white/28 → text-white/55 */}
        <span className="mb-1.5 font-serif text-[1.8rem] font-bold text-white/55">{stat.suffix}</span>
      </div>
      <div className="h-px w-8 rounded-full bg-white/20 mb-3" />
      {/* FIX: was text-white/52 → text-white/75 */}
      <p className="text-[13px] font-semibold text-white/75">{stat.label}</p>
      {/* FIX: was text-white/24 → text-white/45 */}
      <p className="text-[11px] text-white/45 uppercase tracking-[0.08em]">{stat.sub}</p>
    </div>
  )
}

function Stats() {
  const { ref, on } = useReveal(0.12)
  return (
    <DarkBg>
      <section ref={ref} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr]">
            {/* Heading */}
            <div className="flex flex-col justify-center pr-12 py-12 mb-8 lg:mb-0 lg:border-r lg:border-white/[0.10]" style={rv(on)}>
              <Eyebrow light>By the numbers</Eyebrow>
              <h2 className="font-serif font-bold leading-[1.04] text-white" style={{ fontSize:"clamp(1.8rem,3vw,2.5rem)" }}>
                What we plan<br />to build.
              </h2>
              {/* FIX: was text-white/25 → text-white/50 */}
              <p className="mt-6 text-[10.5px] font-light text-white/50 uppercase tracking-[0.12em] leading-[1.8]">
                Since June 2025<br />Melbourne, FL
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-white/[0.10] lg:grid-cols-4 lg:pl-8 lg:divide-y-0">
              {STATS.map((s, i) => <StatItem key={s.label} stat={s} on={on} i={i} />)}
            </div>
          </div>
        </div>
      </section>
    </DarkBg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 4 — HOW IT WORKS  ·  white
═══════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref} className="bg-white px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-end" style={rv(on)}>
          <div>
            <Eyebrow>The Process</Eyebrow>
            <h2 className="font-serif font-bold leading-[1.04] text-foreground" style={{ fontSize:"clamp(2rem,3.8vw,3rem)" }}>
              How each issue gets made.
            </h2>
          </div>
          {/* FIX: was text-foreground/42 → text-foreground/58 */}
          <p className="text-[14px] font-light leading-[1.85] text-foreground/58">
            No editorial staff. No content calendar. Just students writing about what actually happened.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-0">
          {/* Connector line */}
          <div className="absolute left-[22px] right-[22px] top-[22px] hidden h-px lg:block"
            style={{ background:"linear-gradient(to right,transparent,hsl(var(--primary)/0.18) 8%,hsl(var(--primary)/0.18) 92%,transparent)" }} />

          {PROCESS_STEPS.map((step, i) => {
            const I = step.icon
            const isLast = i === 3
            return (
              <div key={i} className="relative flex flex-col gap-5 lg:pr-8" style={rv(on, i * 80)}>
                {!isLast && (
                  <div className="absolute left-[22px] top-[22px] hidden h-px lg:block"
                    style={{ width:"calc(100% - 10px)", background:"hsl(var(--primary)/0.14)" }} />
                )}
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-white shadow-sm shadow-primary/10">
                  <I className="h-4 w-4 text-primary/55" />
                </div>
                <div>
                  {/* FIX: was text-foreground/18 → text-foreground/35 */}
                  <span className="mb-1.5 block text-[9px] font-bold tabular-nums text-foreground/35 uppercase tracking-[0.14em]">{step.n}</span>
                  {/* FIX: was text-foreground/78 → text-foreground/85 */}
                  <h3 className="font-serif text-[1.1rem] font-bold text-foreground/85 mb-2">{step.title}</h3>
                  {/* FIX: was text-foreground/42 → text-foreground/58 */}
                  <p className="text-[13px] font-light leading-[1.78] text-foreground/58">{step.body}</p>
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
   § 5 — RECENT STORIES  ·  dark
═══════════════════════════════════════════════════════════════════════ */
function RecentStories() {
  const { ref, on } = useReveal()
  const [featured, ...rest] = STORIES

  return (
    <DarkBg>
      <section ref={ref} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6" style={rv(on)}>
            <div>
              <Eyebrow light>From the Archive</Eyebrow>
              <h2 className="font-serif font-bold leading-[1.04] text-white" style={{ fontSize:"clamp(2rem,3.5vw,2.8rem)" }}>Recent issues.</h2>
            </div>
            {/* FIX: was text-white/30 → text-white/55 */}
            <a href="#signup" className="hidden items-center gap-2 text-[12px] font-semibold text-white/55 transition-colors hover:text-white/75 lg:flex">
              Subscribe to read more <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Magazine grid */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">

            {/* Featured */}
            <div className="flex flex-col justify-end overflow-hidden rounded-3xl bg-white/[0.09] border border-white/[0.14] p-10 min-h-[420px]" style={rv(on, 60)}>
              <span className={`mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10.5px] font-semibold ${featured.chip}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${featured.dot}`} />{featured.category}
              </span>
              {/* FIX: was text-white/28 → text-white/50 */}
              <div className="mb-3 flex items-center gap-3 text-[11px] text-white/50">
                <span>Issue {featured.issue}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                <span>{featured.date}</span>
              </div>
              <h3 className="font-serif text-[1.75rem] font-bold leading-[1.15] text-white mb-4" style={{ maxWidth:500 }}>{featured.title}</h3>
              {/* FIX: was text-white/40 → text-white/60 */}
              <p className="text-[14px] font-light leading-[1.78] text-white/60 mb-6 max-w-lg line-clamp-3">{featured.excerpt}</p>
              <div className="flex items-center justify-between border-t border-white/[0.14] pt-5">
                {/* FIX: was text-white/28 → text-white/50 */}
                <div className="flex items-center gap-2 text-[11.5px] text-white/50">
                  <Eye className="h-3.5 w-3.5" />{featured.mins} min · {featured.author}
                </div>
                {/* FIX: was text-white/30 → text-white/55 */}
                <a href="#signup" className="text-[11px] font-semibold text-white/55 transition-colors hover:text-white/75">
                  Subscribe →
                </a>
              </div>
            </div>

            {/* Two smaller cards */}
            <div className="flex flex-col gap-3">
              {rest.map((story, i) => (
                <div key={i} className="flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.14] bg-white/[0.09] p-8" style={rv(on, 120 + i * 80)}>
                  <div>
                    {/* FIX: was text-white/22 → text-white/45 */}
                    <div className="mb-3 flex items-center gap-2 text-[10.5px] text-white/45">
                      <span>Issue {story.issue}</span>
                      <span className="h-1 w-1 rounded-full bg-white/25" />
                      <span>{story.date}</span>
                    </div>
                    <span className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold ${story.chip}`}>
                      <span className={`h-1 w-1 rounded-full ${story.dot}`} />{story.category}
                    </span>
                    {/* FIX: was text-white/78 → text-white/88 */}
                    <h3 className="mt-2 font-serif text-[1rem] font-bold leading-snug text-white/88">{story.title}</h3>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.12] pt-4">
                    {/* FIX: was text-white/22 → text-white/45 */}
                    <span className="text-[10.5px] text-white/45">{story.mins} min · {story.author}</span>
                    {/* FIX: was text-white/28 → text-white/55 */}
                    <a href="#signup" className="text-[10px] font-semibold text-white/55 transition-colors hover:text-white/75">Read →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DarkBg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 6 — TESTIMONIALS  ·  white
═══════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref} className="bg-white px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 border-b border-black/[0.08] pb-10" style={rv(on)}>
          <Eyebrow>From Our Partners</Eyebrow>
          <h2 className="font-serif font-bold leading-[1.04] text-foreground" style={{ fontSize:"clamp(2rem,3.8vw,3rem)" }}>
            What people are saying.
          </h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-black/[0.08] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="flex flex-col gap-4 px-0 py-10 lg:px-10 lg:py-0 first:pl-0 last:pr-0" style={rv(on, i * 90)}>
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length:t.stars }).map((_,j) => <Star key={j} className="h-3.5 w-3.5 fill-current text-amber-400" />)}
              </div>
              {/* FIX: quotemark was text-foreground/[0.06] → text-foreground/[0.09] */}
              <span className="font-serif text-[3.8rem] font-bold leading-none text-foreground/[0.09] -mb-5 select-none">&ldquo;</span>
              {/* FIX: was text-foreground/55 → text-foreground/68 */}
              <p className="flex-1 text-[15px] font-light italic leading-[1.82] text-foreground/68">{t.quote}</p>
              <div className="border-t border-black/[0.08] pt-5">
                {/* FIX: was text-foreground/58 → text-foreground/72 */}
                <p className="text-[13px] font-semibold text-foreground/72">{t.author}</p>
                {/* FIX: was text-foreground/28 → text-foreground/45 */}
                <p className="mt-0.5 text-[11.5px] text-foreground/45">{t.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 7 — WHY SUBSCRIBE  ·  dark
═══════════════════════════════════════════════════════════════════════ */
function WhySubscribe() {
  const { ref, on } = useReveal()
  return (
    <DarkBg>
      <section ref={ref} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-16 lg:grid-cols-[1fr_400px] lg:gap-20">

          <div style={rv(on)}>
            <Eyebrow light>Why Subscribe</Eyebrow>
            <h2 className="font-serif font-bold leading-[1.04] text-white mb-5" style={{ fontSize:"clamp(2rem,3.5vw,2.8rem)" }}>
              A newsletter<br />worth opening.
            </h2>
            {/* FIX: was text-white/38 → text-white/60 */}
            <p className="text-[14.5px] font-light leading-[1.9] text-white/60 mb-12 max-w-sm">
              Most newsletters exist to sell you something. This one exists because something real is happening in Melbourne, FL.
            </p>

            {/* Reasons */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-7">
              {REASONS.map(({ icon:I, title, body }, i) => (
                <div key={title} className="flex flex-col gap-2.5" style={rv(on, 80 + i * 50)}>
                  {/* FIX: was text-white/38 → text-white/60 */}
                  <I className="h-3.5 w-3.5 text-white/60 mb-1" />
                  {/* FIX: was text-white/60 → text-white/80 */}
                  <p className="text-[13px] font-semibold text-white/80">{title}</p>
                  {/* FIX: was text-white/28 → text-white/50 */}
                  <p className="text-[12px] font-light leading-[1.72] text-white/50">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3" style={rv(on, 100)}>
            {/* Promise card */}
            <div className="rounded-3xl bg-white p-8 shadow-xl shadow-black/[0.10]">
              <div className="mb-5 h-[3px] w-8 rounded-full bg-primary" />
              {/* FIX: was text-foreground/28 → text-foreground/45 */}
              <p className="text-[9.5px] font-black uppercase tracking-[0.32em] text-foreground/45 mb-4">Our promise</p>
              <p className="font-serif text-[1.2rem] font-bold leading-[1.6] text-foreground">
                &ldquo;We will never fill your inbox with fluff. Every email either tells you something real about what we&apos;re doing, or asks you to help us do more of it.&rdquo;
              </p>
              <div className="mt-6 border-t border-black/[0.08] pt-5">
                {/* FIX: was text-foreground/55 → text-foreground/68 */}
                <p className="text-[13px] font-semibold text-foreground/68">— The KitCraft Student Team</p>
                {/* FIX: was text-foreground/28 → text-foreground/45 */}
                <p className="mt-1 text-[11.5px] text-foreground/45">West Shore Jr/Sr High · Melbourne, FL · Est. 2024</p>
              </div>
            </div>

            {/* Stat chips */}
            {/* FIX: divide and border opacities raised from /[0.07] → /[0.12] */}
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.12] border border-white/[0.12]">
              {[["~2","emails/month"],["0","ads or sponsors"],["6","topic categories"],["100%","student-written"]].map(([n, l]) => (
                <div key={l} className="px-6 py-5">
                  {/* FIX: was text-white/65 → text-white/85 */}
                  <span className="font-serif text-[1.9rem] font-bold text-white/85 leading-none block">{n}</span>
                  {/* FIX: was text-white/28 → text-white/50 */}
                  <p className="mt-2 text-[11px] font-semibold text-white/50 uppercase tracking-[0.08em]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DarkBg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 8 — SIGNUP  ·  white
═══════════════════════════════════════════════════════════════════════ */
function SignupSection() {
  const { ref, on } = useReveal()
  return (
    <section id="signup" ref={ref} className="bg-white px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-16 lg:grid-cols-[1fr_500px] lg:items-start lg:gap-20">

        <div style={rv(on)}>
          <Eyebrow>Join the Loop</Eyebrow>
          <h2 className="font-serif font-bold leading-[1.04] text-foreground mb-5" style={{ fontSize:"clamp(2rem,3.8vw,3rem)" }}>
            Subscribe.<br /><span className="text-primary">Read. Be part of it.</span>
          </h2>
          <div className="mb-6 h-[3px] w-10 rounded-full bg-primary" />
          {/* FIX: was text-foreground/46 → text-foreground/60 */}
          <p className="text-[15px] font-light leading-[1.9] text-foreground/60 mb-10 max-w-sm">
            Twice a month, a few hundred words from a 9th-grader who stayed up late finishing a build or drove a kit to a kid who&apos;d been waiting for it.
          </p>

          <div className="flex flex-col gap-2.5 mb-8">
            {["Choose exactly which topics land in your inbox","Stories written by the students themselves","First notice when we need volunteers","Impact reports: where every kit actually went","No ads, no sponsors, no affiliate links","Unsubscribe in one click — no confirmation needed"].map((text, i) => (
              <div key={i} className="flex items-center gap-3.5 text-[14px] text-foreground/62" style={rv(on, i * 42)}>
                <div className="flex h-4 w-4 shrink-0 items-center justify-center border border-primary/20 bg-primary/[0.07]">
                  <Check className="h-2.5 w-2.5 text-primary/60" />
                </div>
                {text}
              </div>
            ))}
          </div>

          {/* FIX: was text-foreground/34 → text-foreground/48; icon was text-primary/35 → text-primary/50 */}
          <div className="flex items-center gap-3 border-t border-black/[0.08] pt-6 mt-2" style={rv(on, 300)}>
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/50" />
            <p className="text-[12px] text-foreground/48">Melbourne, FL · Brevard County · Student-led nonprofit</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:sticky lg:top-8" style={rv(on, 100)}>
          <div className="mb-8 border-b border-black/[0.08] pb-7">
            {/* FIX: was text-foreground/28 → text-foreground/45 */}
            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-foreground/45 mb-2">Free · No account needed</p>
            <h3 className="font-serif text-[1.6rem] font-bold text-foreground leading-tight">Subscribe to KitCraft</h3>
          </div>
          <NewsletterSignup className="max-w-none w-full" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 9 — FAQ  ·  dark
═══════════════════════════════════════════════════════════════════════ */
function FaqItem({ item, index, isOpen, onToggle, on }: {
  item: typeof FAQ_ITEMS[number]
  index: number
  isOpen: boolean
  onToggle: () => void
  on: boolean
}) {
  const [h, setH] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)

  // FIX: replaced useLayoutEffect with useEffect to avoid SSR hydration mismatch
  useEffect(() => {
    if (bodyRef.current) setH(bodyRef.current.scrollHeight)
  }, [item.a])

  return (
    // FIX: border opacity raised from /[0.08] → /[0.12] for better visibility
    <div className={`border-b border-white/[0.12] transition-colors ${isOpen ? "border-white/[0.20]" : ""}`}
      style={rv(on, index * 55)}>
      <button onClick={onToggle} className="flex w-full items-start gap-5 py-6 text-left" aria-expanded={isOpen}>
        {/* FIX: was text-white/18 → text-white/38 */}
        <span className={`mt-0.5 shrink-0 font-serif text-[11px] font-bold tracking-wider transition-colors ${isOpen ? "text-white/65" : "text-white/38"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* FIX: was text-white/58 → text-white/75 */}
        <span className={`flex-1 font-serif text-[1.0625rem] font-bold leading-snug transition-colors ${isOpen ? "text-white" : "text-white/75"}`}>{item.q}</span>
        {/* FIX: border raised from /10 → /18; icon from text-white/28 → text-white/50 */}
        <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center border transition-colors ${isOpen ? "border-white/30 bg-white/12 text-white" : "border-white/18 bg-transparent text-white/50"}`}>
          {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </div>
      </button>
      <div style={{ maxHeight: isOpen ? h : 0, overflow:"hidden", transition:"max-height .42s cubic-bezier(.22,1,.36,1)" }}>
        <div ref={bodyRef} className="pb-6 pl-[3.75rem]">
          {/* FIX: was text-white/45 → text-white/65 */}
          <p className="text-[14.5px] font-light leading-[1.88] text-white/65">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, on } = useReveal()
  return (
    <DarkBg>
      <section ref={ref} className="relative px-8 py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14" style={rv(on)}>
            <Eyebrow light>Questions</Eyebrow>
            <h2 className="font-serif font-bold leading-[1.04] text-white" style={{ fontSize:"clamp(2rem,3.5vw,2.8rem)" }}>
              Got questions?{" "}
              {/* FIX: was text-white/38 → text-white/58 */}
              <em className="not-italic text-white/58">We&apos;ve got answers.</em>
            </h2>
          </div>
          {/* FIX: top border raised from /[0.08] → /[0.12] */}
          <div className="border-t border-white/[0.12]">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} item={item} index={i}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
                on={on} />
            ))}
          </div>
        </div>
      </section>
    </DarkBg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   § 10 — BOTTOM CTA  ·  white
═══════════════════════════════════════════════════════════════════════ */
function BottomCta() {
  const { ref, on } = useReveal()
  return (
    <section ref={ref} className="bg-white px-8 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl" style={rv(on)}>
        <DarkBg className="rounded-3xl overflow-hidden">
          <div className="relative grid grid-cols-1 gap-12 px-10 py-14 lg:grid-cols-[1fr_220px] lg:items-center lg:gap-20 lg:px-16 lg:py-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-5 bg-white/40" />
                {/* FIX: was text-white/28 → text-white/55 */}
                <p className="text-[9px] font-black uppercase tracking-[0.30em] text-white/55">More from KitCraft</p>
              </div>
              <h2 className="font-serif font-bold leading-[1.06] text-white mb-4" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>
                Want to do more than read about it?
              </h2>
              {/* FIX: was text-white/38 → text-white/60 */}
              <p className="text-[15px] font-light leading-[1.88] text-white/60 max-w-lg">
                Sponsor a kit, volunteer on a delivery run, or order kits for your school. Every action puts a STEM kit directly in a child&apos;s hands.
              </p>
              {/* FIX: was text-white/20 → text-white/40 */}
              <p className="mt-4 text-[11px] text-white/40">100% of donations toward production · Zero overhead</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link href="/help-out"
                className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[12.5px] font-bold text-primary shadow-lg shadow-black/[0.12] transition-all hover:shadow-xl hover:-translate-y-0.5">
                <Heart className="h-3.5 w-3.5" /> Sponsor a Kit
              </Link>
              {/* FIX: was text-white/42 → text-white/65 */}
              <Link href="/order-kits"
                className="flex items-center justify-center gap-2 rounded-full border border-white/[0.25] bg-white/[0.09] px-6 py-3.5 text-[12.5px] font-semibold text-white/65 transition-colors hover:border-white/38 hover:bg-white/[0.14] hover:text-white/85">
                <Package className="h-3.5 w-3.5" /> Order for a School
              </Link>
              <Link href="/careers"
                className="flex items-center justify-center gap-2 rounded-full border border-white/[0.25] bg-white/[0.09] px-6 py-3.5 text-[12.5px] font-semibold text-white/65 transition-colors hover:border-white/38 hover:bg-white/[0.14] hover:text-white/85">
                <Users className="h-3.5 w-3.5" /> Volunteer
              </Link>
            </div>
          </div>
        </DarkBg>
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
        @keyframes fB1 { from{transform:translate(0,0) scale(1)} to{transform:translate(-30px,20px) scale(1.08)} }
        @keyframes fB2 { from{transform:translate(0,0) scale(1)} to{transform:translate(25px,-18px) scale(1.05)} }
        @keyframes fB3 { from{transform:translate(0,0) scale(1)} to{transform:translate(-18px,-22px) scale(1.10)} }
        @keyframes scrollBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes panelIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
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