"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Settings } from "lucide-react"
import { useLenis } from "@studio-freight/react-lenis"

const navItems = [
  { label: "Services",     href: "#services" },
  { label: "Projects",     href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact",      href: "#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminPath,  setAdminPath]  = useState("admin")
  const [scrolled,   setScrolled]   = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    setAdminPath(localStorage.getItem("kandy_admin_path") || "admin")
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const delay = mobileOpen ? 150 : 0
    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(href, {
          offset: -80, // Frame the section headers perfectly with navbar height
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Premium smooth exponential easing
        })
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
      }
    }, delay)
  }

  return (
    <>
      {/* ─── Navbar bar ────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 lg:top-5 left-0 right-0 z-50 flex justify-center px-0 lg:px-4"
      >
        <div
          className="flex items-center justify-between w-full lg:w-auto transition-all duration-300 mx-auto lg:rounded-full px-6 py-4 lg:py-2.5 lg:px-3 lg:pl-6 border-b border-white/[0.06] lg:border lg:border-white/[0.06]"
          style={{
            background:          scrolled ? "rgba(10,10,10,0.98)" : "rgba(10,10,10,0.9)",
            backdropFilter:      "blur(24px)",
            WebkitBackdropFilter:"blur(24px)",
            boxShadow:           scrolled
              ? "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* ── Logo ── */}
          <a href="#" className="flex items-center shrink-0 group lg:mr-12">
            <span className="font-bold text-white text-[17px] tracking-tight flex items-baseline gap-[2px]">
              Kandy
              <span
                className="font-light ml-[2px]"
                style={{
                  backgroundImage: "linear-gradient(to right,#00b4b0,#7bc832)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                POS
              </span>
              <sup className="text-[8px] text-zinc-500 ml-0.5">™</sup>
            </span>
          </a>

          {/* ── Desktop nav links ── */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
                className="text-[14px] font-normal text-zinc-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* ── Desktop right — admin + CTA ── */}
          <div className="hidden lg:flex items-center gap-5 shrink-0 ml-8 lg:ml-12">
            <a
              href={`/${adminPath}`}
              className="flex items-center p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors rounded-full"
              title="Admin"
            >
              <Settings className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/94759170323?text=Hi%20KandyPOS%21%20I%27d%20like%20to%20request%20a%20demo%20of%20your%20POS%20system.%20Please%20let%20me%20know%20the%20available%20times.%20Thank%20you%21"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="flex items-center px-6 py-2.5 rounded-full text-[14px] font-medium text-black transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg,#00b4b0,#7bc832)" }}
              >
                Request a Demo
              </button>
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden flex items-center justify-center w-12 h-12 text-white transition-colors mr-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <div className="flex flex-col justify-center items-center gap-[6px]">
                <span className="block w-7 h-0.5 bg-white"></span>
                <span className="block w-7 h-0.5 bg-white"></span>
                <span className="block w-7 h-0.5 bg-white"></span>
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* ─── Mobile full-screen overlay (outside the bar) ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col lg:hidden"
            style={{
              background:          "rgba(10,10,10,0.98)",
              backdropFilter:      "blur(24px)",
              WebkitBackdropFilter:"blur(24px)",
              paddingTop:          "72px", // height of the navbar bar
            }}
          >
            <div className="flex flex-col px-6 py-8 gap-2">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
                  className="text-2xl font-semibold text-white py-4 border-b border-white/[0.06] hover:text-[#00b4b0] transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={`/${adminPath}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors py-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Dashboard
                </a>
                <a
                  href="https://wa.me/94759170323?text=Hi%20KandyPOS%21%20I%27d%20like%20to%20get%20in%20touch%20with%20your%20team.%20Could%20you%20please%20assist%20me%3F%20Thank%20you%21"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                >
                  <button
                    className="w-full py-4 rounded-2xl text-base font-bold text-black"
                    style={{ background: "linear-gradient(135deg,#00b4b0,#7bc832)" }}
                  >
                    Contact Us
                  </button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Height spacer */}
      <div className="h-[72px]" />
    </>
  )
}
