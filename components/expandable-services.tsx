"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Server, Cpu, Globe, ShoppingBag } from "lucide-react"

const SERVICES = [
  {
    id: "01",
    title: "ERP & POS Systems",
    description: "Lightning-fast Point of Sale systems that work seamlessly both online and offline, fully integrated with a powerful ERP backbone to run your entire operation.",
    icon: <Server className="w-6 h-6" />,
    color: "#00b4b0"
  },
  {
    id: "02",
    title: "AI Automation Agents",
    description: "Deploy intelligent AI bots that handle customer inquiries, automatically process data, and generate insights without human intervention.",
    icon: <Cpu className="w-6 h-6" />,
    color: "#7bc832"
  },
  {
    id: "03",
    title: "Custom Business Web Apps",
    description: "Bespoke websites, internal tools, and customer portals tailored specifically to your business niche. Stop paying for generic SaaS and own your software.",
    icon: <Globe className="w-6 h-6" />,
    color: "#00b4b0"
  },
  {
    id: "04",
    title: "E-Commerce Solutions",
    description: "Seamlessly connect your business with a beautiful online storefront. Unified inventory means you never oversell, and online orders sync instantly.",
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "#7bc832"
  }
]

export default function ExpandableServices() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="services" className="py-10 sm:py-16 px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "rgba(0,180,176,0.03)", filter: "blur(120px)", transform: "translate(20%, -20%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(0,180,176,0.08)",
              border: "1px solid rgba(0,180,176,0.2)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00b4b0]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00b4b0]">
              The Operating System
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            Stop duct-taping your business together.
          </h2>
          <p className="text-zinc-400 max-w-2xl text-base sm:text-lg">
            Everything you need to run your operations smoothly, all in one unified ecosystem.
          </p>
        </motion.div>

        {/* Expandable List Container */}
        <div 
          className="w-full flex flex-col border-t border-white/10"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {SERVICES.map((service, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                className="group relative border-b border-white/10 transition-colors duration-500 cursor-pointer overflow-hidden"
                style={{
                  backgroundColor: isHovered ? "rgba(255,255,255,0.02)" : "transparent"
                }}
              >
                {/* Active left border indicator */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                  style={{
                    backgroundColor: service.color,
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "scaleY(1)" : "scaleY(0)"
                  }}
                />

                <div className="px-6 sm:px-10 py-8">
                  {/* Always visible header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 sm:gap-10">
                      <span className="text-sm font-mono text-zinc-600 font-medium">
                        {service.id}
                      </span>
                      <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                    
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border"
                      style={{
                        backgroundColor: isHovered ? `${service.color}15` : "transparent",
                        borderColor: isHovered ? `${service.color}40` : "rgba(255,255,255,0.1)",
                        color: isHovered ? service.color : "rgba(255,255,255,0.3)"
                      }}
                    >
                      <ArrowRight 
                        className={`w-5 h-5 transition-transform duration-500 ${isHovered ? "-rotate-45" : "rotate-0"}`} 
                      />
                    </div>
                  </div>

                  {/* Expandable content */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isHovered ? "auto" : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 24 : 0
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 pl-0 sm:pl-[4.5rem]">
                      <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                        {service.description}
                      </p>
                      
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 hidden sm:flex"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}20, transparent)`,
                          border: `1px solid ${service.color}30`,
                          color: service.color
                        }}
                      >
                        {service.icon}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
