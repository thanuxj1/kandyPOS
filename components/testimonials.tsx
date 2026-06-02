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

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Thanuja Senanayake",
    role: "Managing Director",
    company: "The Royal Bean Cafe",
    text: "Kandy POS transformed our order speed! Table checkouts take literally 3 seconds now. Our waiters love the handheld terminals, and kitchen slip print-errors have dropped to zero.",
    rating: 5,
    avatar: "/professional-headshot-1.png",
  },
  {
    id: "t2",
    name: "Mohamed Rilwan",
    role: "Operations Head",
    company: "City Grocers Supermarket",
    text: "Superb inventory control. We managed to load over 15,000 barcode lines without a single hitch. Even during internet outages, the checkout counter works perfectly. Essential software!",
    rating: 5,
    avatar: "/professional-headshot-2.png",
  },
  {
    id: "t3",
    name: "Dilini Perera",
    role: "Founder & Creative",
    company: "Heritage Silk Boutique",
    text: "Beautiful layout, easy training. We got our sales staff comfortable with the billing tablet in just 10 minutes. The automated WhatsApp bills save us hundreds in paper roll costs.",
    rating: 5,
    avatar: "/professional-headshot-3.png",
  },
  {
    id: "t4",
    name: "Kasun Silva",
    role: "Franchise Owner",
    company: "Burger Hub",
    text: "The multi-branch management is phenomenal. I can monitor live sales from all 4 of my outlets straight from my phone. A total game-changer for my business operations.",
    rating: 5,
    avatar: "/professional-headshot-4.png",
  },
  {
    id: "t5",
    name: "Amala Fernando",
    role: "Retail Manager",
    company: "Glow Cosmetics",
    text: "Customer loyalty features have brought our repeat customer rate up by 40%. The UI is so slick and modern, our cashiers love using it every day.",
    rating: 5,
    avatar: "/professional-headshot-5.png",
  },
  {
    id: "t6",
    name: "Ruwan Wijesinghe",
    role: "CEO",
    company: "Wijesinghe Hardware",
    text: "Handling bulk inventory and wholesale pricing used to be a nightmare. Kandy POS handles variable pricing tiers effortlessly. Best POS investment we've ever made.",
    rating: 5,
    avatar: "/professional-headshot-6.png",
  },
  {
    id: "t7",
    name: "Chaminda Jayasuriya",
    role: "Owner",
    company: "Jayasuriya Auto Parts",
    text: "The system is incredibly fast and reliable. Even when our internet drops, we never miss a sale. The offline mode is a lifesaver for businesses in Sri Lanka.",
    rating: 5,
    avatar: "/professional-headshot-1.png",
  },
  {
    id: "t8",
    name: "Nadeesha Kuruppu",
    role: "Finance Director",
    company: "Kuruppu Textiles",
    text: "Accounting integration is seamless. We save at least 15 hours a week on manual bookkeeping. It's the most comprehensive ERP we've used.",
    rating: 5,
    avatar: "/professional-headshot-3.png",
  },
  {
    id: "t9",
    name: "Suresh Bandara",
    role: "General Manager",
    company: "Bandara Hotels",
    text: "The AI chatbot features have revolutionized how we take reservations. Our staff can focus on the guests while the system handles the busywork.",
    rating: 5,
    avatar: "/professional-headshot-4.png",
  },
]

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)

  useEffect(() => {
    const saved = localStorage.getItem("kandy_testimonials_v2")
    if (saved) {
      try {
        setTestimonials(JSON.parse(saved))
      } catch (e) {
        console.error("Error parsing local testimonials", e)
      }
    } else {
      localStorage.setItem("kandy_testimonials_v2", JSON.stringify(DEFAULT_TESTIMONIALS))
      setTestimonials(DEFAULT_TESTIMONIALS)
    }
  }, [])

  // Duplicate items to ensure a seamless infinite horizontal loop
  const loopItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials]

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

        {/* Infinite Horizontal Scroller - Single Line with Left & Right Fading Overlays */}
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
                    "{test.text}"
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
                      {test.role}, {test.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
