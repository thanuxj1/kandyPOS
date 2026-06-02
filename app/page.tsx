"use client"

import { Navbar } from "@/components/navbar"
import { RainingLettersHero } from "@/components/raining-letters-hero"
import ExpandableServices from "@/components/expandable-services"
import Projects from "@/components/projects"
import Testimonials from "@/components/testimonials"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="relative bg-[#0a0a0a] text-white min-h-screen">
      {/* Matte glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#00b4b0]/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#7bc832]/[0.03] blur-[120px]" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <RainingLettersHero />
        <ExpandableServices />
        <Projects />
        <Testimonials />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  )
}
