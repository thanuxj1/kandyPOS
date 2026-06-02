"use client"

import React from "react"
import { motion } from "framer-motion"

export interface Testimonial {
  id?: string
  text: string
  avatar: string
  name: string
  role: string
  company?: string
  rating?: number
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, avatar, name, role, company, rating }, i) => (
                <div
                  className="p-7 rounded-3xl flex flex-col justify-between transition-all duration-300 max-w-sm w-full relative group overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                  key={i}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(rating || 5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#00b4b0] fill-[#00b4b0]" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-zinc-300 text-[15px] leading-relaxed mb-8 relative z-10">{text}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <img
                      width={40}
                      height={40}
                      src={avatar || "/professional-headshot-5.png"}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                      style={{ backgroundColor: "#222" }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[14px] text-zinc-100 leading-tight">{name}</span>
                      <span className="text-[13px] text-zinc-500 leading-tight mt-0.5">
                        {role}{company ? `, ${company}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}
