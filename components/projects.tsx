"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Lock, X, MessageSquare } from "lucide-react"
import { CardStack } from "./card-stack"
import { FlowMarquee } from "./flow-marquee"

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
  projectUrl?: string
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "royal-bean",
    title: "The Royal Bean Cafe",
    client: "Royal Bean Ltd",
    category: "Cafe & Bistro POS",
    description:
      "Cloud table ordering, split-billing, and KDS dispatch deployed across 4 coffee shop branches.",
    features: ["Split-billing checkout", "Kitchen KDS sync", "WhatsApp receipt dispatch"],
    color: "teal",
    icon: "cafe",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    requiresPermission: false,
    projectUrl: "https://kandypos.com/bean-demo"
  },
  {
    id: "city-grocers",
    title: "City Grocers Supermarket",
    client: "City Grocers Corp",
    category: "Supermarket POS",
    description:
      "Dual-display checkouts integrated with weighing scales, barcode printers, and inventory tracking.",
    features: ["Customer secondary screens", "Weigh scale barcode sync", "Real-time stock alerts"],
    color: "green",
    icon: "market",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    requiresPermission: false,
    projectUrl: "https://kandypos.com/grocery-demo"
  },
  {
    id: "heritage-boutique",
    title: "Heritage Fashion Boutique",
    client: "Heritage Silk Co",
    category: "Boutique Retail Suite",
    description:
      "Elegant POS tablet counters synced with smart CRM, fashion inventory, and electronic gift cards.",
    features: ["Loyalty customer CRM", "Digital instant receipt", "Smart tag barcode registers"],
    color: "teal",
    icon: "retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    requiresPermission: true, // Restricted permission demo
  },
]

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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  const [contactWhatsApp, setContactWhatsApp] = useState("94770000000")

  useEffect(() => {
    const saved = localStorage.getItem("kandy_projects")
    if (saved) {
      try {
        setProjects(JSON.parse(saved))
      } catch (e) {
        console.error("Error parsing local projects", e)
      }
    } else {
      localStorage.setItem("kandy_projects", JSON.stringify(DEFAULT_PROJECTS))
    }

    setContactWhatsApp(localStorage.getItem("kandy_social_whatsapp") || "94770000000")
  }, [])

  const handleViewWork = (project: Project) => {
    if (project.requiresPermission) {
      setSelectedProject(project)
    } else {
      // Unrestricted project: launch the live demo link directly!
      const targetUrl = project.projectUrl || `https://wa.me/${contactWhatsApp.replace(/\+/g, "").trim()}?text=${encodeURIComponent(`Hello! I would like to view a case study for '${project.title}'.`)}`
      window.open(targetUrl, "_blank")
    }
  }

  const selectedAccent = selectedProject ? (accentMap[selectedProject.color] ?? accentMap["teal"]) : accentMap["teal"]

  // WhatsApp request code URL
  const whatsappUrl = `https://wa.me/${contactWhatsApp.replace(/\+/g, "").trim()}?text=${encodeURIComponent(
    `Hello! I would like to request an access code to view the proprietary '${selectedProject?.title}' case study.`
  )}`

  return (
    <section id="projects" className="py-10 sm:py-16 px-4 relative overflow-hidden bg-[#0a0a0a]">
      {/* Grid line backdrop decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient spotlights */}
      <div
        className="absolute top-[-10%] left-1/4 w-[500px] h-[350px] rounded-full pointer-events-none opacity-50"
        style={{ background: "rgba(0,180,176,0.05)", filter: "blur(120px)" }}
      />
      <div
        className="absolute bottom-[-10%] right-1/4 w-[400px] h-[300px] rounded-full pointer-events-none opacity-50"
        style={{ background: "rgba(123,200,50,0.05)", filter: "blur(120px)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6"
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{
                background: "rgba(123,200,50,0.08)",
                border: "1px solid rgba(123,200,50,0.2)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7bc832]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#7bc832]">
                Real-World Wins
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
              Built for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(to right, #00b4b0, #7bc832)" }}
              >
                Local Legends
              </span>
            </h2>
            <p className="text-zinc-400 max-w-xl text-sm sm:text-base leading-relaxed">
              Browse our dynamic client showcase. Displays an infinite gliding marquee in desktop view, and a tactile swipable card stack in mobile view.
            </p>
          </div>
        </motion.div>

        {/* Mobile View - Interactive Card Stack */}
        <div className="block md:hidden pb-12 pt-4">
          <CardStack projects={projects} onViewWork={handleViewWork} isMobile={true} />
        </div>

        {/* Desktop View - Cinematic FlowMarquee */}
        <div className="hidden md:block mt-8">
          {projects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/20 backdrop-blur-sm">
              <p className="text-zinc-500 text-sm font-mono">No projects currently showcased. Add some in the Admin Dashboard.</p>
            </div>
          ) : (
            <div className="py-4">
              <FlowMarquee projects={projects} onViewWork={handleViewWork} />
            </div>
          )}
        </div>
      </div>

      {/* Access Restriction Compact Pop-up Modal */}
      <AnimatePresence>
        {selectedProject && selectedProject.requiresPermission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Compact Modal Body Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-[340px] overflow-hidden bg-zinc-950/95 border border-zinc-900 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-white text-center"
            >
              {/* Corner Spotlight Accent Glow */}
              <div
                className="absolute top-[-50px] right-[-50px] w-[180px] h-[180px] rounded-full pointer-events-none blur-[40px] opacity-25"
                style={{ background: selectedAccent.border }}
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pt-4 flex flex-col items-center">
                {/* Glowing padlock emblem */}
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] mb-5">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>

                <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight mb-3">
                  Security Access Restricted
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                  Due to security reasons, this project can only be viewed by contacting us.
                </p>

                {/* Contact CTA Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  Contact Us to Request Access
                </a>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-3.5 text-zinc-500 hover:text-zinc-300 font-semibold text-[10px] tracking-wider uppercase mt-4 transition-colors"
                >
                  Close Notification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
