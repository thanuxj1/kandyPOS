"use client"

import { useEffect, useRef, useState } from "react"

const CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
const CHAR_COUNT = 200

interface FloatingChar {
  char: string
  xPct: number
  yPct: number
  speedPctPerFrame: number
  isTeal: boolean
  fontSize: number
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>
  frame: number
  frameRequest: number
  resolve: () => void

  constructor(el: HTMLElement, chars = "!<>-_\\/[]{}—=+*^?#") {
    this.el = el
    this.chars = chars
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText || ""
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => (this.resolve = resolve))
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    if (typeof window !== "undefined") {
      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
    }
    return promise
  }

  update() {
    let complete = 0
    if (typeof document === "undefined") return
    const frag = document.createDocumentFragment()
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        frag.appendChild(document.createTextNode(to))
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        const span = document.createElement("span")
        span.setAttribute("data-dud", "1")
        span.style.color = "#7bc832" // Lime green for dud characters
        span.style.opacity = "0.75"
        span.textContent = char
        frag.appendChild(span)
      } else {
        frag.appendChild(document.createTextNode(from))
      }
    }
    while (this.el.firstChild) this.el.removeChild(this.el.firstChild)
    this.el.appendChild(frag)
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }

  destroy() {
    if (typeof window !== "undefined") {
      cancelAnimationFrame(this.frameRequest)
    }
  }
}

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const spansRef = useRef<(HTMLSpanElement | null)[]>([])
  const charsRef = useRef<FloatingChar[]>([])
  const rafRef = useRef<number | null>(null)
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeSetRef = useRef<Set<number>>(new Set())

  const titleRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const phraseTimerRef = useRef<number | null>(null)

  // Build characters
  useEffect(() => {
    charsRef.current = Array.from({ length: CHAR_COUNT }, () => ({
      char: CHARACTER_SET[Math.floor(Math.random() * CHARACTER_SET.length)],
      xPct: Math.random() * 100,
      yPct: Math.random() * 100,
      speedPctPerFrame: 0.05 + Math.random() * 0.2,
      isTeal: Math.random() > 0.5,
      fontSize: 12 + Math.random() * 16,
    }))

    // Apply initial positions
    charsRef.current.forEach((ch, idx) => {
      const el = spansRef.current[idx]
      if (!el) return
      el.textContent = ch.char
      el.style.position = "absolute"
      el.style.left = `${ch.xPct}%`
      el.style.top = `${ch.yPct}%`
      el.style.transform = "translate(-50%, -50%)"
      el.style.fontSize = `${ch.fontSize}px`
      el.style.fontFamily = "monospace"
      el.style.pointerEvents = "none"
      el.style.userSelect = "none"
      el.style.transition = "color 0.12s linear, opacity 0.12s linear, text-shadow 0.12s linear"
      el.style.color = "#3f3f46"
      el.style.opacity = "0.35"
    })
  }, [])

  // Rain animation loop
  useEffect(() => {
    const loop = () => {
      charsRef.current.forEach((ch, idx) => {
        const el = spansRef.current[idx]
        if (!el) return
        ch.yPct += ch.speedPctPerFrame
        if (ch.yPct >= 108) {
          ch.yPct = -8
          ch.xPct = Math.random() * 100
          ch.char = CHARACTER_SET[Math.floor(Math.random() * CHARACTER_SET.length)]
          el.textContent = ch.char
        }
        el.style.top = `${ch.yPct}%`
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // Flicker active characters
  useEffect(() => {
    flickerRef.current = setInterval(() => {
      const next = new Set<number>()
      const count = 4 + Math.floor(Math.random() * 8)
      for (let i = 0; i < count; i++) next.add(Math.floor(Math.random() * CHAR_COUNT))

      const prev = activeSetRef.current
      activeSetRef.current = next

      prev.forEach((idx) => {
        if (next.has(idx)) return
        const el = spansRef.current[idx]
        if (!el) return
        el.style.color = "#3f3f46"
        el.style.opacity = "0.35"
        el.style.fontWeight = "400"
        el.style.textShadow = "none"
      })
      next.forEach((idx) => {
        if (prev.has(idx)) return
        const el = spansRef.current[idx]
        const ch = charsRef.current[idx]
        if (!el || !ch) return
        const col = ch.isTeal ? "#00b4b0" : "#7bc832"
        el.style.color = col
        el.style.opacity = "1"
        el.style.fontWeight = "700"
        el.style.textShadow = `0 0 8px ${col}80, 0 0 16px ${col}40`
      })
    }, 60)
    return () => { if (flickerRef.current) clearInterval(flickerRef.current) }
  }, [])

  // Text scramble effect
  useEffect(() => {
    if (!titleRef.current) return
    
    if (!scramblerRef.current) {
      scramblerRef.current = new TextScramble(titleRef.current)
    }

    const phrases = [
      "POS SYSTEMS",
      "ERP SYSTEMS",
      "WEB APPS",
      "E-COMMERCE",
      "AI AGENTS" // Ends on this to perfectly sync with the hero section title
    ]
    
    let counter = 0
    let cancelled = false
    
    const tick = () => {
      if (cancelled) return
      const scrambler = scramblerRef.current
      if (!scrambler) return
      
      const phrase = phrases[counter] ?? phrases[0]
      
      scrambler.setText(phrase).then(() => {
        if (typeof window === "undefined") return
        
        counter++
        // If we haven't reached the end, schedule the next phrase
        if (counter < phrases.length) {
          phraseTimerRef.current = window.setTimeout(tick, 450)
        } else {
          // Once we reach the final phrase ("AI AGENTS"), start the fade out process
          setTimeout(() => setFadeOut(true), 800)
          setTimeout(() => setVisible(false), 1500)
        }
      }).catch(() => {})
    }
    
    // Start scrambling after a tiny delay
    phraseTimerRef.current = window.setTimeout(tick, 300)
    
    return () => {
      cancelled = true
      if (phraseTimerRef.current != null) {
        window.clearTimeout(phraseTimerRef.current)
        phraseTimerRef.current = null
      }
      scramblerRef.current?.destroy()
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: "#09130f",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vw] rounded-full pointer-events-none"
        style={{ background: "rgba(0,180,176,0.07)", filter: "blur(100px)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[20vw] rounded-full pointer-events-none"
        style={{ background: "rgba(123,200,50,0.05)", filter: "blur(80px)", transform: "translate(15%, -50%)" }}
      />

      {/* Raining characters */}
      <div ref={canvasContainerRef} className="absolute inset-0" aria-hidden="true">
        {Array.from({ length: CHAR_COUNT }).map((_, idx) => (
          <span
            key={idx}
            ref={(el) => { spansRef.current[idx] = el }}
          />
        ))}
      </div>

      {/* Centre brand content */}
      <div className="relative z-10 flex flex-col items-center justify-center select-none">
        {/* Scrambling Title */}
        <h1 
          ref={titleRef}
          className="font-black text-[9.5vw] sm:text-6xl md:text-8xl text-white text-center select-none whitespace-nowrap"
          style={{ 
            textShadow: "0 0 40px rgba(0,0,0,0.8)",
            letterSpacing: "-0.02em"
          }}
          aria-label="Hero title"
        >
          POS SYSTEMS
        </h1>
      </div>
    </div>
  )
}
