"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { motion, useAnimationFrame } from "framer-motion"

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

// Sub-component for individual project cards in horizontal FlowMarquee
function MarqueeCard({
  project,
  cardWidth,
  itemX,
  onViewWork,
}: {
  project: Project
  cardWidth: number
  itemX: number
  onViewWork?: (project: Project) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const accent = accentMap[project.color] ?? accentMap["teal"]

  const transitionConfig = { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }

  return (
    <motion.div
      style={{
        position: "absolute",
        width: cardWidth,
        height: "100%",
        left: itemX,
        top: 0,
        overflow: "hidden",
        borderRadius: "24px",
        willChange: "transform",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800/80 transition-colors duration-300 relative group/card cursor-default shadow-2xl flex flex-col justify-end"
    >
      {/* Dynamic Cover Graphic Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-[24px]">
        <motion.img
          src={
            project.image ||
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
          }
          alt={project.title}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={transitionConfig}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Soft shadow overlay, deepens slightly on hover */}
        <motion.div 
          animate={{ opacity: isHovered ? 0.95 : 0.85 }}
          transition={transitionConfig}
          className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/60 to-transparent pointer-events-none" 
        />
      </div>

      {/* Ambient background glow spotlight */}
      <div
        className="absolute top-[-50px] right-[-50px] w-[180px] h-[180px] rounded-full pointer-events-none blur-[35px] transition-opacity duration-500"
        style={{
          background: accent.glow,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Static Minimalist Details Overlay - Always readable, aligned bottom-left */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-8 text-white select-none text-left space-y-4">
        <div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            {project.title}
          </h3>
          <p className="text-zinc-300 text-sm mt-1.5 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation() // Prevent click leaks
              onViewWork?.(project)
            }}
            className="bg-zinc-200 hover:bg-white text-zinc-950 font-bold py-2.5 px-6 rounded-full text-xs transition-colors shadow-lg cursor-pointer shrink-0 inline-block w-fit"
          >
            View Work
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function FlowMarquee({
  projects,
  onViewWork,
}: {
  projects: Project[]
  onViewWork?: (project: Project) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1200)
  const offsetRef = useRef(0)
  const [offset, setOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Drag state for cursor swipe on desktop
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartOffset = useRef(0)
  const dragVelocity = useRef(0)
  const lastDragX = useRef(0)
  const lastDragTime = useRef(0)
  const wasDragged = useRef(false)

  const speed = 0.85 // Consistent glide speed
  const gap = 12

  // 1. Monitor layout changes to size card widths responsively
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const cardWidth = useMemo(() => {
    return Math.max(280, containerWidth / 3 - gap)
  }, [containerWidth, gap])

  // 2. Clone collection to guarantee gap-free wrapping on wide displays
  const baseProjects = useMemo(() => {
    if (!projects || projects.length === 0) return []
    let repeated = [...projects]
    while (repeated.length < 12) {
      repeated = [...repeated, ...projects]
    }
    return repeated
  }, [projects])

  const duplicatedProjects = useMemo(() => {
    return [...baseProjects, ...baseProjects]
  }, [baseProjects])

  const loopWidth = useMemo(() => {
    return baseProjects.length * (cardWidth + gap)
  }, [baseProjects.length, cardWidth, gap])

  // 3. Fluid requestAnimationFrame render loop with drag momentum
  useAnimationFrame((_, delta) => {
    if (loopWidth === 0) return

    const normalizedDelta = delta / 16.67

    if (!isPaused && !isDragging.current) {
      // Apply auto-scroll
      offsetRef.current += speed * normalizedDelta

      // Apply residual drag momentum (decaying inertia after release)
      if (Math.abs(dragVelocity.current) > 0.1) {
        offsetRef.current -= dragVelocity.current * normalizedDelta
        dragVelocity.current *= 0.95 // Friction decay
      } else {
        dragVelocity.current = 0
      }
    }

    // Wrap offset within loop bounds
    if (offsetRef.current >= loopWidth) {
      offsetRef.current -= loopWidth
    } else if (offsetRef.current < 0) {
      offsetRef.current += loopWidth
    }

    setOffset(offsetRef.current)
  })

  // --- Desktop cursor drag/swipe handlers ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only handle primary pointer (left mouse button / single touch)
    if (e.button !== 0) return
    isDragging.current = true
    wasDragged.current = false
    dragStartX.current = e.clientX
    dragStartOffset.current = offsetRef.current
    lastDragX.current = e.clientX
    lastDragTime.current = performance.now()
    dragVelocity.current = 0
    setIsPaused(true)

    // Capture pointer to track outside container
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return

    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 3) wasDragged.current = true

    // Track velocity for momentum
    const now = performance.now()
    const dt = now - lastDragTime.current
    if (dt > 0) {
      dragVelocity.current = (e.clientX - lastDragX.current) / dt * 16 // normalize to ~frame
    }
    lastDragX.current = e.clientX
    lastDragTime.current = now

    // Update offset directly (drag left = scroll forward, drag right = scroll back)
    let newOffset = dragStartOffset.current - dx
    if (newOffset < 0) newOffset += loopWidth
    if (newOffset >= loopWidth) newOffset -= loopWidth
    offsetRef.current = newOffset
    setOffset(newOffset)
  }, [loopWidth])

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    // Resume auto-scroll after a brief pause so momentum feels natural
    setTimeout(() => setIsPaused(false), 50)
  }, [])

  if (!projects.length) return null

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => { if (!isDragging.current) setIsPaused(true) }}
      onMouseLeave={() => { if (!isDragging.current) setIsPaused(false) }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="w-full h-[430px] overflow-hidden relative flex items-center select-none touch-none"
      style={{
        cursor: isDragging.current ? "grabbing" : "grab",
        maskImage:
          "linear-gradient(90deg, transparent, rgba(0,0,0,0.02) 2%, rgba(0,0,0,0.15) 5%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.85) 15%, black 20%, black 80%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0.5) 90%, rgba(0,0,0,0.15) 95%, rgba(0,0,0,0.02) 98%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, rgba(0,0,0,0.02) 2%, rgba(0,0,0,0.15) 5%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.85) 15%, black 20%, black 80%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0.5) 90%, rgba(0,0,0,0.15) 95%, rgba(0,0,0,0.02) 98%, transparent)",
      }}
    >
      <div className="relative w-full h-full">
        {duplicatedProjects.map((project, index) => {
          const itemX = index * (cardWidth + gap) - offset

          // Buffer boundary check to avoid offscreen draw calls
          if (itemX < -cardWidth - 100 || itemX > containerWidth + 100) return null

          return (
            <MarqueeCard
              key={`${project.id}-${index}`}
              project={project}
              cardWidth={cardWidth}
              itemX={itemX}
              onViewWork={onViewWork}
            />
          )
        })}
      </div>
    </div>
  )
}
