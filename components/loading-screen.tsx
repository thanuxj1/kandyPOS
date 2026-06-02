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

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const spansRef = useRef<(HTMLSpanElement | null)[]>([])
  const charsRef = useRef<FloatingChar[]>([])
  const rafRef = useRef<number | null>(null)
  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeSetRef = useRef<Set<number>>(new Set())

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

  // Auto-dismiss after 2.2s
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200)
    const hideTimer = setTimeout(() => setVisible(false), 2900)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
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
        {/* Logo wordmark */}
        <div
          className="font-black text-white text-center whitespace-nowrap"
          style={{
            fontSize: "clamp(3rem, 12vw, 8rem)",
            letterSpacing: "-0.03em",
            textShadow: "0 0 60px rgba(0,0,0,0.9)",
            lineHeight: 1,
          }}
        >
          Kandy
          <span
            style={{
              backgroundImage: "linear-gradient(to right, #00b4b0, #7bc832)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            POS
          </span>
          <sup
            style={{
              fontSize: "0.2em",
              WebkitTextFillColor: "#52525b",
              verticalAlign: "super",
              marginLeft: "0.15em",
            }}
          >
            ™
          </sup>
        </div>

        {/* Tagline */}
        <p
          className="mt-3 font-mono text-zinc-500 tracking-[0.3em] uppercase"
          style={{ fontSize: "clamp(0.55rem, 1.5vw, 0.75rem)" }}
        >
          Point of Sale · Sri Lanka
        </p>

        {/* Animated progress bar */}
        <div className="mt-8 w-48 h-[2px] rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(to right, #00b4b0, #7bc832)",
              animation: "kandyload 2s cubic-bezier(0.4,0,0.6,1) forwards",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes kandyload {
          0%   { width: 0%; opacity: 1; }
          85%  { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
