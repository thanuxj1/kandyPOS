"use client"

import { useCallback, useEffect, useRef } from "react"
import { useInView } from "framer-motion"

export function RainingLettersHero() {
  const charCount = 260
  const characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
  const minFontSizePx = 12
  const maxFontSizePx = 28
  
  // Brand colors
  const idleColor = "#3f3f46" // zinc-700
  const activeColor1 = "#00b4b0" // Teal
  const activeColor2 = "#7bc832" // Lime

  const flickerMinActive = 4
  const flickerMaxActive = 12
  const flickerIntervalMs = 60

  const containerRef = useRef<HTMLElement>(null)
  const inView = useInView(containerRef, { amount: 0.15 })
  const spansRef = useRef<(HTMLSpanElement | null)[]>([])
  const charsRef = useRef<{char: string, xPct: number, yPct: number, speedPctPerFrame: number, isTeal: boolean}[]>([])
  const rafRef = useRef<number | null>(null)
  const flickerTimerRef = useRef<number | null>(null)
  const activeSetRef = useRef<Set<number>>(new Set())

  const makeCharacters = useCallback(() => {
    const count = Math.max(1, Math.floor(charCount))
    const result = []
    for (let i = 0; i < count; i++) {
      const c = characterSet[Math.floor(Math.random() * characterSet.length)] || "A"
      result.push({
        char: c,
        xPct: Math.random() * 100,
        yPct: Math.random() * 100,
        speedPctPerFrame: 0.06 + Math.random() * 0.24,
        isTeal: Math.random() > 0.5 // Randomly assign teal or lime to active characters
      })
    }
    return result
  }, [charCount, characterSet])

  const setSpanActive = useCallback((idx: number, active: boolean) => {
    const el = spansRef.current[idx]
    const ch = charsRef.current[idx]
    if (!el || !ch) return
    
    if (active) {
      const activeColor = ch.isTeal ? activeColor1 : activeColor2
      el.style.color = activeColor
      el.style.opacity = "1"
      el.style.fontWeight = "700"
      el.style.textShadow = `0 0 8px ${activeColor}80, 0 0 14px ${activeColor}40`
    } else {
      el.style.color = idleColor
      el.style.opacity = "0.35"
      el.style.fontWeight = "400"
      el.style.textShadow = "none"
    }
  }, [idleColor])

  const applySpanStaticStyle = useCallback((idx: number) => {
    const el = spansRef.current[idx]
    const ch = charsRef.current[idx]
    if (!el || !ch) return
    const fontSize = Math.max(minFontSizePx, Math.min(maxFontSizePx, minFontSizePx + Math.random() * (maxFontSizePx - minFontSizePx)))
    el.textContent = ch.char
    el.style.position = "absolute"
    el.style.left = `${ch.xPct}%`
    el.style.top = `${ch.yPct}%`
    el.style.transform = "translate(-50%, -50%)"
    el.style.willChange = "transform, top"
    el.style.pointerEvents = "none"
    el.style.userSelect = "none"
    el.style.fontSize = `${fontSize}px`
    el.style.fontFamily = "monospace"
    el.style.lineHeight = "1"
    el.style.transition = "color 0.12s linear, opacity 0.12s linear, text-shadow 0.12s linear"
    setSpanActive(idx, activeSetRef.current.has(idx))
  }, [maxFontSizePx, minFontSizePx, setSpanActive])

  const stopAllTimers = useCallback(() => {
    if (typeof window === "undefined") return
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (flickerTimerRef.current != null) {
      window.clearInterval(flickerTimerRef.current)
      flickerTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    charsRef.current = makeCharacters()
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        for (let i = 0; i < charsRef.current.length; i++) applySpanStaticStyle(i)
      })
    }
  }, [makeCharacters, applySpanStaticStyle])

  useEffect(() => {
    return () => {
      stopAllTimers()
    }
  }, [stopAllTimers])

  useEffect(() => {
    if (!inView) return
    if (typeof window === "undefined") return
    
    const count = charsRef.current.length
    if (count <= 0) return
    
    const minA = Math.max(0, Math.min(count, Math.floor(flickerMinActive)))
    const maxA = Math.max(minA, Math.min(count, Math.floor(flickerMaxActive)))
    const interval = Math.max(16, Math.floor(flickerIntervalMs))
    
    flickerTimerRef.current = window.setInterval(() => {
      const nextActive = new Set<number>()
      const numActive = Math.max(minA, Math.min(maxA, minA + Math.floor(Math.random() * (maxA - minA + 1))))
      
      for (let i = 0; i < numActive; i++) {
        nextActive.add(Math.floor(Math.random() * count))
      }
      
      const prev = activeSetRef.current
      activeSetRef.current = nextActive
      
      prev.forEach((idx) => {
        if (!nextActive.has(idx)) setSpanActive(idx, false)
      })
      nextActive.forEach((idx) => {
        if (!prev.has(idx)) setSpanActive(idx, true)
      })
    }, interval)
    
    return () => {
      if (flickerTimerRef.current != null) {
        window.clearInterval(flickerTimerRef.current)
        flickerTimerRef.current = null
      }
    }
  }, [flickerIntervalMs, flickerMaxActive, flickerMinActive, inView, setSpanActive])

  useEffect(() => {
    if (!inView) return
    if (typeof window === "undefined") return
    
    const loop = () => {
      const chars = charsRef.current
      const spans = spansRef.current
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i]
        const el = spans[i]
        if (!ch || !el) continue
        
        ch.yPct += ch.speedPctPerFrame
        if (ch.yPct >= 105) {
          ch.yPct = -5
          ch.xPct = Math.random() * 100
          ch.char = characterSet[Math.floor(Math.random() * characterSet.length)] || ch.char || "A"
          el.textContent = ch.char
        }
        el.style.top = `${ch.yPct}%`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    
    rafRef.current = requestAnimationFrame(loop)
    
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [characterSet, inView])

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[85vh] sm:h-screen overflow-hidden flex items-center justify-center"
      aria-label="Animated hero section"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
      }}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[28vw] rounded-full"
          style={{ background: "rgba(0,180,176,0.07)", filter: "blur(90px)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[18vw] rounded-full"
          style={{ background: "rgba(123,200,50,0.05)", filter: "blur(70px)", transform: "translate(10%, -50%)" }}
        />
      </div>

      <div className="absolute inset-0 z-10" aria-hidden="true">
        {Array.from({ length: Math.max(1, Math.floor(charCount)) }).map((_, idx) => (
          <span
            key={idx}
            ref={(el) => {
              if (!el) return
              spansRef.current[idx] = el
              if (charsRef.current[idx]) {
                applySpanStaticStyle(idx)
              }
            }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        {/* Static Title (Synced perfectly with the end of the Loading Screen) */}
        <h1 
          className="font-black text-[9.5vw] sm:text-6xl md:text-8xl text-white text-center select-none whitespace-nowrap"
          style={{ 
            textShadow: "0 0 40px rgba(0,0,0,0.8)",
            letterSpacing: "-0.02em"
          }}
          aria-label="Hero title"
        >
          AI AGENTS
        </h1>
        
        <p className="mt-6 text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium text-center shadow-black drop-shadow-lg">
          Your business&apos;s plug-and-play operating system. ERP, POS, and AI Agents built for Sri Lankan owners who want to move fast, eliminate chaos, and boost their income.
        </p>
      </div>
    </section>
  )
}
