"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="py-10 sm:py-16 px-4 relative flex justify-center overflow-hidden">
      {/* Bottom ambient glow - using brand colors */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(0,180,176,0.15) 0%, transparent 70%)",
          filter: "blur(70px)",
          transform: "translateY(50%)"
        }}
      />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="p-10 sm:p-16 rounded-[32px] border border-white/5 bg-[#0a0a0a] shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight max-w-3xl leading-[1.15]">
            Ready to scale your business with the ultimate Point of Sale?
          </h2>

          <a
            href="https://wa.me/94759170323?text=Hi%20KandyPOS%21%20I%27d%20like%20to%20request%20a%20demo%20of%20your%20POS%20system.%20Please%20let%20me%20know%20the%20available%20times.%20Thank%20you%21"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="rounded-xl px-8 h-14 text-sm sm:text-base font-bold text-white shadow-lg shadow-[#00b4b0]/20 hover:scale-105 active:scale-95 transition-all"
              style={{ background: "linear-gradient(to right, #00b4b0, #7bc832)" }}
            >
              <div className="flex items-center gap-3">
                {/* Kandy POS Brand Logo */}
                <span className="flex items-baseline text-white tracking-tight">
                  <span className="font-bold text-lg">Kandy</span>
                  <span className="font-light text-lg">POS</span>
                  <sup className="text-[8px] opacity-70 ml-0.5">™</sup>
                </span>
                <div className="w-[1px] h-4 bg-white/30 mx-1" />
                Request a Demo
              </div>
            </Button>
          </a>

          <p className="mt-8 text-sm sm:text-base text-zinc-500 font-medium">
            Join hundreds of businesses across Sri Lanka already streamlining their checkout.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
