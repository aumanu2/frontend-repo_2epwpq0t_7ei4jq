import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Download, Github, Linkedin, Mail, ChevronUp, ExternalLink } from 'lucide-react'

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="scroll-mt-24 py-20 sm:py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {title && (
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  </section>
)

function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])
  return { dark, setDark }
}

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

function GradientBG() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_10%_-10%,rgba(56,189,248,0.15),transparent),radial-gradient(800px_600px_at_90%_10%,rgba(99,102,241,0.14),transparent),radial-gradient(600px_500px_at_50%_110%,rgba(59,130,246,0.12),transparent)]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white to-white/60 dark:from-slate-950 dark:to-slate-950/60"></div>
    </div>
  )
}

function Header({ onScrollTo }) {
  const { dark, setDark } = useTheme()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 })

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => onScrollTo('hero')} className="text-base sm:text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400">
            Mohan Appikatla
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((n) => (
              <button key={n.id} onClick={() => onScrollTo(n.id)} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="/mohan_appikatla_resume.pdf" className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow hover:shadow-md transition">
              <Download className="h-4 w-4" /> Resume
            </a>
            <button onClick={() => setDark((d) => !d)} className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition" aria-label="Toggle theme">
              {dark ? (
                <span className="i">🌞</span>
              ) : (
                <span className="i">🌙</span>
              )}
            </button>
          </div>
        </div>
        <motion.div className="h-0.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400" style={{ scaleX }} />
      </div>
    </header>
  )
}

function Typing({ words }) {
  const [index, setIndex] = useState(0)
  const [sub, setSub] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, sub.length + 1)
        setSub(next)
        if (next.length === current.length) {
          setDeleting(true)
        }
      } else {
        const next = current.slice(0, sub.length - 1)
        setSub(next)
        if (next.length === 0) {
          setDeleting(false)
          setIndex((i) => (i + 1) % words.length)
        }
      }
    }, deleting ? 60 : 80)
    return () => clearTimeout(timeout)
  }, [sub, deleting, index, words])

  return (
    <span className="relative">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400">{sub}</span>
      <span className="ml-0.5 inline-block w-[2px] h-6 align-middle bg-cyan-400 animate-pulse rounded" />
    </span>
  )
}

function Counter({ label, value, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 900
    const startTime = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const current = Math.round(start + (end - start) * eased)
      setCount(current)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-5 shadow-sm">
      <div className="text-2xl font-semibold text-slate-900 dark:text-white">{count}{suffix}</div>
      <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{label}</div>
    </div>
  )
}

function SkillBar({ name, level }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700 dark:text-slate-200">{name}</span>
        <span className="text-slate-500 dark:text-slate-400">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200/70 dark:bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${level}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} viewport={{ once: true }} className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400" />
      </div>
    </div>
  )
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
      {children}
    </span>
  )
}

const projects = [
  {
    title: 'Smart Attendance System using Face Recognition',
    desc: 'Automated attendance using real-time facial detection and recognition.',
    stack: ['Python', 'OpenCV', 'Flask'],
    github: '#'
  },
  {
    title: 'AI-Driven Retail Inventory Management',
    desc: 'Computer vision powered stock tracking and demand prediction.',
    stack: ['Computer Vision', 'Data Science'],
    github: '#'
  },
  {
    title: 'Movie Recommendation using BERT',
    desc: 'Semantic recommendations using transformer embeddings.',
    stack: ['NLP', 'Deep Learning'],
    github: '#'
  },
  {
    title: 'GM Cart E-Commerce Website',
    desc: 'Full-stack e-commerce platform with admin dashboard.',
    stack: ['Django', 'SQL', 'Bootstrap'],
    github: '#'
  }
]

export default function App() {
  const onScrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const { scrollYProgress } = useScroll()
  const showTop = useSpring(scrollYProgress, { stiffness: 120, damping: 20 })
  const [showBtn, setShowBtn] = useState(false)
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setShowBtn(v > 0.15))
    return () => unsub()
  }, [scrollYProgress])

  const contactRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || ''

  async function submitContact(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSent(false)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())
    try {
      const res = await fetch(`${backend}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
      e.currentTarget.reset()
    } catch (err) {
      setError('Something went wrong. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <GradientBG />
      <Header onScrollTo={onScrollTo} />

      {/* Hero */}
      <section id="hero" className="pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Mohan Appikatla
            </motion.h1>
            <div className="mt-3 text-lg sm:text-2xl">
              <Typing words={[
                'Designing scalable experiences in the Azure Cloud.',
                'Turning infrastructure into innovation.'
              ]} />
            </div>
            <p className="mt-6 text-slate-600 dark:text-slate-300 max-w-xl">
              Cloud Enthusiast | Azure Cloud Intern | Aspiring Cloud Engineer. Focused on building scalable, secure, and cost-efficient cloud solutions that bridge innovation with reliability.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="/mohan_appikatla_resume.pdf" className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow hover:shadow-md transition">
                <Download className="h-4 w-4" /> Download Resume
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); onScrollTo('contact') }} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border border-slate-300/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                Let’s Connect
              </a>
              <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border border-slate-300/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border border-slate-300/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0%,#6366f1_25%,#0ea5e9_50%,#22d3ee_75%,#6366f1_100%)] opacity-20 blur-3xl rounded-full" />
            <div className="grid grid-cols-2 gap-4">
              <Counter label="Years of Learning" value={4} />
              <Counter label="Projects" value={12} />
              <Counter label="Technologies Used" value={18} />
              <Counter label="Certifications" value={2} />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <Section id="about" title="About" subtitle="A driven and analytical B.Tech graduate passionate about cloud infrastructure, automation, and DevOps.">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Currently working as an Azure Cloud Intern at PCS Solution, Pune — gaining hands-on experience deploying, managing, and optimizing Azure environments.
            </p>
            <p>
              I focus on building scalable, secure, and cost-efficient cloud solutions. My goal is to bridge innovation with reliability through strong fundamentals and practical implementation.
            </p>
            <blockquote className="border-l-4 border-cyan-400 pl-4 italic text-slate-800 dark:text-slate-200">
              “I believe great cloud engineers build reliability as much as scalability.”
            </blockquote>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-5 shadow-sm">
              <div className="text-sm text-slate-600 dark:text-slate-300">Quick Profile</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="opacity-70">Role</div><div className="text-right">Azure Cloud Intern</div>
                <div className="opacity-70">Focus</div><div className="text-right">Cloud, DevOps</div>
                <div className="opacity-70">Location</div><div className="text-right">Pune, India</div>
                <div className="opacity-70">Open to</div><div className="text-right">Cloud/DevOps Roles</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills" subtitle="Azure-blue themed, grouped by capability with animated proficiency bars.">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Cloud</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Azure','Azure DevOps','ARM Templates','Blob Storage','VM Management'].map((s) => <Chip key={s}>{s}</Chip>)}
              </div>
              <div className="space-y-4">
                <SkillBar name="Azure" level={85} />
                <SkillBar name="Azure DevOps" level={78} />
                <SkillBar name="ARM Templates" level={70} />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Programming</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Python','SQL','JavaScript'].map((s) => <Chip key={s}>{s}</Chip>)}
              </div>
              <div className="space-y-4">
                <SkillBar name="Python" level={80} />
                <SkillBar name="SQL" level={72} />
                <SkillBar name="JavaScript" level={68} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Tools</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Git','Docker','Linux','VS Code'].map((s) => <Chip key={s}>{s}</Chip>)}
              </div>
              <div className="space-y-4">
                <SkillBar name="Git" level={82} />
                <SkillBar name="Docker" level={70} />
                <SkillBar name="Linux" level={76} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Concepts</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Networking','CI/CD','Cloud Security','Automation'].map((s) => <Chip key={s}>{s}</Chip>)}
              </div>
              <div className="space-y-4">
                <SkillBar name="Networking" level={74} />
                <SkillBar name="CI/CD" level={72} />
                <SkillBar name="Cloud Security" level={66} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Projects" subtitle="Minimalist text cards with quick links.">
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((p) => (
            <motion.div key={p.title} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border border-slate-300/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                  View on GitHub <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border border-slate-300/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition" onClick={() => alert('Details coming soon!')}>
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">Azure Cloud Intern — PCS Solution, Pune</div>
              <div className="text-sm text-slate-500">June 2025 – Present</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>• Managing and deploying Azure services and virtual environments.</li>
            <li>• Working with CI/CD pipelines and monitoring tools.</li>
            <li>• Learning to automate infrastructure provisioning and scaling.</li>
          </ul>
        </div>
      </Section>

      {/* Education */}
      <Section id="education" title="Education">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-900 dark:text-white">Bachelor of Technology (B.Tech), Computer Science</div>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Strong foundation in data structures, networking, and cloud computing.</p>
        </div>
      </Section>

      {/* Certifications */}
      <Section id="certifications" title="Certifications">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-sm">
            <div className="font-medium">Microsoft Certified: Azure Fundamentals (AZ-900)</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-sm">
            <div className="font-medium">Microsoft Certified: Azure Administrator (AZ-104)</div>
            <div className="text-xs text-slate-500 mt-1">If applicable</div>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact" subtitle="Have an opportunity or want to say hi? Drop a note.">
        <div className="grid md:grid-cols-3 gap-6">
          <form ref={contactRef} onSubmit={submitContact} className="md:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Name</label>
                <input name="name" required placeholder="Your name" className="mt-1 w-full rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Email</label>
                <input type="email" name="email" required placeholder="you@example.com" className="mt-1 w-full rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300">Message</label>
              <textarea name="message" required rows={5} placeholder="How can I help?" className="mt-1 w-full rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200 dark:border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            {error && <div className="text-sm text-rose-500">{error}</div>}
            {sent && <div className="text-sm text-emerald-600">Thanks! Your message has been sent.</div>}
            <button disabled={submitting} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow hover:shadow-md transition disabled:opacity-60">
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          <div className="space-y-3">
            <a href="mailto:mohan.appikatla@example.com" className="flex items-center gap-2 text-sky-600 hover:underline"><Mail className="h-4 w-4"/> Email</a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:underline"><Github className="h-4 w-4"/> GitHub</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sky-600 hover:underline"><Linkedin className="h-4 w-4"/> LinkedIn</a>
          </div>
        </div>
      </Section>

      <footer className="py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} Mohan Appikatla — Crafted with care.</footer>

      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showBtn ? 1 : 0, y: showBtn ? 0 : 20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 rounded-full p-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg hover:shadow-xl"
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </motion.button>
    </div>
  )
}
