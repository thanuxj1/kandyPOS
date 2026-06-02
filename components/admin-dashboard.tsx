"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, Save, Trash2, PlusCircle, CheckCircle, ArrowLeft, Settings, Users, FolderKanban, Share2, Pencil, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
  rating: number
  avatar: string
}

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState("")

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"projects" | "testimonials" | "settings">("projects")

  // Loading states
  const [loadingData, setLoadingData] = useState(false)
  const [saving, setSaving] = useState(false)

  // State lists
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [adminPath, setAdminPath] = useState("admin")
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Social links state
  const [facebookUrl, setFacebookUrl] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [socialsSaved, setSocialsSaved] = useState(false)

  // Edit states for Projects & Testimonials
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  // Form states for adding items
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    requiresPermission: false,
    projectUrl: "",
    image: ""
  })

  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    text: ""
  })

  // Load all data from API on mount (after auth)
  useEffect(() => {
    if (!isAuthenticated) return

    const loadAll = async () => {
      setLoadingData(true)
      try {
        const [projRes, testRes, settRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/testimonials"),
          fetch("/api/settings"),
        ])

        const projData = await projRes.json()
        const testData = await testRes.json()
        const settData = await settRes.json()

        if (Array.isArray(projData)) setProjects(projData)
        if (Array.isArray(testData)) setTestimonials(testData)

        if (settData) {
          if (settData.admin_path) setAdminPath(settData.admin_path)
          if (settData.facebook) setFacebookUrl(settData.facebook)
          if (settData.whatsapp) setWhatsappUrl(settData.whatsapp)
          if (settData.email) setEmailAddress(settData.email)
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setLoadingData(false)
      }
    }

    loadAll()
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "kandypos123"
    if (adminPasscode && passcode === adminPasscode) {
      setIsAuthenticated(true)
      setAuthError("")
    } else {
      setAuthError("Incorrect passcode. Please try again.")
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getAutoIcon = (title: string, category: string): "cafe" | "market" | "retail" => {
    const combined = (title + " " + category).toLowerCase()
    if (combined.match(/cafe|dining|restaurant|bistro|food/)) return "cafe"
    if (combined.match(/market|grocer|supermarket|store/)) return "market"
    return "retail"
  }

  const getAutoImage = (icon: string, customImage: string) => {
    if (customImage.trim()) return customImage.trim()
    const defaults: Record<string, string> = {
      cafe:   "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
      market: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      retail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    }
    return defaults[icon] ?? defaults.retail
  }

  // ── 1. Project Actions ─────────────────────────────────────────────────────

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.title || !newProject.category || !newProject.description) return

    const autoIcon = getAutoIcon(newProject.title, newProject.category)
    const autoImage = getAutoImage(autoIcon, newProject.image)

    setSaving(true)
    try {
      const payload: Project = {
        id: editingProject ? editingProject.id : "project_" + Date.now(),
        title: newProject.title,
        client: newProject.title,
        category: newProject.category,
        description: newProject.description,
        features: [],
        color: autoIcon === "market" ? "green" : "teal",
        icon: autoIcon,
        image: autoImage,
        requiresPermission: newProject.requiresPermission,
        projectUrl: newProject.projectUrl || undefined,
      }

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Save failed")

      const saved = await res.json()

      if (editingProject) {
        setProjects((prev) => prev.map((p) => p.id === saved.id ? saved : p))
        setEditingProject(null)
      } else {
        setProjects((prev) => [...prev, saved])
      }

      setNewProject({ title: "", category: "", description: "", requiresPermission: false, projectUrl: "", image: "" })
    } catch (err) {
      console.error("Failed to save project:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleEditStart = (proj: Project) => {
    setEditingProject(proj)
    setNewProject({
      title: proj.title,
      category: proj.category,
      description: proj.description,
      requiresPermission: !!proj.requiresPermission,
      projectUrl: proj.projectUrl || "",
      image: proj.image || ""
    })
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
    setNewProject({ title: "", category: "", description: "", requiresPermission: false, projectUrl: "", image: "" })
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Failed to delete project:", err)
    }
  }

  // ── 2. Testimonial Actions ─────────────────────────────────────────────────

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTestimonial.name || !newTestimonial.role || !newTestimonial.text) return

    setSaving(true)
    try {
      const avatarIdx = Math.floor(Math.random() * 5) + 1
      const payload: Testimonial = {
        id: editingTestimonial ? editingTestimonial.id : "test_" + Date.now(),
        name: newTestimonial.name,
        role: newTestimonial.role,
        company: "",
        text: newTestimonial.text,
        rating: 5,
        avatar: editingTestimonial?.avatar || `/professional-headshot-${avatarIdx}.png`,
      }

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Save failed")

      const saved = await res.json()

      if (editingTestimonial) {
        setTestimonials((prev) => prev.map((t) => t.id === saved.id ? saved : t))
        setEditingTestimonial(null)
      } else {
        setTestimonials((prev) => [...prev, saved])
      }

      setNewTestimonial({ name: "", role: "", text: "" })
    } catch (err) {
      console.error("Failed to save testimonial:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleEditTestimonialStart = (test: Testimonial) => {
    setEditingTestimonial(test)
    setNewTestimonial({
      name: test.name,
      role: test.company ? `${test.role}, ${test.company}` : test.role,
      text: test.text
    })
  }

  const handleCancelTestimonialEdit = () => {
    setEditingTestimonial(null)
    setNewTestimonial({ name: "", role: "", text: "" })
  }

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error("Failed to delete testimonial:", err)
    }
  }

  // ── 3. Admin Settings ──────────────────────────────────────────────────────

  const handleSavePath = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPath = adminPath.replace(/\//g, "").trim().toLowerCase()
    if (!cleanPath) return

    setSaving(true)
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_path: cleanPath }),
      })
      setAdminPath(cleanPath)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch (err) {
      console.error("Failed to save admin path:", err)
    } finally {
      setSaving(false)
    }
  }

  // ── 4. Social Links ────────────────────────────────────────────────────────

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facebook: facebookUrl.trim(),
          whatsapp: whatsappUrl.trim(),
          email: emailAddress.trim(),
        }),
      })
      setSocialsSaved(true)
      setTimeout(() => setSocialsSaved(false), 3000)
    } catch (err) {
      console.error("Failed to save socials:", err)
    } finally {
      setSaving(false)
    }
  }

  // ── Login Screen ───────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 font-sans overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#00b4b0]/[0.03] blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#7bc832]/[0.03] blur-[120px]" />
        </div>

        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0a0a0a]/80 border border-zinc-850 shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center shadow-lg">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">KandyPOS™ Admin Portal</h2>
              <p className="text-zinc-500 text-xs mt-1">Enter password to manage site catalog and settings</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-850 text-white text-center placeholder-zinc-600 focus:outline-none focus:border-cyan-500 text-sm font-medium select-text"
              />
              {authError && (
                <div className="text-[10px] text-rose-500 font-mono text-center mt-2">{authError}</div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-black hover:opacity-90 font-bold py-6 rounded-xl text-xs sm:text-sm tracking-wide"
            >
              Authenticate Portal
            </Button>
          </form>

          <div className="text-center text-[10px] text-zinc-600 font-mono mt-6">
            Authorized personnel only
          </div>
        </div>
      </div>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-6 sm:p-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#00b4b0]/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#7bc832]/[0.03] blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-850 pb-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">Administrator Controls</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Kandy POS Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/">
              <Button variant="outline" className="rounded-xl px-4 text-xs bg-zinc-950 hover:bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white flex items-center gap-1.5 py-4">
                <ArrowLeft className="w-3.5 h-3.5" />
                Go to Homepage
              </Button>
            </a>
          </div>
        </div>

        {/* Loading spinner while data loads */}
        {loadingData && (
          <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-mono">Loading data from database…</span>
          </div>
        )}

        {!loadingData && (
          <>
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-1">
              <button
                onClick={() => { setActiveTab("projects"); handleCancelEdit() }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "projects" ? "text-cyan-400 border-cyan-500" : "text-zinc-500 border-transparent hover:text-white"
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab("testimonials")}
                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "testimonials" ? "text-green-400 border-green-500" : "text-zinc-500 border-transparent hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                Testimonials ({testimonials.length})
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "settings" ? "text-white border-white" : "text-zinc-500 border-transparent hover:text-white"
                }`}
              >
                <Settings className="w-4 h-4" />
                Portal & Social Settings
              </button>
            </div>

            {/* ── PROJECTS TAB ── */}
            {activeTab === "projects" && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-4">
                  <h2 className="text-sm font-mono font-bold text-zinc-500 uppercase tracking-widest">Currently Showcased</h2>
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">{proj.category}</span>
                            {proj.requiresPermission && (
                              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 animate-pulse" />
                                Access Code Required
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-white mt-2">{proj.title}</h3>
                          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{proj.description}</p>
                          <div className="text-[10px] font-mono text-zinc-500 mt-2">Client: {proj.client}</div>
                          {proj.projectUrl && (
                            <div className="text-[9px] font-mono text-zinc-500 mt-1 truncate">Link: <span className="text-cyan-400/90">{proj.projectUrl}</span></div>
                          )}
                          {proj.image && (
                            <div className="text-[9px] font-mono text-zinc-500 mt-1 truncate">Image: <span className="text-green-400/90">{proj.image}</span></div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditStart(proj)} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-cyan-400 hover:border-cyan-950 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProject(proj.id)} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-500 hover:border-rose-950 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-zinc-600 text-sm font-mono py-8 text-center border border-dashed border-zinc-800 rounded-2xl">No projects yet. Add one using the form.</p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-850 space-y-4">
                  <div className="flex items-center justify-between text-white font-bold text-sm border-b border-zinc-900 pb-2">
                    <div className="flex items-center gap-1.5">
                      {editingProject ? <><Pencil className="w-4 h-4 text-cyan-400" />Edit Case Study</> : <><PlusCircle className="w-4 h-4 text-cyan-400" />Add New Case Study</>}
                    </div>
                    {editingProject && (
                      <button onClick={handleCancelEdit} className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleAddProject} className="space-y-4 text-xs font-semibold">
                    <div>
                      <label className="block text-zinc-500 mb-1">Project Title</label>
                      <input type="text" required value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="e.g. Golden Diner POS Integration" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 select-text" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-1">Category type</label>
                      <input type="text" required value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} placeholder="e.g. Restaurant System" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 select-text" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-1">Project Demo URL (Optional)</label>
                      <input type="text" value={newProject.projectUrl} onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })} placeholder="https://example.com/live-demo" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 select-text" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-1">Project Image URL (Optional)</label>
                      <input type="text" value={newProject.image} onChange={(e) => setNewProject({ ...newProject, image: e.target.value })} placeholder="https://images.unsplash.com/..." className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 select-text" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-1">Brief Description</label>
                      <textarea required rows={3} value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Describe hardware/software setups..." className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-500 resize-none select-text" />
                    </div>
                    <div className="flex items-center gap-2.5 py-1">
                      <input type="checkbox" id="requiresPermission" checked={newProject.requiresPermission} onChange={(e) => setNewProject({ ...newProject, requiresPermission: e.target.checked })} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-cyan-500 focus:ring-cyan-500 accent-cyan-500 cursor-pointer" />
                      <label htmlFor="requiresPermission" className="text-zinc-300 font-medium cursor-pointer">Requires Permission Access Code</label>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button type="submit" disabled={saving} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-2">
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {editingProject ? "Save Project Settings" : "Create Showcased Project"}
                      </Button>
                      {editingProject && (
                        <Button type="button" onClick={handleCancelEdit} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold py-5 rounded-xl border border-zinc-800">Cancel</Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── TESTIMONIALS TAB ── */}
            {activeTab === "testimonials" && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-4">
                  <h2 className="text-sm font-mono font-bold text-zinc-500 uppercase tracking-widest">Active Client Testimonials</h2>
                  <div className="space-y-3">
                    {testimonials.map((test) => (
                      <div key={test.id} className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex justify-between items-start gap-4">
                        <div>
                          <div className="text-xs text-green-400 font-bold">{"★".repeat(test.rating || 5)}</div>
                          <p className="text-zinc-300 text-xs italic mt-2">&quot;{test.text}&quot;</p>
                          <div className="text-xs text-white font-bold mt-3">
                            {test.name} {test.role && <span className="text-zinc-500 font-mono text-[10px]">— {test.role}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditTestimonialStart(test)} className="p-2 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-cyan-400 hover:border-cyan-950 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTestimonial(test.id)} className="p-2 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-rose-500 hover:border-rose-950 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {testimonials.length === 0 && (
                      <p className="text-zinc-600 text-sm font-mono py-8 text-center border border-dashed border-zinc-800 rounded-2xl">No testimonials yet. Add one using the form.</p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-850 space-y-4">
                  <div className="flex items-center justify-between text-white font-bold text-sm border-b border-zinc-900 pb-2">
                    <div className="flex items-center gap-1.5">
                      {editingTestimonial ? <><Pencil className="w-4 h-4 text-green-400" />Edit Client Review</> : <><PlusCircle className="w-4 h-4 text-green-400" />Add Client Review</>}
                    </div>
                    {editingTestimonial && (
                      <button onClick={handleCancelTestimonialEdit} className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleAddTestimonial} className="space-y-4 text-xs font-semibold">
                    <div>
                      <label className="block text-zinc-500 mb-1">Author Name</label>
                      <input type="text" required value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} placeholder="e.g. Thanuja Senanayake" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-green-500" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-1">Role & Business</label>
                      <input type="text" required value={newTestimonial.role} onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })} placeholder="e.g. Managing Director, The Royal Bean Cafe" className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-green-500" />
                    </div>
                    <div>
                      <label className="block text-zinc-500 mb-1">Review Statement</label>
                      <textarea required rows={4} value={newTestimonial.text} onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })} placeholder="Enter what the business owner says..." className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-850 text-white placeholder-zinc-700 focus:outline-none focus:border-green-500 resize-none" />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button type="submit" disabled={saving} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-2">
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {editingTestimonial ? "Save Testimonial Settings" : "Create Testimonial Review"}
                      </Button>
                      {editingTestimonial && (
                        <Button type="button" onClick={handleCancelTestimonialEdit} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold py-5 rounded-xl border border-zinc-800">Cancel</Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === "settings" && (
              <div className="max-w-xl mx-auto space-y-8">
                {/* Admin URL */}
                <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-850 shadow-2xl space-y-6">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Custom Admin URL Settings</h2>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    Change the URL path of this Admin panel for security. Saved to the database — works across all browsers and devices.
                  </p>
                  <div className="p-4 rounded-2xl bg-cyan-950/10 border border-cyan-500/10 text-cyan-400/90 text-xs font-medium space-y-1">
                    <div>• Current Configured Path: <span className="font-mono text-white">/{adminPath}</span></div>
                  </div>
                  <form onSubmit={handleSavePath} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">New Admin Path name</label>
                      <div className="flex rounded-xl bg-zinc-900 border border-zinc-850 overflow-hidden focus-within:border-cyan-500 transition-colors">
                        <span className="px-4 bg-zinc-950 text-zinc-500 text-xs sm:text-sm font-mono flex items-center select-none border-r border-zinc-850">/</span>
                        <input type="text" required value={adminPath} onChange={(e) => setAdminPath(e.target.value)} placeholder="e.g. kandy-portal-dashboard" className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder-zinc-700 text-xs sm:text-sm font-semibold focus:outline-none select-text" />
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono mt-2 leading-normal">* Must be alphanumeric characters (no slashes).</p>
                    </div>
                    <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-black hover:opacity-90 font-bold py-6 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm">
                      {settingsSaved ? <><CheckCircle className="w-4 h-4 animate-bounce" />Path Saved!</> : saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save URL Customization</>}
                    </Button>
                  </form>
                </div>

                {/* Social Links */}
                <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-850 shadow-2xl space-y-6">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-bold text-white">Social Media & Contact Links</h2>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    Configure your official public contact links. Saved to the database — visible to all visitors instantly.
                  </p>
                  <form onSubmit={handleSaveSocials} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Facebook Page Link</label>
                      <input type="text" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/yourpage" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-850 text-white placeholder-zinc-700 text-xs sm:text-sm font-semibold focus:outline-none focus:border-green-500 transition-colors select-text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">WhatsApp Contact (Number or Link)</label>
                      <input type="text" value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} placeholder="e.g. 94770000000 or https://wa.me/..." className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-850 text-white placeholder-zinc-700 text-xs sm:text-sm font-semibold focus:outline-none focus:border-green-500 transition-colors select-text" />
                      <p className="text-[10px] text-zinc-500 font-mono mt-1">Enter your international format number (no + or spaces) or direct wa.me link.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Public Email Address</label>
                      <input type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} placeholder="info@kandypos.com" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-850 text-white placeholder-zinc-700 text-xs sm:text-sm font-semibold focus:outline-none focus:border-green-500 transition-colors select-text" />
                    </div>
                    <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-black hover:opacity-90 font-bold py-6 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm">
                      {socialsSaved ? <><CheckCircle className="w-4 h-4 animate-bounce" />Social Links Saved!</> : saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Social Links</>}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
