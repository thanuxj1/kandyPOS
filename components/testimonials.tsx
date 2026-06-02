"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, MessageSquareQuote } from "lucide-react"

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
  rating: number
  avatar: string
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTestimonials(data)
      })
      .catch((err) => console.error("Failed to load testimonials:", err))
      .finally(() => setLoading(false))
  }, [])

  // Duplicate items for seamless infinite horizontal loop
  const loopItems = testimonials.length > 0
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : []

  return (
    <section id="testimonials" className="py-10 sm:py-16 px-4 relative overflow-hidden bg-[#0a0a0a]">
      {/* Global CSS keyframes for horizontal scroller loop with hover pause support */}
      <style>{`
        @keyframes scrollLeftToRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .scroll-row-horizontal {
          animation: scrollLeftToRight 55s linear infinite;
        }
        .scroll-row-horizontal:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Border top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center max-w-xl mx-auto mb-8 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(0,180,176,0.08)",
              border: "1px solid rgba(0,180,176,0.2)",
            }}
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#00b4b0]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00b4b0]">
              Testimonials
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5">
            What Our Users Say
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            lightning-fast system reviews from business owners, general managers, and founders across Sri Lanka.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex gap-5 overflow-hidden py-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-[380px] sm:w-[410px] shrink-0 h-[175px] rounded-2xl bg-zinc-900/40 border border-zinc-900 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Infinite Horizontal Scroller */}
        {!loading && testimonials.length > 0 && (
          <div
            className="relative w-full overflow-hidden py-4 select-none"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div className="flex gap-5 w-max scroll-row-horizontal">
              {loopItems.map((test, idx) => (
                <div
                  key={test.id + "-" + idx}
                  className="w-[380px] sm:w-[410px] shrink-0 p-6 rounded-2xl bg-zinc-950/60 border border-zinc-900 flex flex-col justify-between h-[175px] transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/10 cursor-default"
                >
                  <div>
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(test.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed italic line-clamp-3">
                      &quot;{test.text}&quot;
                    </p>
                  </div>

                  {/* Profile Meta info */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {test.name}
                      </h4>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {test.role}{test.company ? `, ${test.company}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && testimonials.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 text-sm font-mono">No testimonials yet. Add some in the Admin Dashboard.</p>
          </div>
        )}
      </div>
    </section>
  )
}
