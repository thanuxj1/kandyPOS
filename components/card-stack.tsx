"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Project {
  id: string
  title: string
  client: string
  category: string
  description: string
  features: string[]
  color: string
  icon: "cafe" | "market" | "retail"
  image?: string
  requiresPermission?: boolean
}

const accentMap: Record<string, { pill: string; border: string; glow: string; icon: string }> = {
  teal: {
    pill: "rgba(0,180,176,0.08)",
    border: "#00b4b0",
    glow: "rgba(0,180,176,0.04)",
    icon: "text-[#00b4b0]",
  },
  green: {
    pill: "rgba(123,200,50,0.08)",
    border: "#7bc832",
    glow: "rgba(123,200,50,0.04)",
    icon: "text-[#7bc832]",
  },
}

export function CardStack({
  projects,
  isMobile = false,
  onViewWork,
}: {
  projects: Project[]
  isMobile?: boolean
  onViewWork?: (project: Project) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Clamp/reset active index when database dimensions shift
  useEffect(() => {
    setActiveIndex(0)
  }, [projects.length])

  if (!projects.length) return null

  // Animation layout parameters from Framer spec
  const offset = isMobile ? 6 : 8 // percentage shift vertical
  const scaleStep = 0.05
  const dimStep = 0.15
  const spring = { type: "spring", stiffness: 180, damping: 25 }

  return (
    <div
      className={`relative select-none flex items-center justify-center overflow-visible z-10 ${
        isMobile
          ? "w-full max-w-[325px] h-[450px] mx-auto mt-6"
          : "w-[620px] h-[480px] mx-auto mt-12"
      }`}
    >
      {/* Ambient background glow keyed to the top card's color theme */}
      {projects[activeIndex] && (
        <div
          className="absolute -inset-10 rounded-full opacity-35 pointer-events-none transition-all duration-700 blur-[80px]"
          style={{
            background:
              projects[activeIndex].color === "green"
                ? "radial-gradient(circle, rgba(123,200,50,0.15) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(0,180,176,0.15) 0%, transparent 70%)",
          }}
        />
      )}

      <ul className="relative w-full h-full m-0 p-0 overflow-visible list-none">
        {projects.map((project, i) => {
          // Circular relative offset index from current pointer
          const relativeIndex = (i - activeIndex + projects.length) % projects.length
          const front = relativeIndex === 0
          
          // Cap stack visual offset to at most 3 cards deep
          const displayIndex = Math.min(relativeIndex, 3)
          const accent = accentMap[project.color] ?? accentMap["teal"]
          const brightness = Math.max(0.1, 1 - displayIndex * dimStep)
          const baseZ = projects.length - relativeIndex

          return (
            <motion.li
              key={project.id || i}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "24px",
                listStyle: "none",
                cursor: front ? "grab" : "auto",
                overflow: "hidden",
                touchAction: "none",
                zIndex: baseZ,
                pointerEvents: front ? "auto" : "none",
                boxShadow: front
                  ? "0px 20px 40px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255,255,255,0.06)"
                  : "0px 10px 20px rgba(0, 0, 0, 0.4)",
              }}
              animate={{
                top: `${displayIndex * -offset}%`,
                scale: 1 - displayIndex * scaleStep,
                filter: `brightness(${brightness})`,
                zIndex: baseZ,
                opacity: relativeIndex <= 3 ? 1 : 0,
              }}
              transition={spring}
              drag={front ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.45}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                // Determine if swipe gesture represents a decisive vertical push to flip card
                const dragThreshold = 40
                if (
                  Math.abs(info.offset.y) > dragThreshold ||
                  Math.abs(info.velocity.y) > 300
                ) {
                  setActiveIndex((prev) => (prev + 1) % projects.length)
                }
              }}
              whileDrag={
                front
                  ? {
                      zIndex: projects.length + 1,
                      cursor: "grabbing",
                      scale: 1.02,
                      rotate: 1.5,
                    }
                  : {}
              }
              className="bg-zinc-950 border border-zinc-900 group/card"
            >
              {/* Graphic background */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <img
                  src={
                    project.image ||
                    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/98 via-black/85 to-black/20 ${
                    front ? "opacity-100" : "opacity-90"
                  } transition-opacity duration-300`}
                />
              </div>

              {/* Decorative accent spotlight glow */}
              <div
                className="absolute top-[-50px] right-[-50px] w-[180px] h-[180px] rounded-full pointer-events-none transition-opacity duration-500 blur-[30px]"
                style={{
                  background: accent.glow,
                  opacity: front ? 1 : 0,
                }}
              />

              {/* Full Content Overlay for Active Front Card - Minimalistic Visual Layout */}
              {front && (
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 text-white select-none bg-gradient-to-t from-black/95 via-black/45 to-transparent">
                  <div className="space-y-4 max-w-md text-left">
                    <div>
                      <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-zinc-300 text-sm mt-1.5 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Prevent card dragging
                          onViewWork?.(project)
                        }}
                        className="bg-zinc-200 hover:bg-white text-zinc-950 font-bold py-2.5 px-6 rounded-full text-xs transition-colors shadow-lg cursor-pointer shrink-0"
                      >
                        View Work
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.li>
          )
        })}
      </ul>

      {/* Swipe Navigation Indicator Overlay */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center text-[10px] text-zinc-500 font-mono tracking-widest uppercase pointer-events-none">
        Drag top card vertically to cycle
      </div>
    </div>
  )
}
