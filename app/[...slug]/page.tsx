"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import AdminDashboard from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import { AlertOctagon } from "lucide-react"

export default function CatchAllPage() {
  const params = useParams()
  const slug = params?.slug as string[] | undefined
  const [isAdminRoute, setIsAdminRoute] = useState<boolean | null>(null)

  useEffect(() => {
    if (!slug || slug.length === 0) {
      setIsAdminRoute(false)
      return
    }

    const currentSlug = slug[0].toLowerCase()
    const savedAdminPath = (localStorage.getItem("kandy_admin_path") || "admin").toLowerCase()

    if (currentSlug === savedAdminPath) {
      setIsAdminRoute(true)
    } else {
      setIsAdminRoute(false)
    }
  }, [slug])

  if (isAdminRoute === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#00b4b0] animate-spin" />
      </div>
    )
  }

  if (isAdminRoute) {
    return <AdminDashboard />
  }

  // Else, show a custom premium 404 page!
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 text-center font-sans overflow-hidden">
      {/* Matte glow background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#00b4b0]/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#7bc832]/[0.03] blur-[120px]" />
      </div>
      
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0a0a0a]/80 border border-zinc-850 shadow-2xl relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/10 text-rose-500 shadow-lg animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">404</h1>
            <h2 className="text-base font-bold text-zinc-300 mt-2">Route Not Found</h2>
            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
              The requested address does not exist or has been shifted securely to a customized administrator URL.
            </p>
          </div>
        </div>

        <a href="/" className="block">
          <Button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-400 py-6 rounded-xl font-bold">
            Return to Safety
          </Button>
        </a>
      </div>
    </div>
  )
}
