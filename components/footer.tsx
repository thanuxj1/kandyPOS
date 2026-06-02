"use client"

import { Heart, Facebook, MessageCircle, Mail, ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useLenis } from "@studio-freight/react-lenis"

export function Footer() {
  const lenis = useLenis()
  const [facebook, setFacebook] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    try {
      const savedFacebook = localStorage.getItem("kandy_social_facebook") || ""
      const savedWhatsapp = localStorage.getItem("kandy_social_whatsapp") || ""
      const savedEmail = localStorage.getItem("kandy_social_email") || ""
      setFacebook(savedFacebook)
      setWhatsapp(savedWhatsapp)
      setEmail(savedEmail)
    } catch {}
  }, [])

  // Helper formatting logic
  const getFacebookHref = () => {
    if (!facebook) return "https://facebook.com"
    if (facebook.startsWith("http://") || facebook.startsWith("https://")) return facebook
    return `https://facebook.com/${facebook}`
  }

  const getWhatsappHref = () => {
    if (!whatsapp) return "https://wa.me/94770000000"
    if (whatsapp.startsWith("http://") || whatsapp.startsWith("https://")) return whatsapp
    const cleanNum = whatsapp.replace(/[^\d]/g, "")
    return `https://wa.me/${cleanNum}`
  }

  const getEmailHref = () => {
    if (!email) return "mailto:info@kandypos.com"
    if (email.startsWith("mailto:")) return email
    return `mailto:${email}`
  }

  return (
    <footer
      className="relative py-8 px-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs text-zinc-500 text-center sm:text-left">
          <a href="#" className="flex items-center group">
            <span className="font-bold text-white text-[15px] tracking-tight flex items-baseline transition-transform duration-300 group-hover:scale-[1.02]">
              Kandy
              <span className="font-light text-white ml-[1px]">pos</span>
              <sup className="text-[8px] text-zinc-500 ml-0.5">™</sup>
            </span>
          </a>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <span>© {new Date().getFullYear()} Kandy POS Sri Lanka</span>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <span className="hidden sm:inline flex items-center gap-1">
            Made with{" "}
            <Heart className="w-2.5 h-2.5 inline mx-0.5" style={{ color: "#00b4b0", fill: "#00b4b0" }} />
            for local merchants
          </span>
        </div>

        {/* Social Icons Bar */}
        <div className="flex items-center gap-4">
          {/* Facebook */}
          <a
            href={getFacebookHref()}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            className="relative w-10 h-10 rounded-2xl border border-zinc-850 bg-zinc-950/40 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#1877f2]/40 hover:bg-[#1877f2]/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(24,119,242,0.25)] transition-all duration-300"
          >
            <Facebook className="w-4.5 h-4.5" />
          </a>

          {/* WhatsApp */}
          <a
            href={getWhatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="relative w-10 h-10 rounded-2xl border border-zinc-850 bg-zinc-950/40 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#25d366]/40 hover:bg-[#25d366]/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.25)] transition-all duration-300"
          >
            <MessageCircle className="w-4.5 h-4.5" />
          </a>

          {/* Email */}
          <a
            href={getEmailHref()}
            title="Email Contact"
            className="relative w-10 h-10 rounded-2xl border border-zinc-850 bg-zinc-950/40 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#00b4b0]/40 hover:bg-[#00b4b0]/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,180,176,0.25)] transition-all duration-300"
          >
            <Mail className="w-4.5 h-4.5" />
          </a>
        </div>

        {/* Back to Top Action */}
        <div>
          <button
            onClick={() => {
              if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 })
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors duration-200 group font-medium cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
